/* SCWORK V1.7.4 — one quote route across the storefront. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  function apply(){
    const lang=document.documentElement.lang||'th', th=lang==='th';
    const extra=window.SCWORK_EXTRA_LOCALES?.[lang];
    const quote=th?'เช็กราคาเบื้องต้น':extra?.navigation?.quote||'Check estimated price';
    const advice=th?'ให้ทีมช่วยแนะนำ':extra?.headings?.adviceButton||'Ask for advice';
    const copy=th?{
      quoteEntryKicker:'ขอราคางานสติกเกอร์','quote-entry-title':'เตรียมสเปกก่อนสั่งพิมพ์',
      quoteEntryText:'เลือกวัสดุ ขนาด และจำนวน แล้วส่งสเปกให้ SCWORK ทาง LINE',
      contactLead:'บอกเราว่าจะใช้สติกเกอร์กับงานอะไร ทีม SCWORK ช่วยแนะนำวัสดุ ขนาด และงานหลังพิมพ์ได้',
      'pc-quote-eyebrow':'ปรึกษางานสติกเกอร์','pc-unified-title':'ยังไม่แน่ใจว่าจะเริ่มตรงไหน?',
      'pc-unified-text':'บอกเท่าที่ทราบได้เลย ไม่ต้องมีไฟล์พร้อมพิมพ์หรือกรอกสเปกให้ครบ',
      'pc-unified-mode':'ส่งไฟล์ใน LINE ภายหลัง หรือแนบลิงก์ไฟล์ได้'
    }:{
      quoteEntryKicker:'STICKER QUOTATION','quote-entry-title':extra?.headings?.quoteTitle||'Plan your sticker order',
      quoteEntryText:extra?.headings?.quoteDescription||'Choose size, material and quantity, then send your specifications to SCWORK on LINE.',
      contactLead:extra?.headings?.contactDescription||'Tell us how you plan to use your stickers. We can help with material, size and finishing.',
      'pc-quote-eyebrow':'STICKER ADVICE','pc-unified-title':'Not sure where to start?',
      'pc-unified-text':'Share what you know so far. You do not need a finished design or complete specifications.',
      'pc-unified-mode':'Send artwork later in LINE or share a link.'
    };
    for(const [id,value] of Object.entries(copy))if($(id))$(id).textContent=value;
    document.querySelectorAll('a[href*="smart-quote.html"]').forEach(a=>{
      const url=new URL(a.getAttribute('href'),location.href);
      if(!url.pathname.endsWith('/smart-quote.html'))return;
      url.searchParams.set('lang',lang);
      a.setAttribute('href','./smart-quote.html'+url.search+url.hash);
      if(a.id==='footerContactCard')return;
      a.textContent=a.hasAttribute('data-quote-help')?advice:quote;
    });
  }
  window.addEventListener('scwork-site-updated',apply);
  window.addEventListener('scwork:locale-applied',apply);
  document.addEventListener('DOMContentLoaded',apply);
  apply();
})();
