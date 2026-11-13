import {build} from 'esbuild';
import {mkdir,copyFile,cp} from 'node:fs/promises';
const out='../extensao';
await mkdir(out,{recursive:true});
await build({entryPoints:['src/worker.ts','src/content.ts','src/popup.ts'],outdir:out,bundle:true,format:'iife',target:'chrome120'});
for(const file of ['manifest.json','popup.html','popup.css'])await copyFile(file,`${out}/${file}`);
await cp('icons',`${out}/icons`,{recursive:true});
