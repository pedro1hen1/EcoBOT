import type {Task} from './planner';
import type {Outcome} from './assisted-store';
import type {ScoreObservation} from './score';
import type {Pacing} from './pacing';
export type RoundPhase='OPENING'|'READY'|'FLYING'|'RETRY'|'RETURNING'|'COMPLETED'|'PAUSED';
export type RoundAttempt={id:string;startedAt:number;finishedAt?:number;outcome?:Outcome;inputClaimedAt?:number;force?:number;spin?:number;score?:ScoreObservation;pacing?:Pacing};
export type Round={id:string;runId:string;task:Task;tabId:number;documentId?:string;level?:string;phase:RoundPhase;startedAt:number;endedAt?:number;reviewedAt?:number;attempts:RoundAttempt[];terminal?:'success'|'ended-failure';reason?:string;menuDocumentId?:string};
export function openRound(runId:string,id:string,task:Task,tabId:number,now:number):Round{
 return {runId,id,task:structuredClone(task),tabId,phase:'OPENING',startedAt:now,attempts:[]};
}
export function pauseRound(round:Round,reason:string):Round{
 if(round.phase==='COMPLETED')return round;
 return {...round,phase:'PAUSED',reason};
}
export function enterAR(round:Round,context:{tabId:number;documentId:string;itemId:string}):Round{
 if(round.tabId!==context.tabId||round.task.item.id!==context.itemId)throw Error('Aba ou resíduo diverge da partida');
 if(round.documentId===context.documentId)return round;
 if(round.phase!=='OPENING'||round.documentId)return pauseRound(round,'Documento interrompido; conferir a rodada');
 return {...round,documentId:context.documentId,phase:'READY'};
}
export function reserveThrow(round:Round,documentId:string,id:string,now:number):Round{
 if(round.documentId!==documentId||!['READY','RETRY'].includes(round.phase))throw Error('Lançamento bloqueado por estado ou documento');
 if(round.attempts.length>=3||round.attempts.some(a=>a.id===id))throw Error('Limite de tentativas ou ID duplicado');
 return {...round,phase:'FLYING',attempts:[...round.attempts,{id,startedAt:now}]};
}
export function observeThrow(round:Round,documentId:string,id:string,outcome:Outcome,ended:boolean,now:number):Round{
 if(round.documentId!==documentId)throw Error('Feedback de outro documento');
 const attempt=round.attempts.at(-1);
 if(!attempt||attempt.id!==id)throw Error('Tentativa não corresponde à reserva');
 if(attempt.finishedAt!==undefined)return round;
 if(round.phase!=='FLYING')throw Error('Resultado sem lançamento reservado');
 const attempts=round.attempts.map(a=>a.id===id?{...a,outcome,finishedAt:now}:a);
 const next={...round,attempts};
 if((outcome==='success'||outcome==='ended-failure')&&ended)return {...next,phase:'RETURNING',terminal:outcome};
 if(outcome==='retry'&&!ended&&attempts.length<3)return {...next,phase:'RETRY'};
 return pauseRound(next,'Resultado incerto: '+outcome);
}
export function confirmMenu(round:Round,context:{tabId:number;documentId:string;hasCatalog:boolean},now:number):Round{
 if(round.phase==='COMPLETED')return round;
 if(round.phase!=='RETURNING'||!round.terminal||!context.hasCatalog||context.tabId!==round.tabId||context.documentId===round.documentId)throw Error('Retorno ao menu ainda não confirmado');
 return {...round,phase:'COMPLETED',menuDocumentId:context.documentId,endedAt:now};
}
export type RoundLedger={version:1;runId:string;cursor:number;active?:Round;history:Round[]};
export function commitRound(ledger:RoundLedger,round:Round):RoundLedger{
 if(round.runId!==ledger.runId)throw Error('Partida de outra execução');
 if(ledger.history.some(r=>r.id===round.id))return ledger;
 if(ledger.active?.id!==round.id||round.phase!=='COMPLETED'||!round.endedAt)throw Error('Partida ainda não confirmada');
 return {...ledger,cursor:ledger.cursor+1,active:undefined,history:[...ledger.history,round]};
}
