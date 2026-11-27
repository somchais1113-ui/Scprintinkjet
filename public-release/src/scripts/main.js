(() => {
  'use strict';
  let site=window.PROCLEANING_SITE;
  const i18n=window.PROCLEANING_I18N;
  if(!i18n){console.error('Missing i18n module');return;}
  let language=i18n.initial(site),activeSite=null;
  const config=window.PROCLEANING_CONFIG,ui=window.PROCLEANING_UI;
  const byId=id=>document.getElementById(id);
  let visibleBlogCount=3;
  let serviceTransitionLocked=false;
  let serviceTransitionEpoch=0;
  let serviceTransitionTimer=null;
  let outgoingServiceLayer=null;
  let serviceOffset=0,billing='monthly',heroIndex=0,heroTimer=null;
  if(!site||!config||!ui){console.error('Missing data/site-data.js or scripts');return;}
  function fallbackImages(scope=document){scope.querySelectorAll('img[data-fallback]').forEach(img=>{
    if(img.dataset.fallbackBound)return;
    img.dataset.fallbackBound='yes';
    img.addEventListener('error',()=>{if(!img.src.endsWith('placeholder.svg'))img.src=img.dataset.fallback;});
  });}

  // Cinematic story rail (V2.1.20): four original service photos with
  // coordinated visual and copy transitions. Keeps the standard site editor
  // text for slide 01 and its image overrides for all four photos.
  function initHeroCarousel(){
    const hero=document.querySelector('.hero--cinematic');
    if(!hero)return;
    const slides=[...hero.querySelectorAll('.hero__slide')];
    const dots=[...hero.querySelectorAll('[data-hero-dot]')];
    const prev=byId('scCinematicPrev');
    const next=byId('scCinematicNext');
    const playPause=byId('scCinematicPause');
    const count=byId('scCinematicCount');
    const scroll=byId('scCinematicScroll');
    const story=byId('scCinematicStory');
    const title=byId('hero-title');
    const eyebrow=hero.querySelector('.hero__eyebrow');
    const desc=hero.querySelector('.hero__description');
    if(!slides.length||!dots.length||!story||!prev||!next||!playPause)return;
    const total=slides.length;
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let isHovered=false,isFocusWithin=false,manualPause=false,isVisible=true,isTouching=false;
    let isSwitching=false,copyTimer=null;
    const duration=7400;
    // Keep the outgoing image slowly zooming until opacity crossfade completes.
    const exitTimers=new Map();
    const photoFadeDuration=880;

    function locale(){return document.documentElement.lang||'en';}
    function storyField(slide,field,language){
      const key=field+language[0].toUpperCase()+language.slice(1);
      return slide.dataset[key]||slide.dataset[field+'En']||'';
    }
    function setHeroCopy(){
      const current=slides[heroIndex];
      const language=locale();
      const first=current.dataset.heroStory==='inkjet';
      const branding=current.dataset.heroStory==='branding';
      hero.dataset.activeStory=branding?'branding':'original';
      const brandCta=byId('scBrandHeroCta');
      if(brandCta)brandCta.textContent=language==='th'?'ดูแพ็กเกจออกแบบ':'Explore design packages';
      const extendedLocale=language!=='th'&&language!=='en';
      const siteHero=activeSite?.hero||{};
      const defaultEyebrow=language==='th'?'SCWORK / งานพิมพ์สติกเกอร์ Inkjet':'SCWORK / INKJET STICKER PRINTING';
      eyebrow.textContent=(first||(!branding&&extendedLocale)) ? (siteHero.eyebrow||(language==='th'?'SCWORK / งานพิมพ์สติกเกอร์ Inkjet':'SCWORK / INKJET PRINT PRODUCTION')) : (storyField(current,'label',language)||defaultEyebrow);
      title.textContent=(first||(!branding&&extendedLocale)) ? (siteHero.title||storyField(current,'title',language)||'Stickers that make your brand stand out') : storyField(current,'title',language);
      desc.textContent=(first||(!branding&&extendedLocale)) ? (siteHero.description||storyField(current,'desc',language)||'Custom sticker production with practical design and materials') : storyField(current,'desc',language);
      const format=i=>String(i+1).padStart(2,'0');
      if(count){
        const strong=count.querySelector('strong'); if(strong)strong.textContent=format(heroIndex);
        const suffix=count.querySelector('span'); if(suffix)suffix.textContent=' / '+String(total).padStart(2,'0');
        count.setAttribute('aria-label',language==='th'?`สไลด์ ${heroIndex+1} จาก ${total}`:`Slide ${heroIndex+1} of ${total}`);
      }
      dots.forEach((dot,i)=>{const active=i===heroIndex;dot.classList.toggle('is-active',active);dot.setAttribute('aria-pressed',String(active));dot.setAttribute('aria-label',language==='th'?`แสดงภาพที่ ${i+1}`:`Show image ${i+1}`);});
      scroll.querySelector('span').textContent=language==='th'?'เลื่อนดูบริการ':(extendedLocale?(activeSite?.navigation?.services||'Explore Services'):'SCROLL TO EXPLORE');
      scroll.setAttribute('aria-label',language==='th'?'เลื่อนไปดูบริการ':'Scroll down to services');
      prev.setAttribute('aria-label',language==='th'?'สไลด์ก่อนหน้า':'Previous slide');
      next.setAttribute('aria-label',language==='th'?'สไลด์ถัดไป':'Next slide');
      playPause.setAttribute('aria-label',manualPause?(language==='th'?'เล่นสไลด์ต่อ':'Resume slideshow'):(language==='th'?'หยุดสไลด์ชั่วคราว':'Pause slideshow'));
      playPause.setAttribute('aria-pressed',String(manualPause));
      playPause.classList.toggle('is-paused',manualPause);
    }
    function preloadNearby(){
      for(let n=1;n<=2;n++){
        const image=slides[(heroIndex+n)%total]?.querySelector('img');
        if(image && image.loading!=='eager') image.loading='eager';
      }
    }
    function activeExitTimer(i){return exitTimers.has(i);}
    function clearExitTimer(i){
      window.clearTimeout(exitTimers.get(i));
      exitTimers.delete(i);
    }
    function commitSlide(index){
      const previous=heroIndex;
      heroIndex=(index+total)%total;
      slides.forEach((slide,i)=>{
        const active=i===heroIndex;
        if(active){
          // A returning slide becomes foreground; cancel any pending exit.
          if(activeExitTimer(i))clearExitTimer(i);
          slide.classList.remove('is-exiting');
        } else if(i===previous && !reduceMotion?.matches){
          // Preserve the *current* image scale through the complete fade.
          // Other exiting slides retain their own timers during rapid navigation.
          if(activeExitTimer(i))clearExitTimer(i);
          slide.classList.add('is-exiting');
          exitTimers.set(i,window.setTimeout(()=>{
            slide.classList.remove('is-exiting');
            exitTimers.delete(i);
          },photoFadeDuration+50));
        }
        slide.classList.toggle('is-active',active);
        slide.setAttribute('aria-hidden',String(!active));
      });
      setHeroCopy();
      preloadNearby();
    }
    async function goTo(index){
      if(isSwitching)return;
      const target=(index+total)%total;
      if(target===heroIndex)return;
      isSwitching=true;
      const nextImg=slides[target]?.querySelector('img');
      if(nextImg && nextImg.loading!=='eager')nextImg.loading='eager';
      // Decode before starting: switching directly from 01 to 04 never flashes a blank frame.
      if(nextImg && !nextImg.complete && typeof nextImg.decode==='function'){
        try { await Promise.race([nextImg.decode(),new Promise(resolve=>window.setTimeout(resolve,1600))]); }
        catch { /* keep fallback image and text visible if the next photo fails */ }
      }
      // Copy starts fading out while the incoming photo crossfades over the old one.
      if(reduceMotion?.matches){commitSlide(target);isSwitching=false;return;}
      story.classList.add('sc-cinema__copy--leaving');
      if(copyTimer)window.clearTimeout(copyTimer);
      copyTimer=window.setTimeout(()=>{
        commitSlide(target);
        window.requestAnimationFrame(()=>story.classList.remove('sc-cinema__copy--leaving'));
        isSwitching=false;
      },190);
    }
    function stopTimer(){if(heroTimer){window.clearInterval(heroTimer);heroTimer=null;}}
    function restart(){
      stopTimer();
      if(document.hidden||!isVisible||manualPause||reduceMotion?.matches||isHovered||isFocusWithin||isTouching)return;
      heroTimer=window.setInterval(()=>goTo(heroIndex+1),duration);
    }
    function navigate(i){goTo(i);restart();}
    // V2.1.60: single-finger horizontal swipe, using the existing slide navigation.
    // Passive listeners leave vertical scrolling and pinch zoom to the browser.
    let swipeStart=null;
    function finishTouch(){swipeStart=null;isTouching=false;restart();}
    hero.addEventListener('touchstart',event=>{
      if(event.touches.length!==1){if(isTouching)finishTouch();return;}
      if(event.target.closest('a,button,input,textarea,select,[role="button"]'))return;
      const t=event.touches[0];
      swipeStart={id:t.identifier,x:t.clientX,y:t.clientY,vertical:false};
      isTouching=true;stopTimer();
    },{passive:true});
    hero.addEventListener('touchmove',event=>{
      if(!swipeStart)return;
      if(event.touches.length!==1){finishTouch();return;}
      const t=event.touches[0];
      if(t.identifier!==swipeStart.id)return;
      const dx=Math.abs(t.clientX-swipeStart.x),dy=Math.abs(t.clientY-swipeStart.y);
      if(dy>12&&dy>dx*1.2)swipeStart.vertical=true;
    },{passive:true});
    hero.addEventListener('touchend',event=>{
      if(!swipeStart)return;
      const t=Array.from(event.changedTouches).find(t=>t.identifier===swipeStart.id);
      if(!t)return;
      const dx=t.clientX-swipeStart.x,dy=t.clientY-swipeStart.y;
      const horizontal=!swipeStart.vertical&&event.touches.length===0&&Math.abs(dx)>=50&&Math.abs(dx)>Math.abs(dy)*1.5;
      finishTouch();
      if(horizontal)navigate(heroIndex+(dx<0?1:-1));
    },{passive:true});
    hero.addEventListener('touchcancel',()=>{if(isTouching)finishTouch();},{passive:true});
    prev.addEventListener('click',()=>navigate(heroIndex-1));
    next.addEventListener('click',()=>navigate(heroIndex+1));
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>navigate(i)));
    playPause.addEventListener('click',()=>{
      manualPause=!manualPause;
      setHeroCopy();
      restart();
    });
    hero.addEventListener('mouseenter',()=>{isHovered=true;restart();});
    hero.addEventListener('mouseleave',()=>{isHovered=false;restart();});
    hero.addEventListener('focusin',()=>{isFocusWithin=true;restart();});
    hero.addEventListener('focusout',event=>{
      if(!hero.contains(event.relatedTarget)){isFocusWithin=false;restart();}
    });
    hero.addEventListener('keydown',event=>{
      if(event.target.matches('input,textarea,select'))return;
      if(event.key==='ArrowRight'){event.preventDefault();navigate(heroIndex+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();navigate(heroIndex-1);}
    });
    document.addEventListener('visibilitychange',restart);
    reduceMotion?.addEventListener?.('change',restart);
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        isVisible=(entries[0]?.intersectionRatio||0)>.15;
        restart();
      },{threshold:[0,.15,.5]});
      observer.observe(hero);
    }
    // Site editor / translation draw() rewrites hero text; restore the current story after it.
    window.addEventListener('scwork-site-updated',()=>setHeroCopy());
    commitSlide(0);
    restart();
  }

  function getScrollTarget(hash){
    const map={
      '#home':'.hero',
      '#services':'#services-title',
      '#about':'#socialProofTitle',
      '#pricing':'#scBrandTitle',
      '#blog':'#blog-title',
      '#contact':'#contact-title',
      '#team':'#team-title'
    };
    return document.querySelector(map[hash]||hash);
  }

  function setupAnchorScrolling(){
    const links=[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href').length>1);
    links.forEach(link=>link.addEventListener('click',event=>{
      const href=link.getAttribute('href');
      const target=getScrollTarget(href);
      if(!target)return;
      event.preventDefault();
      const header=document.querySelector('.site-header');
      const headerHeight=(header&&getComputedStyle(header).position==='fixed')?header.offsetHeight:0;
      const extraGap=16;
      const top=window.pageYOffset+target.getBoundingClientRect().top-headerHeight-extraGap;
      window.scrollTo({top:Math.max(top,0),behavior:'smooth'});
      // Inline/file previews may disallow History API URL updates. Scrolling must still work.
      try { if(window.history?.pushState)window.history.pushState(null,'',href); } catch(_err) { /* no-op: scroll is independent of hash */ }
    }));
  }

  function renderServices(){
    const list=activeSite.services||[],grid=byId('servicesGrid');if(!list.length){grid.textContent=activeSite.labels?.emptyServices||'No services configured.';byId('serviceNext').disabled=true;return;}
    byId('serviceNext').disabled=list.length<2 || serviceTransitionLocked;
    const offset=serviceOffset%list.length;
    grid.innerHTML=list.slice(offset).concat(list.slice(0,offset)).map((s,i)=>ui.serviceCard(s,i)).join('');
    fallbackImages(grid);
  }
  // Cleanly abort a carousel transition when a locale/editor refresh replaces the cards.
  function resetServicesTransition(){
    serviceTransitionEpoch += 1;
    if(serviceTransitionTimer !== null){window.clearTimeout(serviceTransitionTimer);serviceTransitionTimer=null;}
    if(outgoingServiceLayer){outgoingServiceLayer.remove();outgoingServiceLayer=null;}
    const grid=byId('servicesGrid');
    const viewport=byId('servicesViewport');
    grid?.classList.remove('services__grid--incoming');
    viewport?.classList.remove('services__viewport--crossfade','services__viewport--active');
    viewport?.style.removeProperty('min-height');
    viewport?.removeAttribute('aria-busy');
    serviceTransitionLocked=false;
    const button=byId('serviceNext');
    if(button)button.disabled=(activeSite?.services||[]).length<2;
  }

  // Load upcoming card imagery first so a slow network cannot show blank cards mid-fade.
  function warmServicePhoto(src){
    return new Promise(resolve=>{
      if(!src){resolve();return;}
      const image=new Image();
      let done=false;
      const timer=window.setTimeout(finish,1000);
      function finish(){
        if(done)return;
        done=true;window.clearTimeout(timer);resolve();
      }
      image.onload=finish;image.onerror=finish;
      image.src=src;
      if(image.complete)finish();
    });
  }

  async function advanceServices(){
    const services=activeSite?.services||[];
    const grid=byId('servicesGrid'),viewport=byId('servicesViewport');
    const button=byId('serviceNext');
    if(serviceTransitionLocked||services.length<2||!grid||!viewport)return;

    const newOffset=(serviceOffset+1)%services.length;
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if(reduceMotion){
      serviceOffset=newOffset;renderServices();
      window.dispatchEvent(new Event('scwork:estimate-links-updated'));
      return;
    }

    serviceTransitionLocked=true;
    button.disabled=true;
    const epoch=++serviceTransitionEpoch;
    const nextOrder=services.slice(newOffset).concat(services.slice(0,newOffset));
    await Promise.all(nextOrder.slice(0,3).map(item=>warmServicePhoto(item.image)));
    if(epoch!==serviceTransitionEpoch)return;

    const oldHeight=grid.getBoundingClientRect().height;
    const outgoing=grid.cloneNode(true);
    outgoing.removeAttribute('id');
    outgoing.classList.add('services__grid--outgoing');
    outgoing.setAttribute('aria-hidden','true');
    outgoing.inert=true;
    outgoing.querySelectorAll('a,button').forEach(link=>link.setAttribute('tabindex','-1'));

    serviceOffset=newOffset;
    viewport.classList.add('services__viewport--crossfade');
    viewport.setAttribute('aria-busy','true');
    grid.classList.add('services__grid--incoming');
    renderServices();
    // The reveal observer normally handles these cards; make the transition independent of it.
    grid.querySelectorAll('.service-card').forEach(card=>card.classList.add('is-visible'));
    viewport.append(outgoing);
    outgoingServiceLayer=outgoing;
    viewport.style.minHeight=`${Math.max(oldHeight,grid.getBoundingClientRect().height)}px`;
    window.dispatchEvent(new Event('scwork:estimate-links-updated'));
    // Commit the zero-opacity start state before allowing the new cards to fade in.
    void grid.offsetWidth;

    window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>{
      if(epoch===serviceTransitionEpoch)viewport.classList.add('services__viewport--active');
    }));
    serviceTransitionTimer=window.setTimeout(()=>{
      if(epoch===serviceTransitionEpoch)resetServicesTransition();
    },740);
  }

  function renderPricing(){
    const list=activeSite.pricing||[];
    byId('pricingGrid').innerHTML=list.length?list.map(p=>ui.priceCard(p,billing,config.demoYearlyDiscount)).join(''):`<p>${ui.escape(activeSite.labels?.emptyPricing||'No packages configured.')}</p>`;
    byId('pricingNote').hidden=activeSite.settings?.priceMode!=='quote' && billing!=='yearly';
    document.querySelectorAll('[data-billing]').forEach(b=>{const active=b.dataset.billing===billing;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
  }
  function renderBlogs(){
    const blogs=activeSite.blogs||[];
    const grid=byId('blogGrid'),wrap=byId('blogMoreWrap'),button=byId('blogMoreButton');
    if(!grid||!wrap||!button)return;
    grid.innerHTML=blogs.slice(0,3).map((blog,index)=>ui.blogCard(blog,index,language)).join('');
    fallbackImages(grid);
    wrap.hidden=blogs.length<=3;
    const label=language==='th'?`ดูบทความทั้งหมด (${blogs.length})`:`Explore all articles (${blogs.length})`;
    const preview=new URLSearchParams(window.location.search).get('editorPreview')==='1';
    button.href=`./knowledge.html?lang=${encodeURIComponent(language)}${preview?'&editorPreview=1':''}`;
    button.innerHTML=ui.escape(label)+' <span aria-hidden="true">↗</span>';
    button.setAttribute('aria-label',label);
  }

  function draw(){
    resetServicesTransition();
    document.documentElement.lang=language;
    activeSite=i18n.resolve(site,language);
    window.PROCLEANING_SITE=activeSite;
    window.PROCLEANING_APPLY_SITE(activeSite,window.PROCLEANING_IMAGE_OVERRIDES||{});
    const thai=language==='th';
    const portfolioCopy=thai?{title:'จากโจทย์ของแบรนด์ สู่แนวทางที่ผลิตได้จริง',lead:'สำรวจกรณีตัวอย่างการออกแบบและการผลิต ตั้งแต่แนวคิดไปจนถึงรายละเอียดก่อนลงมือทำ',notice:'กรณีตัวอย่างและภาพประกอบจำลอง ไม่ใช่ผลงานลูกค้าที่ได้รับการยืนยัน'}:{title:'From brand challenges to practical production',lead:'Explore illustrative design and print projects, from concept to production planning.',notice:'Illustrative project studies, not verified client work.'};
    for(const [id,value] of Object.entries({scPortfolioTitle:portfolioCopy.title,scPortfolioLead:portfolioCopy.lead,scPortfolioNotice:portfolioCopy.notice})){const el=byId(id);if(el)el.textContent=value;}
    const portfolioLink=byId('scPortfolioViewAll');if(portfolioLink){portfolioLink.href=`./portfolio.html?lang=${encodeURIComponent(language)}`;portfolioLink.firstChild.textContent=thai?'ดูผลงานทั้งหมด ':'View all work ';}
    document.querySelectorAll('.sc-portfolio__grid figure[data-work]').forEach((figure,index)=>{const item=(window.SCWORK_PORTFOLIO_ITEMS||[]).find(x=>x.id===figure.dataset.work),a=figure.querySelector('a'),l=thai?'th':'en';if(!a||!item)return;const title=item.title[l];figure.querySelector('figcaption').textContent=title;figure.querySelector('.sc-work-fit').textContent=item.fit[l];const summary=figure.querySelector('.sc-project-summary');if(summary)summary.textContent=item.summary?.[l]||'';a.href=`./portfolio-detail.html?work=${encodeURIComponent(item.id)}&lang=${encodeURIComponent(language)}`;a.setAttribute('aria-label',title);const image=figure.querySelector('img:not(.sc-mock-brand img)');if(image){image.src=item.cover||item.image;image.alt=title;}});
    renderServices();
    byId('teamGrid').innerHTML=(activeSite.team||[]).map((p,i)=>ui.teamCard(p,i)).join('');
    const featureGrid=byId('featureGrid');
    if(featureGrid)featureGrid.innerHTML=(activeSite.features||[]).map(x=>`<div class="feature-pill">${ui.escape(x)}</div>`).join('');
    renderPricing();
    renderBlogs();
    const photos=activeSite.photos||{};
    const images={quoteMainImage:photos.quoteMain,quoteSmallImage:photos.quoteSmall,aboutMainImage:photos.aboutMain,aboutSmallImage:photos.aboutSmall};
    Object.entries(images).forEach(([id,url])=>{const el=byId(id);if(el)el.src=url||'./assets/images/placeholder.svg';});
    // Hero images remain replaceable in the Unified Image Manager preview.
    const overrides=window.PROCLEANING_IMAGE_OVERRIDES||{};
    document.querySelectorAll('.hero__slide img').forEach(img=>{
      const path=img.dataset.heroDefault||(img.dataset.heroDefault=img.getAttribute('src'));
      if(!path)return;
      const current=overrides[path.replace(/^\.\//,'')]||overrides[img.dataset.heroLegacy]||path;
      if(img.getAttribute('src')!==current)img.src=current;
    });
    const cn=activeSite.contact||{},labels=activeSite.labels||{};
    byId('contactMethods').innerHTML=[ui.contactMethod('phone',labels.contactCall||'Call Us',cn.officePhone||cn.phone||cn.mobilePhone||''),ui.contactMethod('email',labels.contactEmail||'Email Now',cn.email||''),ui.contactMethod('contact',labels.contactAddress||'Address',cn.address||'')].join('');
    byId('year').textContent=new Date().getFullYear();
    fallbackImages();
    window.dispatchEvent(new Event('scwork-site-updated'));
  }
  function useOverrides(original,overrides){
    const copy=JSON.parse(JSON.stringify(original));
    function walk(value){if(typeof value==='string')return overrides[value.replace(/^\.\//,'')]||value;
      if(Array.isArray(value))return value.map(walk);
      if(value&&typeof value==='object')for(const k of Object.keys(value))value[k]=walk(value[k]);
      return value;
    }
    return walk(copy);
  }
  function setLanguage(next,persist=true){
    if(!i18n.supported.includes(next))return;
    language=next;
    if(persist)i18n.persist(next);
    const selected=document.activeElement;

    draw();
    window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:language}}));
    if(selected?.matches?.('[data-language]'))selected.focus();
  }
  draw();
  initHeroCarousel();
  setupAnchorScrolling();
  document.querySelectorAll('[data-language]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.language)));
  window.addEventListener('scwork:locale-change',event=>setLanguage(event.detail?.code));
  byId('serviceNext').addEventListener('click',()=>{void advanceServices();});
  document.querySelectorAll('[data-billing]').forEach(btn=>btn.addEventListener('click',()=>{billing=btn.dataset.billing;renderPricing();}));
  const menu=byId('mainNav'),menuToggle=byId('menuToggle');
  menuToggle.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?(activeSite.labels?.closeNav||'Close navigation'):(activeSite.labels?.openNav||'Open navigation'));});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}});
  if(new URLSearchParams(window.location.search).get('editorPreview')==='1'){
    window.addEventListener('message',event=>{
      if(event.source!==window.parent)return;
      if(event.data?.kind==='PROCLEANING_PREVIEW_PING'){window.parent.postMessage({kind:'PROCLEANING_PREVIEW_READY'},'*');return;}
      if(event.data?.kind!=='PROCLEANING_PREVIEW')return;
      if(!event.data.site || typeof event.data.site!=='object')return;
      window.PROCLEANING_IMAGE_OVERRIDES=event.data.images||{};
      site=useOverrides(event.data.site,window.PROCLEANING_IMAGE_OVERRIDES);
      if(i18n.supported.includes(event.data.lang))language=event.data.lang;
      serviceOffset=0;draw();
    });
    window.parent.postMessage({kind:'PROCLEANING_PREVIEW_READY'},'*');
  }
})();
