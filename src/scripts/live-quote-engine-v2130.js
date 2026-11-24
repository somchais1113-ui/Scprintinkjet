/* V2.1.30 live pricing adapter — NEVER uses customer-entered example amounts.
 * Consumes only an approved, public SELLING rate card; no private cost data.
 */
(function(root){
  'use strict';
  const positive=n=>Number.isFinite(n)&&n>0&&n<1e12;
  const nonnegative=n=>Number.isFinite(n)&&n>=0&&n<1e12;
  const validApprovedCard=(card,cfg)=>Boolean(card&&card.status==='approved'&&card.demonstrationOnly===false&&
    typeof card.version==='string'&&/^[A-Za-z0-9._-]{1,45}$/.test(card.version)&&
    typeof card.approvedAt==='string'&&Number.isFinite(Date.parse(card.approvedAt))&&
    Array.isArray(card.categories)&&card.categories.length>0&&
    Number.isFinite(card.vatRate)&&card.vatRate>=0&&card.vatRate<=.2&&
    cfg&&['not-registered','registered'].includes(cfg.vatStatus)&&
    (cfg.vatStatus==='not-registered'?card.vatRate===0:card.vatRate>0));
  function validMaterial(m,card){
    if(!m||!['a3_sheet','area_sqm','quantity_tier','size_preset'].includes(m.mode))return false;
    if(!nonnegative(m.minimumCharge??0))return false;
    if(m.addons&&!Array.isArray(m.addons))return false;
    if((m.addons||[]).some(a=>!a||typeof a.id!=='string'||!nonnegative(a.price)||!['per_unit','flat'].includes(a.type)))return false;
    if(m.mode==='a3_sheet'){
      if(!positive(card.a3PlusSheet?.usableWidthCm)||!positive(card.a3PlusSheet?.usableHeightCm)||!nonnegative(card.a3PlusSheet?.gapCm))return false;
    }
    if(m.mode==='a3_sheet'||m.mode==='quantity_tier'){
      if(!Array.isArray(m.tiers)||!m.tiers.length)return false;
      let prevMax=0;
      for(let i=0;i<m.tiers.length;i++){
        const t=m.tiers[i];
        if(!Number.isSafeInteger(t?.min)||t.min<1||!positive(t.price))return false;
        if(i&&t.min!==prevMax+1)return false;
        if(i===m.tiers.length-1){if(t.max!==null)return false;}
        else {if(!Number.isSafeInteger(t.max)||t.max<t.min)return false;prevMax=t.max;}
      }
    }
    if(m.mode==='area_sqm'&&!positive(m.ratePerSqm))return false;
    if(m.mode==='size_preset'&&(!Array.isArray(m.sizePresets)||!m.sizePresets.length||m.sizePresets.some(p=>!positive(p.price))))return false;
    return true;
  }
  function estimate({card,engine,billing,billingConfig,buyer,raw,customCut}){
    try{
      if(!validApprovedCard(card,billingConfig)||!engine?.calculate||!billing?.rated||customCut)return null;
      if(!raw||!Number.isInteger(raw.quantity)||raw.quantity<1||raw.quantity>1000000||
         !positive(raw.widthCm)||!positive(raw.heightCm)||raw.widthCm>100000||raw.heightCm>100000)return null;
      const buyerCard=engine.forBuyer?engine.forBuyer(card,buyer):card;
      const category=buyerCard.categories.filter(c=>c?.id===raw.categoryId);
      if(category.length!==1||!Array.isArray(category[0].materials))return null;
      const mats=category[0].materials.filter(m=>m?.id===raw.materialId);
      if(mats.length!==1||!validMaterial(mats[0],buyerCard))return null;
      const m=mats[0];
      if(!Array.isArray(raw.addonIds)||raw.addonIds.some(id=>!(m.addons||[]).some(a=>a.id===id)))return null;
      const rate=engine.calculate(raw,buyerCard);
      if(rate.demonstrationOnly!==false||rate.rateVersion!==card.version||rate.vatRate!==card.vatRate||
        !positive(rate.subtotal)||!positive(rate.total)||!nonnegative(rate.vat)||!nonnegative(rate.basePrint)||
        !nonnegative(rate.addonsTotal)||!nonnegative(rate.minimumSurcharge)||!positive(rate.units))return null;
      const one={...rate,quantity:raw.quantity,perPiece:rate.total/raw.quantity};
      const rated=billing.rated({vatRate:card.vatRate,version:card.version,options:[one]},billingConfig);
      const r=rated?.options?.[0];
      if(!r||!positive(r.total)||!nonnegative(r.managementFee)||r.vatRate!==card.vatRate)return null;
      return r;
    }catch{return null;}
  }
  const api=Object.freeze({estimate,validApprovedCard});
  root.SCWORK_LIVE_QUOTE_ENGINE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
