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
  // Contact strip: business contacts only. NEVER import competitor numbers.
  // If a number is not configured, show a non-clickable setup hint instead of a false contact.
  // Website Manager values take priority; public-config.js can provide deploy-only fallback.
  const contactValue=(field)=>String(window.PROCLEANING_SITE?.contact?.[field]||window.SCWORK_PUBLIC_CONTACT?.[field]||'').trim();
  function safePhone(raw){
    const str=String(raw||'').trim();
    return /^[+\d() .-]{7,24}$/.test(str)&&str.replace(/\D/g,'').length>=8?str:'';
  }
  function contactNode(id,kind,value,url){
    const slot=$(id);if(!slot)return;
    const span=slot.querySelector('[data-contact-value]');
    slot.hidden=!(value&&url);
    if(!span)return;
    slot.classList.toggle('is-configured',Boolean(value));
    if(value&&url){
      const a=document.createElement('a');a.href=url;a.textContent=value;
      if(kind==='line'){a.target='_blank';a.rel='noopener noreferrer';}
      span.replaceChildren(a);
    } else {
      span.textContent=value||'—';
      slot.removeAttribute('title');
    }
  }
  function showContacts(){
    const lang=document.documentElement.lang;
    const isThai=lang==='th';
    const office=safePhone(contactValue('officePhone')||contactValue('phone'));
    const mobile=safePhone(contactValue('mobilePhone'));
    const rawLine=contactValue('lineId');
    const line=/^@[\w.-]{2,30}$/.test(rawLine)?rawLine:'';
    const rawUrl=contactValue('lineUrl');
    const lineUrl=/^https:\/\/(line\.me|lin\.ee)\//.test(rawUrl)?rawUrl:line?'https://line.me/R/ti/p/'+encodeURIComponent(line):'';
    const officeLabel=$('topOfficePhone')?.querySelector('[data-contact-label]');if(officeLabel)officeLabel.textContent=isThai?'สำนักงาน':'Office';
    const mobileLabel=$('topMobilePhone')?.querySelector('[data-contact-label]');if(mobileLabel)mobileLabel.textContent=isThai?'มือถือ':'Mobile';
    contactNode('topLine','line',line||(lineUrl?'LINE OA':''),lineUrl);
    contactNode('topOfficePhone','phone',office,office?'tel:'+office.replace(/[^+\d]/g,''):'');
    contactNode('topMobilePhone','phone',mobile,mobile?'tel:'+mobile.replace(/[^+\d]/g,''):'');
    const strip=$('topContactBar');
    if(strip)strip.dataset.contactReady=String(Boolean(office||mobile||line));
  }
  showContacts();
  new MutationObserver(showContacts).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('scwork-site-updated',showContacts);
})();
