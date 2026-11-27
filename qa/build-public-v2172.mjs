/* Build only approved public files; never copy the repository wholesale. */
import {existsSync,readFileSync,writeFileSync,mkdirSync,copyFileSync,lstatSync,readdirSync,mkdtempSync,renameSync,rmSync,realpathSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {permitted,verifyHtml} from './release-contract-v2172.mjs';
const root=realpathSync(dirname(dirname(fileURLToPath(import.meta.url))));
const dest=resolve(process.argv[2]||join(root,'dist-public'));
if(existsSync(dest))throw Error('Choose a new output folder; existing files are never overwritten.');
const manifest=JSON.parse(readFileSync(join(root,'qa/public-manifest-v2172.json'),'utf8')).files;
if(!Array.isArray(manifest)||new Set(manifest).size!==manifest.length||manifest.some(p=>!permitted(p)))throw Error('Unsafe or duplicate public manifest entry.');
const set=new Set(manifest);
for(const p of manifest){
 if(p==='.nojekyll')continue;
 const f=join(root,p);
 if(!existsSync(f)||!lstatSync(f).isFile()||realpathSync(f)!==f)throw Error('Missing or unsafe source file: '+p);
 if(p.endsWith('.html'))verifyHtml(p,readFileSync(f,'utf8'),set);
}
const follow=createRequire(import.meta.url)('../src/scripts/order-followup-core.js');
const statusFiles=[];
for(const entry of readdirSync(join(root,'order-status'),{withFileTypes:true})){
 if(entry.name==='index.html'&&entry.isFile())continue;
 const code=entry.name.slice(0,-5);
 if(!entry.isFile()||!entry.name.endsWith('.json')||!follow.validToken(code))throw Error('Unexpected file in order-status: '+entry.name);
 const raw=readFileSync(join(root,'order-status',entry.name),'utf8');
 if(raw.length>2048)throw Error('Invalid public status size: '+entry.name);
 statusFiles.push([entry.name,follow.status(JSON.parse(raw),code)]);
}
mkdirSync(dirname(dest),{recursive:true});
const staging=mkdtempSync(join(dirname(dest),'.scwork-release-'));
try{
 for(const p of manifest){
  const target=join(staging,p);mkdirSync(dirname(target),{recursive:true});
  if(p==='.nojekyll')writeFileSync(target,'');else copyFileSync(join(root,p),target);
 }
 for(const [name,status] of statusFiles)writeFileSync(join(staging,'order-status',name),JSON.stringify(status)+'\n','utf8');
 if(existsSync(dest))throw Error('Output folder appeared during build; refusing to overwrite.');
 renameSync(staging,dest);
}catch(e){rmSync(staging,{recursive:true,force:true});throw e;}
console.log('SCWork public build: '+manifest.length+' approved files, '+statusFiles.length+' validated status files → '+dest);
