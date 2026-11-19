/* DOM-contract smoke for the quote UI without an installed browser. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const req=createRequire(import.meta.url);
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('smart-quote.html');
const browserLike=(query,contact={},rates=null,clipboard=true,billing=null)=>{
  const listeners={};
  let clip='';
  class El {
    constructor(tag,attrs={},text=''){
      this.tag=tag;this.attrs=attrs;this.dataset=Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,ch)=>ch.toUpperCase()),v]));
      this.classList={toggle(){},add(){},remove(){}};this.textContent=text;this.value=attrs.value||'';this.children=[];this.events={};this.hidden='hidden'in attrs;this._checked='checked'in attrs;
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
    if('data-mode'in attrs||'data-preset'in attrs||'data-size'in attrs||'data-qty'in attrs||'data-plan-qty'in attrs||attrs.name==='artwork'||attrs.name==='cut')group.push(el);
  }
  for(const key of ['purpose','helpPurpose','billBuyer','billContract','exampleType','exampleVAT']){
    const select=els[key];
    const options=html.match(new RegExp('<select id="'+key+'">([\\s\\S]*?)</select>'))[1];
    select.children=[...options.matchAll(/<option value="([^"]*)"[^>]*>([^<]*)/g)].map(m=>new El('option',{value:m[1]},m[2]));
    select.value=select.children[0].value;
  }
  const brand=new El('a'),intro={after(node){els[node.id]=node;}};
  const doc={
    documentElement:{lang:'th'},body:new El('body'),getElementById:id=>els[id]||null,
    createElement:tag=>new El(tag),
    querySelectorAll(selector){
      if(selector.startsWith('[data-addon]'))return els.addonList.children.flatMap(l=>l.children).filter(el=>el.dataset.addon&&el.checked);
      if(selector.startsWith('[data-')){const key=selector.match(/data-([\w-]+)/)[1].replace(/-([a-z])/g,(_,ch)=>ch.toUpperCase());return group.filter(e=>key in e.dataset&&(!selector.includes(':not')||e.dataset[key]!=='custom'));}
      const name=selector.match(/name="([^"]+)"/)?.[1],value=selector.match(/value="([^"]+)"/)?.[1];
      return group.filter(el=>el.attrs.name===name&&(!value||el.value===value)&&(!selector.includes(':checked')||el.checked));
    },
    querySelector(selector){return selector==='.q-brand'?brand:selector==='.q-intro'?intro:this.querySelectorAll(selector)[0];}
  };
  const window={SCWORK_PUBLIC_CONTACT:contact,SCWORK_PRICING_PUBLIC:rates,SCWORK_PRICING_ENGINE:req('../src/scripts/pricing-engine.js'),SCWORK_QUOTE_TO_LINE:req('../src/scripts/quote-to-line.js'),SCWORK_LABEL_QUOTE_PLAN:req('../src/scripts/label-quote-plan.js'),addEventListener(n,f){listeners[n]=f;},dispatchEvent(){}};
  const ctx={window,document:doc,location:{search:query,pathname:'/smart-quote.html',hash:''},history:{replaceState(){}},localStorage:{getItem:()=>null},navigator:{clipboard:{writeText:async s=>{if(!clipboard)throw Error('denied');clip=s;}}},URLSearchParams,Option:function(text,value){return new El('option',{value},text);},CustomEvent:class{}};
  vm.runInNewContext(read('data/quote-catalog.js'),ctx);
  let prints=0;
  if(billing){
    window.SCWORK_QUOTE_BILLING=req('../src/scripts/quote-billing.js');
    window.SCWORK_BILLING_CONFIG=billing;
    window.print=()=>{assert(!els.billPrintSheet.hidden);prints++;listeners.afterprint();};
    vm.runInNewContext(read('src/scripts/quote-billing-ui.js'),ctx);
  }
  vm.runInNewContext(read('src/scripts/smart-quote.js'),ctx);
  return {els,doc,group,clipboard:()=>clip,prints:()=>prints,language:code=>listeners['scwork:locale-change']({detail:{code}})};
};
const cfg={officePhone:'020000000',lineId:'@test-shop'};
const m=browserLike('?lang=th',cfg);
assert(m.els.totalRow.hidden);
assert.match(decodeURIComponent(m.els.mobileAction.href),/5 × 5 ซม\./);
assert.equal(m.els.fallbackContact.href,'tel:020000000');
m.language('en');
assert.equal(m.doc.documentElement.lang,'en');
assert.equal(m.els.projectQuoteEntry.href,'./project-quote.html?lang=en');
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
const card={status:'approved',demonstrationOnly:false,vatRate:.07,version:'QA-only',approvedAt:'2026-11-19T04:00:00Z',a3PlusSheet:{usableWidthCm:30,usableHeightCm:43,gapCm:.2},categories:[{id:'sticker',materials:[{id:'pp-white',mode:'a3_sheet',minSheets:1,tiers:[{min:1,max:null,price:25}],addons:[{id:'design',name:'QA only',type:'flat',price:50}]}]}]};
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

const flow=browserLike('?category=label&lang=th',{lineUrl:'https://line.me/R/ti/p/%40test-shop'},card);
assert(!flow.els.labelPrices.hidden);assert(flow.els.quoteQuantities.hidden);
assert.match(flow.els.labelPricesTerms.textContent,/รวม VAT 7% · ไม่รวมค่าส่ง/);
const click=qty=>flow.group.find(b=>b.dataset.planQty===String(qty)).fire('click');
for(const q of [100,500,1000]){
  click(q);assert.equal(flow.els.sumTotal.textContent,flow.els['planTotal'+q].textContent);
  assert(flow.els['planEach'+q].textContent.startsWith(flow.els.perPieceValue.textContent));
  const href=flow.els.lineCta.href;
  assert.match(href,/oaMessage\/%40test-shop\/\?/,'Thai standard estimate should open a prefilled draft');
  const draft=decodeURIComponent(new URL(href).search.slice(1));
  assert(draft.includes('จำนวน: '+q+' ชิ้น')&&draft.includes('5 × 5 ซม.'));
  assert(draft.includes('ตารางราคา: QA-only')&&draft.includes('ไม่รวมค่าส่ง'));
  await flow.els.copyCta.fire('click');assert.equal(flow.clipboard(),draft);
}
flow.els.quantity.value=600;flow.els.quantity.fire('input');
assert(flow.els.totalRow.hidden&&!flow.els.labelPrices.hidden);
assert.match(decodeURIComponent(flow.els.lineCta.href),/จำนวน: 600 ชิ้น/);
click(500);
flow.els.width.value=6;flow.els.width.fire('input');assert(flow.els.labelPrices.hidden&&flow.els.totalRow.hidden);
flow.els.width.value=5;flow.els.width.fire('input');assert(!flow.els.totalRow.hidden);
const optional=flow.els.addonList.children[1].children[0];
optional.checked=true;optional.fire('change');assert(flow.els.labelPrices.hidden&&flow.els.totalRow.hidden);
assert.match(decodeURIComponent(flow.els.lineCta.href),/บริการออกแบบ/);
const noVat=browserLike('?category=label&lang=en',cfg,{...card,vatRate:0});
assert.match(noVat.els.priceInfo.textContent,/No VAT applied.*Shipping excluded/);
const draftOnly=browserLike('?lang=en',{},card);
assert(!draftOnly.els.totalRow.hidden&&draftOnly.els.lineCta.hidden&&!draftOnly.els.copyCta.disabled);
const excessive=browserLike('?mode=help&lang=th',cfg,card);
excessive.els.helpBrief.value='ขอ'.repeat(170);excessive.els.helpBrief.fire('input');
assert(!new URL(excessive.els.lineCta.href).search&&!excessive.els.copyCta.disabled);
assert.equal(excessive.els.mobileAction.href,'#quoteSummary');
console.log('PASS V1.8.2 DOM: all three comparisons, retail terms, LINE draft matches copied spec, manual routing and long-message fallback.');

const configured={sellerName:'Verified fixture',vatStatus:'registered',standardOrder:'service',managementFee:{type:'fixed',value:1000}};
const bill=browserLike('?lang=th',{},card,true,configured);
assert(!bill.els.totalRow.hidden&&!bill.els.billingPay.hidden&&!bill.els.printEstimate.disabled);
assert.equal(bill.els.mobileAction.href,'#quoteSummary');
const gross=bill.els.sumTotal.textContent;
assert.match(gross,/1,417.75/); // 13 × 25 + 1,000; then add 7% VAT
assert.match(bill.els.billingFeeValue.textContent,/1,000.00/);
assert.match(bill.els.billingNetValue.textContent,/1,417.75/);
bill.els.billBuyer.value='company';bill.els.billBuyer.fire('change');
assert.match(bill.els.billingWhtValue.textContent,/39.75/);
assert.match(bill.els.billingNetValue.textContent,/1,378.00/);
assert.equal(bill.els.sumTotal.textContent,gross);
bill.els.billContract.value='unknown';bill.els.billContract.fire('change');
assert.equal(bill.els.billingWhtValue.textContent,'รอยืนยัน');
bill.els.billContract.value='this-order';bill.els.billContract.fire('change');
bill.els.billRecipient.value='บริษัทตัวอย่าง';
bill.els.printEstimate.fire('click');assert.equal(bill.prints(),1);
assert(bill.els.billPrintSheet.hidden);assert.match(bill.els.docRecipient.textContent,/บริษัทตัวอย่าง/);
assert.equal(bill.els.docTitle.textContent,'ใบประมาณราคา');
assert(bill.els.docAmounts.children.some(r=>r.children[1].textContent.includes('1,378.00')));
const inactive=browserLike('?lang=en',{},card,true,{...configured,vatStatus:'unconfirmed'});
assert(inactive.els.totalRow.hidden&&inactive.els.lineCta.hidden&&!inactive.els.printEstimate.disabled);
inactive.els.printEstimate.fire('click');assert.equal(inactive.prints(),1);
assert.equal(inactive.els.docTitle.textContent,'Specifications for quotation');
assert(inactive.els.docAmounts.hidden&&inactive.els.docAmounts.children.length===0);
inactive.els.exampleBase.value='1000';inactive.els.exampleBase.fire('input');
inactive.els.billBuyer.value='company';inactive.els.billBuyer.fire('change');
assert(inactive.els.billingExampleRows.children.some(row=>row.children[1].textContent.includes('1,040.00')));
const neutral=browserLike('?lang=th',{},card,true,{...configured,standardOrder:'review'});
neutral.els.billBuyer.value='company';neutral.els.billBuyer.fire('change');
assert.equal(neutral.els.billingNetValue.textContent,'รอยืนยัน');
assert(!neutral.els.totalRow.hidden);
console.log('PASS V2.1 DOM: live estimate, buyer switch, fee/VAT/withholding, optional recipient, no-LINE print, and isolated example.');
