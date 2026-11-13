import type {Outcome} from './assisted-store';
export function visible(doc:Document,selector:string):boolean {
 const node=doc.querySelector<HTMLElement>(selector);
 return !!node&&!node.hidden&&node.getClientRects().length>0&&doc.defaultView?.getComputedStyle(node).visibility!=='hidden';
}
export function feedback(doc:Document):Outcome|undefined {
 if(doc.querySelector('input[type=password]')) return 'session';
 if(!visible(doc,'#feedback')) return;
 const title=doc.querySelector('#feedback-titulo')?.textContent?.trim();
 if(title==='Não foi possível confirmar o resultado') return 'network';
 const panel=doc.querySelector('#feedback')!;
 if(title==='Você acertou!'&&panel.classList.contains('painel--sucesso')) return 'success';
 if(panel.classList.contains('painel--erro')&&['Caiu fora da lixeira!','Lixeira errada!'].includes(title??'')) {
 const retry=doc.querySelector<HTMLButtonElement>('#btn-proximo');
 if(retry&&visible(doc,'#btn-proximo')&&!retry.disabled) return 'retry';
 if(doc.querySelector('#hud-tentativas')?.textContent?.trim()==='Rodada encerrada') return 'ended-failure';
 }
}
export function waitFeedback(doc:Document,signal:AbortSignal,timeoutMs=15000):Promise<Outcome> {
 return new Promise(resolve=>{
 let timer:ReturnType<typeof setTimeout>;let done=false;
 const observer=new MutationObserver(check);
 function settle(result:Outcome){if(done)return;done=true;observer.disconnect();clearTimeout(timer);signal.removeEventListener('abort',cancel);doc.defaultView?.removeEventListener('offline',offline);resolve(result);}
 function cancel(){settle('cancelled');}
 function offline(){settle('network');}
 function check(){const result=feedback(doc);if(result)settle(result);}
 if(signal.aborted){resolve('cancelled');return;}
 observer.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});
 signal.addEventListener('abort',cancel,{once:true});doc.defaultView?.addEventListener('offline',offline,{once:true});timer=setTimeout(()=>settle('timeout'),timeoutMs);check();
 });
}
