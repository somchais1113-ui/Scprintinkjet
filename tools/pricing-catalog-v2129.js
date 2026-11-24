/* PRIVATE: adapt the historic demo catalog to the six customer-facing sticker material IDs.
   Demo material prices are reference-only. Only approved cost-derived rates may be exported. */
(() => {
 'use strict';
 const legacy=window.SCWORK_PRICING_DEMO;
 const sticker=legacy?.categories?.find(c=>c.id==='sticker');
 const signage=legacy?.categories?.find(c=>c.id==='signage');
 const vinyl=signage?.materials?.find(m=>m.id==='vinyl-banner');
 if(!sticker||!vinyl) return;
 const materials=[...sticker.materials.filter(m=>m.id!=='pp-silver'),{
   ...vinyl,description:'ไวนิลป้าย/แบนเนอร์ไม่มีกาว — ราคาต้องอนุมัติจากต้นทุนจริง',
   addons:[...(vinyl.addons||[])]
 }];
 const expected=['paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner'];
 if(materials.length!==6||expected.some(id=>!materials.some(m=>m.id===id)))throw Error('BAD_MATERIAL_MAPPING');
 window.SCWORK_PRIVATE_COST_CATALOG={...legacy,categories:[{...sticker,materials}]};
})();
