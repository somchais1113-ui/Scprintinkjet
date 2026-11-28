(() => {
  'use strict';
  const supported=['ar','my','zh','ru','nl','es','en','th','fr','vi','de','it','ja','ko'];
  function saved(){try{return localStorage.getItem('procleaning-language')}catch{return null}}
  const query=new URLSearchParams(location.search).get('lang');
  const isAbout=document.body.classList.contains('sc-about-page');
  function localizeHome(code){document.querySelectorAll('[data-sc-about-link]').forEach(a=>{a.href='./about.html?lang='+encodeURIComponent(supported.includes(code)?code:'en')})}
  if(!isAbout){localizeHome(document.documentElement.lang);window.addEventListener('scwork:locale-applied',e=>localizeHome(e.detail?.code));return}
  const requested=supported.includes(query)?query:supported.includes(saved())?saved():'th';
  const lang=requested==='th'?'th':'en';
  document.documentElement.lang=lang;
  if(lang==='en')document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset.en);
  document.querySelectorAll('[data-ab-local]').forEach(a=>{const u=new URL(a.getAttribute('href'),location.href);u.searchParams.set('lang',requested);a.href=u.pathname+u.search+u.hash});
  document.querySelector('.ab-language [hreflang="'+lang+'"]')?.setAttribute('aria-current','page');
  const menu=document.querySelector('.ab-menu'),nav=document.getElementById('ab-nav');
  menu.textContent=lang==='th'?'เมนู':'Menu';
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')}});
})();
/* V2.1.34 — About cinematic photographs. Match the homepage 7.4s / 880ms / 9s motion;
   headline remains constant. The shared 34-cinematic-hero.css owns the animation. */
(() => {
  'use strict';
  const hero=document.querySelector('.sc-about-page .ab-cinema');
  if(!hero)return;
  const slides=[...hero.querySelectorAll('.hero__slide')], dots=[...hero.querySelectorAll('[data-hero-dot]')];
  const prev=document.getElementById('abscCinematicPrev'), next=document.getElementById('abscCinematicNext'), pause=document.getElementById('abscCinematicPause'), count=document.getElementById('abscCinematicCount'), scroll=document.getElementById('abscCinematicScroll');
  if(slides.length<2||!prev||!next||!pause||!count||dots.length!==slides.length)return;
  const duration=7400, photoFadeDuration=880, reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,timer=null,exiting=new Map(),hover=false,focus=false,paused=false,visible=true,busy=false;
  const th=()=>document.documentElement.lang==='th';
  function update(){
    count.querySelector('strong').textContent=String(current+1).padStart(2,'0');
    count.setAttribute('aria-label',th()?`ภาพ ${current+1} จาก ${slides.length}`:`Slide ${current+1} of ${slides.length}`);
    dots.forEach((d,i)=>{d.classList.toggle('is-active',i===current);d.setAttribute('aria-pressed',String(i===current));d.setAttribute('aria-label',th()?`แสดงภาพที่ ${i+1}`:`Show image ${i+1}`)});
    prev.setAttribute('aria-label',th()?'ภาพก่อนหน้า':'Previous slide');
    next.setAttribute('aria-label',th()?'ภาพถัดไป':'Next slide');
    pause.classList.toggle('is-paused',paused);
    pause.setAttribute('aria-pressed',String(paused));
    pause.setAttribute('aria-label',paused?(th()?'เล่นภาพต่อ':'Resume slideshow'):(th()?'หยุดภาพชั่วคราว':'Pause slideshow'));
    scroll.querySelector('span').textContent=th()?'รู้จัก SCWork':'EXPLORE SCWORK';
  }
  function clearExit(i){if(exiting.has(i)){clearTimeout(exiting.get(i));exiting.delete(i)}}
  async function go(index){
    if(busy)return;
    const target=(index+slides.length)%slides.length;
    if(target===current)return;
    busy=true;
    try{
      const img=slides[target].querySelector('img');
      if(!img.complete&&img.decode)await Promise.race([img.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1600))]);
      if(!img.complete||!img.naturalWidth)return;
      const old=current;current=target;
      slides.forEach((slide,i)=>{
        if(i===current){clearExit(i);slide.classList.remove('is-exiting')}
        else if(i===old&&!reduce.matches){
          clearExit(i);slide.classList.add('is-exiting');
          exiting.set(i,setTimeout(()=>{slide.classList.remove('is-exiting');exiting.delete(i)},photoFadeDuration+50));
        }
        slide.classList.toggle('is-active',i===current);
        slide.setAttribute('aria-hidden',String(i!==current));
      });
      update();
    }finally{busy=false}
  }
  function restart(){
    if(timer!==null)clearInterval(timer);
    timer=null;
    if(!paused&&!hover&&!focus&&visible&&!document.hidden&&!reduce.matches)timer=setInterval(()=>go(current+1),duration);
  }
  function navigate(i){go(i);restart()}
  prev.addEventListener('click',()=>navigate(current-1));next.addEventListener('click',()=>navigate(current+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>navigate(i)));
  pause.addEventListener('click',()=>{paused=!paused;update();restart()});
  hero.addEventListener('mouseenter',()=>{hover=true;restart()});
  hero.addEventListener('mouseleave',()=>{hover=false;restart()});
  hero.addEventListener('focusin',()=>{focus=true;restart()});
  hero.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget)){focus=false;restart()}});
  hero.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();navigate(current+(e.key==='ArrowRight'?1:-1))}});
  document.addEventListener('visibilitychange',restart);
  reduce.addEventListener?.('change',restart);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=(entries[0]?.intersectionRatio||0)>.15;restart()},{threshold:[0,.15,.5]}).observe(hero);
  update();restart();
})();

/* V2.1.35 — section navigation, independent philosophy carousel, restrained reveal. */
(() => {
  if(!document.body.classList.contains('sc-about-page'))return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const links=[...document.querySelectorAll('.ab-jump a')];
  function mark(hash){links.forEach(a=>{const yes=a.hash===hash;a.classList.toggle('is-selected',yes);if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
  links.forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.hash);if(!target)return;e.preventDefault();history.pushState(null,'',a.hash);mark(a.hash);target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}));
  window.addEventListener('hashchange',()=>mark(location.hash));mark(location.hash);
  if('IntersectionObserver' in window){
    const sections=links.map(a=>document.querySelector(a.hash)).filter(Boolean);
    const io=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active)mark('#'+active.target.id)},{rootMargin:'-15% 0px -45% 0px',threshold:0});sections.forEach(s=>io.observe(s));
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');reveal.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('.ab-intro-copy,.ab-leadership,.ab-feature,.ab-expertise-row,.ab-process li,.ab-commit-copy').forEach((el,i)=>{el.classList.add('ab-reveal');el.style.setProperty('--ab-delay',`${(i%3)*70}ms`);reveal.observe(el)});
  }
  const g=document.querySelector('.ab-gallery');if(!g)return;
  const frames=[...g.querySelectorAll('[data-ab-frame]')],dots=[...g.querySelectorAll('[data-ab-gallery-dot]')],pause=g.querySelector('.ab-gallery-pause'),count=g.querySelector('.ab-gallery-count strong');
  let current=0,timer=null,exitTimer=null,paused=false,visible=false,hover=false,focus=false;
  const th=document.documentElement.lang==='th';
  function show(i){if(i===current)return;const old=current;current=i;clearTimeout(exitTimer);frames.forEach((f,j)=>{f.classList.toggle('is-exiting',j===old&&!reduce.matches);f.classList.toggle('is-active',j===i);f.setAttribute('aria-hidden',String(j!==i));});exitTimer=setTimeout(()=>frames.forEach(f=>f.classList.remove('is-exiting')),930);dots.forEach((d,j)=>d.setAttribute('aria-pressed',String(j===i)));count.textContent=String(i+1).padStart(2,'0');}
  function restart(){clearInterval(timer);if(!paused&&visible&&!hover&&!focus&&!document.hidden&&!reduce.matches)timer=setInterval(()=>show((current+1)%frames.length),7400)}
  dots.forEach((d,i)=>{d.setAttribute('aria-label',th?`แสดงภาพที่ ${i+1}`:`Show image ${i+1}`);d.addEventListener('click',()=>{show(i);restart()})});
  const prev=g.querySelector('.ab-gallery-prev'),next=g.querySelector('.ab-gallery-next');
  function navigateGallery(delta){show((current+delta+frames.length)%frames.length);restart()}
  if(prev){prev.setAttribute('aria-label',th?'ภาพก่อนหน้า':'Previous image');prev.addEventListener('click',()=>navigateGallery(-1))}
  if(next){next.setAttribute('aria-label',th?'ภาพถัดไป':'Next image');next.addEventListener('click',()=>navigateGallery(1))}
  g.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();navigateGallery(e.key==='ArrowRight'?1:-1)}});
  function pauseLabel(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?(th?'เล่นภาพต่อ':'Resume slideshow'):(th?'หยุดภาพชั่วคราว':'Pause slideshow'))}
  pause.addEventListener('click',()=>{paused=!paused;pauseLabel();restart()});pauseLabel();
  g.addEventListener('mouseenter',()=>{hover=true;restart()});g.addEventListener('mouseleave',()=>{hover=false;restart()});g.addEventListener('focusin',()=>{focus=true;restart()});g.addEventListener('focusout',e=>{if(!g.contains(e.relatedTarget)){focus=false;restart()}});
  document.addEventListener('visibilitychange',restart);reduce.addEventListener?.('change',restart);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart()},{threshold:.15}).observe(g);else{visible=true;restart()}
})();
