import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const js = fs.readFileSync(new URL('../src/scripts/20-home-enhancements.js', import.meta.url), 'utf8');
const els = new Map();
const makeEl = () => ({
  textContent: '', href: '', title: '', style: { props:new Map(), setProperty(key,val){this.props.set(key,val)} }, src: '', alt: '',
  className: '', innerHTML: '', children: [],
  classList: { add(){}, toggle(){}, remove(){} },
  setAttribute(){}, removeAttribute(){}, listeners: new Map(), addEventListener(type,fn){this.listeners.set(type,fn)},
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
assert.equal(els.get('socialProofEyebrow').textContent, 'ขอบคุณจาก SCWork');
assert.equal(els.get('socialProofTitle').textContent, 'ลูกค้าที่ร่วมงานกับเรา');
assert.equal(els.get('socialProofDescription').textContent, 'ขอบคุณที่ไว้วางใจให้ SCWork ดูแลงานพิมพ์สติกเกอร์ของคุณ');
assert.equal(els.get('scClientLogoTrack').children.length,0);
assert.equal(els.get('client-logos').hidden,true);
window.SCWORK_CLIENT_LOGOS[0]={name:'Authorized Client',approved:true,src:'./assets/images/client-logos/authorized.webp'};
events.get('scwork-site-updated')();
assert.equal(els.get('client-logos').hidden,false);
assert.equal(els.get('scClientLogoTrack').children.length,1);
assert.equal(els.get('scClientLogoPause').hidden,true);
window.SCWORK_CLIENT_LOGOS.push({name:'Another Client',approved:true,src:'./assets/images/client-logos/another.png'});
events.get('scwork-site-updated')();
const strips=els.get('scClientLogoTrack').children;
assert.equal(strips.length,2);
assert.equal(strips[0].children.length,8);
assert.equal(strips[1].children.length,8);
assert.equal(strips[0].children[0].children[0].alt,'Authorized Client');
assert.equal(strips[0].children[1].children[0].alt,'Another Client');
assert.equal(strips[0].children[2].children[0].alt,'');
assert.equal(strips[1].children[0].children[0].alt,'');
const pause=els.get('scClientLogoPause');
assert.equal(pause.hidden,false);
pause.onclick();
assert.equal(pause.textContent,'เลื่อนโลโก้ต่อ');
document.documentElement.lang='en';
events.get('scwork-site-updated')();
assert.equal(els.get('socialProofTitle').textContent, 'Clients we’ve worked with');
assert.equal(els.get('clientCreditsFooter').textContent,'Clients');
assert.equal(pause.textContent,'Resume logo animation');
assert.equal(els.get('scClientLogoTrack').children,strips);
const fireError=img=>img.listeners.get('error')();
fireError(strips[0].children[0].children[0]);
assert.equal(els.get('scClientLogoTrack').children.length,1);
assert.equal(pause.hidden,true);
fireError(els.get('scClientLogoTrack').children[0].children[0].children[0]);
assert.equal(els.get('client-logos').hidden,true);
assert.equal(els.get('socialProofTitle').textContent, 'Clients we’ve worked with');
console.log('PASS client-credit DOM: TH/EN, no invented clients, loop strips, pause and image-error fallback.');

vm.runInNewContext(fs.readFileSync(new URL('../data/client-logos.js',import.meta.url),'utf8'), context);
events.get('scwork-site-updated')();
const mockupNote=els.get('scClientLogoPreviewNote');
assert.equal(mockupNote.hidden,false);
assert.equal(mockupNote.textContent,'Logo mockups for layout preview');
const logosTrack=els.get('scClientLogoTrack');
assert.equal(logosTrack.children.length,2);
assert.equal(logosTrack.children[0].children.length,12);
assert.equal(logosTrack.children[0].children[0].children[0].alt,'Logo mockup 01');
assert.equal(logosTrack.style.props.get('--logo-duration'),'102s');
window.SCWORK_CLIENT_LOGOS.push({name:'Real Client',approved:true,src:'./assets/images/client-logos/actual/client.svg'});
events.get('scwork-site-updated')();
assert.equal(mockupNote.hidden,true);
assert.equal(logosTrack.children.length,1);
assert.equal(logosTrack.children[0].children[0].children[0].alt,'Real Client');
fireError(logosTrack.children[0].children[0].children[0]);
assert.equal(mockupNote.hidden,false);
assert.equal(logosTrack.children.length,2);
console.log('PASS mockup fallback and its slow loop, with real logos taking priority.');
