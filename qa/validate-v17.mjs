import fs from 'node:fs';import assert from 'node:assert/strict';import path from 'node:path';import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const vm=await import('node:vm'),sandbox={window:{}};vm.runInNewContext(read('data/pricing-demo-data.js'),sandbox);
const demo=sandbox.window.SCWORK_PRICING_DEMO,engine=require('../src/scripts/pricing-engine.js'),cost=require('../src/scripts/rate-card-builder.js'),line=require('../src/scripts/quote-to-line.js');
const sticker=demo.categories.find(c=>c.id==='sticker');assert.equal(sticker.materials.length,6);
const initial=cost.defaultRules(demo);for(const m of sticker.materials){assert.throws(()=>cost.validateRule(initial[m.id]),/COST_NOT_SET/);const r=initial[m.id];r.materialCost=7.5;r.printCost=8.2;r.finishingCost=1.5;r.setupCost=120;r.supplierFee=35;r.freightIn=50;r.overhead=30;r.marginPct=36;r.minCharge=550;r.wastePct=7;r.addonCosts=Object.fromEntries((m.addons||[]).map(a=>[a.id,a.type==='flat'?160:1.2]));assert.equal(cost.validateRule(r),true);}
const publicCard=cost.buildPublic(demo,initial,{version:'2026-001',approvedAt:'2026-11-13T00:00:00.000Z'});
assert.equal(publicCard.status,'approved');assert.equal(publicCard.categories.length,1);assert.equal(publicCard.categories[0].materials.length,6);
const plain=JSON.stringify(publicCard);
for(const secret of ['materialCost','printCost','finishingCost','supplierFee','freightIn','overhead','marginPct','wastePct','setupCost','addonCosts'])assert.equal(plain.includes(secret),false,`private key ${secret} leaked`);
for(const m of publicCard.categories[0].materials){const r=initial[m.id];if(m.mode==='a3_sheet'){
 const prices=m.tiers.map(t=>t.price);assert(prices.every(x=>x>0));assert(prices.every((x,i)=>i===0||x<=prices[i-1]));for(const t of m.tiers){const margin=cost.auditSale(r,t.min,t.price*t.min);assert(margin.margin+1e-7>=r.marginPct,`${m.id} tier ${t.min}: below margin target`);}
}else if(m.mode==='area_sqm'){assert(m.ratePerSqm>0);assert(cost.auditSale(r,m.minAreaSqm,m.ratePerSqm*m.minAreaSqm).margin>=r.marginPct);}}
const basic={categoryId:'sticker',materialId:'pp-white',widthCm:5,heightCm:5,desiredPieces:500,quantity:500,addonIds:[]};
const demoQuote=engine.calculate(basic,demo),liveQuote=engine.calculate(basic,publicCard);assert(demoQuote.demonstrationOnly);assert.equal(liveQuote.demonstrationOnly,false);assert.equal(liveQuote.rateVersion,'2026-001');assert(liveQuote.total>0&&liveQuote.vat>0);assert.equal(liveQuote.total,cost.round2(liveQuote.subtotal+liveQuote.vat));assert.equal(liveQuote.units,Math.max(10,Math.ceil(500/liveQuote.details.piecesPerSheet)));
const area=engine.calculate({...basic,materialId:'pvc-sqm',areaWidthCm:100,areaHeightCm:100,quantity:2},publicCard);assert.equal(area.units,2);assert(area.total>0);
const min=JSON.parse(plain);min.categories[0].materials.find(m=>m.id==='pp-white').minimumCharge=500000;const minQuote=engine.calculate(basic,min);assert(minQuote.minimumSurcharge>0);assert.equal(minQuote.subtotal,500000);
assert.throws(()=>cost.buildPublic(demo,{...initial,'pp-white':{...initial['pp-white'],marginPct:100}},{version:'x'}),/BAD_MARGIN/);
assert.equal(line.lineId('@scwork'), '@scwork');assert.equal(line.lineId('wrong'),'');assert.equal(line.validArtworkLink('https://drive.google.com/x'),true);assert.equal(line.validArtworkLink('javascript:alert(1)'),false);
const msg=line.buildMessage({category:'Sticker',material:'PP',width:5,height:5,quantity:500,cut:'Standard',addons:'None',result:liveQuote,rateVersion:'2026-001',artwork:'LINE'},'en');assert(msg.includes('2026-001'));assert(!msg.includes('DEMO reference price'));assert(msg.includes('Estimate from reviewed rate card'));
const main=read('index.html');assert(main.includes('heroCarousel'));assert(main.includes('./smart-quote.html'));assert(!main.includes('pricing-workbench.html'));
const newQuote=read('smart-quote.html');assert(newQuote.includes('data-size="8x10"')&&newQuote.includes('data-qty="1000"')&&newQuote.includes('pricing-public-data.js'));assert(!newQuote.includes('type="file"'));
assert(read('tools/index.html').includes('pricing-workbench.html'));assert(read('tools/pricing-workbench.html').includes('downloadPublic'));
const assetHashes={ 'hero-scene.webp':'0e6003428857edfbea7977f6d7261f3dfb03ac11129a62c3848a0ae47a496821','slide-02-labels.webp':'24dfcfa5f877c8735868496a45563215bb0d9564dd07fc11c8b632688d1e5ca7','slide-03-cut.webp':'47ba1d1d266c15cb37c43191c44cfbc50e0cfd95cb51abf50d0b75d78f498b4e','slide-04-branding.webp':'59562a0a1f7521d0bf61118201abc9be344662bbb534b450904d7b1ce5277fd4'};
for(const [name,hash] of Object.entries(assetHashes))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,'assets/images/hero',name))).digest('hex'),hash);
console.log('V1.6 + V1.7 detailed functional tests PASSED: costing, margin tiers, privacy allowlist, VAT, min charge, A3, SQM, LINE, HTML, banner hashes.');
