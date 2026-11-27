/* SCWork 2.1.70 — Knowledge Hero. */
(function initHero(slides){
 'use strict';
 const root=document.getElementById('knowledgeHero');if(!root)return;
 const $=id=>document.getElementById(id),panels=[...root.querySelectorAll('[data-kh-slide]')],dots=[...root.querySelectorAll('[data-kh-dot]')],copy=$('knowledgeHeroCopy'),prev=$('knowledgeHeroPrev'),next=$('knowledgeHeroNext'),pause=$('knowledgeHeroPause'),controls=$('knowledgeHeroControls'),status=$('knowledgeHeroStatus');
 if(panels.length!==slides.length||dots.length!==slides.length||!prev||!next||!pause||!controls||!copy)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer=null,manualPause=false,hover=false,focus=false,visible=true,touch=null;
 const lang=()=>document.documentElement.lang==='th'?'th':'en';
 function render(announce=false){
   const l=lang(),th=l==='th',story=slides[index][l],count=String(index+1).padStart(2,'0');
   $('knowledgeHeroCrumb').textContent=th?'หน้าแรก / ความรู้งานพิมพ์':'Home / Print Knowledge';
   $('knowledgeEyebrow').textContent='SCWORK / '+story[0];
   $('knowledgeTitle').textContent=story[1];$('knowledgeIntro').textContent=story[2];
   $('knowledgeHeroCta').firstChild.nodeValue=(th?'สำรวจบทความทั้งหมด':'Explore all articles')+' ';
   $('knowledgeHeroCounter').querySelector('strong').textContent=count;
   $('knowledgeHeroCounter').setAttribute('aria-label',th?`สไลด์ ${index+1} จาก ${slides.length}`:`Slide ${index+1} of ${slides.length}`);
   root.setAttribute('aria-label',th?'ความรู้งานพิมพ์ 5 หัวข้อ':'Five print knowledge topics');
   $('knowledgeHeroDots').setAttribute('aria-label',th?'เลือกสไลด์':'Choose slide');
   prev.setAttribute('aria-label',th?'ภาพก่อนหน้า':'Previous slide');next.setAttribute('aria-label',th?'ภาพถัดไป':'Next slide');
   pause.setAttribute('aria-label',manualPause?(th?'เล่นสไลด์ต่อ':'Resume slideshow'):(th?'หยุดเล่นสไลด์':'Pause slideshow'));
   pause.setAttribute('aria-pressed',String(manualPause));pause.classList.toggle('is-paused',manualPause);
   pause.hidden=reduced.matches;
   dots.forEach((d,i)=>{d.classList.toggle('is-active',i===index);d.setAttribute('aria-pressed',String(i===index));d.setAttribute('aria-label',th?`สไลด์ ${i+1}: ${slides[i][l][1]}`:`Slide ${i+1}: ${slides[i][l][1]}`)});
   if(announce)status.textContent=story[1];
 }
 function show(n,announce=false){
   index=(n+slides.length)%slides.length;
   panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);if(i===index)p.querySelector('img').loading='eager';});
   render(announce);
   if(!reduced.matches&&copy.animate){copy.getAnimations?.().forEach(a=>a.cancel());copy.animate([{opacity:0.25,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'ease-out'});}
 }
 function stop(){if(timer!==null)window.clearInterval(timer);timer=null;}
 function restart(){stop();if(visible&&!document.hidden&&!manualPause&&!hover&&!focus&&!reduced.matches)timer=window.setInterval(()=>show(index+1),7400);}
 function navigate(n){show(n,true);restart();}
 prev.addEventListener('click',()=>navigate(index-1));next.addEventListener('click',()=>navigate(index+1));
 dots.forEach((d,i)=>d.addEventListener('click',()=>navigate(i)));
 pause.addEventListener('click',()=>{manualPause=!manualPause;render();restart();});
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;restart();}});
 root.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;restart();}});
 root.addEventListener('focusin',()=>{focus=true;restart();});
 root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){focus=false;restart();}});
 root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();navigate(index+(e.key==='ArrowRight'?1:-1));}});
 root.addEventListener('touchstart',e=>{if(e.touches.length===1&&!e.target.closest('button,a'))touch={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch=null;},{passive:true});
 root.addEventListener('touchend',e=>{if(!touch)return;const p=e.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y;touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(index+(dx<0?1:-1));},{passive:true});
 root.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 document.addEventListener('visibilitychange',restart);
 reduced.addEventListener?.('change',()=>{render();restart();});
 window.addEventListener('scwork:locale-applied',()=>render());
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=(entries[0]?.intersectionRatio||0)>.12;restart();},{threshold:[0,.12]}).observe(root);
 controls.hidden=false;render();restart();
})([
  {
    "img": "artwork-preflight.webp",
    "focus": "68% 48%",
    "th": [
      "PRINT KNOWLEDGE",
      "ความรู้งานพิมพ์สติกเกอร์",
      "เข้าใจวัสดุ การเตรียมไฟล์ และกระบวนการผลิต เพื่อเลือกแนวทางที่เหมาะกับงานของคุณ"
    ],
    "en": [
      "PRINT KNOWLEDGE",
      "Sticker Printing Knowledge",
      "Understand materials, artwork and production processes to choose the right approach for your project."
    ]
  },
  {
    "img": "sticker-material-guide.webp",
    "focus": "72% 50%",
    "th": [
      "MATERIALS & FINISHES",
      "เลือกวัสดุให้เหมาะกับงาน",
      "รู้จักความแตกต่างของกระดาษ ฟิล์ม และพื้นผิว เพื่อเลือกสติกเกอร์ให้เหมาะกับสภาพใช้งานจริง"
    ],
    "en": [
      "MATERIALS & FINISHES",
      "Choose the right material",
      "Understand paper, film and surface finishes to select a sticker for its intended application."
    ]
  },
  {
    "img": "photo-cold-bottle.webp",
    "focus": "76% 45%",
    "th": [
      "DURABILITY",
      "ฉลากที่เหมาะกับสภาพใช้งาน",
      "พิจารณาความชื้น อุณหภูมิ และการสัมผัส ก่อนตัดสินใจเลือกวัสดุและกาวสำหรับฉลากสินค้า"
    ],
    "en": [
      "DURABILITY",
      "Labels for real conditions",
      "Consider moisture, temperature and handling before choosing label materials and adhesives."
    ]
  },
  {
    "img": "photo-sheet-roll.webp",
    "focus": "75% 50%",
    "th": [
      "ARTWORK & PRODUCTION",
      "จากไฟล์ออกแบบสู่ชิ้นงานจริง",
      "ทำความเข้าใจการจัดวาง แนวตัด และรูปแบบส่งมอบ ทั้งสติกเกอร์แบบแผ่น แบบม้วน และชิ้นแยก"
    ],
    "en": [
      "ARTWORK & PRODUCTION",
      "From artwork to production",
      "Understand layout, cut paths and delivery formats for sheets, rolls and individual stickers."
    ]
  },
  {
    "img": "photo-outdoor-window.webp",
    "focus": "76% 50%",
    "th": [
      "REAL-WORLD APPLICATIONS",
      "ออกแบบให้ตอบโจทย์พื้นที่จริง",
      "วางแผนกราฟิกหน้าร้านและงานติดตั้ง โดยคำนึงถึงพื้นผิว ระยะมอง และสภาพแวดล้อม"
    ],
    "en": [
      "REAL-WORLD APPLICATIONS",
      "Design for real spaces",
      "Plan storefront graphics and installation around surfaces, viewing distances and environmental conditions."
    ]
  }
]);
