/* Private SCWORK pricing master. This file is not part of the public build. */
(function(root){
'use strict';
const rateKeys=['electricity','fuel','freight'];
const usageKeys=['kwhPerUnit','litresPerJob','freightTripsPerJob'];
const max=10000000;
function readNumber(value){
  if(value==null||String(value).trim()==='')return null;
  return (typeof value==='number'||typeof value==='string')&&Number.isFinite(Number(value))&&Number(value)>=0&&Number(value)<=max?Number(value):null;
}
const costKeys=['materialCost','printCost','finishingCost','setupCost','supplierFee','freightIn','overhead','minCharge','wastePct','marginPct'];
const materials=catalog=>catalog.categories.find(c=>c.id==='sticker').materials;
const uniqueScope=(ids,catalog)=>materials(catalog).filter(m=>ids.includes(m.id)).map(m=>m.id);
function normalize(raw,catalog,builder){
  if(!raw||![1,2].includes(raw.schemaVersion)||!raw.rules||typeof raw.rules!=='object'||Array.isArray(raw.rules))throw Error('BAD_MASTER_FILE');
  const rules=builder.defaultRules(catalog);
  for(const m of materials(catalog)){
    const incoming=raw.rules[m.id]||{};
    const r=rules[m.id];
    for(const key of costKeys)if(Object.hasOwn(incoming,key))r[key]=readNumber(incoming[key]);
    for(const key of usageKeys)r[key]=Object.hasOwn(incoming,key)?readNumber(incoming[key]):0;
    for(const addon of m.addons||[])if(Object.hasOwn(incoming.addonCosts||{},addon.id))r.addonCosts[addon.id]=readNumber(incoming.addonCosts[addon.id]);
  }
  const globalRates=Object.fromEntries(rateKeys.map(key=>[key,Object.hasOwn(raw.globalRates||{},key)?readNumber(raw.globalRates[key]):0]));
  const legacyReady=materials(catalog).filter(m=>{
    const r=rules[m.id];try{return validateCosts(r,builder)&&costKeys.every(k=>r[k]!==null);}catch{return false;}
  }).map(m=>m.id);
  const selected=uniqueScope(raw.schemaVersion===1?legacyReady:Array.isArray(raw.selected)?raw.selected:[],catalog);
  const rev=typeof raw.version==='string'?raw.version.slice(0,45):'SCW-001';
  const reason=typeof raw.reason==='string'?raw.reason.slice(0,160):'';
  return {schemaVersion:2,version:rev,vatPct:Object.hasOwn(raw,'vatPct')?readNumber(raw.vatPct):catalog.vatRate*100,
    reason,globalRates,selected,rules};
}
function fresh(catalog,builder){
  return normalize({schemaVersion:2,version:'SCW-001',rules:{},selected:[],globalRates:{}},catalog,builder);
}
function validateCosts(r,builder){
  if(!r||costKeys.some(k=>r[k]===null||readNumber(r[k])===null))throw Error('INCOMPLETE_COST');
  return builder.validateRule(r);
}
function effectiveRule(r,globalRates,builder){
  if(!r||costKeys.some(k=>r[k]===null||readNumber(r[k])===null))throw Error('INCOMPLETE_COST');
  if(rateKeys.some(k=>readNumber(globalRates[k])===null))throw Error('INCOMPLETE_SHARED_RATES');
  if(usageKeys.some(k=>readNumber(r[k])===null))throw Error('INCOMPLETE_USAGE');
  const variable=r.kwhPerUnit*globalRates.electricity;
  const fixed=r.litresPerJob*globalRates.fuel+r.freightTripsPerJob*globalRates.freight;
  const effective={...r,printCost:r.printCost+variable/(1+r.wastePct/100),freightIn:r.freightIn+fixed};
  builder.validateRule(effective);
  return {rule:effective,variable,fixed};
}
function makeCard(master,catalog,builder,approvedAt){
  if(!master.selected.length)throw Error('SELECT_MATERIAL');
  if(master.vatPct===null||master.vatPct>20)throw Error('BAD_VAT');
  const sticker=catalog.categories.find(c=>c.id==='sticker');
  const published=sticker.materials.filter(m=>master.selected.includes(m.id));
  const rules=Object.fromEntries(published.map(m=>[m.id,effectiveRule(master.rules[m.id],master.globalRates,builder).rule]));
  const publicCatalog={...catalog,categories:[{...sticker,materials:published.map(m=>({...m,addons:(m.addons||[]).filter(a=>rules[m.id].addonCosts[a.id]!==null)}))}]};
  const card=builder.buildPublic(publicCatalog,rules,{version:master.version,vatRate:master.vatPct/100,approvedAt});
  for(const m of card.categories[0].materials){
    if(!m.tiers||m.mode==='area_sqm')continue;
    m.pricingMode='tier_floor';
    for(let i=0;i<m.tiers.length;i++){
      const t=m.tiers[i];
      if(!Number.isInteger(t.min)||t.min<1||t.max!==null&&(!Number.isInteger(t.max)||t.max<t.min)||
        (i>0&&m.tiers[i-1].max!==t.min-1)||(i===m.tiers.length-1&&t.max!==null))throw Error('BAD_TIER_BOUNDARY');
    }
  }
  return card;
}
const api={rateKeys,usageKeys,readNumber,normalize,fresh,effectiveRule,makeCard};
root.SCWORK_PRICING_MASTER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
