/* V2.1.12: benefit navigation only. Rotating notice has been removed by request. */
(()=>{
  'use strict';
  const base=document.getElementById('scBenefits');
  if(!base)return;
  const list=document.getElementById('scBenefitList');
  const rating=document.getElementById('scBenefitRating');
  const labels=base.querySelectorAll('[data-scb-label]');
  const words={
    th:{price:'ราคามาตรฐาน',design:'บริการออกแบบ',shipping:'จัดส่งรวดเร็วและตรงเวลา',credit:'มีการชำระแบบเครดิตเทอม',group:'จุดเด่นบริการ SCWork',count:'ความคิดเห็น'},
    en:{price:'Standard pricing',design:'Design services',shipping:'Fast, on-time delivery',credit:'Credit terms available',group:'SCWork benefits',count:'reviews'}
  };
  function update(){
    const locale=document.documentElement.lang.toLowerCase().startsWith('th')?'th':'en';
    const text=words[locale];
    base.setAttribute('aria-label',text.group);
    labels.forEach(node=>{
      const value=text[node.dataset.scbLabel];
      if(value)node.textContent=value;
      const link=node.closest('a[data-scb-page]');
      if(link){
        const before=link.getAttribute('href')||'';
        const after=before.replace(/([?&]lang=)(?:th|en)(?=&|#|$)/,'$1'+locale);
        if(after!==before)link.setAttribute('href',after);
      }
    });
    const conf=window.SCWORK_PUBLIC_BENEFITS||{};
    const score=conf.reviewScore,count=conf.reviewCount;
    const configured=Number.isFinite(score)&&score>=0&&score<=5&&Number.isSafeInteger(count)&&count>0;
    rating.hidden=!configured;
    list.classList.toggle('has-rating',configured);
    if(configured){
      document.getElementById('scBenefitScore').textContent=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(score)+' / 5';
      document.getElementById('scBenefitReviewCount').textContent=new Intl.NumberFormat(locale).format(count)+' '+text.count;
    }
  }
  window.addEventListener('scwork-site-updated',update);
  window.addEventListener('scwork:locale-applied',update);
  update();
})();
