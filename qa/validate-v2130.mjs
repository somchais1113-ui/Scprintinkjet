import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const req=createRequire(import.meta.url);
const live=req('../src/scripts/live-quote-engine-v2130.js');
const engine=req('../src/scripts/pricing-engine.js');
const billing=req('../src/scripts/quote-billing.js');
const cfg={vatStatus:'not-registered',standardOrder:'review',managementFee:{type:'none',value:0}};
const approved={status:'approved',demonstrationOnly:false,version:'test-only',approvedAt:'2026-11-24T00:00:00Z',vatRate:0,
  a3PlusSheet:{usableWidthCm:30,usableHeightCm:43,gapCm:.3},categories:[{id:'sticker',materials:[{
  id:'pp-white',mode:'a3_sheet',minSheets:1,minimumCharge:120,tiers:[{min:1,max:19,price:30},{min:20,max:null,price:27}],pricingMode:'tier_floor',addons:[]
 }]}]};
const spec={categoryId:'sticker',materialId:'pp-white',widthCm:5,heightCm:5,desiredPieces:100,quantity:100,areaWidthCm:5,areaHeightCm:5,addonIds:[]};
const est=overrides=>live.estimate({card:approved,engine,billing,billingConfig:cfg,buyer:'individual',raw:{...spec,...overrides},customCut:false});
assert.equal(live.estimate({card:null,engine,billing,billingConfig:cfg,buyer:'individual',raw:spec,customCut:false}),null);
assert.equal(live.estimate({card:{...approved,status:'draft'},engine,billing,billingConfig:cfg,buyer:'individual',raw:spec,customCut:false}),null);
assert.equal(live.estimate({card:{...approved,vatRate:.07},engine,billing,billingConfig:cfg,buyer:'individual',raw:spec,customCut:false}),null);
const q100=est({quantity:100,desiredPieces:100});
const q500=est({quantity:500,desiredPieces:500});
const q1000=est({quantity:1000,desiredPieces:1000});
assert(q100&&q500&&q1000);
assert(q1000.total>q500.total&&q500.total>q100.total,'price should change with quantity using approved rate');
assert.equal(q100.vat,0);
assert.equal(est({quantity:750,desiredPieces:750}).quantity,750,'non-preset quantity must be supported');
assert.equal(live.estimate({card:approved,engine,billing,billingConfig:cfg,buyer:'company',raw:spec,customCut:true}),null);
assert.equal(live.estimate({card:approved,engine,billing,billingConfig:cfg,buyer:'company',raw:{...spec,addonIds:['unpriced']},customCut:false}),null);
const html=readFileSync(join(root,'smart-quote.html'),'utf8');
assert(html.includes('id="scLinkedQuote"')&&html.includes('src/scripts/live-quote-engine-v2130.js'));
assert(!html.includes('id="billingExample"')&&!html.includes('id="exampleBase"'),'old, unlinked tax demo must be gone');
console.log('PASS V2.1.30: quantity-linked approved prices; arbitrary quantities; no-rate guard; no VAT; no phantom tax example.');
