import type {Outcome} from './assisted-store';
import {waitFeedback,visible} from './feedback';
import type {Candidate,ThrowAdapter,GestureMeasurement} from './solver';
export type AssistedDependencies={reserve:()=>Promise<string>;finish:(id:string,result:Outcome,measurement?:GestureMeasurement)=>Promise<void>;adapter:ThrowAdapter};
export function requireReady(doc:Document):void {
 if(doc.defaultView?.navigator.onLine===false)throw Error('Sem conexão: não iniciar lançamento');
 const hint=doc.querySelector('#hud-dica')?.textContent?.trim();
 if(!visible(doc,'#hud-dica')||!['Clique, puxe para baixo como um estilingue e solte','Toque, puxe para baixo como um estilingue e solte'].includes(hint??''))throw Error('O jogo ainda não confirma que está pronto para arremessar');
 if(doc.querySelector('input[type=password]')||visible(doc,'#feedback')||visible(doc,'#abertura')||!visible(doc,'#cena')) throw Error('Abra a partida e clique em Jogar sem câmera antes de preparar o teste');
}
export async function runAssisted(doc:Document,candidate:Candidate,deps:AssistedDependencies,signal:AbortSignal,timeoutMs=15000):Promise<Outcome> {
 requireReady(doc);signal.throwIfAborted();
 const id=await deps.reserve(); // Persistência obrigatória ANTES de qualquer gesto.
 const local=new AbortController();const combined=AbortSignal.any([signal,local.signal]);
 let result:Outcome='gesture-error';let timer:ReturnType<typeof setTimeout>|undefined;
 try {
 requireReady(doc);combined.throwIfAborted();
 let watchdog=false;
 timer=setTimeout(()=>{watchdog=true;local.abort();},timeoutMs);
 const pending=waitFeedback(doc,combined,timeoutMs).then(outcome=>{if(['network','session'].includes(outcome))local.abort();return outcome;});
 try {await deps.adapter.throwOnce(candidate,combined);result=await pending;}
 catch {local.abort();const observed=await pending;result=observed==='network'||observed==='session'?observed:watchdog?'timeout':signal.aborted?'cancelled':'gesture-error';}
 if(watchdog&&result==='cancelled')result='timeout';
 } catch {result=signal.aborted?'cancelled':'gesture-error';}
 finally {clearTimeout(timer);local.abort();}
 if(deps.adapter.measurement)await deps.finish(id,result,deps.adapter.measurement);else await deps.finish(id,result);return result;
}
