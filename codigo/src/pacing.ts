import {drawInt} from './aim';
export type Pacing={waitMs:number;dragMs:number};
export function paceRange(speed:number):{min:number;max:number}{
 if(!Number.isInteger(speed)||speed<1||speed>5)throw Error('Velocidade deve estar entre 1 e 5');
 return [{min:1600,max:2400},{min:1300,max:2100},{min:800,max:1800},{min:500,max:1200},{min:300,max:850}][speed-1];
}
export function choosePacing(speed:number,random?:()=>number):Pacing{
 const r=paceRange(speed);return {waitMs:drawInt(r.min,r.max,random),dragMs:drawInt(220,420,random)};
}
