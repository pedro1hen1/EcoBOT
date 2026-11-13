import {gesture,type Candidate,type ThrowAdapter} from './solver';
export function endpoints(canvas:HTMLCanvasElement,candidate:Candidate) {
 const rect=canvas.getBoundingClientRect();const {dx,dy}=gesture(candidate,rect.height);
 const start={x:rect.left+rect.width*.5,y:rect.top+rect.height*.4};
 const end={x:start.x+dx,y:start.y+dy};
 if(rect.width<=0||end.x<rect.left||end.x>=rect.right||end.y>=rect.bottom) throw Error('Gesto fora do canvas');
 return {start,end};
}
export class PointerThrowAdapter implements ThrowAdapter {
 constructor(private canvas:HTMLCanvasElement){}
 async throwOnce(candidate:Candidate,signal:AbortSignal):Promise<void> {
 const {start,end}=endpoints(this.canvas,candidate);const win=this.canvas.ownerDocument.defaultView!;
 let capturedError=false,down=false,released=false;
 const onError=()=>{capturedError=true;};
 const emit=(type:string,x:number,y:number,buttons:number)=>{
 signal.throwIfAborted();
 this.canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,composed:true,pointerId:987,pointerType:'mouse',isPrimary:true,button:0,buttons,clientX:x,clientY:y}));
 if(capturedError)throw Error('O navegador/jogo rejeitou o gesto sintético. Não repetir.');
 };
 win.addEventListener('error',onError);
 try {
 down=true;emit('pointerdown',start.x,start.y,1);
 for(let step=1;step<=8;step++) {
 await new Promise<void>((resolve,reject)=>{
 let frame=0;
 const abort=()=>{win.cancelAnimationFrame(frame);signal.removeEventListener('abort',abort);reject(signal.reason);};
 signal.addEventListener('abort',abort,{once:true});
 if(signal.aborted){abort();return;}
 frame=win.requestAnimationFrame(()=>{signal.removeEventListener('abort',abort);resolve();});
 });
 emit('pointermove',start.x+(end.x-start.x)*step/8,start.y+(end.y-start.y)*step/8,1);
 }
 emit('pointerup',end.x,end.y,0);released=true;
 } finally {
 win.removeEventListener('error',onError);
 if(down&&!released)this.canvas.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:987,pointerType:'mouse',isPrimary:true,buttons:0}));
 }
 }
}

// Entrada real do usuário: observa o gesto, sem dispatchEvent nem interceptar o jogo.
export class ManualThrowAdapter implements ThrowAdapter {
 measurement?:{force:number;spin:number;trusted:boolean};
 constructor(private canvas:HTMLCanvasElement){}
 async throwOnce(candidate:Candidate,signal:AbortSignal):Promise<void> {
 const {start,end}=endpoints(this.canvas,candidate),doc=this.canvas.ownerDocument;
 const markers=[{...start,label:'1 · Segure aqui'},{...end,label:'2 · Puxe e solte aqui'}].map(point=>{
 const marker=doc.createElement('div');marker.textContent=point.label;
 Object.assign(marker.style,{position:'fixed',left:point.x+'px',top:point.y+'px',transform:'translate(-50%, -50%)',padding:'10px',border:'3px solid #e39d00',borderRadius:'20px',background:'#fff6ce',color:'#173d32',font:'bold 12px system-ui',zIndex:'2147483646',pointerEvents:'none'});
 doc.documentElement.append(marker);return marker;
 });
 return new Promise<void>((resolve,reject)=>{
 let origin:{x:number;y:number;id:number}|undefined;
 const cleanup=()=>{for(const marker of markers)marker.remove();this.canvas.removeEventListener('pointerdown',down,true);this.canvas.removeEventListener('pointerup',up,true);this.canvas.removeEventListener('pointercancel',cancel,true);signal.removeEventListener('abort',abort);};
 const abort=()=>{cleanup();reject(signal.reason??Error('Captura cancelada'));};
 const cancel=(event:PointerEvent)=>{if(origin&&event.pointerId===origin.id){cleanup();reject(Error('Arraste cancelado'));}};
 const down=(event:PointerEvent)=>{
 if(!event.isTrusted||event.button!==0||origin)return;
 origin={x:event.clientX,y:event.clientY,id:event.pointerId};
 };
 const up=(event:PointerEvent)=>{
 if(!event.isTrusted||!origin||event.pointerId!==origin.id)return;
 const dx=event.clientX-origin.x,dy=event.clientY-origin.y,length=Math.hypot(dx,dy),height=this.canvas.getBoundingClientRect().height;
 cleanup();
 if(dy<=0||length<18||height<=0){reject(Error('Arraste inválido'));return;}
 this.measurement={force:Math.min(1,length/(.3*height)),spin:Math.max(-Math.PI/4,Math.min(Math.PI/4,Math.atan2(dx,Math.max(dy,1)))),trusted:true};
 resolve();
 };
 this.canvas.addEventListener('pointerdown',down,true);this.canvas.addEventListener('pointerup',up,true);this.canvas.addEventListener('pointercancel',cancel,true);signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
 });
 }
}
