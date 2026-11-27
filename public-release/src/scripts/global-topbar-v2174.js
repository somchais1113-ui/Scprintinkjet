/* Shared storefront announcement: preserve existing home contact slots. */
(function(){
 'use strict';
 const root=document.documentElement,bar=document.getElementById('topContactBar'),label=document.getElementById('topBenefitText'),slot=bar?.closest('.sc-global-topbar-slot');
 if(!bar||!label||!slot)return;
 const header=document.querySelector('body > header.site-header, body > header.article-header, body > header.benefit-header, body > header.ab-header, body > header.p-header, body > header.q-top, body > header.header');
 const copy={th:'สั่งผลิตสติกเกอร์ออนไลน์ · ทดลองคำนวณราคา · รับผลิตตามสเปก',en:'Online sticker printing · Quote calculator · Custom production'};
 function locale(){const lang=(root.lang||'th').toLowerCase().split('-')[0];if(copy[lang]){if(label.textContent!==copy[lang])label.textContent=copy[lang];}else if(!bar.querySelector('#topContactActions'))label.textContent=copy.en;}
 let frame=0,lastH=-1,lastHeader=-1;
 function measure(){
  frame=0;
  const h=Math.ceil(bar.getBoundingClientRect().height);
  if(h!==lastH){root.style.setProperty('--sc-global-top-h',h+'px');lastH=h;}
  const pinned=header&&['sticky','fixed'].includes(getComputedStyle(header).position);
  if(header)header.toggleAttribute('data-sc-global-header',Boolean(pinned));
  const hh=pinned?Math.ceil(header.getBoundingClientRect().height):0;
  if(hh!==lastHeader){root.style.setProperty('--sc-global-header-h',hh+'px');lastHeader=hh;}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 locale();measure();root.setAttribute('data-sc-global-top','ready');measure();
 if('ResizeObserver'in window){const observer=new ResizeObserver(schedule);observer.observe(bar);if(header)observer.observe(header);}
 new MutationObserver(()=>{locale();schedule();}).observe(root,{attributes:true,attributeFilter:['lang']});
 if(header)new MutationObserver(schedule).observe(header,{attributes:true,attributeFilter:['class','style']});
 for(const ev of ['scwork:locale-applied','scwork-site-updated'])window.addEventListener(ev,()=>{locale();schedule();});
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('pageshow',schedule);
 document.fonts?.ready?.then(schedule);
})();
