import {observe,inspectCatalog} from './dom';
import {requireReady,runAssisted} from './assisted';
import {DebuggerThrowAdapter} from './debugger-adapter';
import type {Calibration} from './execution';
import {BUILD_VERSION,assertBuild} from './version';
import {hudPoints,readScore} from './score';
let running=false;let abort:AbortController|undefined;
export function cancelSeries(){abort?.abort();}
async function send(type:string,data:Record<string,unknown>={}){const r=await chrome.runtime.sendMessage({type,...data,buildVersion:BUILD_VERSION});assertBuild(r);if(!r?.ok)throw Error('Comunicação de execução indisponível');return r;}
function wait(doc:Document,predicate:()=>boolean,signal:AbortSignal):Promise<void>{
 return new Promise((resolve,reject)=>{
 const observer=new MutationObserver(check);const timer=setTimeout(()=>done(Error('Tempo de UI esgotado')),15000);
 function done(error?:unknown){clearTimeout(timer);observer.disconnect();signal.removeEventListener('abort',cancel);error?reject(error):resolve();}
 function cancel(){done(Error('Execução interrompida'));}
 function check(){if(signal.aborted){cancel();return;}if(predicate())done();}
 observer.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});signal.addEventListener('abort',cancel,{once:true});check();
 });
}
export async function driveSeries():Promise<void>{
 if(running)return;running=true;abort=new AbortController();const signal=abort.signal;
 try{
 if(navigator.onLine===false)throw Error('Offline');
 const screen=observe(document);const current=screen==='HOME'?inspectCatalog(document,location.href):undefined;
 const state=await send('series-document',{screen,hasCatalog:!!current&&!current.warning.includes('Não executar'),items:current?.items});
 if(state.action==='open'){
 const card=[...document.querySelectorAll<HTMLAnchorElement>('.categoria[data-lixeira] a.cartao[href]')].find(a=>{const u=new URL(a.href);return u.origin===location.origin&&u.pathname==='/ResiduoGo/public/index.php/ar'&&u.searchParams.get('residuo')===state.itemId;});
 if(!card)throw Error('Card ausente');signal.throwIfAborted();card.click();return;
 }
 if(state.action!=='play')return;
 const calibration=state.calibration as Calibration;
 if(!calibration[state.category as 'azul'|'cinza'])throw Error('Sem calibração');
 if(document.querySelector<HTMLElement>('#abertura')&&!document.querySelector<HTMLElement>('#abertura')!.hidden){
 await wait(document,()=>document.querySelector('#btn-sem-camera')?.textContent?.trim()==='Jogar',signal);
 document.querySelector<HTMLButtonElement>('#btn-sem-camera')!.click();
 }
 for(let i=0;i<3;i++){
 await wait(document,()=>{try{requireReady(document);return true;}catch{return false;}},signal);
 const candidate={...calibration[state.category as 'azul'|'cinza']!,margin:0};let id='';let next='pause';let before:number|undefined;
 const adapter=new DebuggerThrowAdapter(()=>id,'series-input');
 await runAssisted(document,candidate,{
 reserve:async()=>{before=hudPoints(document);const r=await send('series-reserve',{level:document.querySelector('#hud-nivel')?.textContent?.trim()});if(!r.id)throw Error('Reserva bloqueada');id=r.id;Object.assign(candidate,r.candidate);return id;},
 adapter,
 finish:async(attemptId,outcome)=>{const r=await send('series-finish',{id:attemptId,outcome,inputFailure:adapter.failure,score:readScore(document,before),ended:document.querySelector('#hud-tentativas')?.textContent?.trim()==='Rodada encerrada'});next=r.action;}
 },signal,calibration.background?30000:15000);
 signal.throwIfAborted();
 if(next==='retry'){
 const retry=document.querySelector<HTMLButtonElement>('#btn-proximo');if(!retry||retry.hidden||retry.disabled)throw Error('Nova tentativa indisponível');retry.click();continue;
 }
 if(next==='return'){
 const menu=[...document.querySelectorAll<HTMLAnchorElement>('#feedback a[href]')].find(a=>{const u=new URL(a.href);return u.origin===location.origin&&u.pathname==='/ResiduoGo/public/index.php'&&!u.search;});
 if(!menu)throw Error('Controle de retorno ao menu ausente');menu.click();return;
 }
 return;
 }
 }catch{void send('series-fault').catch(()=>{});}
 finally{running=false;}
}
window.addEventListener('pagehide',cancelSeries);
