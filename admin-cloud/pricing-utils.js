/* Shared, testable Supplier unit-price normalization (not customer selling price). */
(function(root){'use strict';
const valid=new Set(['paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner']);
function supplierCost(data){
 if(!valid.has(data.materialId))throw Error('ไม่รองรับวัสดุนี้');
 const n=Number(data.packPrice),q=Number(data.packUnits),f=Number(data.freightCost||0);
 if(!Number.isFinite(n)||n<=0||n>1e12||!Number.isFinite(q)||q<=0||q>1e10||!Number.isFinite(f)||f<0||f>1e10)throw Error('ราคา หน่วย หรือค่าขนส่งไม่ถูกต้อง');
 if(!['vat-included','vat-excluded','no-vat'].includes(data.taxTreatment))throw Error('เลือกการคิด VAT ของ Supplier');
 const amount=(data.taxTreatment==='vat-excluded'?n*1.07:n)+f;
 const value=Math.round((amount/q+Number.EPSILON)*100)/100;
 if(value<=0)throw Error('ต้นทุนต่ำเกินกว่าระดับราคา 2 ตำแหน่ง');
 return value;
}
const api={supplierCost};root.SCWORK_CLOUD_PRICING=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
