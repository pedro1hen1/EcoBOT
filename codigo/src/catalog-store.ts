import type {Item} from './planner';
export type CatalogReview={version:1;items:Item[];warning:string;inspectedAt:number;reviewedAt?:number};
export function validateItems(value:unknown):Item[]{
 if(!Array.isArray(value)||!value.length||value.length>500)throw Error('Catálogo vazio ou excede 500 itens');
 const ids=new Set<string>();
 return value.map(item=>{
 if(!item||typeof item.id!=='string'||!item.id.trim()||item.id.length>150||ids.has(item.id)||typeof item.nome!=='string'||!item.nome.trim()||item.nome.length>150||!['azul','cinza'].includes(item.lixeira))throw Error('Catálogo inválido ou duplicado');
 ids.add(item.id);return {id:item.id,nome:item.nome,lixeira:item.lixeira};
 });
}
export function reviewCatalog(snapshot:CatalogReview|undefined,inspectedAt:number,now:number):CatalogReview{
 if(!snapshot||snapshot.inspectedAt!==inspectedAt||snapshot.warning.includes('Não executar'))throw Error('Inspecione o menu atual antes de revisar');
 return {...snapshot,items:validateItems(snapshot.items),reviewedAt:now};
}
