/* Footer actions remain visible. Commercial badges appear only for configured channels. */
(()=>{
  'use strict';
  const doc=document;
  const base=doc.querySelector('.sc-footer-utility');
  if(!base)return;
  const get=id=>doc.getElementById(id);
  const words={
    th:{estimate:'เช็กราคา',steps:'วิธีสั่งงาน',paymentHelp:'สอบถามการชำระเงิน',contact:'ติดต่อ SCWork',transfer:'โอนผ่านธนาคาร',shortcuts:'ทางลัด SCWork',payments:'ช่องทางชำระเงินที่รับ'},
    en:{estimate:'Price estimate',steps:'How to order',paymentHelp:'Payment enquiries',contact:'Contact SCWork',transfer:'Bank transfer',shortcuts:'SCWork shortcuts',payments:'Accepted payment methods'}
  };
  const methods=base.querySelectorAll('[data-footer-payment]');
  const dbd=get('scFooterDbd');
  const mark=get('scFooterDbdMark');
  mark.addEventListener('error',()=>{dbd.hidden=true;});
  function certificate(value){
    try {
      const u=new URL(value);
      return u.protocol==='https:'&&/^(?:[a-z0-9-]+\.)*dbd\.go\.th$/i.test(u.hostname)&&!u.port&&!u.username&&!u.password&&u.pathname!=='/'?u.href:'';
    }catch{return '';}
  }
  function render(){
    const t=doc.documentElement.lang==='th'?words.th:words.en;
    base.querySelectorAll('[data-footer-copy]').forEach(node=>{node.textContent=t[node.dataset.footerCopy]||node.textContent;});
    get('scFooterShortcuts').setAttribute('aria-label',t.shortcuts);
    const conf=window.SCWORK_PUBLIC_FOOTER||{};
    const available=new Set(Array.isArray(conf.paymentMethods)?conf.paymentMethods:[]);
    let hasMethod=false;
    methods.forEach(chip=>{chip.hidden=!available.has(chip.dataset.footerPayment);hasMethod||=!chip.hidden;});
    const methodGroup=get('scFooterPayments');
    methodGroup.hidden=!hasMethod;
    methodGroup.setAttribute('aria-label',t.payments);
    const official=certificate(conf.dbdCertificateUrl);
    const asset=String(conf.dbdBadgeAsset||'').trim();
    if(!official||!/^\.\/assets\/icons\/payments\/[a-z0-9_-]+\.(svg|webp|png)$/i.test(asset)){
      dbd.hidden=true;dbd.removeAttribute('href');mark.removeAttribute('src');
      return;
    }
    dbd.href=official;
    if(mark.getAttribute('src')!==asset){dbd.hidden=false;mark.src=asset;}
  }
  window.addEventListener('scwork-site-updated',render);
  window.addEventListener('scwork:locale-applied',render);
  render();
})();
