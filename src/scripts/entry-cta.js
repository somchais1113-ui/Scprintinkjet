(() => {
  'use strict';
  const cfg=window.PROCLEANING_PUBLIC_CONFIG||{};
  const connected=cfg.mode==='connected' && !!cfg.supabaseUrl && !!cfg.turnstileSiteKey;
  function update(){
    const th=document.documentElement.lang==='th';
    const v=th?{
      title:'คำขอเดียว เลขอ้างอิงเดียว',text:'ใช้ฟอร์มขอใบเสนอราคาเพียงหน้าเดียว เมื่อเปิดระบบเชื่อมต่อจริง ข้อมูลจะบันทึกเข้าฐานข้อมูลโดยตรง และจัดคิวส่งอีเมลตอบรับให้อัตโนมัติ ไม่เปิดแอป Mail',cta:'เริ่มขอใบเสนอราคา →',demo:'ขณะนี้เป็นโหมดทดลอง ยังไม่รับข้อมูลลูกค้าจริงจนกว่าจะเชื่อม Backend'}:
      {title:'One request. One reference.',text:'Use one RFQ form. When connected, your details save directly to our system and the acknowledgement email is queued automatically—no Mail app.',cta:'Start a quotation request →',demo:'Demo mode only. Customer submissions require a connected backend.'};
    const extra=window.SCWORK_EXTRA_LOCALES?.[document.documentElement.lang];
    if(extra){v.title=extra.headings?.contactTitle||v.title;v.text=extra.headings?.contactDescription||v.text;v.cta=(extra.navigation?.quote||v.cta)+' →';v.demo=extra.commerce?.pricingDisclaimer||v.demo;}
    for(const [id,value] of [['pc-unified-title',v.title],['pc-unified-text',v.text],['pc-unified-cta',v.cta],['pc-unified-mode',connected?(th?'โหมดเชื่อมต่อ: ระบบ RFQ ออนไลน์':'Connected RFQ mode'):v.demo]]){
      const el=document.getElementById(id);if(el)el.textContent=value;
    }
  }
  update();document.addEventListener('DOMContentLoaded',update);window.addEventListener('scwork-site-updated',update);window.addEventListener('scwork:locale-applied',update);document.querySelectorAll('[data-language]').forEach(x=>x.addEventListener('click',()=>setTimeout(update,0)));
})();
