import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const js = fs.readFileSync(new URL('../src/scripts/20-home-enhancements.js', import.meta.url), 'utf8');
const els = new Map();
const makeEl = () => ({
  textContent: '', href: '', title: '', style: {}, src: '', alt: '',
  className: '', innerHTML: '', children: [],
  classList: { add(){}, toggle(){}, remove(){} },
  setAttribute(){}, removeAttribute(){}, addEventListener(){},
  append(...children){this.children.push(...children)}, appendChild(child){this.children.push(child)},
  replaceChildren(...children){this.children=[...children]},
  querySelector(){return makeEl()}, closest(){return null},
});
const contactAssistant = makeEl();
contactAssistant.querySelector = (selector) => {
  if (!els.has(selector)) els.set(selector, makeEl());
  return els.get(selector);
};
const events = new Map();
const document = {
  documentElement: { lang: 'th' }, body: makeEl(),
  getElementById(id){
    if (id === 'scContactAssistant') return contactAssistant;
    if(!els.has(id)) els.set(id, makeEl());
    return els.get(id);
  },
  createElement(){return makeEl()},
  addEventListener(){},
};
const window = {
  PROCLEANING_SITE: {contact: {}},
  SCWORK_PUBLIC_CONTACT: {},
  SCWORK_CLIENT_LOGOS: Array.from({length: 8}, (_,i)=>({name: `พื้นที่โลโก้ ${i+1}`, src:'', approved:false})),
  addEventListener(type, fn){events.set(type, fn)},
};
const context = { window, document, location:{ pathname:'/index.html' }, MutationObserver: class{observe(){}}, console};
vm.runInNewContext(js, context, {filename:'20-home-enhancements.js'});
assert.equal(els.get('socialProofEyebrow').textContent, 'ลูกค้าและแบรนด์');
assert.equal(els.get('socialProofTitle').textContent, 'พื้นที่สำหรับโลโก้ลูกค้า');
assert.equal(els.get('socialProofDescription').textContent, 'แสดงเฉพาะโลโก้ที่ได้รับอนุญาตให้เผยแพร่');
assert.equal(els.get('scClientLogoTrack').children.length,0);
assert.equal(els.get('client-logos').hidden,true);
window.SCWORK_CLIENT_LOGOS[0]={name:'Authorized Client',approved:true,src:'./assets/images/client-logos/authorized.webp'};
events.get('scwork-site-updated')();
assert.equal(els.get('socialProofTitle').textContent, 'แบรนด์ที่ร่วมงานกับ SCWORK');
assert.equal(els.get('client-logos').hidden,false);
assert.equal(els.get('scClientLogoTrack').children.length,2);
assert.equal(els.get('socialProofDescription').textContent, 'ขอบคุณทุกแบรนด์ที่เลือกใช้บริการผลิตสติกเกอร์กับเรา');
document.documentElement.lang='en';
events.get('scwork-site-updated')();
assert.equal(els.get('socialProofTitle').textContent, 'Brands working with SCWORK');
assert.equal(els.get('socialProofDescription').textContent, 'Thank you to the brands choosing SCWORK for sticker printing.');
console.log('V1.7.3 client-logo copy QA PASS — placeholders, approval, TH, EN, marquee');
