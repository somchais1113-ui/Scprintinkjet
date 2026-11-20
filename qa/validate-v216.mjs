import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
const url=file=>new URL('../'+file,import.meta.url);
const read=file=>readFileSync(url(file),'utf8');
const ids=['paper-white','kraft-paper','pp-white','pp-clear','pvc-white'];
const titles=['Paper stickers','Kraft paper stickers','White PP stickers','Clear PP stickers','PVC vinyl stickers'];
const html=read('index.html'),css=read('src/styles/27-material-gallery.css'),main=read('src/scripts/main.js');
assert.match(html,/<section class="section sc-material" id="materials" aria-labelledby="materials-title"/);
assert.match(html,/27-material-gallery\.css\?v=2\.1\.6/);
assert.match(html,/material-gallery\.js\?v=2\.1\.6/);
assert.match(html,/26-support-bar\.css\?v=2\.1\.5/);
assert.doesNotMatch(html+main,/testimonialPrev|testimonialNext|testimonialCard|renderTestimonial/);
assert.deepEqual([...html.matchAll(/data-material="([^"]+)"/g)].map(m=>m[1]),ids);
for(const id of ids){
  const file='assets/images/materials/'+id+'.webp';
  assert(['href="./'+file+'"','href="./'+file+'?v=2.1.7"'].some(value=>html.includes(value)));
  assert(['src="./'+file+'" width="800" height="800"','src="./'+file+'?v=2.1.7" width="800" height="800"'].some(value=>html.includes(value)));
  assert.equal(readFileSync(url(file)).subarray(8,12).toString(),'WEBP');
  assert(existsSync(url('assets/images/source/materials/'+id+'.png')));
}
for(const n of [5,3,2])assert.match(css,new RegExp('repeat\\('+n+',minmax\\(0,1fr\\)\\)'));
let focus;
function element(textContent=''){
  const attrs=new Map(),events=new Map();
  return {textContent,attrs,events,open:false,alt:'',
    setAttribute(k,v){attrs.set(k,v)},
    addEventListener(k,f){events.set(k,f)},
    showModal(){this.open=true},
    close(){this.open=false;events.get('close')?.()},
    focus(){focus=this}
  };
}
const cards=ids.map((id,i)=>{
  const title=element(titles[i]),detail=element('English detail '+i),link=element(),img=element();
  link.href='./assets/images/materials/'+id+'.webp';
  link.querySelector=()=>img;
  return {dataset:{material:id},title,detail,link,img,querySelector:key=>({
    '.sc-material__name':title,'.sc-material__detail':detail,'.sc-material__zoom':link})[key]};
});
const elements=new Map(['scMaterialsPreview','scMaterialsClose','scMaterialsPreviewImage','scMaterialsPreviewTitle','scMaterialsPreviewDetail','scMaterialsEyebrow','materials-title','scMaterialsLead','scMaterialsNote'].map(id=>[id,element()]));
elements.set('materials',{querySelectorAll:()=>cards});
const get=id=>elements.get(id);
const document={getElementById:get,documentElement:{lang:'th'}},window=element();
vm.runInNewContext(read('src/scripts/material-gallery.js'),{document,window});
assert.equal(get('materials-title').textContent,'ประเภทวัสดุที่มีให้เลือก');
assert.match(get('scMaterialsNote').textContent,/ภาพจำลอง/);
const pp=cards[3];
assert.equal(pp.title.textContent,'สติกเกอร์ PP ใส');
const modal=get('scMaterialsPreview');
let prevented=false;
const click=pp.link.events.get('click');
click({ctrlKey:true,preventDefault(){prevented=true}});
assert.equal(prevented,false);
assert.equal(modal.open,false);
click({preventDefault(){prevented=true}});
assert.equal(prevented,true);
assert.equal(modal.open,true);
assert.equal(focus,get('scMaterialsClose'));
assert.equal(get('scMaterialsPreviewImage').src,pp.link.href);
assert.equal(get('scMaterialsPreviewTitle').textContent,pp.title.textContent);
assert.equal(get('scMaterialsPreviewImage').alt,pp.img.alt);
document.documentElement.lang='en';
window.events.get('scwork-site-updated')();
assert.equal(get('scMaterialsPreviewTitle').textContent,'Clear PP stickers');
get('scMaterialsClose').events.get('click')();
assert.equal(modal.open,false);
assert.equal(focus,pp.link);
console.log('PASS V2.1.6: five optimized swatches, three responsive grids, localized previews, keyboard focus and previous support bar.');
