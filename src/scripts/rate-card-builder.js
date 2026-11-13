/* SCWORK V1.7: Pure costing, quotation margin and sanitized public-rate generator.
   Costs remain in private local draft JSON; NEVER include them in public catalog. */
(function(root){
'use strict';
const round2=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const ceilStep=(v,step=1)=>round2(Math.ceil((v-1e-10)/step)*step);
const money=n=>Number.isFinite(n)&&n>=0?n:0;
function validateRule(r){
 if(!r||typeof r!=='object')throw Error('RULE_MISSING');
 const nonnegative=['materialCost','printCost','finishingCost','setupCost','supplierFee','freightIn','overhead','minCharge','wastePct'];
 for(const key of nonnegative){if(!Number.isFinite(Number(r[key]))||Number(r[key])<0||Number(r[key])>10000000)throw Error('BAD_'+key);}
 if(!Number.isFinite(Number(r.marginPct))||r.marginPct<5||r.marginPct>85)throw Error('BAD_MARGIN');
 if(Number(r.materialCost)+Number(r.printCost)+Number(r.finishingCost)<=0)throw Error('COST_NOT_SET');
 if(Number(r.wastePct)>80)throw Error('BAD_WASTE');
 return true;
}
function model(r){validateRule(r);return {
  variable:(Number(r.materialCost)+Number(r.printCost)+Number(r.finishingCost))*(1+Number(r.wastePct)/100),
  fixed:Number(r.setupCost)+Number(r.supplierFee)+Number(r.freightIn)+Number(r.overhead),
  margin:Number(r.marginPct)/100,
  minCharge:Number(r.minCharge),
 };
}
function suggestedRate(r,units,step=1){const c=model(r);if(!Number.isFinite(units)||units<=0)throw Error('BAD_UNITS');return ceilStep((c.variable+c.fixed/units)/(1-c.margin),step);}
function auditSale(r,units,sale){const c=model(r);const cost=round2(c.variable*units+c.fixed),revenue=round2(Math.max(sale,c.minCharge)),profit=round2(revenue-cost);return {units,cost,revenue,profit,margin:revenue?round2(profit/revenue*100):0};}
function buildPublic(catalog,rules,opts={}){
 if(!catalog||!Array.isArray(catalog.categories))throw Error('CATALOG_MISSING');
 const sticker=catalog.categories.find(c=>c.id==='sticker');if(!sticker||!sticker.materials?.length)throw Error('STICKERS_MISSING');
 const published=sticker.materials.map(m=>{
  const r=rules[m.id];validateRule(r);const unitRef=m.mode==='area_sqm'?(m.minAreaSqm||1):(m.minSheets||m.minQty||1);
  const allowed={id:m.id,name:m.name,description:m.description,mode:m.mode,unitLabel:m.unitLabel};
  if(m.mode==='a3_sheet')allowed.minSheets=m.minSheets;
  if(m.mode==='area_sqm'){allowed.minAreaSqm=m.minAreaSqm;allowed.ratePerSqm=suggestedRate(r,unitRef);allowed.tiers=[{min:unitRef,max:null,price:allowed.ratePerSqm,label:`${unitRef}+ m²`}];}
  else if(m.mode==='a3_sheet'||m.mode==='quantity_tier'){
   if(m.minQty)allowed.minQty=m.minQty;
   if(m.defaultQty)allowed.defaultQty=m.defaultQty;
   allowed.tiers=m.tiers.map(t=>({min:t.min,max:Number.isFinite(t.max)?t.max:null,price:suggestedRate(r,t.min),label:t.label}));
   // Larger orders must not have higher unit rates than smaller tiers.
   for(let i=1;i<allowed.tiers.length;i++)if(allowed.tiers[i].price>allowed.tiers[i-1].price)throw Error('NON_MONOTONIC_TIERS');
  }else throw Error('UNSUPPORTED_STICKER_MODE');
  allowed.minimumCharge=Number(r.minCharge)||0;
  allowed.addons=(m.addons||[]).map(a=>{
    const rawCost=r.addonCosts?.[a.id];
    const cost=Number(rawCost);
    if(rawCost==null||!Number.isFinite(cost)||cost<0)throw Error('BAD_ADDON_'+a.id);
    return {id:a.id,name:a.name,type:a.type,price:ceilStep(cost/(1-Number(r.marginPct)/100),a.type==='per_unit'?0.1:1)};
  });
  return allowed;
 });
 const vat=Number(opts.vatRate??catalog.vatRate);
 if(!Number.isFinite(vat)||vat<0||vat>0.2)throw Error('BAD_VAT');
 const approvedAt=String(opts.approvedAt||new Date().toISOString());
 const version=String(opts.version||'2026-001');
 if(!/^[a-zA-Z0-9._-]{1,45}$/.test(version))throw Error('BAD_VERSION');
 return {status:'approved',demonstrationOnly:false,version,approvedAt,vatRate:vat,
  a3PlusSheet:{usableWidthCm:catalog.a3PlusSheet.usableWidthCm,usableHeightCm:catalog.a3PlusSheet.usableHeightCm,gapCm:catalog.a3PlusSheet.gapCm},
  categories:[{id:'sticker',name:sticker.name,materials:published}]};
}
function defaultRules(catalog){const s=catalog.categories.find(c=>c.id==='sticker');const result={};for(const m of s.materials){result[m.id]={materialCost:0,printCost:0,finishingCost:0,wastePct:5,setupCost:0,supplierFee:0,freightIn:0,overhead:0,marginPct:30,minCharge:0,addonCosts:Object.fromEntries((m.addons||[]).map(a=>[a.id,null]))};}return result;}
const api={round2,ceilStep,validateRule,model,suggestedRate,auditSale,buildPublic,defaultRules};root.SCWORK_RATE_CARD_BUILDER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
