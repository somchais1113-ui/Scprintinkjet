import assert from 'node:assert/strict';
import vm from 'node:vm';
import {join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readdirSync,readFileSync} from 'node:fs';
const project=fileURLToPath(new URL('../',import.meta.url));
const root=process.argv[2]||project;
const read=(file)=>readFileSync(join(root,file),'utf8');
const files=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const literal=/(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Presentation}|\uFE0F|\u20E3|[✦✧✓✔✕✖✗✘⧉◉◎●○◌◆◇✳★☆☎✆▯⌂▣◈✎▤＄♧▧⇩⇧↻↺])/gu;
const semantic=new Set(['©','®','™']);
const decode=s=>s.replace(/&#(x[0-9a-f]{1,6}|\d{1,7});/gi,(m,v)=>{
 const i=v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v);
 return i<=0x10ffff?String.fromCodePoint(i):m;
}).replace(/\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})/gi,(m,a,b)=>{
 const i=parseInt(a||b,16);return i<=0x10ffff?String.fromCodePoint(i):m;
});
const ui=files(root).map(n=>relative(root,n)).filter(n=>!n.startsWith('qa/')&&/\.(?:html|css|js|mjs|json|ts|svg)$/i.test(n));
assert(ui.includes('index.html')&&ui.includes('src/scripts/language-modal.js'));
for(const n of ui){
 const hits=[...new Set(decode(read(n)).match(literal)||[])].filter(c=>!semantic.has(c));
 assert.equal(hits.length,0,n+': unexpected symbols '+hits.join(' '));
}
assert.match(read('index.html'),/id="footerSocialCall"[^>]*><svg[^>]*>/);
assert.match(read('src/scripts/20-home-enhancements.js'),/footerCall.innerHTML=iconMarkup\('phone'\)/);
assert.match(read('src/styles/17-language-modal.css'),/\.sc-language-option\.is-selected\{box-shadow:/);
assert.match(read('smart-quote.html'),/id="printEstimate"/);
assert.match(read('project-quote.html'),/id="prepare"/);

class El{
 constructor(tag){this.tag=tag;this.attrs={};this.dataset={};this.children=[];this.classes=new Set();this.events={};this.hidden=false;
  this.classList={toggle:(n,on)=>on?this.classes.add(n):this.classes.delete(n),add:n=>this.classes.add(n),remove:n=>this.classes.delete(n)};}
 setAttribute(k,v){this.attrs[k]=v;}
 replaceChildren(...nodes){this.children=nodes;}
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);return node;}
 addEventListener(k,fn){this.events[k]=fn;}
 focus(){document.activeElement=this;}
 set innerHTML(s){this.markup=s;this.modal=new El('dialog');this.close=new El('button');this.left=new El('div');this.right=new El('div');}
 get options(){return [...this.left.children,...this.right.children];}
 querySelector(selector){
  if(selector==='.sc-language-dialog')return this.modal;
  if(selector==='.sc-language-close')return this.close;
  if(selector==='[data-lang-column="left"]')return this.left;
  if(selector==='[data-lang-column="right"]')return this.right;
  if(selector==='.sc-language-option.is-selected')return this.options.find(e=>e.classes.has('is-selected'));
  return selector==='.sc-language-option'?this.options[0]:null;
 }
 querySelectorAll(sel){return sel==='button:not([disabled])'?[this.close,...this.options]:this.options;}
}
const host=new El('host'),body=new El('body'),events={},notices=[],storage=new Map();
const document={body,activeElement:null,documentElement:{lang:'th'},querySelector:()=>host,createElement:t=>new El(t),addEventListener:(k,fn)=>events[k]=fn};
const window={addEventListener:(k,fn)=>events[k]=fn,dispatchEvent:e=>notices.push(e)};
vm.runInNewContext(read('src/scripts/language-modal.js'),{document,window,
 MutationObserver:class{observe(){}},
 localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
 CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail;}}
});
const trigger=host.children[0],modal=body.children[0];
assert.equal(window.SCWORK_LANGUAGES.length,14);
assert.equal(modal.options.length,14);
assert.equal(trigger.children[0].textContent,'TH');
assert.match(trigger.attrs['aria-label'],/ไทย/);
for(const opt of modal.options){
 assert.equal(opt.children.length,2);
 assert.equal(opt.children[0].textContent,opt.dataset.locale.toUpperCase());
 assert(opt.children[1].textContent.length>0);
}
trigger.focus();trigger.events.click();
assert.equal(trigger.attrs['aria-expanded'],'true');assert(!modal.hidden);
assert.equal(document.activeElement.dataset.locale,'th');
modal.options.find(x=>x.dataset.locale==='ja').events.click();
assert.equal(document.documentElement.lang,'ja');
assert.equal(storage.get('procleaning-language'),'ja');
assert.equal(trigger.children[0].textContent,'JA');
assert.equal(modal.options.find(x=>x.dataset.locale==='ja').attrs['aria-pressed'],'true');
assert.equal(notices.at(-1).detail.code,'ja');assert(modal.hidden);
trigger.events.click();events.keydown({key:'Escape',preventDefault(){}});
assert(modal.hidden&&document.activeElement===trigger);
const html=ui.filter(n=>n.endsWith('.html')).length;
console.log('PASS V2.1.1: '+html+' HTML pages, '+ui.length+' UI and data files, language labels and keyboard controls.');
