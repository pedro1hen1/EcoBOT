import {allowed} from './dom';
import {assertBuild} from './version';

// Uma sessão por aba autorizada. Não ativa abas, janelas nem o mouse do sistema.
const sessions=new Set<number>();
const gestures=new Map<number,{done:Promise<void>;finish:()=>void}>();
export function holdBackgroundGesture(tabId:number):()=>void {
 let finish!:()=>void;const done=new Promise<void>(resolve=>{finish=resolve;});
 gestures.set(tabId,{done,finish});
 return ()=>{gestures.delete(tabId);finish();};
}
export function gameRoute(url:string):boolean {
 if(!allowed(url))return false;
 const path=new URL(url).pathname;
 return path==='/ResiduoGo/public/index.php'||path==='/ResiduoGo/public/index.php/ar';
}
export function backgroundAttached(tabId:number){return sessions.has(tabId);}
export function backgroundDetached(tabId:number){return sessions.delete(tabId);}
export async function keepGameActive(tabId:number,documentId:string):Promise<void>{
 const tab=await chrome.tabs.get(tabId);
 if(!tab.url||!gameRoute(tab.url))throw Error('Segundo plano restrito à aba do jogo');
 const alive=await chrome.tabs.sendMessage(tabId,{type:'probe-document'},{documentId});assertBuild(alive);
 if(!alive?.ok)throw Error('Documento indisponível para segundo plano');
 if(!await chrome.permissions.contains({permissions:['debugger']}))throw Error('Permissão debugger não concedida');
 if(!sessions.has(tabId)){
  await chrome.debugger.attach({tabId},'1.3');sessions.add(tabId);
 }
 try{
  // Reaplicar após cada navegação. O jogo conserva seus próprios relógio e física.
  await chrome.debugger.sendCommand({tabId},'Emulation.setFocusEmulationEnabled',{enabled:true});
 }catch{
  await releaseGame(tabId);
  throw Error('Este navegador não permitiu manter o jogo ativo em segundo plano');
 }
}
export async function releaseGame(tabId:number):Promise<void>{
 // Deixe o cancelamento do gesto liberar a captura antes de desconectar.
 await gestures.get(tabId)?.done;
 if(!sessions.delete(tabId))return;
 try{await chrome.debugger.sendCommand({tabId},'Emulation.setFocusEmulationEnabled',{enabled:false});}
 finally{await chrome.debugger.detach({tabId}).catch(()=>{});}
}
