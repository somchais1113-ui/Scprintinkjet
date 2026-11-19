import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';

const url=path=>new URL('../'+path,import.meta.url);
const read=path=>readFileSync(url(path),'utf8');
const html=read('product-labels.html');
const css=read('src/styles/21-product-labels.css');
const script=read('src/scripts/label-evidence.js');
const runFiles=['config/public-config.js','data/label-evidence.js'];
for(const [,path] of html.matchAll(/(?:href|src)="\.\/([^"?]+)(?:\?[^"]*)?"/g))assert(existsSync(url(path)),path);
for(const [,anchor] of html.matchAll(/href="#([a-z-]+)"/g))assert(html.includes(`id="${anchor}"`),anchor);
assert.match(html,/<section class="evidence" id="print-sample"[^>]* hidden>/);
assert.match(html,/<nav class="footer-contact"[^>]* hidden>/);
assert.match(html,/class="sample-badge"[^>]*>ตัวอย่างเท่านั้น/);
assert.match(html,/สีบนจอไม่ใช่สีรับประกันของงานพิมพ์/);
assert.match(css,/\[hidden\]\{display:none!important\}/);
assert.equal([...html.matchAll(/data-trust-copy="step[1-4]"/g)].length,4);
assert.equal([...html.matchAll(/<form\b|<input\b|<button\b|<iframe\b/g)].length,0);
assert(html.indexOf('src/scripts/product-labels.js')<html.indexOf('src/scripts/label-evidence.js'));
for(const path of runFiles)assert(html.indexOf(path)<html.indexOf('src/scripts/label-evidence.js'));

const baseline=Object.create(null);
for(const path of runFiles)vm.runInNewContext(read(path),{window:baseline});
const paths=Object.fromEntries(['sheet','edge','bottle'].map(key=>[key,`./assets/images/labels/print-sample/form-01-${key}.webp`]));
const approved={approvedForPublication:true,photos:paths};

function node(data={}){
  return {dataset:data,hidden:true,textContent:'',href:'',children:[],attributes:{},
    setAttribute(k,v){this.attributes[k]=v;},append(...parts){this.children.push(...parts);},replaceChildren(...parts){this.children=parts;}};
}
const lines=Array.from(html.matchAll(/data-trust-copy="([^" ]+)"[^>]*>([^<]+)</g),m=>[m[1],m[2]]);
assert(lines.length>=30);
async function run({lang='th',sample=baseline.SCWORK_LABEL_EVIDENCE,channels=baseline.SCWORK_PUBLIC_CONTACT,broken=''}={}){
  const nodes=Object.fromEntries(lines.map(([key,val])=>[key,{...node({trustCopy:key}),textContent:val}]));
  const grid=node(),panel={...node(),querySelector:()=>grid},links=['office','mobile','line'].map(k=>({...nodes[k],dataset:{contactChannel:k}}));
  const contact={...node(),querySelectorAll:()=>links};
  const imageRequests=[];
  const document={documentElement:{lang},querySelector:()=>contact,querySelectorAll:()=>Object.values(nodes),getElementById:()=>panel,createElement:()=>node()};
  class Image {
    set src(path){this.path=path;imageRequests.push(path);}
    async decode(){if(this.path===broken)throw Error('file unavailable');}
  }
  vm.runInNewContext(script,{window:{SCWORK_PUBLIC_CONTACT:channels,SCWORK_LABEL_EVIDENCE:sample},document,URL,Image});
  await new Promise(resolve=>setImmediate(resolve));
  return {nodes,grid,panel,links,contact,imageRequests};
}
const th=await run();
assert.equal(th.nodes.step3.textContent,'อนุมัติแบบ');
assert(th.panel.hidden&&th.contact.hidden);
assert.equal(th.imageRequests.length,0);
const en=await run({lang:'en'});
for(const [key,val] of lines)if(key!=='line')assert.notEqual(en.nodes[key].textContent,val,key);
assert.match(en.nodes.proofLimit.textContent,/not a guarantee/);

for(const sample of [null,{...approved,approvedForPublication:false},{...approved,approvedForPublication:'true'},
  {...approved,photos:{...paths,edge:''}},{...approved,photos:{...paths,bottle:paths.sheet}},
  {...approved,photos:{...paths,bottle:'https://evil.example/sample.jpg'}},{...approved,photos:{...paths,edge:'./assets/images/labels/form-01-detail.webp'}}]){
  const r=await run({sample});assert(r.panel.hidden&&r.imageRequests.length===0);
}
const success=await run({lang:'en',sample:approved,channels:{officePhone:'02 111 2222',mobilePhone:'+66 (81) 234-5678',lineId:'@example_qa'}});
assert(!success.panel.hidden&&!success.contact.hidden);
assert.deepEqual(success.imageRequests,Object.values(paths));
assert.equal(success.grid.children.length,3);
assert.equal(success.grid.children[2].children[1].textContent,'Label applied to bottle');
assert.equal(success.grid.children[1].children[0].fetchPriority,'low');
assert.deepEqual(success.links.map(a=>a.href),['tel:021112222','tel:+66812345678','https://line.me/R/ti/p/%40example_qa']);
assert.equal(success.contact.attributes['aria-label'],'SCWork contact channels');
const invalid=await run({sample:approved,broken:paths.edge,channels:{officePhone:'02-111-2222#888',mobilePhone:'javascript:fake()',lineUrl:'https://lin.ee.bad.example/SCWork'}});
assert(invalid.panel.hidden&&invalid.contact.hidden);
assert.equal(invalid.grid.children.length,0);
const direct=await run({channels:{lineUrl:'https://lin.ee/ExampleQA'}});
assert.deepEqual(direct.links.map(a=>a.hidden),[true,true,false]);
assert.equal(direct.links[2].href,'https://lin.ee/ExampleQA');
assert(direct.panel.hidden);
console.log('PASS V1.8.1: bilingual process and proof, hidden by default, complete photo activation, broken/missing/remote evidence omitted, configured contact gates.');
