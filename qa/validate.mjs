import {readFileSync,existsSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(join(root,path),'utf8');
const missing=[];let checked=0;
const html=read('index.html');
for(const key of ['home','services','team','about','pricing','blog','contact']) if(!html.includes(`id="${key}"`)) missing.push(`missing section #${key}`);
for(const path of ['src/scripts/config.js','src/scripts/content.js','src/scripts/ui.js','src/scripts/main.js','tools/image-manager.html','tools/image-manager.js','assets/images/manifest.json','assets/images/manifest.js','assets/images/asset-contact-sheet.jpg','assets/images/source/ai-hero-master.png'])if(!existsSync(join(root,path)))missing.push(`missing file ${path}`); else checked++;
const sourcePaths = [...html.matchAll(/(?:src|href)="(\.\/(?:src|assets)\/[^"#?]+)"/g)].map(m=>m[1]);
for(const path of sourcePaths){checked++;if(!existsSync(join(root,path)))missing.push(`missing HTML reference ${path}`);}
const content=read('src/scripts/content.js');const css=read('src/styles/04-sections.css')+read('src/styles/05-responsive.css');
for(const match of content.matchAll(/['"](\.\/assets\/images\/[^'"\s]+)['"]/g)){
  const path=match[1];checked++;if(!existsSync(join(root,path)))missing.push(`missing content photo ${path}`);
}
for(const match of css.matchAll(/url\(['"]?(\.\.\/\.\.\/assets\/images\/[^)'"\s]+)['"]?\)/g)){
  const path=join('src/styles',match[1]);checked++;if(!existsSync(join(root,path)))missing.push(`missing CSS photo ${path}`);
}
const remotePhotoPattern=/(?:https?:)?\/\/(?:images\.unsplash\.com|images\.squarespace-cdn\.com|www\.figma\.com\/api\/mcp\/asset)/;
for(const [file,source] of [['index.html',html],['content.js',content],['hero CSS',css]]) if(remotePhotoPattern.test(source)) missing.push(`external preview image in ${file}`);
const manifest=JSON.parse(read('assets/images/manifest.json'));
if(manifest.images.length!==18)missing.push(`expected 18 image slots, found ${manifest.images.length}`);
const seen=new Set();
for(const item of manifest.images){
  const path=item.path;
  if(seen.has(path))missing.push(`duplicated image slot ${path}`);
  seen.add(path);
  if(!existsSync(join(root,path))){missing.push(`missing manifest image ${path}`);continue;}
  const size=statSync(join(root,path)).size;
  if(size<2000)missing.push(`too small image ${path}: ${size} bytes`);
  const buffer=readFileSync(join(root,path));
  if(buffer.toString('ascii',0,4)!=='RIFF' || buffer.toString('ascii',8,12)!=='WEBP')missing.push(`not valid WEBP ${path}`);
  if(!Number.isInteger(item.width)||!Number.isInteger(item.height))missing.push(`invalid image dimensions ${path}`);
  checked++;
}
const mirror=read('assets/images/manifest.js');
if(!mirror.includes('PC_IMAGE_MANIFEST')||!mirror.includes('hero/hero-mobile.webp')) missing.push('manifest.js not synced');
for(const image of manifest.images) if(!mirror.includes(image.path))missing.push(`missing manager image slot ${image.path}`);
for(const path of ['src/scripts/config.js','src/scripts/content.js','src/scripts/ui.js','src/scripts/main.js','tools/image-manager.js'])if(!read(path).trim())missing.push(`empty ${path}`);
console.log(`Checked ${checked} paths/slots; ${manifest.images.length} local WEBP slots.`);
if(missing.length){console.error('FAIL:\n' + missing.map(x=>'- '+x).join('\n'));process.exitCode=1}else console.log('PASS: All image slots, local photo references, static files and source sections present.');
