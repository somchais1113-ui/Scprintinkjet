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
const businessKeys=['b2bMarginPct','b2bHandlingCost','b2bCreditDays','b2bAnnualFinancePct'];
const materials=catalog=>catalog.categories.find(c=>c.id==='sticker').materials;
const uniqueScope=(ids,catalog)=>materials(catalog).filter(m=>ids.includes(m.id)).map(m=>m.id);
function normalize(raw,catalog,builder){
  if(!raw||![1,2].includes(raw.schemaVersion)||!raw.rules||typeof raw.rules!=='object'||Array.isArray(raw.rules))throw Error('BAD_MASTER_FILE');
  const rules=builder.defaultRules(catalog);
  for(const m of materials(catalog)){
    const incoming=raw.rules[m.id]||{};
    const r=rules[m.id];
    for(const key of costKeys)if(Object.hasOwn(incoming,key))r[key]=readNumber(incoming[key]);
    // Optional separate B2B policy. Empty margin = use the same approved B2C selling rate.
    for(const key of businessKeys)r[key]=Object.hasOwn(incoming,key)?readNumber(incoming[key]):(key==='b2bMarginPct'?null:0);
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
  return normalize({schemaVersion:2,version:'SCW-001',vatPct:0,rules:{},selected:[],globalRates:{}},catalog,builder);
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
// Add contract overhead and working-capital carrying cost to corporate unit and order costs.
// Conservative estimate: finance cost is based on direct expenses advanced by SCWork.
function businessRule(r){
  if(r.b2bMarginPct===null||r.b2bMarginPct===undefined)return null;
  const margin=readNumber(r.b2bMarginPct),ops=readNumber(r.b2bHandlingCost),days=readNumber(r.b2bCreditDays),annual=readNumber(r.b2bAnnualFinancePct);
  if(margin===null||margin<5||margin>85||ops===null||days===null||days>365||annual===null||annual>100)throw Error('BAD_B2B_POLICY');
  const multiplier=1+(days/365)*(annual/100);
  return {...r,marginPct:margin,materialCost:r.materialCost*multiplier,printCost:r.printCost*multiplier,
    finishingCost:r.finishingCost*multiplier,setupCost:r.setupCost*multiplier,supplierFee:r.supplierFee*multiplier,
    freightIn:r.freightIn*multiplier,overhead:r.overhead*multiplier+ops};
}
function makeCard(master,catalog,builder,approvedAt){
  if(!master.selected.length)throw Error('SELECT_MATERIAL');
  if(master.vatPct!==0)throw Error('NON_VAT_SELLER'); // SCWork is not VAT-registered.
  if(master.vatPct===null||master.vatPct>20)throw Error('BAD_VAT');
  const sticker=catalog.categories.find(c=>c.id==='sticker');
  const published=sticker.materials.filter(m=>master.selected.includes(m.id));
  const rules=Object.fromEntries(published.map(m=>[m.id,effectiveRule(master.rules[m.id],master.globalRates,builder).rule]));
  const publicCatalog={...catalog,categories:[{...sticker,materials:published.map(m=>({...m,addons:(m.addons||[]).filter(a=>rules[m.id].addonCosts[a.id]!==null)}))}]};
  const card=builder.buildPublic(publicCatalog,rules,{version:master.version,vatRate:master.vatPct/100,approvedAt});
  // Export separate approved COMPANY sell rates only when the private B2B policy was provided.
  for(const m of card.categories[0].materials){
    const privateR=rules[m.id],br=businessRule(privateR);
    if(br){
      builder.validateRule(br);
      const source=published.find(x=>x.id===m.id);
      const company={};
      if(m.mode==='area_sqm'){
        company.ratePerSqm=builder.suggestedRate(br,source.minAreaSqm||1);
        company.tiers=[{min:source.minAreaSqm||1,max:null,price:company.ratePerSqm,label:'B2B area'}];
      } else {
        company.tiers=source.tiers.map(t=>({min:t.min,max:Number.isFinite(t.max)?t.max:null,
          price:builder.suggestedRate(br,t.min),label:t.label}));
      }
      company.minimumCharge=br.minCharge;
      company.addons=(source.addons||[]).filter(a=>br.addonCosts?.[a.id]!=null).map(a=>({id:a.id,name:a.name,type:a.type,
        price:builder.ceilStep(br.addonCosts[a.id]*(1+br.b2bCreditDays/365*br.b2bAnnualFinancePct/100)/(1-br.marginPct/100),a.type==='per_unit'?.1:1)}));
      // Privacy: company contains selling rates only. No supplier costs, margins, fees or terms.
      m.buyerRates={company};
    }
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
const api={rateKeys,usageKeys,readNumber,normalize,fresh,effectiveRule,businessRule,makeCard};
root.SCWORK_PRICING_MASTER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
