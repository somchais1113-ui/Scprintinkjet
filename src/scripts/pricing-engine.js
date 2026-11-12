/* SCWork estimator engine — reference formulas, DEMO rates only.
 * No customer information, artwork or quote is sent by this module.
 */
(function (global) {
  'use strict';
  const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
  function requiredPositive(n, name, limit=1000000) {
    const v=Number(n);
    if (!Number.isFinite(v)||v<=0||v>limit) throw Error('INVALID_'+name);
    return v;
  }
  function findTier(tiers,units){
    const tier=(tiers||[]).find(t=>units>=t.min&&units<=t.max);
    if(!tier)throw Error('TIER_NOT_FOUND');
    return tier;
  }
  function calculate(raw, data) {
    if(!data || !Array.isArray(data.categories))throw Error('INVALID_CATALOG');
    const category=data.categories.find(c=>c.id===raw.categoryId);
    const material=category?.materials?.find(m=>m.id===raw.materialId);
    if(!material)throw Error('MATERIAL_NOT_FOUND');
    let units,unitRate,details={},tier=null;
    if(material.mode==='a3_sheet'){
      const w=requiredPositive(raw.widthCm,'WIDTH',1000);
      const h=requiredPositive(raw.heightCm,'HEIGHT',1000);
      const pieces=requiredPositive(raw.desiredPieces,'QUANTITY');
      if(!Number.isInteger(pieces))throw Error('INVALID_QUANTITY');
      const sheet=data.a3PlusSheet;
      const cols=Math.floor(sheet.usableWidthCm/(w+sheet.gapCm));
      const rows=Math.floor(sheet.usableHeightCm/(h+sheet.gapCm));
      if(cols<1||rows<1)throw Error('TOO_LARGE_FOR_A3');
      const perSheet=cols*rows;
      units=Math.max(material.minSheets||1,Math.ceil(pieces/perSheet));
      tier=findTier(material.tiers,units);
      unitRate=tier.price;
      details={widthCm:w,heightCm:h,requestedPieces:pieces,piecesPerSheet:perSheet,columns:cols,rows,sheetsRequired:units,gapCm:sheet.gapCm};
    } else if(material.mode==='area_sqm') {
      const w=requiredPositive(raw.areaWidthCm,'WIDTH',100000),h=requiredPositive(raw.areaHeightCm,'HEIGHT',100000);
      const quantity=requiredPositive(raw.quantity,'QUANTITY');
      if(!Number.isInteger(quantity))throw Error('INVALID_QUANTITY');
      const actualSqm=w*h*quantity/10000;
      units=Math.max(material.minAreaSqm||0,actualSqm);
      unitRate=material.ratePerSqm;
      details={widthCm:w,heightCm:h,quantity,actualSqm,chargedSqm:units};
      tier=(material.tiers||[]).find(t=>units>=t.min&&units<=t.max)||null;
    } else if(material.mode==='quantity_tier') {
      const quantity=requiredPositive(raw.quantity,'QUANTITY');
      if(!Number.isInteger(quantity))throw Error('INVALID_QUANTITY');
      units=Math.max(quantity,material.minQty||1);
      tier=findTier(material.tiers,units);unitRate=tier.price;
      details={requestedQuantity:quantity,chargedQuantity:units};
    } else if(material.mode==='size_preset') {
      const quantity=requiredPositive(raw.quantity,'QUANTITY');
      if(!Number.isInteger(quantity))throw Error('INVALID_QUANTITY');
      const preset=material.sizePresets.find(p=>p.id===raw.presetId)||material.sizePresets[0];
      units=Math.max(quantity,material.minQty||1);
      unitRate=preset.price;
      details={presetId:preset.id,presetLabel:preset.label,requestedQuantity:quantity,chargedQuantity:units};
    } else throw Error('INVALID_MODE');
    const addons=Array.isArray(raw.addonIds)?raw.addonIds:[];
    const applied=(material.addons||[]).filter(a=>addons.includes(a.id)).map(a=>({id:a.id,name:a.name,type:a.type,unitPrice:a.price,amount:round2(a.type==='per_unit'?a.price*units:a.price)}));
    const base=round2(units*unitRate);
    const addOnTotal=round2(applied.reduce((sum,a)=>sum+a.amount,0));
    const subtotal=round2(base+addOnTotal);
    const vat=round2(subtotal*data.vatRate);
    return {categoryId:category.id,materialId:material.id,materialName:material.name,mode:material.mode,
      units,unitLabel:material.unitLabel,unitRate,activeTier:tier?.label||null,details,
      basePrint:base,addons:applied,addonsTotal:addOnTotal,subtotal,vat,vatRate:data.vatRate,total:round2(subtotal+vat),demonstrationOnly:true};
  }
  global.SCWORK_PRICING_ENGINE={calculate,findTier};
  if(typeof module!=='undefined'&&module.exports) module.exports={calculate,findTier};
})(typeof window!=='undefined'?window:globalThis);
