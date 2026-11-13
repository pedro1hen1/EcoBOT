import type {AssistedStore} from './assisted-store';
import type {Round} from './round';
import {sanitizeScore} from './score';
export function roundsCSV(rounds:Round[]):string{
 const rows:unknown[][]=[['tipo','execucao','partida','residuo_id','residuo_nome','categoria','sequencia','repeticao','tentativas','acertos_ui','erros_ui','inicio_utc','fim_utc','duracao_ms','estado','pontos_hud_final','pontos_feedback_final']];
 for(const r of rounds)rows.push(['partida',r.runId,r.id,r.task.item.id,r.task.item.nome,r.task.item.lixeira,r.task.sequence,r.task.repeat,r.attempts.length,r.attempts.filter(a=>a.outcome==='success').length,r.attempts.filter(a=>a.outcome==='retry'||a.outcome==='ended-failure').length,new Date(r.startedAt).toISOString(),r.endedAt===undefined?'':new Date(r.endedAt).toISOString(),r.endedAt===undefined?'':r.endedAt-r.startedAt,r.phase,r.attempts.at(-1)?.score?.hudAfter,sanitizeScore(r.attempts.at(-1)?.score).feedbackPoints]);
 return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
}
export function csvCell(value:unknown):string{
 let text=String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
 if(/^\s*[=+@\-]/.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
 return '"'+text.replace(/"/g,'""')+'"';
}
export function attemptsCSV(store:AssistedStore,rounds:Round[]=[]):string{
 const rows:unknown[][]=[['tipo','id_local','residuo','inicio_utc','fim_utc','resultado_ui','conferido_utc','forca_solicitada','giro_rad','forca_medida','giro_medido_rad','entrada_real','hud_antes','hud_depois','delta_hud','feedback_pontos','feedback_texto','espera_sorteada_ms','arraste_alvo_ms']];
 for(const a of [...store.history,...Object.values(store.active)])rows.push(['tentativa_assistida',a.id,a.itemId,new Date(a.startedAt).toISOString(),a.finishedAt===undefined?'':new Date(a.finishedAt).toISOString(),a.outcome??'incerto',a.reviewedAt===undefined?'':new Date(a.reviewedAt).toISOString(),a.force,a.spin,a.measurement?.force,a.measurement?.spin,a.measurement?.trusted,'','','','','','','']);
 for(const r of rounds)for(const a of r.attempts)rows.push(['tentativa_de_partida',a.id,r.task.item.id,new Date(a.startedAt).toISOString(),a.finishedAt===undefined?'':new Date(a.finishedAt).toISOString(),a.outcome??'incerto','',a.force,a.spin,'','','',sanitizeScore(a.score).hudBefore,sanitizeScore(a.score).hudAfter,sanitizeScore(a.score).hudDelta,sanitizeScore(a.score).feedbackPoints,sanitizeScore(a.score).feedbackText,a.pacing?.waitMs,a.pacing?.dragMs]);
 return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
}
export function attemptMetrics(store:AssistedStore){
 const attempts=[...store.history,...Object.values(store.active)];
 return {attempts:attempts.length,success:attempts.filter(a=>a.outcome==='success').length,blocked:Object.keys(store.active).length};
}
