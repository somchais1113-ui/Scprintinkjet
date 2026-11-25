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

/* V2.1.54 — card-to-comparison navigation */
(()=>{function openGroup(hash){const el=document.getElementById(hash.replace(/^#/,''));if(el?.matches('details.sc-design-group'))el.open=true;}document.addEventListener('click',e=>{const a=e.target.closest('a[data-sc-design-open]');if(a)openGroup(a.hash);});window.addEventListener('hashchange',()=>openGroup(location.hash));openGroup(location.hash);})();

(()=>{const brief=document.getElementById('scDesignBrief'),select=document.getElementById('scDesignPackage'),details=document.getElementById('scDesignDetails'),copy=document.getElementById('scDesignCopy'),status=document.getElementById('scDesignStatus');if(!brief||!select||!details||!copy)return;document.addEventListener('click',e=>{const a=e.target.closest('[data-sc-design-pick]');if(!a)return;select.value=a.dataset.scDesignPick;brief.open=true;status.textContent='';});copy.addEventListener('click',async()=>{const th=document.documentElement.lang==='th';const message='SCWork Design Brief\nPackage: '+select.selectedOptions[0].textContent+'\nProject details: '+details.value.trim();try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(message);}else{const t=document.createElement('textarea');t.value=message;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw Error('copy');}status.textContent=th?'คัดลอกบรีฟแล้ว':'Brief copied';}catch{status.textContent=th?'คัดลอกอัตโนมัติไม่ได้ กรุณาคัดลอกข้อความด้านล่าง':'Automatic copy unavailable. Copy the text below.';const t=document.createElement('textarea');t.readOnly=true;t.value=message;status.append(t);t.select();}});})();
