import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const req=createRequire(import.meta.url);
const engine=req('../src/scripts/pricing-engine.js'),phase=req('../src/scripts/label-quote-plan.js'),line=req('../src/scripts/quote-to-line.js');
const master=req('../src/scripts/pricing-master.js'),builder=req('../src/scripts/rate-card-builder.js');
const window={};
vm.runInNewContext(read('data/pricing-demo-data.js'),{window});
const draft=master.fresh(window.SCWORK_PRICING_DEMO,builder);
draft.selected=['pp-white'];
draft.version='QA-182';
Object.assign(draft.rules['pp-white'],{materialCost:8,printCost:6,finishingCost:1,setupCost:20,minimumCharge:0,minCharge:150,addonCosts:{lamination:2,design:300}});
const approved=master.makeCard(draft,window.SCWORK_PRICING_DEMO,builder,'2026-11-19T06:00:00Z');
const result=phase.prepare(approved,engine);
assert(result,'real Pricing Master output shape');
assert.equal(result.version,'QA-182');
assert.deepEqual(result.options.map(x=>x.quantity),[100,500,1000]);
// The first run may be billed at the minimum A3+ sheets. Compare the true billed result.
for(const q of result.options){
  const calculated=engine.calculate({categoryId:'sticker',materialId:'pp-white',widthCm:5,heightCm:5,desiredPieces:q.quantity,addonIds:[]},approved);
  assert.equal(q.total,calculated.total);assert.equal(q.perPiece,q.total/q.quantity);
  assert.equal(q.vat,Math.round((q.subtotal*approved.vatRate+Number.EPSILON)*100)/100);
}
assert(result.options[0].total<=result.options[1].total&&result.options[1].total<=result.options[2].total);
assert.equal(result.options[0].units,10);
const spec={categoryId:'sticker',materialId:'pp-white',widthCm:5,heightCm:5,preset:'label',standardCut:true,addonIds:[]};
assert(phase.matches(spec));
for(const mod of [{widthCm:5.1},{heightCm:4},{materialId:'pp-clear'},{standardCut:false},{preset:'diecut'},{addonIds:['design']},{addonIds:null}])assert(!phase.matches({...spec,...mod}));

const alter=mutate=>{const copy=structuredClone(approved);mutate(copy,copy.categories[0].materials[0]);return copy;};
for(const bad of [null,window.SCWORK_PRICING_DEMO,{...approved,status:'draft'},{...approved,demonstrationOnly:true},{...approved,version:''},{...approved,approvedAt:undefined},{...approved,vatRate:.25},
  alter(c=>{c.a3PlusSheet.usableWidthCm=1;}),alter((c,m)=>{m.tiers[1].min+=1;}),alter((c,m)=>{m.tiers[1].min-=1;}),
  alter((c,m)=>{m.tiers[1].price=0;}),alter((c,m)=>{m.tiers[1].price=m.tiers[0].price*2;}),
  alter((c,m)=>{m.tiers[1].price=m.tiers[0].price/2;delete m.pricingMode;}),
  alter((c,m)=>{m.tiers.at(-1).max=1500;}),alter((c,m)=>{c.categories[0].materials.push(m);})]){
  assert.equal(phase.prepare(bad,engine),null);
}
assert.equal(phase.prepare(approved,{calculate:(s,c)=>s.desiredPieces===1000?{total:NaN}:engine.calculate(s,c)}),null);
assert.equal(phase.prepare({...approved,vatRate:0},engine).options[1].vat,0);
assert.deepEqual(line.resolveContact('','https://line.me/R/ti/p/%40shop_qa'),{id:'@shop_qa',url:'https://line.me/R/ti/p/%40shop_qa'});
assert.deepEqual(line.resolveContact('','https://lin.ee/exampleQA'),{id:'',url:'https://lin.ee/exampleQA'});
assert.deepEqual(line.resolveContact('@shop_qa','https://line.me/R/ti/p/%40different'),{id:'@shop_qa',url:''});
for(const bad of ['https://line.me.bad.example/R/ti/p/@shop_qa','https://line.me/R/ti/p/@shop_qa?payload=1','https://evil@line.me/R/ti/p/@shop_qa','http://lin.ee/exampleQA','https://line.me:8443/R/ti/p/@shop_qa']){
  assert.deepEqual(line.resolveContact('',bad),{id:'',url:''});
}
const shipped={};
for(const file of ['data/pricing-public-data.js','data/site-data.js','config/public-config.js'])vm.runInNewContext(read(file),{window:shipped});
assert.equal(shipped.SCWORK_PRICING_PUBLIC,null);
for(const conf of [shipped.SCWORK_PUBLIC_CONTACT,shipped.PROCLEANING_SITE.contact])assert(!conf.lineId&&!conf.lineUrl);
for(const page of ['smart-quote.html','product-labels.html']){
  for(const [,url] of read(page).matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)){
    if(!/^[a-z]+:/i.test(url))assert(existsSync(new URL('../'+url.replace(/^\.\//,''),import.meta.url)),page+' : '+url);
  }
  assert.doesNotMatch(read(page),/type="file"|pricing-demo-data/);
}
console.log('PASS V1.8.2: genuine Master export format, totals and VAT for 100/500/1,000, rejection of invalid tiers/approvals, LINE routes and empty live configuration.');
