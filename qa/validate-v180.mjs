import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const require=createRequire(import.meta.url);
const html=read('product-labels.html'),css=read('src/styles/21-product-labels.css');
const engine=require('../src/scripts/pricing-engine.js');
const script=read('src/scripts/product-labels.js');
for(const [,path] of html.matchAll(/(?:href|src)="(\.\/[^"?]+)(?:\?[^"]*)?"/g))assert(existsSync(new URL('../'+path.slice(2),import.meta.url)),path);
for(const [,path,width] of html.matchAll(/(\.\/assets\/images\/labels\/[^\s,]+) (\d+)w/g)){
 const img=new URL('../'+path.slice(2),import.meta.url);assert(statSync(img).size<120000);
 assert(Number(width)>=640);
}
assert.match(html,/fetchpriority="high"/);
assert.match(html,/loading="lazy"/);
assert.match(html,/ภาพจำลอง/);
assert.match(css,/#ff6900/);
assert.match(css,/object-fit:contain/);
assert.match(read('qa/build-public-v180.mjs'),/product-labels\.html/);
assert.match(read('qa/build-public-v180.mjs'),/21-product-labels/);
function run(query,card){
 const attr=new Map();
 const el=(dataset={})=>({dataset,textContent:'',href:null,alt:'',getAttribute:key=>attr.get(key),setAttribute:(key,val)=>attr.set(key,val),removeAttribute:key=>attr.delete(key),replaceChildren(...nodes){this.textContent=nodes.filter(n=>typeof n==='string').join('|');}});
 const copy=Array.from(html.matchAll(/data-copy="([^"]+)"/g),m=>el({copy:m[1]}));
 const routes=['home','quote','help','project','tracking'].map(route=>el({route}));
 const alt=['heroAlt','detailAlt'].map(alt=>el({alt}));
 const links=['th','en'].map(hreflang=>{const a=el();a.attrs={hreflang};a.getAttribute=k=>a.attrs[k];a.setAttribute=(k,v)=>a.attrs[k]=v;a.removeAttribute=k=>delete a.attrs[k];return a;});
 const doc={documentElement:{},querySelector:()=>el(),createElement:()=>({}),querySelectorAll:s=>({'[data-copy]':copy,'[data-route]':routes,'[data-alt]':alt,'.locale [hreflang]':links}[s]||[])};
 vm.runInNewContext(script,{window:{SCWORK_PRICING_PUBLIC:card,SCWORK_PRICING_ENGINE:engine,SCWORK_LABEL_QUOTE_PLAN:require('../src/scripts/label-quote-plan.js')},location:{search:query},document:doc,URLSearchParams});
 return {doc,copy:key=>copy.filter(x=>x.dataset.copy===key).map(x=>x.textContent),routes,alt,links};
}
const material={id:'pp-white',mode:'a3_sheet',tiers:[{min:1,max:null,price:20}],minSheets:1};
const card={status:'approved',demonstrationOnly:false,vatRate:0,version:'QA-180',approvedAt:'2026-11-19T04:00:00Z',a3PlusSheet:{usableWidthCm:28,usableHeightCm:40,gapCm:.15},categories:[{id:'sticker',materials:[material]}]};
const th=run('',null);
assert.equal(th.doc.documentElement.lang,'th');
assert.deepEqual(th.copy('quote'),['ส่งสเปกเพื่อขอราคา','ส่งสเปกเพื่อขอราคา']);
assert.equal(th.routes[1].href,'./smart-quote.html?category=label&lang=th');
const en=run('?lang=en',card);
assert.equal(en.doc.documentElement.lang,'en');
assert.deepEqual(en.copy('quote'),['Check estimated price','Check estimated price']);
assert.equal(en.routes[2].href,'./smart-quote.html?category=label&mode=help&lang=en');
assert.equal(en.routes[3].href,'./project-quote.html?lang=en');
assert.equal(en.routes[4].href,'./order-tracking.html?lang=en');
assert.equal(en.links[1].attrs['aria-current'],'page');
assert.equal(en.links[0].attrs['aria-current'],undefined);
assert.match(en.alt[1].alt,/peeled/);
for(const bad of [{...card,demonstrationOnly:true},{...card,vatRate:9},{...card,a3PlusSheet:{...card.a3PlusSheet,usableWidthCm:1}},{...card,categories:[{id:'sticker',materials:[]}]}]){
 assert.deepEqual(run('?lang=en',bad).copy('quote'),['Share specs for a quote','Share specs for a quote']);
}
console.log('PASS V1.8.0: Thai/English, local render files, existing quote/advice links, approved-rate CTA and safe fallback.');
