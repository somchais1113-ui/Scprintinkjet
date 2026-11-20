/* Homepage benefits: bilingual labels, accessible rotating notices, optional configured ratings. */
(()=>{
  'use strict';
  const doc=document;
  const get=id=>doc.getElementById(id);
  const base=get('scBenefits');
  if(!base)return;
  const list=get('scBenefitList');
  const card=get('scBenefitRating');
  const prev=get('scBenefitPrev'),next=get('scBenefitNext'),message=get('scBenefitMessage');
  const notice=get('scBenefitNotice'),controls=get('scBenefitControls');
  const toggle=get('scBenefitToggle'),position=get('scBenefitPosition'),eyebrow=get('scBenefitEyebrow');
  const labels=base.querySelectorAll('[data-scb-label]');
  const sizing=[0,1,2].map(n=>get('scBenefitSize'+n));
  const copy={
    th:{
      group:'จุดเด่นบริการ SCWork',price:'ราคามาตรฐาน',design:'บริการออกแบบ',
      shipping:'จัดส่งรวดเร็วและตรงเวลา',credit:'มีการชำระแบบเครดิตเทอม',
      previous:'ข้อความก่อนหน้า',next:'ข้อความถัดไป',count:'ความคิดเห็น',
      updates:'อัปเดตบริการ',pause:'หยุดเลื่อนข้อความ',play:'เล่นข้อความอัตโนมัติ',
      delivery:'สอบถามกำหนดจัดส่งตามสเปกงานและพื้นที่ปลายทาง',
      designNotice:'มีไฟล์แล้วส่งให้เราช่วยตรวจ หรือปรึกษาทีมออกแบบก่อนเริ่มงาน',
      terms:'สอบถามเงื่อนไขเครดิตเทอมกับทีม SCWork'
    },
    en:{
      group:'SCWork benefits',price:'Standard pricing',design:'Design services',
      shipping:'Fast, on-time delivery',credit:'Credit terms available',
      previous:'Previous notice',next:'Next notice',count:'reviews',
      updates:'Service updates',pause:'Pause notices',play:'Play notices automatically',
      delivery:'Ask us about delivery times for your job and delivery area.',
      designNotice:'Send your artwork for a file check, or talk with our design team.',
      terms:'Ask the SCWork team about credit terms.'
    }
  };
  const language=()=>doc.documentElement.lang.toLowerCase().split('-')[0]==='th'?'th':'en';
  const clean=v=>typeof v==='string'?v.trim():'';
  const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const delay=6500;
  let index=0,timer=null,animation=null;
  let paused=false,hovered=false,focused=false,inView=true;
  const eligible=()=>!paused&&!hovered&&!focused&&inView&&!doc.hidden&&!motion?.matches;
  const double=n=>String(n).padStart(2,'0');

  function schedule(){
    if(timer!==null){window.clearTimeout(timer);timer=null;}
    const auto=eligible()&&typeof window.setTimeout==='function';
    message.setAttribute('aria-live',auto?'off':'polite');
    if(auto)timer=window.setTimeout(()=>{timer=null;advance(1);},delay);
  }
  function show(direction=0){
    const locale=language();
    const t=copy[locale],conf=window.SCWORK_PUBLIC_BENEFITS||{};
    const notices=[clean(locale==='th'?conf.deliveryNoticeTh:conf.deliveryNoticeEn)||t.delivery,t.designNotice,t.terms];
    index=(index+notices.length)%notices.length;
    sizing.forEach((node,n)=>{if(node.textContent!==notices[n])node.textContent=notices[n];});
    base.setAttribute('aria-label',t.group);
    labels.forEach(n=>{
      const label=t[n.dataset.scbLabel];
      if(label&&n.textContent!==label)n.textContent=label;
      const anchor=n.closest?.('a[data-scb-page]');
      if(anchor){
        const href=anchor.getAttribute('href');
        const localHref=href.replace(/([?&]lang=)(?:th|en)(?=&|#|$)/,'$1'+locale);
        if(localHref!==href)anchor.setAttribute('href',localHref);
      }
    });
    eyebrow.textContent=t.updates;
    prev.setAttribute('aria-label',t.previous);
    next.setAttribute('aria-label',t.next);
    toggle.setAttribute('aria-label',paused?t.play:t.pause);
    toggle.dataset.paused=String(paused);
    toggle.hidden=!!motion?.matches;
    controls.hidden=false;
    prev.hidden=false;
    next.hidden=false;
    position.textContent=double(index+1)+' / '+double(notices.length);
    if(message.textContent!==notices[index]){
      animation?.cancel();
      message.textContent=notices[index];
      if(direction&&!motion?.matches&&typeof message.animate==='function'){
        animation=message.animate(
          [{opacity:0,transform:'translateY('+(direction>0?7:-7)+'px)'},{opacity:1,transform:'translateY(0)'}],
          {duration:330,easing:'cubic-bezier(.2,.65,.3,1)'}
        );
      }
    }
    const score=conf.reviewScore,count=conf.reviewCount;
    const configured=Number.isFinite(score)&&score>=0&&score<=5&&Number.isSafeInteger(count)&&count>0;
    card.hidden=!configured;
    list.classList.toggle('has-rating',configured);
    if(configured){
      get('scBenefitScore').textContent=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(score)+' / 5';
      get('scBenefitReviewCount').textContent=new Intl.NumberFormat(locale).format(count)+' '+t.count;
    }
    schedule();
  }
  function advance(direction){index+=direction;show(direction);}
  prev.addEventListener('click',()=>advance(-1));
  next.addEventListener('click',()=>advance(1));
  toggle.addEventListener('click',()=>{paused=!paused;show();});
  notice.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;schedule();}});
  notice.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovered=false;schedule();}});
  notice.addEventListener('focusin',()=>{focused=true;schedule();});
  notice.addEventListener('focusout',e=>{if(!notice.contains(e.relatedTarget)){focused=false;schedule();}});
  doc.addEventListener('visibilitychange',schedule);
  if(typeof window.IntersectionObserver==='function'){
    new window.IntersectionObserver(([entry])=>{inView=!!entry?.isIntersecting;schedule();}).observe(notice);
  }
  motion?.addEventListener?.('change',()=>{animation?.cancel();show();});
  window.addEventListener('scwork-site-updated',()=>show());
  window.addEventListener('scwork:locale-applied',()=>show());
  show();
})();
