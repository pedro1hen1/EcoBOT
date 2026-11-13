export type ScoreObservation={hudBefore?:number;hudAfter?:number;hudDelta?:number;feedbackPoints?:number;feedbackText?:string};
export function parsePoints(text:string):number|undefined{
 const clean=text.trim().replace(/\s+/g,' ');
 const totals=[...clean.matchAll(/Total:\s*([+−-]?(?:\d{1,3}(?:\.\d{3})+|\d+))\s*pontos/gi)];
 if(totals.length===1&&clean.endsWith(totals[0][0]))return parsePoints(totals[0][1]);
 if(!/^[+−-]?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:\s*(?:ponto|pontos|pts))?$/i.test(clean))return;
 const n=Number(clean.replace(/(?:pontos?|pts)$/i,'').trim().replace(/\./g,'').replace('−','-'));return Number.isSafeInteger(n)&&Math.abs(n)<=1e9?n:undefined;
}
function visibleText(doc:Document,selector:string):string|undefined{
 const e=doc.querySelector<HTMLElement>(selector);if(!e||e.hidden||!e.getClientRects().length)return;
 return e.textContent?.trim().slice(0,120);
}
export function hudPoints(doc:Document):number|undefined{const text=visibleText(doc,'#hud-pontos');return text===undefined?undefined:parsePoints(text);}
export function readScore(doc:Document,hudBefore?:number):ScoreObservation{
 const hudAfter=hudPoints(doc),feedbackText=visibleText(doc,'#feedback-pontos');const feedbackPoints=feedbackText===undefined?undefined:parsePoints(feedbackText);
 return sanitizeScore({hudBefore,hudAfter,feedbackPoints,feedbackText});
}
export function sanitizeScore(value:unknown):ScoreObservation{
 if(!value||typeof value!=='object')return {};
 const v=value as ScoreObservation;const out:ScoreObservation={};
 for(const key of ['hudBefore','hudAfter','feedbackPoints'] as const)if(Number.isSafeInteger(v[key])&&Math.abs(v[key]!)<=1e9)out[key]=v[key];
 if(out.hudBefore!==undefined&&out.hudAfter!==undefined)out.hudDelta=out.hudAfter-out.hudBefore;
 if(typeof v.feedbackText==='string')out.feedbackText=v.feedbackText.replace(/[\u0000-\u001f]/g,' ').slice(0,120);
 if(out.feedbackText){const parsed=parsePoints(out.feedbackText);if(parsed!==undefined)out.feedbackPoints=parsed;}
 return out;
}
