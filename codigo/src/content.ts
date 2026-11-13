import {allowed,inspectCatalog,observe} from './dom';
import {showAssistedPanel,cancelAssisted} from './assisted-panel';
import {requireReady} from './assisted';
import {endpoints} from './pointer';
import {driveSeries,cancelSeries} from './series-content';
import {BUILD_VERSION} from './version';
if(allowed(location.href)) chrome.runtime.onMessage.addListener((message,sender,respond)=>{
 const reply=(payload:Record<string,unknown>)=>respond({...payload,buildVersion:BUILD_VERSION});
 if(sender.id!==chrome.runtime.id)return false;
 if(message?.type==='series-wake'){void driveSeries();reply({ok:true});}
 else if(message?.type==='probe-document'){reply({ok:true});}
 else if(message?.type==='probe-gesture'){
 try{requireReady(document);const canvas=document.querySelector<HTMLCanvasElement>('canvas#cena');if(!canvas)throw Error('Canvas ausente');reply({ok:true,...endpoints(canvas,message.candidate),width:innerWidth,height:innerHeight});}catch{reply({ok:false});}
 }else if(message?.type==='inspect') reply({catalog:inspectCatalog(document,location.href),screen:observe(document)});
 else if(message?.type==='prepare-assisted') {
 if(location.pathname!=='/ResiduoGo/public/index.php/ar'){reply({ok:false,error:'Abra uma partida antes de preparar o lançamento assistido.'});return false;}
 void showAssistedPanel();reply({ok:true});return false;
 } else if(message?.type==='cancel-assisted'){cancelAssisted();cancelSeries();reply({ok:true});}
 return false;
});
if(allowed(location.href))void driveSeries();
