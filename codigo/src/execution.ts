import {readCheckpoint} from './storage';
import {openRound,enterAR,reserveThrow,observeThrow,confirmMenu,commitRound,pauseRound,type Round} from './round';
import {allowed} from './dom';
import {debuggerThrow,cancelDebugger,InputInterruption} from './debugger-input';
import {initial,type Checkpoint} from './machine';
import {plan,type Config,type Task} from './planner';
import {chooseDifferent,pickPair,observedPairs,unmeasuredPairs,requireVariation,type AimProfile,type AimPair} from './aim';
import type {CatalogReview} from './catalog-store';
import type {AssistedStore} from './assisted-store';
import {sanitizeScore} from './score';
import {choosePacing} from './pacing';
import {VERIFIED_PAIRS} from './verified';
import {keepGameActive,releaseGame} from './background';
export type Calibration={level:string;background?:boolean;observedOnly?:boolean;measuring?:boolean;learnMissing?:boolean;pauseOnMiss?:boolean;azul?:AimProfile;cinza?:AimProfile};
function missingItems(queue:Task[],calibration:Calibration,history:Round[]){return [...new Map(queue.map(t=>[t.item.id,t.item])).values()].filter(item=>observedPairs(history,item.id,item.lixeira,calibration.level,calibration[item.lixeira as 'azul'|'cinza']?.range,VERIFIED_PAIRS).length<2);}
export type Execution={id:string;tabId:number;status:'RUNNING'|'PAUSED'|'STOPPED'|'COMPLETED';limit:number;completed:number;calibration:Calibration;lastAim?:AimPair;active?:Round;history:Round[]};
export type ExecutionCheckpoint=Checkpoint&{execution?:Execution};
export async function seriesMessage(message:any,sender:chrome.runtime.MessageSender,reply:(response:any)=>void):Promise<void>{
 let cp=await readCheckpoint() as ExecutionCheckpoint;
 let roundHistory:Round[]|undefined;
 const save=async()=>{await chrome.storage.local.set({checkpoint:cp,...(roundHistory?{roundHistory}:{})});};
 if(message.type==='series-preview'){
 if(message.limit!==undefined&&(!Number.isInteger(message.limit)||message.limit<1||message.limit>10000))throw Error('Use um limite entre 1 e 10.000 partidas');
 if(sender.url!==chrome.runtime.getURL('popup.html'))throw Error('Somente o painel pode consultar a seleção');
 const stored=await chrome.storage.local.get(['catalogReview','roundHistory']);const reviewed=stored.catalogReview as CatalogReview|undefined;
 const queue=plan(message.config as Config,reviewed?.reviewedAt?reviewed.items:undefined);const calibration=message.calibration as Calibration;
 if(!calibration?.level?.trim())throw Error('Informe o nível visível no jogo');
 for(const p of [calibration.azul,calibration.cinza])if(p)requireVariation(p);
 const history=(stored.roundHistory??[]) as Round[];const totalItems=new Set(queue.map(t=>t.item.id)).size;
 const limited=queue.slice(0,message.limit??queue.length);const missing=missingItems(limited,calibration,history);
 reply({ok:true,totalItems,readyItems:totalItems-missingItems(queue,calibration,history).length,pendingThisRun:missing.length,total:queue.length,runTotal:limited.length,missing:missing.map(i=>i.nome)});return;
 }
 if(message.type==='series-start'){
 if(sender.tab&&sender.url!==chrome.runtime.getURL('popup.html'))throw Error('Somente o painel pode iniciar');
 if(cp.uncertain||cp.execution?.status==='RUNNING'||cp.execution?.active)throw Error('Pause e confira a rodada pendente antes de iniciar outra execução');
 const stored=await chrome.storage.local.get(['catalogReview','assisted']);
 const catalogReview=stored.catalogReview as CatalogReview|undefined;const assisted=stored.assisted as AssistedStore|undefined;
 if(message.config){const config=message.config as Config;cp={...initial(),config,queue:plan(config,catalogReview?.reviewedAt?catalogReview.items:undefined),state:'PAUSED'};}
 if(cp.cursor>=cp.queue.length)throw Error('Selecione resíduos e uma quantidade de partidas');
 const limit=message.limit??cp.queue.length-cp.cursor;
 if(!Number.isInteger(limit)||limit<1||limit>10000)throw Error('Use um limite entre 1 e 10.000 partidas');
 const calibration=message.calibration as Calibration;
 if(!calibration||typeof calibration.level!=='string'||!calibration.level.trim())throw Error('Informe o nível da calibração');
 if(calibration.learnMissing)calibration.pauseOnMiss=true;
 if(calibration.measuring&&(limit!==2||cp.queue.length!==2||cp.queue[0].item.id!==cp.queue[1].item.id))throw Error('Medição exige um resíduo e exatamente duas partidas');
 for(const bin of ['azul','cinza'] as const)if(calibration[bin])requireVariation(calibration[bin]!);
 if(calibration.measuring){const item=cp.queue[cp.cursor].item;const range=calibration[item.lixeira as 'azul'|'cinza']?.range;const history=((await chrome.storage.local.get('roundHistory')).roundHistory??[]) as Round[];if(!range||unmeasuredPairs(history,item.id,item.lixeira,calibration.level,range,VERIFIED_PAIRS).length<2)throw Error('Há menos de dois pares ainda não medidos nesta faixa. Amplie a faixa ou inicie com os pares já observados.');}
 if(calibration.observedOnly&&!calibration.learnMissing){
 const history=((await chrome.storage.local.get('roundHistory')).roundHistory??[]) as Round[];
 const missing=missingItems(cp.queue.slice(cp.cursor,cp.cursor+limit),calibration,history);
 if(missing.length)throw Error('Faltam 2 pares com acerto e sem erro neste nível para: '+missing.slice(0,5).map(i=>i.nome).join(', ')+'. Selecione um resíduo e use Medir 2 lances. Nenhuma partida iniciada.');
 }
 if(!catalogReview?.reviewedAt||catalogReview.warning.includes('Não executar'))throw Error('Inspecione e revise o catálogo do menu atual');
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 if(!tab?.id||!tab.url||!allowed(tab.url)||new URL(tab.url).pathname!=='/ResiduoGo/public/index.php')throw Error('Inicie na aba do menu do jogo');
 if(Object.keys(assisted?.active??{}).length)throw Error('Confira e encerre o teste assistido antes da série');
 const previousRounds=((await chrome.storage.local.get('roundHistory')).roundHistory??[]) as Round[];
 const last=previousRounds.flatMap(r=>r.attempts).filter(a=>a.force!==undefined&&a.spin!==undefined&&a.inputClaimedAt!==undefined).at(-1);
 cp={...cp,state:'HOME',message:'Execução em andamento pela interface do jogo',execution:{id:crypto.randomUUID(),tabId:tab.id,status:'RUNNING',limit:Math.min(limit,cp.queue.length-cp.cursor),completed:0,calibration,history:[],...(last?{lastAim:{force:last.force!,spin:last.spin!}}:{})}};
 await save();void chrome.tabs.sendMessage(tab.id,{type:'series-wake'}).catch(()=>{});reply({ok:true,cp});return;
 }
 const run=cp.execution;
 if(message.type==='series-status'){reply({ok:true,cp});return;}
 if(message.type==='series-review'){
 if(sender.url!==chrome.runtime.getURL('popup.html')||message.reviewed!==true||(!cp.uncertain&&!run?.active)||run?.active?.id!==message.id||run?.status==='RUNNING')throw Error('Pause e confira a pendência atual antes de arquivar');
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 if(!tab?.id||!tab.url||!allowed(tab.url)||new URL(tab.url).pathname!=='/ResiduoGo/public/index.php')throw Error('Volte ao menu dos resíduos antes de encerrar a pendência');
 if(run&&run.tabId!==tab.id){
 const original=await chrome.tabs.get(run.tabId).catch(()=>undefined);
 if(original)throw Error('Confira a aba original da execução e volte ao menu nela antes de encerrar a pendência');
 // Após fechar/reiniciar o navegador, a aba antiga não existe. A conferência
 // explícita no menu atual pode arquivar, sem presumir nem reenviar resultado.
 }
 if(run?.active){
 const archived={...pauseRound(run.active,'Arquivada manualmente após conferência; partida não contabilizada'),reviewedAt:Date.now()};
 const stored=await chrome.storage.local.get('roundHistory');const previous=(stored.roundHistory??[]) as Round[];
 if(!Array.isArray(previous))throw Error('Histórico incompatível');
 roundHistory=previous.some(r=>r.id===archived.id)?previous:[...previous,archived].slice(-10000);
 }
 if(run){cancelDebugger(run.tabId);await releaseGame(run.tabId).catch(()=>{});run.active=undefined;run.status='STOPPED';}cp.state='IDLE';cp.uncertain=false;cp.message='Pendência encerrada após conferência. Clique em Iniciar para um novo plano. Cursor preservado; nenhum resultado reenviado.';
 await save();reply({ok:true,cp});return;
 }
 if(!sender.tab?.id||sender.frameId!==0||!sender.documentId||!sender.url||!allowed(sender.url))throw Error('Documento de execução inválido');
 if(!run||run.tabId!==sender.tab.id){reply({ok:true,action:'idle'});return;}
 const documentId=sender.documentId;
 const path=new URL(sender.url).pathname;
 const pause=async(reason:string)=>{cancelDebugger(run.tabId);run.status='PAUSED';if(run.active)run.active=pauseRound(run.active,reason);cp.state='PAUSED';cp.uncertain=!!run.active;cp.message=reason;await save();await releaseGame(run.tabId).catch(()=>{});reply({ok:true,action:'pause',cp});};
 if(run.status!=='RUNNING'){reply({ok:true,action:'pause'});return;}
 if(message.type==='series-fault'){await pause('Execução interrompida; confira a rodada antes de retomar');return;}
 if(message.type==='series-document'){
 if(path==='/ResiduoGo/public/index.php'&&message.screen==='HOME'){
 if(run.active){
 if(run.active.phase!=='RETURNING'){await pause('Retorno sem encerramento confirmado; partida não contabilizada');return;}
 const done=confirmMenu(run.active,{tabId:run.tabId,documentId,hasCatalog:message.hasCatalog===true},Date.now());
 const ledger=commitRound({version:1,runId:run.id,cursor:cp.cursor,active:run.active,history:run.history},done);
 cp.cursor=ledger.cursor;run.history=ledger.history;run.active=undefined;run.completed++;
 const storedHistory=await chrome.storage.local.get('roundHistory');
 const previous=(storedHistory.roundHistory??[]) as Round[];
 if(!Array.isArray(previous))throw Error('Histórico de partidas incompatível');
 roundHistory=previous.some(r=>r.id===done.id)?previous:[...previous,done].slice(-10000);
 }
 if(cp.cursor>=cp.queue.length||run.completed>=run.limit){run.status='COMPLETED';cp.state=cp.cursor>=cp.queue.length?'COMPLETED':'PAUSED';cp.previous='HOME';cp.message=`Execução concluída: ${run.completed} partidas confirmadas. Fila preservada.`;await save();await releaseGame(run.tabId).catch(()=>{});reply({ok:true,action:'pause',cp});return;}
 const {catalogReview}=await chrome.storage.local.get('catalogReview');const reviewed=catalogReview as CatalogReview|undefined;
 if(!reviewed?.reviewedAt||!Array.isArray(message.items)||message.items.length!==reviewed.items.length||reviewed.items.some(i=>!message.items.some((actual:any)=>actual.id===i.id&&actual.nome===i.nome&&actual.lixeira===i.lixeira))){await pause('Catálogo mudou: inspecione e revise a seleção antes de continuar');return;}
 const task=cp.queue[cp.cursor];
 if(!message.items.some((item:any)=>item.id===task.item.id&&item.nome===task.item.nome&&item.lixeira===task.item.lixeira)){await pause('Seleção planejada diverge do menu; prepare uma fila revisada');return;}
 if(!run.calibration[task.item.lixeira as 'azul'|'cinza']){await pause('Categoria sem calibração; nenhuma nova partida aberta');return;}
 if(run.calibration.background){try{await keepGameActive(run.tabId,documentId);}catch{await pause('Segundo plano indisponível. Confira a permissão e o aviso de depuração; nenhum novo card aberto.');return;}}
 run.active=openRound(run.id,crypto.randomUUID(),task,run.tabId,Date.now());cp.state='OPENING';await save();reply({ok:true,action:'open',itemId:task.item.id});return;
 }
 if(path==='/ResiduoGo/public/index.php/ar'&&run.active){
 const oldDocument=run.active.documentId;
 run.active=enterAR(run.active,{tabId:run.tabId,documentId,itemId:new URL(sender.url).searchParams.get('residuo')??''});
 if(run.active.phase==='PAUSED'){await pause('Recarga da partida: confira o resultado, sem repetir');return;}
 if(oldDocument===documentId){reply({ok:true,action:'idle'});return;}
 if(run.calibration.background){try{await keepGameActive(run.tabId,documentId);}catch{await pause('Segundo plano interrompido. Confira a aba e a permissão antes de continuar.');return;}}
 cp.state='READY';await save();reply({ok:true,action:'play',calibration:run.calibration,category:run.active.task.item.lixeira});return;
 }
 await pause('Tela não reconhecida ou sessão perdida');return;
 }
 const round=run.active;
 if(!round||round.documentId!==documentId||path!=='/ResiduoGo/public/index.php/ar')throw Error('Partida de outro documento');
 if(message.type==='series-reserve'){
 if(message.level!==run.calibration.level){await pause('Nível mudou: requer nova calibração');return;}
 const profile=run.calibration[round.task.item.lixeira as 'azul'|'cinza'];if(!profile)throw Error('Categoria sem calibração');
 const storedRounds=((await chrome.storage.local.get('roundHistory')).roundHistory??[]) as Round[];
 const known=observedPairs([...storedRounds,round],round.task.item.id,round.task.item.lixeira,run.calibration.level,profile.range,VERIFIED_PAIRS);
 const learning=!!run.calibration.measuring||!!run.calibration.learnMissing&&known.length<2;
 let candidate;
 if(learning){
 const options=unmeasuredPairs(storedRounds,round.task.item.id,round.task.item.lixeira,run.calibration.level,profile.range!,VERIFIED_PAIRS);
 if(!options.length){await pause('Faixa sem novos pares para medir. Confira a calibração antes de continuar.');return;}
 if(options.length===1&&run.lastAim?.force===options[0].force&&run.lastAim?.spin===options[0].spin){await pause('O único par disponível repetiria o último lance. Amplie a faixa para medir outra combinação.');return;}
 candidate=options.length===1?{...options[0],margin:0}:pickPair(options,run.lastAim);
 }else candidate=run.calibration.observedOnly?pickPair(known,run.lastAim):chooseDifferent(profile,run.lastAim);
 run.active=reserveThrow(round,documentId,crypto.randomUUID(),Date.now());run.active.level=message.level;run.lastAim={force:candidate.force,spin:candidate.spin};Object.assign(run.active.attempts.at(-1)!,{force:candidate.force,spin:candidate.spin,aimSource:learning?'learning':'observed',pacing:choosePacing(cp.config?.speed??3)});cp.state='FLYING';cp.message=(learning?'Medindo combinação nova de ':'Usando par observado de ')+round.task.item.nome+'. A partida faz parte da quantidade selecionada.';await save();reply({ok:true,id:run.active.attempts.at(-1)!.id,candidate});return;
 }
 const attempt=round.attempts.at(-1);
 if(message.type==='series-input'){
 if(!attempt||attempt.id!==message.id||attempt.finishedAt!==undefined||attempt.inputClaimedAt!==undefined||round.phase!=='FLYING')throw Error('Entrada já consumida ou sem reserva');
 if(attempt.force===undefined||attempt.spin===undefined)throw Error('Parâmetros da reserva não encontrados; não sortear novamente');
 const candidate={force:attempt.force,spin:attempt.spin};
 attempt.inputClaimedAt=Date.now();await save();
 void debuggerThrow({id:attempt.id,tabId:run.tabId,documentId,itemId:round.task.item.id,...candidate,...attempt.pacing,startedAt:attempt.startedAt}).then(()=>reply({ok:true}),async error=>{
 if(error instanceof InputInterruption)await chrome.storage.local.set({inputDiagnostic:{id:attempt.id,timing:error.timing}}).catch(()=>{});
 reply({ok:false,error:error instanceof Error?error.message:'Entrada interrompida; não repetir'});
 });return;
 }
 if(message.type==='series-finish'){
 const alreadyFinished=round.attempts.at(-1)?.finishedAt!==undefined;
 run.active=observeThrow(round,documentId,message.id,message.outcome,message.ended===true,Date.now());
 if(!alreadyFinished)run.active.attempts.at(-1)!.score=sanitizeScore(message.score);
 if(message.outcome==='gesture-error'&&/^Entrada nativa interrompida na etapa: (verificar documento|aguardar ritmo|conectar entrada|medir canvas|posicionar mouse|pressionar|arrastar|soltar)$/.test(message.inputFailure??'')){await pause(message.inputFailure+'. Confira o jogo e encerre a pendência antes de um novo início.');return;}
 if((run.calibration.measuring||run.calibration.pauseOnMiss)&&run.active.attempts.at(-1)?.outcome!=='success'){await pause('Lance sem acerto confirmado. Execução pausada; confira o jogo. O par com erro será excluído após arquivar a pendência.');return;}
 if(run.active.phase==='PAUSED'){await pause('Resultado ambíguo; partida preservada sem contabilizar');return;}
 cp.state=run.active.phase==='RETRY'?'RETRY':'RETURNING';await save();reply({ok:true,action:run.active.phase==='RETRY'?'retry':'return'});return;
 }
 throw Error('Comando de execução desconhecido');
}
