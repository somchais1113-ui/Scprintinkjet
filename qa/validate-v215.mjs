import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const pageNames=['index.html','article.html','product-labels.html','smart-quote.html','project-quote.html','order-tracking.html'];
for(const file of pageNames){
  const page=read(file);
  assert.match(page,/\.\/src\/styles\/26-support-bar\.css\?v=2\.1\.5/);
  assert.match(page,/\.\/src\/scripts\/support-bar\.js\?v=2\.1\.5/);
  assert.match(page,file==='index.html'?/config\/public-config\.js\?v=2\.1\.[589]/:/config\/public-config\.js\?v=2\.1\.5/);
}
assert.doesNotMatch(read('order-status/index.html'),/support-bar/);
assert(existsSync(new URL('../assets/images/support/scwork-support-bear.webp',import.meta.url)));
const css=read('src/styles/26-support-bar.css');
assert.match(css,/\.sc-helpbar \{\s*position: fixed;\s*inset: auto 0 0;/);
assert.match(css,/\.q-mobile-bar \{\s*bottom: var\(--sc-support-h\)/);
assert.match(css,/scroll-padding-bottom: calc\(var\(--sc-support-h\) \+ var\(--sc-quote-dock-h\) \+ 12px\)/);
assert.match(css,/@media print \{\s*\.sc-helpbar \{ display: none !important;/);
assert.match(css,/safe-area-inset-bottom/);

function setup({pub={},site={},lang='th',home=false,quote=false}={}){
  let focus;
  const all=(e,predicate)=>predicate(e)?e:e.nodes.map(n=>all(n,predicate)).find(Boolean);
  class El {
    nodes=[]; attrs=new Map(); events=new Map(); data=new Map(); dataset={}; hidden=false;
    style={setProperty:(k,v)=>this.data.set(k,v)};
    constructor(tag){this.tag=tag;}
    addEventListener(k,v){this.events.set(k,v);}
    emit(k,e={}){this.events.get(k)?.(e);}
    append(...nodes){this.nodes.push(...nodes);}
    replaceChildren(...nodes){this.nodes=nodes;}
    setAttribute(k,v){this.attrs.set(k,v);}
    removeAttribute(k){this.attrs.delete(k);if(k in this)delete this[k];}
    getAttribute(k){return this.attrs.get(k)??this[k]??null;}
    querySelector(t){return all(this,e=>e.tag===t)||null;}
    contains(node){return Boolean(all(this,e=>e===node));}
    getBoundingClientRect(){return {height:this.heightNow||0};}
    focus(){focus=this;}
  }
  const body=new El('body'),root=new El('html'),win=new El('window'),doc=new El('document');
  root.lang=lang;
  const summary=new El('section');
  if(quote){summary.className='q-mobile-bar';summary.heightNow=55;body.append(summary);}
  if(home){const section=new El('section');section.id='contact';body.append(section);}
  win.SCWORK_PUBLIC_CONTACT=pub;
  win.PROCLEANING_SITE={contact:site};
  doc.documentElement=root;doc.body=body;doc.readyState='complete';
  doc.getElementById=id=>all(body,e=>e.id===id)||null;
  doc.querySelector=sel=>all(body,e=>e.className===sel.replace('.',''))||null;
  doc.createElement=tag=>new El(tag);
  let onSize;
  let onLang;
  vm.runInNewContext(read('src/scripts/support-bar.js'),{document:doc,window:win,URL,
    ResizeObserver:class{constructor(fn){onSize=fn} observe(){}},
    MutationObserver:class{constructor(fn){onLang=fn} observe(){}}
  });
  const one=(cls,tag)=>all(body,e=>e.className===cls&&(!tag||tag===e.tag));
  return {root,body,doc,win,one,summary,onSize,onLang,get focus(){return focus;}};
}
const base=setup({home:true});
assert.equal(base.root.dataset.scSupport,'ready');
assert.equal(base.one('sc-helpbar__button','a').href,'#contact');
assert.equal(base.one('sc-helpbar__button','a').textContent,'ดูวิธีติดต่อ');
assert.equal(base.one('sc-helpbar__button','button').hidden,true);
assert.equal(base.one('sc-helpbar__qr').hidden,true);
assert.equal(base.one('sc-helpbar__bear').alt,'');
assert.equal(base.one('sc-helpbar__bear').src,'./assets/images/support/scwork-support-bear.webp');

const other=setup({lang:'en',quote:true,pub:{lineId:'',lineUrl:'javascript:alert(1)',facebookUrl:'https://facebook.com.evil.test/example'}});
assert.equal(other.one('sc-helpbar__button','a').href,'./index.html?lang=en#contact');
assert.equal(other.one('sc-helpbar__title').textContent,'Need help with your print job?');
other.one('sc-helpbar').heightNow=64;
other.onSize();
assert.equal(other.root.data.get('--sc-support-h'),'64px');
assert.equal(other.root.data.get('--sc-quote-dock-h'),'55px');

const single=setup({pub:{lineId:'@scwork-qa',supportLineQr:'./assets/images/support/line-qr.png'}});
const direct=single.one('sc-helpbar__button','a');
assert.equal(direct.href,'https://line.me/R/ti/p/%40scwork-qa');
assert.equal(direct.rel,'noopener noreferrer');
const qr=single.one('sc-helpbar__qr');
assert.equal(qr.hidden,false);
assert.equal(qr.querySelector('img').src,'./assets/images/support/line-qr.png');
qr.querySelector('img').emit('error');
assert.equal(qr.hidden,true);

const many=setup({pub:{lineUrl:'https://lin.ee/qa',officePhone:'02 123 4567',mobilePhone:'021234567',facebookUrl:'https://facebook.com/scwork-qa'}});
const panel=many.one('sc-helpbar__panel'),toggle=many.one('sc-helpbar__button','button');
assert.equal(panel.hidden,true);
assert.equal(many.one('sc-helpbar__button','a').hidden,true);
assert.equal(many.one('sc-helpbar__list').nodes.length,3);
toggle.emit('click');
assert.equal(panel.hidden,false);
assert.equal(toggle.getAttribute('aria-expanded'),'true');
assert.equal(many.focus.href,'https://lin.ee/qa');
many.doc.emit('keydown',{key:'Escape',preventDefault(){}});
assert.equal(panel.hidden,true);
assert.equal(many.focus,toggle);
toggle.emit('click');
many.doc.emit('click',{target:many.body});
assert.equal(panel.hidden,true);
many.root.lang='en';
many.onLang();
assert.equal(toggle.textContent,'Contact us');
console.log('PASS V2.1.5: 6 pages, fixed bottom spacing, mobile quote clearance, bilingual help, QR fallback and keyboard support.');
