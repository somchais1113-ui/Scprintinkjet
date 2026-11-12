/* SCWork v1.1 — public UI copy follows the same resolved locale as Website Manager. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const trigger=$('scLocaleTrigger'), menu=$('scLocaleMenu');
  function closeMenu(){if(menu)menu.hidden=true;if(trigger)trigger.setAttribute('aria-expanded','false');}
  function applyLocale(){
    const lang=document.documentElement.lang||'th';
    const site=window.PROCLEANING_SITE||{};
    const c=site.commerce||{};
    const set=(id,value)=>{const el=$(id);if(el&&value!==undefined)el.textContent=String(value);};
    set('scLocaleCurrent',lang.toUpperCase());
    set('scLocaleHint',c.languageHint);set('scLocaleNote',c.languageNote);
    set('topBenefitText',c.topBenefit);set('topPriceText',c.topEstimate);set('topInquiryText',c.topInquiry);
    set('scProcessEyebrow',c.processEyebrow);set('scProcessTitle',c.processTitle);set('scProcessCTA',(c.processCta||'Estimate price')+' ↗');
    set('scPriceLink',(c.pricingCta||'Estimate price')+' ↗');set('scPricingDisclaimer',c.pricingDisclaimer);
    const band=document.querySelector('.v24-rfq-band');
    if(band && lang!=='en' && lang!=='th'){
      const english=band.querySelectorAll('.v24-en');
      const overlay=window.SCWORK_EXTRA_LOCALES?.[lang]||{};
      const custom=[overlay.headings?.quoteTitle,overlay.headings?.quoteDescription,(overlay.navigation?.quote||'Request a quote')+' →'];
      english.forEach((node,i)=>{if(!node.dataset.originalEn)node.dataset.originalEn=node.textContent;if(custom[i])node.textContent=custom[i];});
    } else if(band && lang==='en'){band.querySelectorAll('.v24-en').forEach(node=>{if(node.dataset.originalEn)node.textContent=node.dataset.originalEn;});}
    const articles=[...document.querySelectorAll('#scProcessSteps article')];
    articles.forEach((article,i)=>{const entry=c.processSteps?.[i];if(!entry)return;const title=article.querySelector('h3'),desc=article.querySelector('p');if(title)title.textContent=entry.title;if(desc)desc.textContent=entry.text;});
    document.querySelectorAll('.sc-locale__choice').forEach(btn=>{const active=btn.dataset.language===lang;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
  }
  // v1.2 modal owns selection and focus. Main.js applies translated storefront state.
  // main.js resolves the locale on click. Main and this enhancement both observe the html lang.
  new MutationObserver(applyLocale).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('scwork-site-updated',applyLocale);
  // Some main draw() paths mutate the data without changing the language; the small delay catches initial render.
  applyLocale();
  // Never use contact details from reference screenshots. Only show verified SCWork channels.
  const contact=window.SCWORK_PUBLIC_CONTACT||{};
  if(contact.phone && /^[+\d() -]{6,25}$/.test(contact.phone)){
    const p=$('topPhone');p.href='tel:'+contact.phone.replace(/[^+\d]/g,'');p.textContent='☎ '+contact.phone;p.hidden=false;
  }
  if(contact.lineId && /^@[\w.\-]{2,30}$/.test(contact.lineId)){
    const l=$('topLine');l.textContent='LINE '+contact.lineId;
    l.href=contact.lineUrl&&/^https:\/\/line\.me\//.test(contact.lineUrl)?contact.lineUrl:'https://line.me/R/ti/p/'+encodeURIComponent(contact.lineId);
    l.hidden=false;
  }
})();
