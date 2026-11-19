/* Phase 02 public scope. One ruleset for the landing CTA and Smart Quote. */
(function(root){
  'use strict';
  const quantities=Object.freeze([100,500,1000]);
  const materialId='pp-white',sizeCm=5;
  const positive=n=>Number.isFinite(n)&&n>0;
  const nonNegative=n=>Number.isFinite(n)&&n>=0;
  function matches(st){
    return st?.categoryId==='sticker'&&st.materialId===materialId&&st.widthCm===sizeCm&&st.heightCm===sizeCm&&
      st.preset==='label'&&st.standardCut===true&&Array.isArray(st.addonIds)&&st.addonIds.length===0;
  }
  function prepare(card,engine){
    try{
      if(card?.status!=='approved'||card.demonstrationOnly!==false||typeof card.version!=='string'||!/^[A-Za-z0-9._-]{1,45}$/.test(card.version)||
        typeof card.approvedAt!=='string'||!Number.isFinite(Date.parse(card.approvedAt))||
        !nonNegative(card.vatRate)||card.vatRate>0.2||!Array.isArray(card.categories))return null;
      const categories=card.categories.filter(c=>c?.id==='sticker');
      if(categories.length!==1||!Array.isArray(categories[0].materials))return null;
      const mats=categories[0].materials.filter(m=>m?.id===materialId);
      const m=mats[0],s=card.a3PlusSheet,min=m?.minSheets??1;
      if(mats.length!==1||m.mode!=='a3_sheet'||!Number.isSafeInteger(min)||min<1||!nonNegative(m.minimumCharge??0)||
        !positive(s?.usableWidthCm)||!positive(s?.usableHeightCm)||!nonNegative(s?.gapCm))return null;
      const tiers=m.tiers;
      if(!Array.isArray(tiers)||!tiers.length||tiers[0]?.min>min)return null;
      for(let i=0;i<tiers.length;i++){
        const t=tiers[i],previous=tiers[i-1],last=i===tiers.length-1;
        if(!Number.isSafeInteger(t?.min)||t.min<1||!positive(t.price)||
          (last?t.max!==null:(!Number.isSafeInteger(t.max)||t.max<t.min)))return null;
        if(previous&&(t.min!==previous.max+1||t.price>previous.price||
          (m.pricingMode!=='tier_floor'&&t.min*t.price<previous.max*previous.price)))return null;
      }
      const options=quantities.map(quantity=>{
        const q=engine.calculate({categoryId:'sticker',materialId,widthCm:sizeCm,heightCm:sizeCm,desiredPieces:quantity,addonIds:[]},card);
        if(q.demonstrationOnly!==false||!positive(q.total)||q.vatRate!==card.vatRate||!nonNegative(q.vat)||
          !nonNegative(q.basePrint)||!nonNegative(q.minimumSurcharge)||q.rateVersion!==card.version||!positive(q.units))throw Error('Invalid estimate');
        return Object.freeze({...q,quantity,perPiece:q.total/quantity});
      });
      if(options.some((q,i)=>i&&q.total<options[i-1].total))return null;
      return Object.freeze({version:card.version,vatRate:card.vatRate,options:Object.freeze(options)});
    }catch{return null;}
  }
  const api=Object.freeze({quantities,matches,prepare});
  root.SCWORK_LABEL_QUOTE_PLAN=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
