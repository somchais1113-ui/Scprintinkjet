/* V2.1.17 static package regression checks: approved favicon and services crossfade. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const full=read('index.html');
const css=read('src/styles/32-services-crossfade.css');
const js=read('src/scripts/main.js');
const builder=read('qa/build-public-v2111.mjs');
const pages=['index','article','product-labels','smart-quote','standard-pricing','design-services','delivery','credit-terms','project-quote','order-tracking'];
for(const page of pages){
  const html=read(page+'.html');
  for(const name of ['favicon.ico','favicon-16x16.png','favicon-32x32.png','favicon-180x180.png']){
    assert(html.includes('./'+name+'?v=2.1.17')||html.includes(name+'?v=2.1.17'),`${page}: missing ${name}`);
  }
  assert(!/rel=["']icon["'][^>]*favicon\.svg/i.test(html),`${page}: stale SVG favicon link`);
}
const ico=readFileSync(fileURLToPath(new URL('favicon.ico',root)));
assert(ico.length>50000 && ico.readUInt16LE(0)===0 && ico.readUInt16LE(2)===1,'approved multi-image ICO');
for(const size of [16,32,180,192,512]){
 const path=`favicon-${size}x${size}.png`;
 const buf=readFileSync(fileURLToPath(new URL(path,root)));
 assert.equal(buf.subarray(1,4).toString('ascii'),'PNG',path);
 assert.equal(buf.readUInt32BE(16),size,path+' width');
 assert.equal(buf.readUInt32BE(20),size,path+' height');
}
assert.match(full,/32-services-crossfade\.css\?v=2\.1\.17/);
assert.match(full,/main\.js\?v=2\.1\.17/);
for(const selector of ['.services__viewport--crossfade','.services__grid--outgoing','.services__grid--incoming','.services__viewport--active']){
  assert(css.includes(selector),`missing crossfade selector ${selector}`);
}
for(const snippet of ['advanceServices','warmServicePhoto','resetServicesTransition','cloneNode(true)','requestAnimationFrame','serviceTransitionLocked']){
 assert(js.includes(snippet),`missing ${snippet}`);
}
assert.match(js,/byId\('serviceNext'\)\.addEventListener\('click',\(\)=>\{void advanceServices\(\);\}\)/);
assert.match(css,/670ms/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert(builder.includes('32-services-crossfade')&&builder.includes('favicon.ico'),'public build must ship new CSS and favicon');
console.log('PASS V2.1.17: favicon routes and multi-size assets, whole-card crossfade CSS/JS, public builder.');
