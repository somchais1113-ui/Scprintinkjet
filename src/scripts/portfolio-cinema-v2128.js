/* SCWork V2.1.28 — Cinematic Portfolio Banner: four standalone photos, 7.4s autoplay,
   880ms crossfade and slow zoom-in; reduced-motion and keyboard accessible. */
(()=>{
  'use strict';
  const root=document.getElementById('portfolioCinema');if(!root)return;
  const slides=[...root.querySelectorAll('[data-portfolio-slide]')],dots=[...root.querySelectorAll('[data-cinema-dot]')];
  const prev=document.getElementById('portfolioCinemaPrev'),next=document.getElementById('portfolioCinemaNext'),pause=document.getElementById('portfolioCinemaPause');
  const heading=document.getElementById('portfolioTitle'),intro=document.getElementById('portfolioIntroduction'),eyebrow=document.getElementById('portfolioEyebrow');
  const crumb=document.getElementById('portfolioBreadcrumb'),cta=document.getElementById('portfolioCinemaCta'),counter=document.getElementById('portfolioCinemaCount');
  if(slides.length!==4||!prev||!next||!pause)return;
  const words={
    th:[
      {label:'SCWORK / PRODUCT LABELS',title:'ฉลากสินค้าคุณภาพ พร้อมผลิต',text:'ตั้งแต่ตรวจไฟล์และเลือกวัสดุ ไปจนถึงพิมพ์และตรวจฉลากให้เหมาะกับบรรจุภัณฑ์'},
      {label:'SCWORK / DIE-CUT STICKERS',title:'สติกเกอร์ไดคัท ตามรูปทรง',text:'สร้างชิ้นงานเฉพาะตัวด้วยการพิมพ์สี ตรวจแนวตัด และเก็บรายละเอียดก่อนส่งมอบ'},
      {label:'SCWORK / RETAIL GRAPHICS',title:'กราฟิกหน้าร้านและงานขนาดใหญ่',text:'เตรียมขนาด วัสดุ และงานติดตั้งให้เหมาะกับกระจก ผนัง หรือพื้นที่สื่อสารแบรนด์'},
      {label:'SCWORK / PRINT & QC',title:'ใส่ใจคุณภาพในทุกขั้นตอน',text:'ตรวจสี งานพิมพ์ วัสดุ และความเรียบร้อยของชิ้นงาน เพื่อเตรียมพร้อมก่อนส่งมอบ'}
    ],
    en:[
      {label:'SCWORK / PRODUCT LABELS',title:'Labels ready for production',text:'Review artwork, select the right substrate, print and check labels for the intended package.'},
      {label:'SCWORK / DIE-CUT STICKERS',title:'Custom-shaped die-cut stickers',text:'Printed shapes, cutting paths and finishing details tailored to each application.'},
      {label:'SCWORK / RETAIL GRAPHICS',title:'Retail & large-format graphics',text:'Plan dimensions, stock and installation for windows, walls and branded spaces.'},
      {label:'SCWORK / PRINT & QC',title:'Quality at each production stage',text:'Check colour, printing, materials and finishing before the work is prepared for delivery.'}
    ]
  };
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let index=0,manualPause=false,hover=false,focusWithin=false,visible=true,timer=null;
  const exits=new Map();
  function lang(){return document.documentElement.lang==='th'?'th':'en';}
  function copy(){
    const th=lang()==='th',story=words[lang()][index];
    heading.textContent=story.title;intro.textContent=story.text;eyebrow.textContent=story.label;
    crumb.textContent=th?'หน้าแรก / ผลงาน':'Home / Portfolio';cta.textContent=th?'ดูผลงานทั้งหมด':'Explore all work';
    counter.querySelector('strong').textContent=String(index+1).padStart(2,'0');
    counter.setAttribute('aria-label',th?`สไลด์ ${index+1} จาก 4`:`Slide ${index+1} of 4`);
    dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===index);dot.setAttribute('aria-pressed',String(i===index));dot.setAttribute('aria-label',th?`สไลด์ ${i+1}`:`Slide ${i+1}`);});
    prev.setAttribute('aria-label',th?'ภาพก่อนหน้า':'Previous slide');next.setAttribute('aria-label',th?'ภาพถัดไป':'Next slide');
    pause.setAttribute('aria-label',manualPause?(th?'เล่นสไลด์ต่อ':'Resume slideshow'):(th?'หยุดเล่นสไลด์':'Pause slideshow'));
    pause.setAttribute('aria-pressed',String(manualPause));pause.classList.toggle('is-paused',manualPause);
    root.setAttribute('aria-label',th?'ภาพตัวอย่างงานและกระบวนการผลิต 4 หมวด':'Four work and production examples');
  }
  function show(n){
    const outgoing=index;index=(n+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      if(exits.has(i)){clearTimeout(exits.get(i));exits.delete(i)}
      slide.classList.toggle('is-active',i===index);
      if(i===index){slide.classList.remove('is-exiting');slide.querySelector('img').loading='eager';}
      else if(i===outgoing&&!reduced?.matches){
        slide.classList.add('is-exiting');const id=window.setTimeout(()=>{slide.classList.remove('is-exiting');exits.delete(i)},950);exits.set(i,id);
      }else slide.classList.remove('is-exiting');
    });
    copy();
  }
  function stop(){if(timer!==null)window.clearInterval(timer);timer=null;}
  function restart(){stop();if(visible&&!document.hidden&&!manualPause&&!reduced?.matches&&!hover&&!focusWithin)timer=window.setInterval(()=>show(index+1),7400);}
  function navigate(n){show(n);restart();}
  prev.addEventListener('click',()=>navigate(index-1));next.addEventListener('click',()=>navigate(index+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>navigate(i)));
  pause.addEventListener('click',()=>{manualPause=!manualPause;copy();restart();});
  root.addEventListener('mouseenter',()=>{hover=true;restart();});root.addEventListener('mouseleave',()=>{hover=false;restart();});
  root.addEventListener('focusin',()=>{focusWithin=true;restart();});root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){focusWithin=false;restart();}});
  root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();navigate(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();navigate(index-1);}});
  document.addEventListener('visibilitychange',restart);reduced?.addEventListener?.('change',restart);
  window.addEventListener('scwork:locale-change',()=>queueMicrotask(copy));
  window.addEventListener('scwork:locale-applied',copy);
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=(entries[0]?.intersectionRatio||0)>.15;restart();},{threshold:[0,.15,.4]}).observe(root);}
  show(0);restart();
})();
