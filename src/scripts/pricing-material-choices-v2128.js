/* Six material choices in pricing section, with bilingual labels and deep links. */
(()=>{
 'use strict';
 function paint(){
   const root=document.getElementById('scPricingMaterials');if(!root)return;
   const supported=window.PROCLEANING_I18N?.supported||['th','en'];
   const lang=supported.includes(document.documentElement.lang)?document.documentElement.lang:'en';
   const th=lang==='th';
   root.querySelectorAll('[data-price-mat-th]').forEach(el=>el.textContent=el.dataset[th?'priceMatTh':'priceMatEn']);
   root.querySelectorAll('a[href*="smart-quote.html"]').forEach(a=>{
     const u=new URL(a.getAttribute('href'),document.baseURI||location.href);u.searchParams.set('lang',lang);
     a.setAttribute('href','./smart-quote.html'+u.search);
   });
 }
 window.addEventListener('scwork:locale-applied',paint);
 window.addEventListener('scwork-site-updated',paint);
 document.addEventListener('DOMContentLoaded',paint);
 paint();
})();
