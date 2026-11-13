export type Geometry={origin:{x:number;y:number;z:number}; target:{x:number;y:number;z:number}; mouthRadius:number; yaw:number};
export type Candidate={force:number;spin:number;margin:number};
export type GestureMeasurement={force:number;spin:number;trusted:boolean};
export interface ThrowAdapter {measurement?:GestureMeasurement;failure?:string;throwOnce(candidate:Candidate,signal:AbortSignal):Promise<void>}
// PROTÓTIPO: aproximação balística; não inclui colisões laterais, câmera móvel ou rede.
export function solve(g:Geometry):Candidate {
 if(![g.origin.x,g.origin.y,g.origin.z,g.target.x,g.target.y,g.target.z,g.mouthRadius,g.yaw].every(Number.isFinite)||g.mouthRadius<=0) throw Error('Geometria inválida');
 let best:Candidate={force:0,spin:0,margin:-Infinity};
 for(let f=0;f<=100;f++) for(let a=-45;a<=45;a++) {
 const force=f/100,spin=a*Math.PI/180,v=2.5+4*force,angle=42*Math.PI/180;
 const vx=-Math.sin(g.yaw+spin)*Math.cos(angle)*v,vz=-Math.cos(g.yaw+spin)*Math.cos(angle)*v;
 let vy=Math.sin(angle)*v,x=g.origin.x,y=g.origin.y,z=g.origin.z;
 for(let t=0;t<360;t++) {
 const before={x,y,z};vy-=9.81/60;x+=vx/60;y+=vy/60;z+=vz/60;
 if(vy<0&&before.y>g.target.y&&y<=g.target.y) {
 const k=(before.y-g.target.y)/(before.y-y);
 const margin=g.mouthRadius-Math.hypot(before.x+(x-before.x)*k-g.target.x,before.z+(z-before.z)*k-g.target.z);
 if(margin>best.margin) best={force,spin,margin}; break;
 } if(y<0) break;
 }
 } return best;
}
export function gesture(c:Candidate,height:number) {
 if(!Number.isFinite(height)||height<=0||!Number.isFinite(c.force)||c.force<0||c.force>1||!Number.isFinite(c.spin)||Math.abs(c.spin)>Math.PI/4) throw Error('Gesto inválido');
 const length=c.force*.3*height;if(length<18) throw Error('Gesto abaixo do mínimo');
 return {dx:Math.sin(c.spin)*length,dy:Math.cos(c.spin)*length};
}
