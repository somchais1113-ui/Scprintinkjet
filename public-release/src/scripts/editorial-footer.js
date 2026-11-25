/* V2.1.22: localized footer copy and verified LINE channel. */
(()=>{
  'use strict';
  const root=document.getElementById('siteFooter');
  if(!root)return;
  const byId=id=>document.getElementById(id);
  const safeLineUrl=()=>{
    const conf=window.SCWORK_PUBLIC_CONTACT||{};
    const site=window.PROCLEANING_SITE?.contact||{};
    const url=String(conf.lineUrl||site.lineUrl||'').trim();
    if(/^https:\/\/(?:line\.me|lin\.ee)\//i.test(url))return url;
    const lineId=String(conf.lineId||site.lineId||'').trim();
    if(/^@[a-z0-9_.-]{2,30}$/i.test(lineId))return 'https://line.me/R/ti/p/'+encodeURIComponent(lineId);
    return '';
  };
  function render(){
    const th=document.documentElement.lang==='th';
    root.querySelectorAll('[data-footer-th][data-footer-en]').forEach(el=>{
      el.textContent=th?el.dataset.footerTh:el.dataset.footerEn;
    });
    const cta=byId('footerConsultCta'),icon=byId('footerConsultLineIcon'),label=byId('footerConsultCtaLabel');
    const url=safeLineUrl();
    if(url){
      cta.href=url;
      cta.target='_blank';cta.rel='noopener noreferrer';
      label.textContent=th?'ปรึกษางานผ่าน LINE':'Discuss your project on LINE';
      icon.hidden=false;
    }else{
      cta.href='./smart-quote.html?mode=help&lang='+(th?'th':'en');
      cta.removeAttribute('target');cta.removeAttribute('rel');
      label.textContent=th?'ส่งรายละเอียดเพื่อปรึกษา':'Ask for project advice';
      icon.hidden=true;
    }
    root.querySelectorAll('a[data-footer-local]').forEach(a=>{
      const u=new URL(a.getAttribute('href'),'https://scwork.invalid/');u.searchParams.set('lang',th?'th':'en');
      a.setAttribute('href','./'+u.pathname.split('/').pop()+u.search+u.hash);
    });
  }
  window.addEventListener('scwork-site-updated',render);
  window.addEventListener('scwork:locale-applied',render);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);
  else render();
})();
