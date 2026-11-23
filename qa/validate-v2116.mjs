import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const css=read('src/styles/27-material-gallery.css');
const js=read('src/scripts/material-gallery.js');
const materials=['paper-white','kraft-paper','pp-white','pp-clear','pvc-white'];
assert.match(html,/id="scMaterialsImageStage"/);
assert.match(html,/id="scMaterialsIncomingImage"/);
assert.match(html,/material-gallery\.js\?v=2\.1\.16/);
assert.match(html,/27-material-gallery\.css\?v=2\.1\.16/);
assert.match(css,/\.sc-material__stage\.is-crossfading \.sc-material__image-layer\.is-incoming/);
assert.match(js,/await preload\(slideKey\(nextSlide\)\)/);
assert.match(js,/prefers-reduced-motion/);
for(const name of materials){
 for(const type of ['printed','product']){
  const filename=`assets/images/material-preview/v216/${name}-${type}.webp`;
  assert(fs.existsSync(path.join(root,filename)),filename);
  const bytes=fs.readFileSync(path.join(root,filename));
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert(fs.existsSync(path.join(root,`assets/images/source/material-preview-v216/${name}-${type}.png`)));
 }
 assert(fs.existsSync(path.join(root,`assets/images/materials/${name}.webp`)));
}
class El {
 constructor(id=''){this.id=id;this.events=new Map();this.children=[];this.attrs=new Map();this.style={setProperty(){},removeProperty(){}};this.classes=new Set();this.classList={add:(x)=>this.classes.add(x),remove:(x)=>this.classes.delete(x),toggle:(x,b)=>{if(b)this.classes.add(x);else this.classes.delete(x)},contains:(x)=>this.classes.has(x)};this.open=false;this.textContent='';this._src='';this.alt='';this.naturalWidth=1200;}
 addEventListener(name,cb){this.events.set(name,cb)}
 dispatch(name,event={}){return this.events.get(name)?.(event)}
 setAttribute(key,val){this.attrs.set(key,String(val))}
 removeAttribute(key){this.attrs.delete(key)}
 querySelectorAll(selector){return selector==='button'?this.children:[]}
 append(x){this.children.push(x)}
 replaceChildren(...nodes){this.children=[...nodes]}
 focus(){}
 showModal(){this.open=true}
 close(){this.open=false;this.dispatch('close')}
 get src(){return this._src}
 set src(x){this._src=x}
 get offsetWidth(){return 100}
}
const ids=['materials','scMaterialsPreview','scMaterialsClose','scMaterialsPrev','scMaterialsNext','scMaterialsDots','scMaterialsPreviewImage','scMaterialsIncomingImage','scMaterialsImageStage','scMaterialsPreviewTitle','scMaterialsPreviewDetail','scMaterialsSlideLabel','scMaterialsSlideCounter','scMaterialsSlideNote','scMaterialsBenefitsTitle','scMaterialsBenefits','scMaterialsExampleTitle','scMaterialsExampleText','scMaterialsSlideInfoTitle','scMaterialsEyebrow','materials-title','scMaterialsLead','scMaterialsNote'];
const nodes=new Map(ids.map(id=>[id,new El(id)]));
const content=new El('content');
nodes.get('scMaterialsPreview').querySelector=()=>content;
nodes.get('scMaterialsPreviewImage').closest=()=>new El('viewer');
const cards=materials.map(id=>{
 const title=new El('title'),detail=new El('detail'),link=new El('link'),image=new El('cardimage');
 link.querySelector=()=>image;
 const card={dataset:{material:id},querySelector:(q)=>({'.sc-material__name':title,'.sc-material__detail':detail,'.sc-material__zoom':link,'img':image})[q]};
 return {id,card,link};
});
nodes.get('materials').querySelectorAll=()=>cards.map(x=>x.card);
const doc={getElementById:id=>nodes.get(id),documentElement:{lang:'th'},hidden:false,createElement:()=>new El(),addEventListener(){}};
const mq={matches:true,addEventListener(){}};
const window={matchMedia:()=>mq,addEventListener(){},setTimeout(){return 1},clearTimeout(){},requestAnimationFrame:fn=>fn()};
class Img extends El {set src(x){this._src=x;this.complete=true;this.naturalWidth=1200;this.onload?.()}get src(){return this._src}}
vm.runInNewContext(js,{document:doc,window,Image:Img,Date,console});
const wait=()=>new Promise(resolve=>setTimeout(resolve,3));
for(const card of cards){
 card.link.dispatch('click',{preventDefault(){},metaKey:false,ctrlKey:false,shiftKey:false,altKey:false});
 assert.equal(nodes.get('scMaterialsPreview').open,true);
 assert.equal(nodes.get('scMaterialsSlideCounter').textContent,'1 / 3');
 nodes.get('scMaterialsNext').dispatch('click');await wait();
 assert.equal(nodes.get('scMaterialsSlideCounter').textContent,'2 / 3');
 const names=['paper-white','kraft-paper','pp-white','pp-clear','pvc-white'];
 const stageTwo=nodes.get('scMaterialsIncomingImage').src||nodes.get('scMaterialsPreviewImage').src;
 assert(stageTwo.includes(`${card.id}-printed.webp`),card.id+' did not load correct process image '+stageTwo);
 nodes.get('scMaterialsNext').dispatch('click');await wait();
 assert.equal(nodes.get('scMaterialsSlideCounter').textContent,'3 / 3');
 const stageThree=nodes.get('scMaterialsIncomingImage').src||nodes.get('scMaterialsPreviewImage').src;
 assert([nodes.get('scMaterialsIncomingImage').src,nodes.get('scMaterialsPreviewImage').src].some(x=>x.includes(`${card.id}-product.webp`)),card.id+' did not load product image '+stageThree);
 nodes.get('scMaterialsClose').dispatch('click');
 // In a real browser the close button calls native HTMLDialogElement.close().
 nodes.get('scMaterialsPreview').close();
}
// Non-reduced-motion path: assert that incoming and outgoing layers overlap during the fade.
mq.matches=false;
window.setTimeout=(fn,ms)=>ms<1000?setTimeout(fn,ms):1;
window.clearTimeout=id=>clearTimeout(id);
const kraft=cards.find(x=>x.id==='kraft-paper');
kraft.link.dispatch('click',{preventDefault(){}});
nodes.get('scMaterialsNext').dispatch('click');
await new Promise(resolve=>setTimeout(resolve,50));
assert(nodes.get('scMaterialsImageStage').classes.has('is-crossfading'),'two-layer fade did not begin');
await new Promise(resolve=>setTimeout(resolve,850));
assert.equal(nodes.get('scMaterialsSlideCounter').textContent,'2 / 3','fade did not settle on image 2');
assert(!nodes.get('scMaterialsImageStage').classes.has('is-crossfading'),'fade did not finish');
nodes.get('scMaterialsPreview').close();
console.log('PASS V2.1.16 — 15 image slots, 5x3 routes, TH content, preloading and non-reduced 750ms crossfade');
