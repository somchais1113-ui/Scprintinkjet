import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const read=p=>readFileSync(join(root,p),'utf8');
const req=createRequire(import.meta.url);
const builder=req('../src/scripts/rate-card-builder.js');
const privatePricing=req('../src/scripts/pricing-master.js');
const engine=req('../src/scripts/pricing-engine.js');
const billing=req('../src/scripts/quote-billing.js');
const context={window:{}};
vm.runInNewContext(read('data/pricing-demo-data.js'),context);
vm.runInNewContext(read('tools/pricing-catalog-v2129.js'),context);
const cat=context.window.SCWORK_PRIVATE_COST_CATALOG;
assert.deepEqual(Array.from(cat.categories[0].materials,m=>m.id),['paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner']);
const master=privatePricing.fresh(cat,builder);
assert.equal(master.vatPct,0,'new private master must default to no VAT');
assert.equal(read('config/billing-config.js').includes("vatStatus: 'not-registered'"),true);
const m=cat.categories.find(c=>c.id==='sticker').materials.find(m=>m.id==='pp-white');
assert(m,'Test material exists');
master.selected=[m.id];
const r=master.rules[m.id];
Object.assign(r,{materialCost:11,printCost:4,finishingCost:2,setupCost:200,supplierFee:40,freightIn:60,overhead:80,
 minCharge:0,marginPct:40,wastePct:5,addonCosts:Object.fromEntries((m.addons||[]).map(a=>[a.id,20])),
 b2bMarginPct:28,b2bHandlingCost:190,b2bCreditDays:45,b2bAnnualFinancePct:12});
const card=privatePricing.makeCard(master,cat,builder,'2026-11-24T02:00:00Z');
assert.equal(card.vatRate,0,'Do not charge VAT');
assert.equal(card.status,'approved');
const publicText=JSON.stringify(card);
for(const forbidden of ['materialCost','printCost','finishingCost','setupCost','supplierFee','freightIn','overhead','marginPct','b2bMarginPct','b2bHandlingCost','b2bCreditDays','b2bAnnualFinancePct']){
 assert(!publicText.includes('"'+forbidden+'"'),'Never leak '+forbidden);
}
const retail=engine.calculate({categoryId:'sticker',materialId:m.id,widthCm:5,heightCm:5,desiredPieces:500,addonIds:[]},card);
const company=engine.calculate({categoryId:'sticker',materialId:m.id,widthCm:5,heightCm:5,desiredPieces:500,addonIds:[]},engine.forBuyer(card,'company'));
assert.equal(retail.vat,0);assert.equal(company.vat,0);
assert.notEqual(company.total,retail.total,'Approved company cost policy should change actual quote price');
assert(company.total>0&&retail.total>0);
// Company/individual tax selection must not change gross sale, and WHT is NOT a discount.
const b2c=billing.quote(1000,0,0,'review','individual','this-order');
const b2bReview=billing.quote(1000,0,0,'review','company','this-order');
const b2bService=billing.quote(1000,0,0,'service','company','this-order');
assert.equal(b2c.gross,1000);assert.equal(b2bReview.gross,1000);assert.equal(b2bReview.net,null);
assert.equal(b2bService.gross,1000);assert.equal(b2bService.wht,30);assert.equal(b2bService.net,970);
// No invented company discount if company policy was not explicitly set.
r.b2bMarginPct=null;
const noCompanyCard=privatePricing.makeCard(master,cat,builder,'2026-11-24T02:00:00Z');
assert.equal(JSON.stringify(engine.forBuyer(noCompanyCard,'company').categories[0].materials[0]),JSON.stringify(noCompanyCard.categories[0].materials[0]));
master.vatPct=7;
assert.throws(()=>privatePricing.makeCard(master,cat,builder,'2026-11-24T02:00:00Z'),/NON_VAT_SELLER/);
const h=read('smart-quote.html'),u=read('src/scripts/quote-billing-ui.js');
assert(h.includes('data-buyer-choice="individual"')&&h.includes('data-buyer-choice="company"'));
assert(read('config/billing-config.js').includes("vatStatus: 'not-registered'"));
assert(h.includes('41-b2b-b2c-pricing-v2129.css'));
console.log('PASS V2.1.29: unregistered VAT guard, B2C/B2B cost-based approved policy, corporate financing, no cost leak, WHT review, no invented rate.');
