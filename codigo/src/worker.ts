import {initial,transition,recover} from './machine';
import {catalog,plan,type Config} from './planner';
import {allowed} from './dom';
import {readCheckpoint} from './storage';
import {emptyAssisted,reserve,finish,review,type AssistedStore} from './assisted-store';
import {reviewCatalog,type CatalogReview} from './catalog-store';
import {attemptsCSV,attemptMetrics,roundsCSV} from './audit';
import type {Round} from './round';
import {debuggerThrow,cancelDebugger} from './debugger-input';
import {seriesMessage,type ExecutionCheckpoint} from './execution';
import {BUILD_VERSION,PROTOCOL,assertBuild} from './version';
import {combinedEvidence,requireVariation} from './aim';
import {VERIFIED_PAIRS} from './verified';
let serial:Promise<unknown>=Promise.resolve();
async function assistedStore():Promise<AssistedStore>{
 const data=await chrome.storage.local.get('assisted');const store=data.assisted as AssistedStore|undefined;
 if(store&&(store.version!==1||!store.active||!Array.isArray(store.history)))throw Error('Checkpoint de teste incompatível');
 return store??emptyAssisted();
}
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
 const reply=(payload:Record<string,unknown>)=>respond({...payload,buildVersion:BUILD_VERSION});
 if(sender.id!==chrome.runtime.id)return false;
 if(message?.type==='assisted-input-cancel'&&sender.tab?.id&&sender.frameId===0&&sender.url&&allowed(sender.url))cancelDebugger(sender.tab.id);
 serial=serial.catch(()=>{}).then(async()=>{
 const popupUrl=chrome.runtime.getURL?.('popup.html');
 const fromPopup=!!popupUrl&&sender.url===popupUrl;
 if(sender.tab&&!fromPopup)assertBuild(message);
 if(fromPopup&&message.type==='series-start')assertBuild(message);
 if(typeof message?.type==='string'&&message.type.startsWith('series-')){await seriesMessage(message,sender,reply);return;}
 if(sender.tab&&!fromPopup){
 // Somente o content script no frame principal do jogo pode reservar/concluir o teste.
 if(sender.frameId!==0||!sender.documentId||!sender.url||!allowed(sender.url)||!sender.tab.id||new URL(sender.url).pathname!=='/ResiduoGo/public/index.php/ar')throw Error('Contexto de teste inválido');
 const context={tabId:sender.tab.id,documentId:sender.documentId};let store=await assistedStore();
 const {catalogReview}=await chrome.storage.local.get('catalogReview');
 const snapshot=catalogReview as CatalogReview|undefined;
 const items=snapshot?.reviewedAt?snapshot.items:catalog;
 if(message.type==='assisted-input'){
 const attempt=store.active[String(context.tabId)];
 if(!attempt||attempt.id!==message.id||attempt.documentId!==context.documentId||attempt.finishedAt!==undefined||attempt.inputClaimedAt!==undefined)throw Error('Entrada bloqueada: reserva ausente, já consumida ou documento divergente');
 attempt.inputClaimedAt=Date.now();await chrome.storage.local.set({assisted:store});
 // Fora da fila serial: cancelamento e observação continuam atendidos durante o gesto.
 void debuggerThrow(attempt).then(()=>reply({ok:true}),()=>reply({ok:false,error:'Gesto interrompido ou recusado. Confira o jogo; não repetir.'}));return;
 }
 if(message.type==='assisted-input-cancel'){reply({ok:true});return;}
 if(message.type==='assisted-reserve'){
 const itemId=new URL(sender.url).searchParams.get('residuo');if(itemId!==message.itemId)throw Error('Resíduo diverge da aba atual');
 store=reserve(store,context,message.itemId,message.candidate,crypto.randomUUID(),Date.now(),items);
 }else if(message.type==='assisted-finish')store=finish(store,context,message.id,message.outcome,Date.now(),message.measurement);
 else if(message.type==='assisted-review')store=review(store,context.tabId,message.id,Date.now());
 else if(message.type!=='assisted-status')throw Error('Comando de teste desconhecido');
 await chrome.storage.local.set({assisted:store});reply({ok:true,attempt:store.active[String(context.tabId)],itemKnown:items.some(i=>i.id===new URL(sender.url!).searchParams.get('residuo'))});return;
 }
 let cp:ExecutionCheckpoint=await readCheckpoint();
 let wakeTab:number|undefined;
 if(message.type==='plan') {
 if(cp.state!=='IDLE'&&cp.state!=='COMPLETED')throw Error('Pare o plano atual antes de substituí-lo');
 if(cp.uncertain)throw Error('Checkpoint incerto: confira a rodada antes de substituir o plano');
 const {catalogReview}=await chrome.storage.local.get('catalogReview');
 const snapshot=catalogReview as CatalogReview|undefined;
 const config=message.config as Config;cp={...initial(),config,queue:plan(config,snapshot?.reviewedAt?snapshot.items:undefined),state:'PAUSED',previous:'HOME',message:'Fila preparada. Confira o total e clique em Iniciar na aba do menu.'};
 }else if(message.type==='pause'||message.type==='stop'){
 cp=transition(cp,message.type);
 if(cp.execution){cp.execution.status=message.type==='stop'?'STOPPED':'PAUSED';cp.uncertain=cp.uncertain||!!cp.execution.active;if(cp.uncertain)cp.message="Rodada pendente preservada. Confira o jogo, volte ao menu e use Encerrar pendência no painel principal.";cancelDebugger(cp.execution.tabId);void chrome.tabs.sendMessage(cp.execution.tabId,{type:'cancel-assisted'}).catch(()=>{});}
 const store=await assistedStore();
 await Promise.all(Object.values(store.active).map(a=>{cancelDebugger(a.tabId);return chrome.tabs.sendMessage(a.tabId,{type:'cancel-assisted'},{documentId:a.documentId}).catch(()=>{});}));
 }else if(message.type==='resume'){
 if(!cp.execution)throw Error('Não há execução pausada. Configure a quantidade e clique em Iniciar.');
 for(const p of [cp.execution.calibration.azul,cp.execution.calibration.cinza])if(p)requireVariation(p);
 if(!cp.execution.calibration.observedOnly&&!cp.execution.calibration.measuring)throw Error('Execução antiga sem calibração observada. Confira o jogo e configure uma nova execução pelo Iniciar.');
 cp.execution.calibration.pauseOnMiss=true;
 cp=transition(cp,'resume');if(cp.execution?.status==='PAUSED'){cp.execution.status='RUNNING';wakeTab=cp.execution.tabId;}
 }
 else if(message.type==='inspect'||message.type==='prepare-assisted') {
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 if(!tab?.id||!tab.url||!allowed(tab.url))throw Error('Abra a aba do jogo no domínio e caminho corretos');
 const result=await chrome.tabs.sendMessage(tab.id,{type:message.type}).catch(()=>{throw Error('A extensão não está conectada à aba. Recarregue o jogo depois de recarregar o EcoBot na página de extensões.');});
 assertBuild(result);
 if(result?.ok===false)throw Error(result.error);
 if(message.type==='inspect'&&result.screen==='HOME'&&!result.catalog.warning.includes('Não executar')){
 const previous=(await chrome.storage.local.get('catalogReview')).catalogReview as CatalogReview|undefined;
 const same=previous?.reviewedAt&&previous.items.length===result.catalog.items.length&&previous.items.every((item,index)=>{const actual=result.catalog.items[index];return actual.id===item.id&&actual.nome===item.nome&&actual.lixeira===item.lixeira;});
 const catalogReview:CatalogReview={version:1,items:result.catalog.items,warning:result.catalog.warning,inspectedAt:Date.now(),...(same?{reviewedAt:previous.reviewedAt}:{})};
 await chrome.storage.local.set({catalogReview});
 }
 reply({ok:true,cp,...(message.type==='inspect'?{result}:{notice:'Painel aberto na aba. Nenhum gesto enviado; confirme o teste lá.'})});return;
 }else if(message.type==='review-catalog'){
 const {catalogReview}=await chrome.storage.local.get('catalogReview');
 const snapshot=reviewCatalog(catalogReview as CatalogReview|undefined,message.inspectedAt,Date.now());
 await chrome.storage.local.set({catalogReview:snapshot});reply({ok:true,cp,catalogReview:snapshot});return;
 }else if(message.type==='catalog-status'){
 const {catalogReview}=await chrome.storage.local.get('catalogReview');reply({ok:true,cp,catalogReview});return;
 }else if(message.type==='export-attempts'||message.type==='export-rounds'||message.type==='metrics'||message.type==='aim-evidence'){
 const store=await assistedStore();const {roundHistory}=await chrome.storage.local.get('roundHistory');
 const rounds=(roundHistory??[]) as Round[];if(!Array.isArray(rounds))throw Error('Histórico de partidas incompatível');
 const allRounds=cp.execution?.active?[...rounds,cp.execution.active]:rounds;
 const roundAttempts=allRounds.flatMap(r=>r.attempts);const metrics=attemptMetrics(store);
 if(message.type==='aim-evidence'){reply({ok:true,rows:combinedEvidence(allRounds,VERIFIED_PAIRS)});return;}
 reply({ok:true,cp,metrics:{...metrics,attempts:metrics.attempts+roundAttempts.length,success:metrics.success+roundAttempts.filter(a=>a.outcome==='success').length,rounds:rounds.filter(r=>r.phase==='COMPLETED').length},...(message.type==='export-attempts'?{csv:attemptsCSV(store,allRounds)}:message.type==='export-rounds'?{csv:roundsCSV(allRounds)}:{})});return;
 }else if(message.type!=='status')throw Error('Comando desconhecido');
 await chrome.storage.local.set({checkpoint:cp});reply({ok:true,cp,protocol:PROTOCOL});
 if(wakeTab!==undefined)void chrome.tabs.sendMessage(wakeTab,{type:'series-wake'}).catch(()=>{});
 }).catch(error=>reply({ok:false,error:error instanceof Error?error.message:'Operação indisponível. Revise a aba, seleção e estado do plano.'}));
 return true;
});
chrome.runtime.onStartup.addListener(()=>{serial=serial.catch(()=>{}).then(async()=>{const cp=await readCheckpoint();await chrome.storage.local.set({checkpoint:recover(cp)});});});
