import type {Candidate,ThrowAdapter} from './solver';
import {BUILD_VERSION} from './version';
export class DebuggerThrowAdapter implements ThrowAdapter{
 failure?:string;
 constructor(private id:()=>string,private command='assisted-input'){}
 async throwOnce(_candidate:Candidate,signal:AbortSignal):Promise<void>{
 signal.throwIfAborted();
 const cancel=()=>{void chrome.runtime.sendMessage({type:'assisted-input-cancel',id:this.id(),buildVersion:BUILD_VERSION}).catch(()=>{});};
 signal.addEventListener('abort',cancel,{once:true});
 try{
 const reply=await chrome.runtime.sendMessage({type:this.command,id:this.id(),buildVersion:BUILD_VERSION});
 if(!reply?.ok)throw Error(reply?.error??'Entrada indisponível');signal.throwIfAborted();
 }catch(error){this.failure=error instanceof Error?error.message:'Entrada indisponível';throw error;}
 finally{signal.removeEventListener('abort',cancel);}
 }
}
