import raw from '../data/residuos.json';
export type Item = {id:string; nome:string; lixeira:string};
export const catalog:Item[] = raw;
export type Config = {mode:'sequencial'|'fixo'; ids:string[]; category:'todos'|'azul'|'cinza'; repeats:number; sequences:number; order:'group'|'rodizio'; speed:number};
export const defaults:Config = {mode:'sequencial', ids:catalog.map(x=>x.id), category:'todos', repeats:3,sequences:2,order:'group',speed:3};
export type Task = {id:string; sequence:number; repeat:number; item:Item};
export function integer(n:number,max=10000):number {
 if(typeof n!=='number'||!Number.isSafeInteger(n)||n<1||n>max) throw Error('Use um inteiro positivo dentro do limite '+max); return n;
}
export function selected(c:Config, items:Item[]=catalog):Item[] {
 if(!['sequencial','fixo'].includes(c.mode)||!['group','rodizio'].includes(c.order)||!['todos','azul','cinza'].includes(c.category)) throw Error('Configuração inválida');
 integer(c.repeats); integer(c.speed,5); if(c.mode==='sequencial') integer(c.sequences);
 if(!Array.isArray(c.ids)||new Set(c.ids).size!==c.ids.length||c.ids.some(id=>!items.some(i=>i.id===id))) throw Error('Seleção inválida');
 const chosen=items.filter(i=>c.ids.includes(i.id)&&(c.category==='todos'||i.lixeira===c.category));
 if(!chosen.length||(c.mode==='fixo'&&chosen.length!==1)) throw Error('Selecione resíduos; modo fixo exige exatamente um');
 return chosen;
}
export function plan(c:Config,items:Item[]=catalog):Task[] {
 const chosen=selected(c,items), sequences=c.mode==='fixo'?1:c.sequences;
 if(chosen.length*c.repeats*sequences>10000) throw Error('Limite de 10.000 partidas por plano');
 const tasks:Task[]=[];
 const add=(s:number,i:Item,r:number)=>tasks.push({id:`${s}:${i.id}:${r}`,sequence:s,repeat:r,item:{...i}});
 for(let s=1;s<=sequences;s++) {
 if(c.order==='group') for(const i of chosen) for(let r=1;r<=c.repeats;r++) add(s,i,r);
 else for(let r=1;r<=c.repeats;r++) for(const i of chosen) add(s,i,r);
 } return tasks;
}
