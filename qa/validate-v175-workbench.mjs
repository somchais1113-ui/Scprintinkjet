/* Workbench integration with a test DOM and fake browser downloads. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('tools/pricing-workbench.html'),window={};
vm.runInNewContext(read('data/pricing-demo-data.js'),{window});
for(const [globalName,file] of Object.entries({
 SCWORK_RATE_CARD_BUILDER:'rate-card-builder',SCWORK_PRICING_ENGINE:'pricing-engine',SCWORK_PRICING_MASTER:'pricing-master'
}))window[globalName]=require('../src/scripts/'+file+'.js');
const els={},byAttribute={};
const files=[],data=new Map();
let blob;
class Element {
 constructor(attrs={}){this.dataset={};this.children=[];this.value='';this.events={};this.classList={toggle(){}};this.attrs=attrs;}
 addEventListener(event,fn){this.events[event]=fn;}
 emit(event){return this.events[event]?.({target:this});}
 click(){if(this.download)files.push({name:this.download,blob});else if(!this.disabled)return this.emit('click');}
 append(...items){this.children.push(...items);}
 replaceChildren(){this.children=[];}
 remove(){}
 setAttribute(){}
 setCustomValidity(){}
}
for(const tag of html.matchAll(/<\w+\s+([^>]+)>/g)){
 const attrs=Object.fromEntries([...tag[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(([,key,value])=>[key,value]));
 const el=new Element(attrs);if(attrs.id)els[attrs.id]=el;
 for(const attr of ['data-shared','data-cost'])if(attrs[attr]){
   el.dataset[attr.slice(5)]=attrs[attr];
   (byAttribute['['+attr+']']??=[]).push(el);
 }
}
const document={getElementById:key=>els[key],querySelectorAll:selector=>byAttribute[selector]||[],createElement:()=>new Element(),body:new Element()};
const localStorage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
const ctx={window,document,location:{hostname:'localhost',protocol:'http:'},localStorage,Intl,structuredClone,Blob,
 URL:{createObjectURL:data=>{blob=data;return 'blob:fake';},revokeObjectURL(){}},setTimeout(){},confirm:()=>true};
vm.runInNewContext(read('tools/pricing-workbench.js'),ctx);
const id=k=>els[k], input=(key,value,scope='cost')=>{
 const el=byAttribute['[data-'+scope+']'].find(e=>e.dataset[scope]===key);el.value=String(value);el.emit('input');
};
assert.equal(id('downloadPublic').disabled,true);
input('materialCost',10);
input('printCost',12);
input('kwhPerUnit',1);
input('electricity',4,'shared');
id('includeMaterial').checked=true;id('includeMaterial').emit('change');
assert.equal(id('impactRows').children.length,3);
id('approval').checked=true;id('approval').emit('change');
assert.equal(id('downloadPublic').disabled,false);
input('electricity',5,'shared');
assert.equal(id('approval').checked,false);
assert.equal(id('downloadPublic').disabled,true);
id('approval').checked=true;id('approval').emit('change');id('downloadPublic').click();
assert.equal(files[0].name,'pricing-public-data.js');
const exportContext={window:{}};vm.runInNewContext(await files[0].blob.text(),exportContext);
assert.equal(exportContext.window.SCWORK_PRICING_PUBLIC.categories[0].materials[0].id,'pp-white');
assert.equal(id('historyList').children.length,1);
id('exportPrivate').click();
const saved=JSON.parse(await files[1].blob.text());
assert.equal(saved.history[0].snapshot.globalRates.electricity,5);
id('historyList').children[0].children[1].click();
assert.equal(id('priceVersion').value,'');
id('importPrivate').files=[files[1].blob];
await id('importPrivate').emit('change');
assert.equal(id('priceVersion').value,'SCW-001');
console.log('PASS V1.7.5 Workbench DOM: shared input, selective preview, approval invalidation, public export, private backup, restore and reimport.');
