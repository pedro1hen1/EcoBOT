import {catalog,type Item} from './planner';
import type {Candidate,GestureMeasurement} from './solver';
export type Outcome='success'|'retry'|'ended-failure'|'network'|'session'|'timeout'|'cancelled'|'gesture-error';
export type Attempt={id:string;tabId:number;documentId:string;itemId:string;force:number;spin:number;startedAt:number;finishedAt?:number;outcome?:Outcome;reviewedAt?:number;measurement?:GestureMeasurement;inputClaimedAt?:number};
export type AssistedStore={version:1;active:Record<string,Attempt>;history:Attempt[]};
export const emptyAssisted=():AssistedStore=>({version:1,active:{},history:[]});
const outcomes:Outcome[]=['success','retry','ended-failure','network','session','timeout','cancelled','gesture-error'];
export function reserve(store:AssistedStore,context:{tabId:number;documentId:string},itemId:string,candidate:Candidate,id:string,now:number,items:Item[]=catalog):AssistedStore {
 if(store.active[String(context.tabId)]) throw Error('Confira e encerre o teste anterior antes de outro lançamento');
 if(!items.some(i=>i.id===itemId)) throw Error('Resíduo não reconhecido; inspecione e revise o catálogo');
 if(!Number.isFinite(candidate.force)||candidate.force<0||candidate.force>1||!Number.isFinite(candidate.spin)||Math.abs(candidate.spin)>Math.PI/4) throw Error('Força ou giro inválido');
 const attempt:Attempt={id,...context,itemId,force:candidate.force,spin:candidate.spin,startedAt:now};
 return {...store,active:{...store.active,[String(context.tabId)]:attempt}};
}
export function finish(store:AssistedStore,context:{tabId:number;documentId:string},id:string,outcome:Outcome,now:number,measurement?:GestureMeasurement):AssistedStore {
 const attempt=store.active[String(context.tabId)];
 if(!attempt||attempt.id!==id||attempt.documentId!==context.documentId) throw Error('Teste pertence a outro documento');
 if(!outcomes.includes(outcome)) throw Error('Resultado inválido');
 if(attempt.finishedAt!==undefined) return store;
 if(measurement&&(!Number.isFinite(measurement.force)||measurement.force<0||measurement.force>1||!Number.isFinite(measurement.spin)||Math.abs(measurement.spin)>Math.PI/4||typeof measurement.trusted!=='boolean'))throw Error('Medição inválida');
 return {...store,active:{...store.active,[String(context.tabId)]:{...attempt,outcome,finishedAt:now,...(measurement?{measurement:{force:measurement.force,spin:measurement.spin,trusted:measurement.trusted}}:{})}}};
}
export function review(store:AssistedStore,tabId:number,id:string,now:number):AssistedStore {
 const attempt=store.active[String(tabId)];if(!attempt||attempt.id!==id) throw Error('Teste não encontrado');
 const active={...store.active};delete active[String(tabId)];
 return {...store,active,history:[...store.history,{...attempt,reviewedAt:now}].slice(-1000)};
}
