/* DOM-contract smoke for the quote UI without an installed browser. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const req=createRequire(import.meta.url);
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('smart-quote.html');
const browserLike=(query,contact={},rates=null,clipboard=true)=>{
  const listeners={};
  let clip='';
  class El {
    constructor(tag,attrs={},text=''){
      this.tag=tag;this.attrs=attrs;this.dataset=Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5),v]));
      this.classList={toggle(){}};this.textContent=text;this.value=attrs.value||'';this.children=[];this.events={};this.hidden='hidden'in attrs;this._checked='checked'in attrs;
    }
    get checked(){return this._checked;}
    set checked(on){if(on&&this.attrs.type==='radio')for(const other of group)if(other!==this&&other.attrs.name===this.attrs.name)other._checked=false;this._checked=on;}
    get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
    get options(){return this.children;}
    get selectedIndex(){return Math.max(0,this.children.findIndex(e=>e.value===this.value));}
    get selectedOptions(){return [this.children[this.selectedIndex]];}
    replaceChildren(...a){this.children=a;}append(...a){this.children.push(...a);}
    addEventListener(n,f){this.events[n]=f;} fire(n){return this.events[n]?.({target:this});}
    setAttribute(k,v){this.attrs[k]=v;}
    removeAttribute(k){delete this.attrs[k];if(k==='href')this.href=undefined;}
    focus(){this.focused=true;}select(){this.selected=true;}
    remove(){delete els[this.id];}
  }
  const els={},group=[];
  for(const match of html.matchAll(/<([\w-]+)\s+([^>]+)>/g)){
    const attrs=Object.fromEntries([...match[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m=>[m[1],m[2]??'']));
    const el=new El(match[1],attrs);
    if(attrs.id){el.id=attrs.id;els[attrs.id]=el;}
    if('data-mode'in attrs||'data-preset'in attrs||'data-size'in attrs||'data-qty'in attrs||attrs.name==='artwork'||attrs.name==='cut')group.push(el);
  }
  for(const key of ['purpose','helpPurpose']){
    const select=els[key];
    const options=html.match(new RegExp('<select id="'+key+'">([\\s\\S]*?)</select>'))[1];
    select.children=[...options.matchAll(/<option value="([^"]*)">([^<]*)/g)].map(m=>new El('option',{value:m[1]},m[2]));
    select.value=select.children[0].value;
  }
  const brand=new El('a'),intro={after(node){els[node.id]=node;}};
  const doc={
    documentElement:{lang:'th'},getElementById:id=>els[id]||null,
    createElement:tag=>new El(tag),
    querySelectorAll(selector){
      if(selector.startsWith('[data-addon]'))return els.addonList.children.flatMap(l=>l.children).filter(el=>el.dataset.addon&&el.checked);
      if(selector.startsWith('[data-')){const key=selector.match(/data-([\w-]+)/)[1];return group.filter(e=>key in e.dataset&&(!selector.includes(':not')||e.dataset[key]!=='custom'));}
      const name=selector.match(/name="([^"]+)"/)?.[1],value=selector.match(/value="([^"]+)"/)?.[1];
      return group.filter(el=>el.attrs.name===name&&(!value||el.value===value)&&(!selector.includes(':checked')||el.checked));
    },
    querySelector(selector){return selector==='.q-brand'?brand:selector==='.q-intro'?intro:this.querySelectorAll(selector)[0];}
  };
  const window={SCWORK_PUBLIC_CONTACT:contact,SCWORK_PRICING_PUBLIC:rates,SCWORK_PRICING_ENGINE:req('../src/scripts/pricing-engine.js'),SCWORK_QUOTE_TO_LINE:req('../src/scripts/quote-to-line.js'),addEventListener(n,f){listeners[n]=f;},dispatchEvent(){}};
  const ctx={window,document:doc,location:{search:query,pathname:'/smart-quote.html',hash:''},history:{replaceState(){}},localStorage:{getItem:()=>null},navigator:{clipboard:{writeText:async s=>{if(!clipboard)throw Error('denied');clip=s;}}},URLSearchParams,Option:function(text,value){return new El('option',{value},text);},CustomEvent:class{}};
  vm.runInNewContext(read('data/quote-catalog.js'),ctx);
  vm.runInNewContext(read('src/scripts/smart-quote.js'),ctx);
  return {els,doc,group,clipboard:()=>clip,language:code=>listeners['scwork:locale-change']({detail:{code}})};
};
const cfg={officePhone:'020000000',lineId:'@test-shop'};
const m=browserLike('?lang=th',cfg);
assert(m.els.totalRow.hidden);
assert.match(decodeURIComponent(m.els.mobileAction.href),/5 × 5 ซม\./);
assert.equal(m.els.fallbackContact.href,'tel:020000000');
m.language('en');
assert.equal(m.doc.documentElement.lang,'en');
assert.equal(m.group.find(b=>b.dataset.size==='3x3').textContent,'3 × 3 cm');
m.group.find(b=>b.dataset.mode==='guided').fire('click');
m.els.purpose.value='outdoor';m.els.purpose.fire('change');
assert.equal(m.els.material.value,'pvc-sqm');
m.group.find(b=>b.dataset.mode==='help').fire('click');
assert(m.els.specPanel.hidden);
m.els.helpBrief.value='Some outdoor signs';m.els.helpBrief.fire('input');
await m.els.copyCta.fire('click');
assert.match(m.clipboard(),/Sticker advice\nDetails: Some outdoor signs/);
assert.doesNotMatch(m.clipboard(),/100 × 100|NaN|500 pcs/);
m.group.filter(b=>b.attrs.name==='artwork').forEach(b=>b.checked=b.value==='link');
m.group.find(b=>b.attrs.name==='artwork'&&b.value==='link').fire('change');
m.els.artUrl.value='javascript:bad';m.els.artUrl.fire('input');
assert(m.els.lineCta.hidden);assert(m.els.copyCta.disabled);
const denied=browserLike('?lang=zh&mode=help',{lineUrl:'https://lin.ee/example'},null,false);
assert.equal(denied.els.quoteForm.lang,'en');
assert.equal(denied.els.lineCta.href,'https://lin.ee/example');
await denied.els.copyCta.fire('click');
assert(!denied.els.manualCopyPanel.hidden);assert.match(denied.els.manualCopy.value,/Sticker advice/);
const card={status:'approved',demonstrationOnly:false,vatRate:.07,version:'QA only',a3PlusSheet:{usableWidthCm:30,usableHeightCm:43,gapCm:.2},categories:[{id:'sticker',materials:[{id:'pp-white',mode:'a3_sheet',minSheets:1,tiers:[{min:1,max:null,price:25}]}]}]};
const p=browserLike('?lang=en',cfg,card);
assert(!p.els.totalRow.hidden);assert.match(p.els.sumVatLabel.textContent,/7%/);
const first=p.els.sumTotal.textContent;
p.group.find(b=>b.dataset.qty==='1000').fire('click');
assert.notEqual(p.els.sumTotal.textContent,first);
p.group.find(b=>b.dataset.preset==='diecut').fire('click');
assert(p.els.totalRow.hidden);assert(!p.els.lineCta.hidden);
const blank=browserLike('?lang=th');
assert(blank.els.lineCta.hidden);assert(!blank.els.copyCta.disabled);
console.log('PASS quote UI DOM contracts: modes, Thai/English fallback, contact states, clipboard denial, artwork and reviewed rates.');
