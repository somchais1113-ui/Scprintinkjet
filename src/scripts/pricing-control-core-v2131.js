/* SCWORK 2.1.31 – PRIVATE pricing control calculations, testable without DOM.
   This module is deliberately not in the customer/public build. */
(function(root){
'use strict';
const MATERIALS=['paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner'];
const VERSION=1;
function round(n){return Math.round((Number(n)+Number.EPSILON)*100)/100;}
function finite(n){return typeof n==='number'&&Number.isFinite(n);}
function unitFor(m){return m?.mode==='area_sqm'?'sqm':'a3_sheet';}
function normalizeSupplierQuote(raw,material,now=new Date()){
 if(!material||!MATERIALS.includes(material.id))throw Error('เลือกวัสดุจากรายการที่รองรับ');
 const supplier=String(raw.supplier||'').trim().slice(0,100),documentNo=String(raw.documentNo||'').trim().slice(0,90);
 if(supplier.length<2)throw Error('ระบุชื่อ Supplier');
 if(documentNo.length<2)throw Error('ระบุเลขที่เอกสารอ้างอิง');
 const qty=Number(raw.packUnits),price=Number(raw.packPrice);
 if(!finite(qty)||qty<=0||qty>1e7||!finite(price)||price<=0||price>1e9)throw Error('ราคาและจำนวนหน่วยต้องมากกว่า 0');
 if(raw.unit!==unitFor(material))throw Error('หน่วยราคาไม่ตรงกับ Cost Master กรุณาแปลงหน่วยก่อน');
 if(!['no-vat','vat-included','vat-excluded'].includes(raw.taxTreatment))throw Error('ระบุสถานะ VAT ในเอกสาร Supplier');
 const quoteDate=String(raw.quoteDate||'');const validUntil=String(raw.validUntil||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(quoteDate)||!Number.isFinite(Date.parse(quoteDate)))throw Error('กรอกวันที่ใบเสนอราคา');
 if(validUntil&&(!/^\d{4}-\d{2}-\d{2}$/.test(validUntil)||!Number.isFinite(Date.parse(validUntil))||validUntil<quoteDate))throw Error('วันหมดอายุต้องไม่ก่อนวันเสนอราคา');
 let url=String(raw.sourceURL||'').trim();if(url&&(!/^https?:\/\//i.test(url)||url.length>2048))throw Error('ลิงก์อ้างอิงต้องเป็น http(s) เท่านั้น');
 const evidence=raw.evidence&&typeof raw.evidence==='object'?{
  id:String(raw.evidence.id||''),name:String(raw.evidence.name||''),size:Number(raw.evidence.size)||0,
  sha256:String(raw.evidence.sha256||'').slice(0,64)
 }:null;
 if(!url&&!evidence?.id)throw Error('ต้องมีไฟล์หลักฐานหรือ URL อ้างอิงก่อนบันทึกราคา');
 const totalPrice=raw.taxTreatment==='vat-excluded'?round(price*1.07):round(price);
 const perUnit=round(totalPrice/qty);
 if(perUnit<=0)throw Error('ต้นทุนต่อหน่วยต่ำเกินกว่าความละเอียด 2 ตำแหน่ง');
 return {id:String(raw.id||''),supplier,documentNo,materialId:material.id,materialName:material.name,
  unit:raw.unit,packUnits:qty,packPrice:price,taxTreatment:raw.taxTreatment,
  grossPrice:totalPrice,landedUnitCost:perUnit,quoteDate,validUntil,
  sourceURL:url,evidence,notes:String(raw.notes||'').trim().slice(0,400),
  createdAt:now.toISOString(),updatedAt:now.toISOString(),status:'draft'};
}
function validationForApproval(record,dateISO){
 if(record.status!=='draft')throw Error('เฉพาะร่างที่ยังไม่อนุมัติ');
 if(record.validUntil&&record.validUntil<dateISO)throw Error('ใบเสนอราคา Supplier หมดอายุแล้ว');
 if(!record.documentNo||(!record.sourceURL&&!record.evidence?.id))throw Error('ยังไม่มีหลักฐานอ้างอิง');
 return true;
}
function getImpact(master,material,proposedCost,engine,builder,api){
 const rule=master?.rules?.[material.id],rates=master?.globalRates;
 if(!rule||!rates||!finite(proposedCost)||proposedCost<=0)return {ready:false,reason:'ยังไม่มี Master หรือต้นทุนที่ใช้เปรียบเทียบ'};
 // Do not invent a retail price when other production costs have not been recorded and vetted.
 if(!(rule.materialCost>0&&rule.printCost>0&&rule.marginPct>0))return {ready:false,reason:'Cost Master ยังไม่มีต้นทุนวัสดุ/ค่าพิมพ์จริงและ Margin ที่ตรวจแล้ว'};
 try{
  const base=api.effectiveRule(rule,rates,builder).rule;
  const changed=api.effectiveRule({...rule,materialCost:proposedCost},rates,builder).rule;
  const previousUnit=Number(rule.materialCost);
  const lines=[];
  for(const n of material.mode==='area_sqm'?[1,5,10]:[10,50,100]){
    const bc=builder.model(base),ac=builder.model(changed);
    const originalUnitPrice=builder.suggestedRate(base,n),recommendedUnitPrice=builder.suggestedRate(changed,n);
    const retailCurrent=Math.max(originalUnitPrice*n,base.minCharge);
    const afterCost=round(ac.fixed+ac.variable*n);
    const retailRecommended=Math.max(recommendedUnitPrice*n,changed.minCharge);
    const afterMargin=round((retailCurrent-afterCost)/retailCurrent*100);
    const companyBase=api.businessRule(base),companyNext=api.businessRule(changed);
    let b2b=null;
    if(companyBase&&companyNext){
      const oldSell=Math.max(builder.suggestedRate(companyBase,n)*n,companyBase.minCharge);
      const nextSell=Math.max(builder.suggestedRate(companyNext,n)*n,companyNext.minCharge);
      const newModel=builder.model(companyNext),newCost=round(newModel.fixed+newModel.variable*n);
      b2b={current:round(oldSell),recommended:round(nextSell),marginIfUnchanged:round((oldSell-newCost)/oldSell*100)};
    }
    lines.push({units:n,b2c:{current:round(retailCurrent),recommended:round(retailRecommended),marginIfUnchanged:afterMargin},b2b,
     newCost:afterCost,costIncrease:round(ac.variable*n+ac.fixed-(bc.variable*n+bc.fixed))});
  }
  return {ready:true,previousUnit,proposedUnit:proposedCost,deltaPct:round((proposedCost/previousUnit-1)*100),lines};
 }catch(e){return {ready:false,reason:'คำนวณไม่ได้: '+e.message};}
}
function audit(entry,action,by,details='',now=new Date()){
 return {id:entry.id,action,by:String(by||'').trim().slice(0,100),details:String(details).slice(0,200),at:now.toISOString()};
}
const api={VERSION,MATERIALS,unitFor,normalizeSupplierQuote,validationForApproval,getImpact,audit,round};
root.SCWORK_PRICING_CONTROL_CORE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
