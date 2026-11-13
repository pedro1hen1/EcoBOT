import {allowed} from './dom';
import type {Attempt} from './assisted-store';
import {assertBuild} from './version';
type Point={x:number;y:number};
export type Probe={ok:boolean;start:Point;end:Point;width:number;height:number};
const controls=new Map<number,AbortController>();
export function cancelDebugger(tabId:number){controls.get(tabId)?.abort();}
export function validateProbe(probe:Probe):void{
 if(!probe?.ok||![probe.start?.x,probe.start?.y,probe.end?.x,probe.end?.y,probe.width,probe.height].every(Number.isFinite)||probe.width<=0||probe.height<=0)throw Error('Geometria de entrada inválida');
 for(const p of [probe.start,probe.end])if(p.x<0||p.y<0||p.x>=probe.width||p.y>=probe.height)throw Error('Gesto fora da janela');
 if(probe.end.y<=probe.start.y||Math.hypot(probe.end.x-probe.start.x,probe.end.y-probe.start.y)<18)throw Error('Arraste inválido');
}
export async function debuggerThrow(attempt:Attempt&{waitMs?:number;dragMs?:number}):Promise<void>{
 const waitMs=attempt.waitMs??0,dragMs=attempt.dragMs??192;
 if(!Number.isInteger(waitMs)||waitMs<0||waitMs>2400||!Number.isInteger(dragMs)||dragMs<120||dragMs>1000)throw Error('Ritmo fora dos limites permitidos');
 const {tabId,documentId,itemId}=attempt;
 if(controls.has(tabId))throw Error('Entrada já em andamento nesta aba');
 const abort=new AbortController();controls.set(tabId,abort);
 const target={tabId};let attached=false,pressed=false,released=false;let probe:Probe|undefined;
 const check=async()=>{
 abort.signal.throwIfAborted();const tab=await chrome.tabs.get(tabId);
 if(!tab.url||!allowed(tab.url)||new URL(tab.url).pathname!=='/ResiduoGo/public/index.php/ar'||new URL(tab.url).searchParams.get('residuo')!==itemId)throw Error('A aba deixou a partida autorizada');
 const alive=await chrome.tabs.sendMessage(tabId,{type:'probe-document'},{documentId});assertBuild(alive);if(!alive?.ok)throw Error('Documento reservado indisponível');
 abort.signal.throwIfAborted();
 };
 const command=async(method:string,params:Record<string,unknown>)=>{
 await check();await chrome.debugger.sendCommand(target,method,params);abort.signal.throwIfAborted();
 };
 const detach=(source:chrome.debugger.Debuggee)=>{if(source.tabId===tabId)abort.abort();};
 chrome.debugger.onDetach.addListener(detach);
 const timer=setTimeout(()=>abort.abort(),8000);
 try{
 await check();
 // Espera cancelável antes de pressionar; o checkpoint já consumiu a reserva.
 if(waitMs)await new Promise<void>((resolve,reject)=>{const done=()=>{abort.signal.removeEventListener('abort',cancel);resolve();};const delay=setTimeout(done,waitMs);const cancel=()=>{clearTimeout(delay);reject(Error('Espera cancelada'));};abort.signal.addEventListener('abort',cancel,{once:true});if(abort.signal.aborted)cancel();});
 await check();
 if(!await chrome.permissions.contains({permissions:['debugger']}))throw Error('Permissão debugger não concedida pelo navegador');
 await chrome.debugger.attach(target,'1.3');attached=true;
 await check();
 probe=await chrome.tabs.sendMessage(tabId,{type:'probe-gesture',candidate:{force:attempt.force,spin:attempt.spin,margin:0}},{documentId});
 validateProbe(probe!);abort.signal.throwIfAborted();
 const {start,end}=probe!;
 await command('Input.dispatchMouseEvent',{type:'mouseMoved',x:start.x,y:start.y,buttons:0});
 pressed=true;await command('Input.dispatchMouseEvent',{type:'mousePressed',x:start.x,y:start.y,button:'left',buttons:1,clickCount:1});
 for(let i=1;i<=12;i++){
 await new Promise(resolve=>setTimeout(resolve,dragMs/12));
 await command('Input.dispatchMouseEvent',{type:'mouseMoved',x:start.x+(end.x-start.x)*i/12,y:start.y+(end.y-start.y)*i/12,buttons:1});
 }
 await check();
 // A resposta pode provocar feedback/offline antes de resolver a Promise.
 // Depois de solicitar a liberação, nunca enviar uma segunda por cancelamento.
 released=true;
 await chrome.debugger.sendCommand(target,'Input.dispatchMouseEvent',{type:'mouseReleased',x:end.x,y:end.y,button:'left',buttons:0,clickCount:1});
 }finally{
 clearTimeout(timer);
 let sameDocument=false;
 if(attached&&pressed&&!released){try{const tab=await chrome.tabs.get(tabId);const alive=await chrome.tabs.sendMessage(tabId,{type:'probe-document'},{documentId});sameDocument=!!tab.url&&allowed(tab.url)&&new URL(tab.url).pathname==='/ResiduoGo/public/index.php/ar'&&new URL(tab.url).searchParams.get('residuo')===itemId&&alive?.ok===true;}catch{/* Documento encerrado: apenas desconectar. */}}
 if(attached&&pressed&&!released&&sameDocument){
 // Escape cancela a captura no jogo. A liberação volta à origem, nunca ao alvo.
 await chrome.debugger.sendCommand(target,'Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27}).catch(()=>{});
 await chrome.debugger.sendCommand(target,'Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27}).catch(()=>{});
 if(probe)await chrome.debugger.sendCommand(target,'Input.dispatchMouseEvent',{type:'mouseReleased',x:probe.start.x,y:probe.start.y,button:'left',buttons:0}).catch(()=>{});
 }
 if(attached)await chrome.debugger.detach(target).catch(()=>{});
 chrome.debugger.onDetach.removeListener(detach);controls.delete(tabId);
 }
}
