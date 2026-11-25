/* Six material choices in pricing section, with bilingual labels and deep links. */
(()=>{
 'use strict';
 function paint(){
   const root=document.getElementById('scPricingMaterials');if(!root)return;
   const supported=window.PROCLEANING_I18N?.supported||['th','en'];
   const lang=supported.includes(document.documentElement.lang)?document.documentElement.lang:'en';
   const th=lang==='th';
   root.querySelectorAll('[data-price-mat-th]').forEach(el=>el.textContent=el.dataset[th?'priceMatTh':'priceMatEn']);
   root.querySelectorAll('[data-price-mat-alt-th]').forEach(el=>el.setAttribute('alt',el.dataset[th?'priceMatAltTh':'priceMatAltEn']));
   root.querySelectorAll('a[data-price-link-preserve],a[href*="smart-quote.html"],a[href*="project-quote.html"],a[href*="design-services.html"]').forEach(a=>{
     const raw=a.getAttribute('href'); if(!raw) return;
     const u=new URL(raw,document.baseURI||location.href);
     u.searchParams.set('lang',lang);
     const local=(u.pathname.split('/').pop()||'');
     a.setAttribute('href','./'+local+u.search+(u.hash||''));
   });
 }
 window.addEventListener('scwork:locale-applied',paint);
 window.addEventListener('scwork-site-updated',paint);
 document.addEventListener('DOMContentLoaded',paint);
 paint();
})();
