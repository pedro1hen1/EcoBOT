import type {Candidate} from './solver';
import type {Round} from './round';
import {sanitizeScore} from './score';
import type {VerifiedPair} from './verified';
export type AimRange={forceMin:number;forceMax:number;angleMin:number;angleMax:number};
export type AimProfile={force:number;spin:number;range?:AimRange};
export function validateProfile(p:AimProfile):void{
 if(!p||!Number.isFinite(p.force)||p.force<.1||p.force>1||!Number.isFinite(p.spin)||Math.abs(p.spin)>Math.PI/4)throw Error('Força fixa deve estar entre 10 e 100%; giro entre −45° e 45°');
 if(p.range){const r=p.range;if(![r.forceMin,r.forceMax,r.angleMin,r.angleMax].every(Number.isSafeInteger)||r.forceMin<10||r.forceMax>100||r.forceMin>r.forceMax||r.angleMin< -45||r.angleMax>45||r.angleMin>r.angleMax)throw Error('Faixas devem ter limites inteiros ordenados: força 10–100% e ângulo −45–45°');}
}
export function drawInt(min:number,max:number,random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296):number{
 const n=random();if(!Number.isFinite(n)||n<0||n>=1)throw Error('Fonte de sorteio inválida');return min+Math.floor(n*(max-min+1));
}
export function chooseAim(p:AimProfile,random?:()=>number):Candidate{
 validateProfile(p);if(!p.range)return {force:p.force,spin:p.spin,margin:0};
 return {force:drawInt(p.range.forceMin,p.range.forceMax,random)/100,spin:drawInt(p.range.angleMin,p.range.angleMax,random)*Math.PI/180,margin:0};
}
export type AimPair={force:number;spin:number};
const samePair=(a:AimPair,b:AimPair)=>Math.abs(a.force-b.force)<1e-8&&Math.abs(a.spin-b.spin)<1e-8;
export function chooseDifferent(p:AimProfile,previous?:AimPair,random?:()=>number):Candidate{
 requireVariation(p);
 return pickPair(rangePairs(p.range!),previous,random);
}
export function requireVariation(p:AimProfile):void{
 validateProfile(p);if(!p.range||(p.range.forceMin===p.range.forceMax&&p.range.angleMin===p.range.angleMax))throw Error('Configure ao menos duas combinações; execução fixa antiga exige nova configuração');
}
export function rangePairs(r:AimRange):AimPair[]{
 const pairs:AimPair[]=[];
 for(let f=r.forceMin;f<=r.forceMax;f++)for(let a=r.angleMin;a<=r.angleMax;a++)pairs.push({force:f/100,spin:a*Math.PI/180});
 return pairs;
}
export function unmeasuredPairs(rounds:Round[],itemId:string,category:string,level:string,range:AimRange,verified:VerifiedPair[]=[]):AimPair[]{
 const known=combinedEvidence(rounds,verified).filter(r=>r.itemId===itemId&&r.category===category&&r.level===level);
 return rangePairs(range).filter(p=>!known.some(r=>samePair(p,{force:r.force/100,spin:r.angle*Math.PI/180})));
}
export function pickPair(pairs:AimPair[],previous?:AimPair,random?:()=>number):Candidate{
 const unique=pairs.filter((p,i)=>pairs.findIndex(x=>samePair(p,x))===i);
 if(unique.length<2)throw Error('São necessárias ao menos duas combinações para variar a cada lance');
 const options=unique.filter(p=>!previous||!samePair(p,previous));
 return {...options[drawInt(0,options.length-1,random)],margin:0};
}
export function observedPairs(rounds:Round[],itemId:string,category:string,level:string,range?:AimRange,verified:VerifiedPair[]=[]):AimPair[]{
 return combinedEvidence(rounds,verified).filter(r=>r.itemId===itemId&&r.category===category&&r.level===level&&(r.successes+(r.priorSuccesses??0))>0&&r.misses===0&&(!range||(r.force>=range.forceMin&&r.force<=range.forceMax&&r.angle>=range.angleMin&&r.angle<=range.angleMax))).map(r=>({force:r.force/100,spin:r.angle*Math.PI/180}));
}
export type AimEvidence={itemId:string;category:string;level:string;force:number;angle:number;successes:number;misses:number;priorSuccesses?:number;hudDeltas:number[];feedbackScores:number[]};
export function combinedEvidence(rounds:Round[],verified:VerifiedPair[]):AimEvidence[]{
 const rows=aimEvidence(rounds);
 for(const v of verified){let row=rows.find(r=>r.itemId===v.itemId&&r.category===v.category&&r.level===v.level&&r.force===v.force&&r.angle===v.angle);
 if(!row){row={...v,successes:0,misses:0,hudDeltas:[],feedbackScores:[]};rows.push(row);}
 row.priorSuccesses=(row.priorSuccesses??0)+1;
 if(v.points!==undefined)row.feedbackScores.push(v.points);
 }return rows;
}
export function aimEvidence(rounds:Round[]):AimEvidence[]{
 const groups=new Map<string,AimEvidence>();
 for(const round of rounds)for(const a of round.attempts){
 if(!['success','retry','ended-failure'].includes(a.outcome??'')||a.force===undefined||a.spin===undefined)continue;
 const force=Math.round(a.force*10000)/100,angle=Math.round(a.spin*180/Math.PI*100)/100;
 const key=JSON.stringify([round.task.item.id,round.task.item.lixeira,round.level??'não registrado',force,angle]);
 const row=groups.get(key)??{itemId:round.task.item.id,category:round.task.item.lixeira,level:round.level??'não registrado',force,angle,successes:0,misses:0,hudDeltas:[],feedbackScores:[]};
 const score=sanitizeScore(a.score);
 if(score.hudDelta!==undefined)row.hudDeltas.push(score.hudDelta);
 if(score.feedbackPoints!==undefined)row.feedbackScores.push(score.feedbackPoints);
 if(a.outcome==='success')row.successes++;else row.misses++;groups.set(key,row);
 }
 return [...groups.values()];
}
