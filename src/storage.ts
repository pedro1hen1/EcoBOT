import {initial,type Checkpoint} from './machine';
export async function readCheckpoint():Promise<Checkpoint> {
 const data=await chrome.storage.local.get('checkpoint');
 if(data.checkpoint===undefined) return initial();
 const cp=data.checkpoint as Checkpoint;
 if(cp?.version!==1||!Array.isArray(cp.queue)||!Number.isSafeInteger(cp.cursor)||cp.cursor<0||cp.cursor>cp.queue.length||!['IDLE','HOME','OPENING','READY','AIMING','FLYING','FEEDBACK','RETRY','RETURNING','PAUSED','COMPLETED','ERROR'].includes(cp.state)) throw Error('Checkpoint incompatível; não executar');
 return cp;
}
