import {runAssisted,requireReady} from './assisted';
import type {Attempt,Outcome} from './assisted-store';
import {PointerThrowAdapter,ManualThrowAdapter,endpoints} from './pointer';
import type {Candidate} from './solver';
import {DebuggerThrowAdapter} from './debugger-adapter';
import {BUILD_VERSION} from './version';
const labels:Record<Outcome,string>={success:'Acerto confirmado na UI.',retry:'Erro confirmado; há nova tentativa. Nenhuma nova tentativa automática.', 'ended-failure':'Rodada encerrada sem acerto.',network:'Resultado não confirmado pelo jogo. Confira a página.',session:'Sessão expirada. Confira a página.',timeout:'Tempo esgotado: resultado incerto. Não repetir automaticamente.',cancelled:'Teste interrompido: confira o jogo.', 'gesture-error':'Gesto rejeitado ou não concluído. Confira o jogo; não repetir automaticamente.'};
let activePanel:{host:HTMLElement;cancel:AbortController}|undefined;
async function send(type:string,data:Record<string,unknown>={}) {
 const reply=await chrome.runtime.sendMessage({type,...data,buildVersion:BUILD_VERSION});if(!reply?.ok)throw Error(reply?.error??'Falha ao salvar o teste; não repetir');return reply;
}
export function cancelAssisted(){activePanel?.cancel.abort();}
export async function showAssistedPanel():Promise<void> {
 if(activePanel?.host.isConnected)return;
 const host=document.createElement('div');host.id='ecobot-assisted';
 const root=host.attachShadow({mode:'closed'});const cancel=new AbortController();activePanel={host,cancel};
 root.innerHTML=`<style>:host{all:initial;position:fixed;top:12px;right:12px;z-index:2147483647;width:310px;font:14px system-ui;color:#173d32}section{background:#f3f7f4;border:2px solid #176b50;border-radius:10px;padding:16px;box-shadow:0 3px 20px #0005}h2{margin:0;font-size:18px}label{display:block;margin:10px 0}input[type=number]{width:75px;padding:6px}button{padding:8px;margin:4px;background:#176b50;color:white;border:0;border-radius:5px}button:disabled{opacity:.5}p{line-height:1.4}output{display:block;font-weight:bold}small{display:block}input:focus-visible,button:focus-visible{outline:3px solid #c29816}</style>
 <section aria-label="EcoBot teste assistido"><h2>EcoBot · 1 lançamento</h2><p>PROTÓTIPO. Abra o resíduo e clique em Jogar sem câmera. Sem nova tentativa automática.</p><label>Entrada <select id="method"><option value="debugger">Mouse real pela extensão (debugger)</option><option value="manual" selected>Arraste manual guiado</option><option value="synthetic">Sintético (diagnóstico)</option></select></label>
 <label>Força (1–100%) <input id="force" type="number" min="1" max="100" step="1" placeholder="%"></label>
 <label>Giro (−45 a 45°) <input id="spin" type="number" min="-45" max="45" value="0" step="1"></label>
 <small>Use valores de calibração manual. A precisão ainda não foi medida no jogo.</small>
 <label><input id="permission" type="checkbox"> Confirmei que o jogo permite automação e autorizo apenas este lançamento.</label>
 <button id="launch">Armar 1 teste</button><button id="cancel">Cancelar / fechar</button>
 <output id="status" role="status" aria-live="polite">Carregando checkpoint…</output>
 <label><input id="reviewed" type="checkbox"> Conferi o jogo e quero encerrar este teste, inclusive se o resultado ficou incerto.</label>
 <button id="review" disabled>Encerrar após conferência</button><small>Este teste não avança a fila de partidas.</small></section>`;
 document.documentElement.append(host);
 const get=<T extends HTMLElement>(id:string)=>root.getElementById(id) as T;
 const status=get<HTMLOutputElement>('status'),launch=get<HTMLButtonElement>('launch'),review=get<HTMLButtonElement>('review');
 launch.disabled=true;
 let attempt:Attempt|undefined,busy=false;
 const pagehide=()=>cancel.abort();window.addEventListener('pagehide',pagehide,{once:true});
 function render(){launch.disabled=busy||!!attempt||cancel.signal.aborted;review.disabled=busy||!attempt;}
 try {attempt=(await send('assisted-status')).attempt;status.textContent=attempt?'Teste anterior bloqueia novo lançamento. Confira o jogo e encerre abaixo.':'Pronto para configurar um único teste.';}catch(e){status.textContent=(e as Error).message;cancel.abort();}render();
 launch.addEventListener('click',async event=>{
 if(!event.isTrusted||busy||attempt||cancel.signal.aborted)return;
 try {
 if(!get<HTMLInputElement>('permission').checked)throw Error('Confirme a permissão de um único lançamento.');
 const forceInput=get<HTMLInputElement>('force'),spinInput=get<HTMLInputElement>('spin');
 if(!forceInput.value||!spinInput.value||!forceInput.checkValidity()||!spinInput.checkValidity())throw Error('Informe força e giro válidos.');
 const candidate:Candidate={force:forceInput.valueAsNumber/100,spin:spinInput.valueAsNumber*Math.PI/180,margin:0};
 requireReady(document);
 const canvas=document.querySelector<HTMLCanvasElement>('canvas#cena');if(!canvas)throw Error('Canvas do jogo não encontrado.');
 const itemId=new URL(location.href).searchParams.get('residuo');if(!itemId)throw Error('Resíduo atual não reconhecido.');
 const manual=get<HTMLSelectElement>('method').value==='manual';
 endpoints(canvas,candidate);busy=true;render();status.textContent='Salvando bloqueio antes do gesto…';
 const adapter=manual?new ManualThrowAdapter(canvas):get<HTMLSelectElement>('method').value==='debugger'?new DebuggerThrowAdapter(()=>attempt!.id):new PointerThrowAdapter(canvas);
 const result=await runAssisted(document,candidate,{
 reserve:async()=>{const reply=await send('assisted-reserve',{itemId,candidate});attempt=reply.attempt;status.textContent=manual?'Faça um único arraste seguindo os marcadores no canvas (30 segundos).':'Teste em andamento. Aguardando feedback do jogo…';return attempt!.id;},
 finish:async(id,outcome,measurement)=>{const reply=await send('assisted-finish',{id,outcome,...(measurement?{measurement}:{})});attempt=reply.attempt;},
 adapter
 },cancel.signal,manual?30000:15000);
 status.textContent=labels[result]+('failure' in adapter&&adapter.failure?' '+adapter.failure:'');
 }catch(e){status.textContent=(e as Error).message;}
 finally {busy=false;render();}
 });
 review.addEventListener('click',async event=>{
 if(!event.isTrusted||busy||!attempt)return;
 if(!get<HTMLInputElement>('reviewed').checked){status.textContent='Confira o jogo e marque a confirmação de encerramento.';return;}
 busy=true;render();try{await send('assisted-review',{id:attempt.id});attempt=undefined;cancel.abort();status.textContent='Teste encerrado manualmente. Para outro teste, prepare novamente pelo popup.';}catch(e){status.textContent=(e as Error).message;}finally{busy=false;render();}
 });
 get('cancel').addEventListener('click',event=>{
 if(!event.isTrusted)return;cancel.abort();if(busy){status.textContent='Interrompendo; confira o jogo antes de encerrar o teste.';return;}
 window.removeEventListener('pagehide',pagehide);host.remove();activePanel=undefined;
 });
}
