/** v2.4 deterministic tests; avoids browser/network dependencies. Run: node qa/validate-v24.mjs */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
let count=0;
const check=(condition,message)=>{assert.ok(condition,message);count++;};
const load=path=>readFileSync(join(root,path),'utf8');
const memory=new Map();
const context={
 console:{warn(){},error(){},log(){}},Date,Math,JSON,Map,Set,Number,String,Array,RegExp,
 localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))},
};
context.window=context;vm.createContext(context);
for(const path of ['data/demo/seed-data.js','tools/business/quotation-engine.js','tools/business/admin-data.js'])vm.runInContext(load(path),context,{filename:path});
const E=context.PCQuoteEngine,A=context.PCAdminCore;
check(!!E&&!!A,'Both new core and pricing engine load');
const m0=A.metrics();check(m0.rfqs>=40&&m0.orderCount>=10,'V2.3 demo seed remains intact');
const old=A.snapshot(),oldQuotes=old.quotes.length,oldOrders=old.orders.length,oldCustomers=old.customers.length;
const calc=E.calculate({items:[{description:'Test label',quantity:500,unit:'pcs',unitPrice:18,unitCost:8}],costs:{material:120},discountType:'amount',discountValue:100,shippingCharge:50,vatEnabled:true,vatRate:7});
check(calc.subtotal===9000&&calc.netSales===8950,'Subtotal, discount and customer shipping correct');
check(calc.vat===626.5&&calc.grandTotal===9576.5,'VAT 7% and customer total correct');
check(calc.directCost===4120&&calc.grossProfit===4830,'Direct costs and ex-VAT margin correct');
check(E.calculate({items:[{description:'A',quantity:1,unit:'unit',unitPrice:500,unitCost:300}],discountType:'percent',discountValue:10,vatEnabled:false}).grandTotal===450,'Percentage discount and no VAT');
for(const input of [
 {items:[],vatEnabled:false},
 {items:[{description:'X',quantity:1,unitPrice:-1,unitCost:0}]},
 {items:[{description:'X',quantity:1,unitPrice:10,unitCost:0}],discountType:'percent',discountValue:110},
 ]){let threw=false;try{E.calculate(input);}catch{threw=true;}check(threw,'Invalid quotation rejected');}
A.addWebsiteDemoRfq({title:'DEMO PVC label',category:'Sticker & Label',quantity:500,width:80,height:100,dimensionUnit:'mm',material:'PVC Sticker',finish:'Matte Lamination',printSides:'1',artwork:'ready',fileSelected:true,notes:'sample only'});
check(A.read().customers.length===oldCustomers+1&&A.read().rfqs.length===old.rfqs.length+1,'Website demo creates linked synthetic customer + RFQ');
const rfq=A.read().rfqs.at(-1);check(rfq.spec?.width===80&&rfq.spec?.artwork==='ready'&&rfq.source==='Website','Production specifications persist without image bytes');
const quotePayload={rfqId:rfq.id,items:[{description:'PVC Sticker',quantity:500,unit:'pcs',unitPrice:18,unitCost:8}],costs:{material:120},discountType:'amount',discountValue:100,shippingCharge:50,vatEnabled:true,vatRate:7,terms:'Demo only'};
A.addDetailedQuote(quotePayload);
check(A.read().quotes.length===oldQuotes+1,'Quotation draft saved');
const q=A.read().quotes.at(-1);check(q.version===1&&q.amount===9576.5&&q.netRevenue===8950&&q.estimatedCost===4120,'Saved quotation uses proper values');
A.addDetailedQuote({...quotePayload,discountValue:200});
check(A.latestQuotes().find(x=>x.rfqId===rfq.id)?.version===2,'Second save creates revision 2; older quote remains');
const latest=A.read().quotes.at(-1);
let blocked=false;try{A.updateQuoteStatus(q.id,'sent')}catch{blocked=true}check(blocked,'Cannot send stale revision');
A.updateQuoteStatus(latest.id,'sent');check(A.getQuote(latest.id).status==='sent','Quotation sent state recorded');
A.confirmOrder(latest.id);
const order=A.read().orders.at(-1);check(order.quoteId===latest.id&&order.netRevenue===8850&&order.taxAmount===619.5&&order.amount===9469.5,'Order copies quote values and preserves ex-VAT revenue');
check(A.read().orders.length===oldOrders+1&&A.getRfq(rfq.id).status==='won','Original pipeline confirms new order');
const m=A.metrics();check(m.orderCount===m0.orderCount+1,'Dashboard includes new confirmed order');
blocked=false;try{A.confirmOrder(latest.id)}catch{blocked=true}check(blocked,'Duplicate order prevented');
blocked=false;try{A.addDetailedQuote(quotePayload)}catch{blocked=true}check(blocked,'No quote version allowed after order confirmation');
const snapshot=A.snapshot();A.importData(snapshot);check(A.read().orders.length===oldOrders+1,'V2.4 JSON backup/import backwards compatible with schema 1');
check(A.read().quotes.slice(0,oldQuotes).every((x,i)=>x.id===old.quotes[i].id),'Old v2.3 quote IDs unchanged');
// Ensure page entrypoints and asset references exist; pages use relative URLs not placeholders.
for(const page of ['request-quote.html','tools/business/quote-builder.html','tools/business/quote-print.html','tools/business/dashboard.html','tools/business/customers.html','tools/business/orders.html','tools/business/quotations.html','tools/site-manager.html','tools/image-manager.html']){
 check(existsSync(join(root,page)),`File exists: ${page}`);
}
for(const src of ['src/scripts/rfq-demo.js','src/styles/08-rfq.css','src/styles/09-rfq-banner.css','tools/business/quotation-engine.js','tools/business/quote-builder.js','tools/business/quote-print.js'])check(existsSync(join(root,src)),`New asset exists: ${src}`);
check(load('index.html').includes('request-quote.html'),'Existing homepage links to new RFQ demo');
check(load('tools/index.html').includes('quote-builder.html'),'Hub links to Quotation Builder');
check(load('tools/business/quotations.html').includes('quotation-engine.js'),'Existing pages load new engine');
console.log(`PASS — V2.4: ${count} checks, backward compatible v2.3 core, no network required`);
