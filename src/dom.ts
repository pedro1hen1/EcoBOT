import {catalog,type Item} from './planner';
export const HOST='atlasserver-anbefqardqe8b0f5.brazilsouth-01.azurewebsites.net';
export function allowed(url:string):boolean {try {const u=new URL(url); return u.protocol==='https:'&&u.hostname===HOST&&u.pathname.startsWith('/ResiduoGo/public/');}catch{return false;}}
export function inspectCatalog(doc:Document,base:string):{items:Item[];warning:string} {
 const items:Item[]=[];
 for(const a of doc.querySelectorAll<HTMLAnchorElement>('.categoria[data-lixeira] a.cartao[href]')) {
 let u:URL;try{u=new URL(a.getAttribute('href')!,base);}catch{continue;}
 const id=u.searchParams.get('residuo'); const lixeira=a.closest<HTMLElement>('.categoria')?.dataset.lixeira;
 const name=a.querySelector('.cartao__nome,h2,h3,strong')?.textContent??a.textContent?.trim().split('\n')[0];
 if(allowed(u.href)&&u.pathname==='/ResiduoGo/public/index.php/ar'&&id&&id.length<=150&&['azul','cinza'].includes(lixeira??'')&&!items.some(i=>i.id===id)) items.push({id,nome:name?.trim().slice(0,150)||id,lixeira:lixeira!});
 }
 if(!items.length) return {items:catalog,warning:'Catálogo local de referência; DOM do menu não disponível. Não executar.'};
 const diverges=items.length!==catalog.length||items.some(i=>!catalog.some(c=>c.id===i.id&&c.lixeira===i.lixeira&&c.nome===i.nome));
 return {items,warning:diverges?'Divergência no catálogo atual. Revise a seleção.':''};
}
const visible=(doc:Document,s:string)=>{const e=doc.querySelector<HTMLElement>(s);return !!e&&!e.hidden&&e.getClientRects().length>0;};
export function observe(doc:Document):string {
 if(doc.querySelector('input[type=password]')) return 'session';
 if(visible(doc,'#feedback')&&doc.querySelector('#feedback-titulo')?.textContent?.includes('Não foi possível confirmar')) return 'network';
 if(visible(doc,'#feedback')) return 'FEEDBACK';
 if(visible(doc,'#abertura')) return 'OPENING';
 if(visible(doc,'#cena')) return 'READY';
 if(doc.querySelector('.categoria[data-lixeira] a.cartao[href]')) return 'HOME';
 return 'UNKNOWN';
}
