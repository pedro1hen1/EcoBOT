import type {Config,Task} from './planner';
export type State='IDLE'|'HOME'|'OPENING'|'READY'|'AIMING'|'FLYING'|'FEEDBACK'|'RETRY'|'RETURNING'|'PAUSED'|'COMPLETED'|'ERROR';
export type Event='home'|'open'|'ready'|'aim'|'throw'|'feedback'|'retry'|'return'|'confirmed'|'pause'|'resume'|'stop'|'network'|'session'|'timeout';
export type Checkpoint={version:1;state:State;previous?:State;queue:Task[];cursor:number;config?:Config;uncertain:boolean;message:string;tabId?:number};
export const initial=():Checkpoint=>({version:1,state:'IDLE',queue:[],cursor:0,uncertain:false,message:'Diagnóstico — nenhuma partida executada'});
const routes:Partial<Record<State,Partial<Record<Event,State>>>>={IDLE:{home:'HOME'},HOME:{open:'OPENING'},OPENING:{ready:'READY'},READY:{aim:'AIMING'},AIMING:{throw:'FLYING'},FLYING:{feedback:'FEEDBACK'},FEEDBACK:{retry:'RETRY',return:'RETURNING'},RETRY:{ready:'READY'},RETURNING:{confirmed:'HOME'}};
export function transition(cp:Checkpoint,event:Event):Checkpoint {
 const next=structuredClone(cp);
 if(['network','session','timeout'].includes(event)) return {...next,state:'PAUSED',uncertain:true,message:'Intervenção necessária: '+event};
 if(event==='pause'&&cp.state==='PAUSED') return next;
 if(event==='pause') return {...next,previous:cp.state,state:'PAUSED',uncertain:cp.uncertain||['FLYING','FEEDBACK','RETURNING'].includes(cp.state),message:'Pausado'};
 if(event==='stop') return {...next,state:'IDLE',uncertain:cp.uncertain||['FLYING','FEEDBACK','RETURNING'].includes(cp.state),message:'Parado; checkpoint preservado'};
 if(event==='resume') {
 if(cp.state!=='PAUSED'||cp.uncertain) throw Error('Retomada bloqueada: resultado incerto ou estado inválido');
 return {...next,state:cp.previous??'HOME',message:'Retomado em diagnóstico'};
 }
 const target=routes[cp.state]?.[event]; if(!target) throw Error(`Transição inválida: ${cp.state}/${event}`);
 next.state=target;
 if(event==='confirmed') {next.cursor++; if(next.cursor>=next.queue.length) next.state='COMPLETED';}
 return next;
}
// A recarga nunca repete automaticamente uma operação com efeito no jogo.
export function recover(cp:Checkpoint):Checkpoint {
 if(['IDLE','PAUSED','COMPLETED'].includes(cp.state)) return cp;
 return {...cp,previous:cp.state,state:'PAUSED',uncertain:true,message:'Contexto interrompido: confira a rodada antes de criar outro plano'};
}
