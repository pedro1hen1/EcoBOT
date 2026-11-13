import {catalog,defaults,plan,type Config,type Item} from './planner';
import type {CatalogReview} from './catalog-store';
import type {ExecutionCheckpoint,Calibration} from './execution';
import {readCheckpoint} from './storage';
import {BUILD_VERSION,assertBuild} from './version';
import {validateProfile,type AimEvidence} from './aim';
import {paceRange} from './pacing';
const el=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const input=(id:string)=>el<HTMLInputElement>(id);
const list=el<HTMLSelectElement>('ids');
let items:Item[]=catalog,snapshot:CatalogReview|undefined,compatible=false,busy=false,running=false;
function error(value:unknown){el('log').textContent=value instanceof Error?value.message:String(value);}
function controls(){for(const id of ['start-series','measure-aim'])el<HTMLButtonElement>(id).disabled=!compatible||busy||running;}
function options(next:Item[],ids=Array.from(list.selectedOptions,o=>o.value)){
 items=next;list.replaceChildren();for(const i of items)list.add(new Option(i.nome+' · '+i.lixeira,i.id,false,ids.includes(i.id)));
}
options(catalog,defaults.ids);
function config():Config{
 const fixed=input('mode').value==='fixo';
 return {mode:fixed?'fixo':'sequencial',category:input('category').value as Config['category'],ids:Array.from(list.selectedOptions,o=>o.value),repeats:Number(input('repeats').value),sequences:fixed?1:Number(input('sequences').value),order:fixed?'group':input('order').value as Config['order'],speed:Number(input('speed').value)};
}
function preview(){
 const fixed=input('mode').value==='fixo';el('sequence-label').hidden=fixed;el('order-label').hidden=fixed;el('selection-help').hidden=fixed;list.multiple=!fixed;list.size=fixed?1:4;
 try{el('total').textContent=plan(config(),items).length+' partidas selecionadas';}catch(e){el('total').textContent=(e as Error).message;}
 el('aim-preview').textContent='Cada lance sorteia um novo par, diferente do anterior. Iniciar usa somente pares com acerto observado neste resíduo e nível. Medir explora a faixa, com limite de 2 lances e pausa no primeiro erro.';
 for(const bin of ['azul','cinza']){input('force-max-'+bin).disabled=!input('vary-aim').checked;input('spin-max-'+bin).disabled=!input('vary-aim').checked;}
 try{const r=paceRange(Number(input('speed').value));el('timing-preview').textContent=`Ritmo sorteado por lance: espera ${r.min}–${r.max} ms; arraste alvo 220–420 ms.`;}catch{el('timing-preview').textContent='Velocidade deve estar entre 1 e 5';}
}
function render(cp:ExecutionCheckpoint){
 running=cp.execution?.status==='RUNNING';el<HTMLFieldSetElement>('config-fields').disabled=running;
 el('machine-state').textContent=cp.state+' · '+cp.cursor+'/'+cp.queue.length+' · '+cp.message;
 el('status').textContent=running?'Jogando · '+cp.cursor+'/'+cp.queue.length+' partidas concluídas':cp.uncertain?'Pausado: confira o jogo e a pendência':cp.execution?.status==='PAUSED'?'Pausado · '+cp.cursor+'/'+cp.queue.length+' partidas concluídas':cp.execution?.status==='COMPLETED'?'Execução concluída · '+cp.cursor+'/'+cp.queue.length:'Pronto para iniciar a configuração abaixo';
 if(cp.execution||cp.uncertain)el('log').textContent=cp.message;
 el<HTMLButtonElement>('pause').disabled=!running;
 el<HTMLButtonElement>('resume').disabled=cp.execution?.status!=='PAUSED'||cp.uncertain;
 controls();
}
async function rpc(type:string,data:Record<string,unknown>={}){
 const r=await chrome.runtime.sendMessage({type,...data,buildVersion:BUILD_VERSION});
 if(r?.buildVersion!==BUILD_VERSION){compatible=false;controls();el('open-extensions').hidden=false;assertBuild(r);}
 if(!r?.ok){if(r?.error?.includes('Versões desencontradas')){compatible=false;controls();el('open-extensions').hidden=false;}throw Error(r?.error??'A extensão não respondeu. Recarregue o EcoBot e a aba do jogo.');}
 return r;
}
function renderCatalog(){
 el('catalog-warning').textContent=snapshot?(snapshot.items.length+' resíduos · '+(snapshot.warning||'catálogo confere')+(snapshot.reviewedAt?' · revisado':'')):'Abra o menu do jogo para ler o catálogo.';
 el('catalog-items').textContent=snapshot?.items.map(i=>i.nome+' · '+i.lixeira+' ('+i.id+')').join('\n')??'';
 el<HTMLButtonElement>('review-catalog').disabled=!snapshot||snapshot.warning.includes('Não executar');
 if(snapshot?.reviewedAt){options(snapshot.items);preview();}
}
async function inspect(){
 const r=await rpc('inspect');snapshot=(await rpc('catalog-status')).catalogReview;renderCatalog();
 if(r.result.screen!=='HOME'||snapshot?.warning.includes('Não executar'))throw Error('Volte ao menu dos resíduos na aba do jogo antes de iniciar.');
 return snapshot!;
}
async function review(){if(!snapshot)throw Error('Atualize o catálogo primeiro.');snapshot=(await rpc('review-catalog',{inspectedAt:snapshot.inspectedAt})).catalogReview;renderCatalog();}
function calibration():Calibration{
 const c:Calibration={level:input('calibration-level').value.trim(),observedOnly:true,pauseOnMiss:true};
 for(const bin of ['azul','cinza'] as const)if(input('force-'+bin).value){
 c[bin]={force:input('force-'+bin).valueAsNumber/100,spin:input('spin-'+bin).valueAsNumber*Math.PI/180,...(input('vary-aim').checked?{range:{forceMin:input('force-'+bin).valueAsNumber,forceMax:input('force-max-'+bin).valueAsNumber,angleMin:input('spin-'+bin).valueAsNumber,angleMax:input('spin-max-'+bin).valueAsNumber}}:{})};
 validateProfile(c[bin]!);
 }return c;
}
async function evidence(){
 const {rows}=await rpc('aim-evidence');const host=el('aim-evidence');host.replaceChildren();
 if(!rows?.length){host.textContent='Sem pares registrados por este histórico. Não há faixa de acerto comprovada.';return;}
 const table=document.createElement('table');const header=table.insertRow();
 for(const text of ['Resíduo / nível','Força','Ângulo','Acertos locais / prévios','Erros','Δ HUD','Feedback']){const th=document.createElement('th');th.textContent=text;header.append(th);}
 const extent=(values:number[]|undefined)=>!values?.length?'—':Math.min(...values)===Math.max(...values)?String(values[0]):Math.min(...values)+' a '+Math.max(...values);
 for(const row of rows as AimEvidence[]){const tr=table.insertRow();for(const text of [row.itemId+' / '+row.level,row.force+'%',row.angle+'°',row.successes+' / '+(row.priorSuccesses??0),String(row.misses),extent(row.hudDeltas),extent(row.feedbackScores)])tr.insertCell().textContent=text;}
 host.append(table);
}
async function metrics(){const r=await rpc('metrics');const m=r.metrics;if(m)el('metrics').textContent=(m.rounds??0)+' partidas · '+m.attempts+' registros de tentativa · '+m.success+' acertos na UI';}
async function act(action:()=>Promise<void>){if(busy)return;busy=true;controls();el('log').textContent='';try{await action();}catch(e){error(e);}finally{busy=false;controls();}}
el('config').addEventListener('input',preview);
el('config').addEventListener('submit',e=>{e.preventDefault();void start(e.isTrusted);});
el('aim-details').addEventListener('input',preview);
el('review-catalog').addEventListener('click',()=>void act(review));
el('inspect').addEventListener('click',()=>void act(async()=>{await inspect();}));
el('open-extensions').addEventListener('click',()=>{void chrome.tabs.create({url:'chrome://extensions/?id='+chrome.runtime.id});});
function start(trusted:boolean,measure=false){return act(async()=>{
 if(!trusted||!input('series-permission').checked)throw Error('Marque a autorização das partidas selecionadas para iniciar.');
 const c=calibration();let cfg=config();
 if(measure){if(cfg.mode!=='fixo')throw Error('Para medir, selecione Fixo e um resíduo.');cfg={...cfg,repeats:2,sequences:1};c.observedOnly=false;c.measuring=true;}
 for(const task of plan(cfg,items)){const p=c[task.item.lixeira as 'azul'|'cinza'];if(!p?.range||(p.range.forceMin===p.range.forceMax&&p.range.angleMin===p.range.angleMax))throw Error('Configure uma faixa com pelo menos duas combinações. O modo fixo de força/ângulo foi removido.');}
 const s=await inspect();
 if(!s.reviewedAt){if(s.warning){el<HTMLDetailsElement>('catalog-details').open=true;throw Error('O catálogo mudou. Confira os itens e clique em Revisei: aplicar catálogo atual.');}await review();}
 const settings={calibration:c,vary:input('vary-aim').checked,limit:input('series-limit').value};
 await chrome.storage.local.set({aimSettings:settings});
 const r=await rpc('series-start',{config:cfg,calibration:c,...(measure?{limit:2}:settings.limit?{limit:Number(settings.limit)}:{})});render(r.cp);
 });}
el('start-series').addEventListener('click',event=>{void start(event.isTrusted);});
el('measure-aim').addEventListener('click',event=>{void start(event.isTrusted,true);});
for(const id of ['pause','resume','stop'])el(id).addEventListener('click',()=>void act(async()=>{const r=await rpc(id);render(r.cp);el('log').textContent=r.cp.message;}));
el('prepare-assisted').addEventListener('click',()=>void act(async()=>{const r=await rpc('prepare-assisted');el('log').textContent=r.notice;}));
el('review-round').addEventListener('click',()=>void act(async()=>{
 if(!input('round-reviewed').checked)throw Error('Confira o jogo e marque a confirmação antes de arquivar.');
 const cp=await readCheckpoint() as ExecutionCheckpoint;const r=await rpc('series-review',{id:cp.execution?.active?.id,reviewed:true});render(r.cp);el('log').textContent=r.cp.message;await metrics();
}));
for(const [id,type,name] of [['export-attempts','export-attempts','tentativas'],['export-rounds','export-rounds','partidas']])el(id).addEventListener('click',()=>void act(async()=>{
 const r=await rpc(type);const url=URL.createObjectURL(new Blob([r.csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ecobot-'+name+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}));
chrome.storage.onChanged?.addListener((changes,area)=>{if(area==='local'&&changes.checkpoint?.newValue){render(changes.checkpoint.newValue as ExecutionCheckpoint);void metrics().then(evidence).catch(error);}});
async function load(){
 const status=await rpc('status');compatible=true;render(status.cp);
 snapshot=(await rpc('catalog-status')).catalogReview;if(snapshot?.reviewedAt)options(snapshot.items,defaults.ids);
 const saved=await readCheckpoint();const c=saved.config??defaults;
 for(const key of ['mode','category','repeats','sequences','order','speed'] as const)input(key).value=String(c[key]);
 for(const o of list.options)o.selected=c.ids.includes(o.value);
 const {aimSettings}=await chrome.storage.local.get('aimSettings');const s=aimSettings as {calibration:Calibration;vary:boolean;limit:string}|undefined;
 if(s?.calibration){input('calibration-level').value=s.calibration.level;input('series-limit').value=s.limit;
 for(const bin of ['azul','cinza'] as const){const p=s.calibration[bin];if(p?.range&&(p.range.forceMin!==p.range.forceMax||p.range.angleMin!==p.range.angleMax)){input('force-'+bin).value=String(p.range.forceMin);input('force-max-'+bin).value=String(p.range.forceMax);input('spin-'+bin).value=String(p.range.angleMin);input('spin-max-'+bin).value=String(p.range.angleMax);}}}
 preview();renderCatalog();await metrics();await evidence();
 try{await inspect();}catch(e){error(e);}controls();
}
preview();void load().catch(error);
