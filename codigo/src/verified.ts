// Calibração prévia observada pela interface, sem dados de conta. Consulte README.md.
export type VerifiedPair={itemId:string;category:string;level:string;force:number;angle:number;points?:number};
const level='Nível Especialista';
export const VERIFIED_PAIRS:VerifiedPair[]=[
 ...[[38,26],[36,26,338],[37,27,342],[38,27,344],[33,30,310],[34,31,312],[32,33,294],[33,33,298],[32,32,298],[32,34,290]].map(([force,angle,points])=>({itemId:'jornal',category:'azul',level,force,angle,points})),
 ...[[38,-26],[36,-25,336],[37,-26,344]].map(([force,angle,points])=>({itemId:'casca-banana',category:'cinza',level,force,angle,points}))
];
