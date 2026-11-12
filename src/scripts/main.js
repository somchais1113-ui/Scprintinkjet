(() => {
  'use strict';
  let site=window.PROCLEANING_SITE;
  const i18n=window.PROCLEANING_I18N;
  if(!i18n){console.error('Missing i18n module');return;}
  let language=i18n.initial(site),activeSite=null;
  const config=window.PROCLEANING_CONFIG,ui=window.PROCLEANING_UI;
  const byId=id=>document.getElementById(id);
  let visibleBlogCount=3;
  let serviceOffset=0,testimonialIndex=0,billing='monthly',heroIndex=0,heroTimer=null;
  if(!site||!config||!ui){console.error('Missing data/site-data.js or scripts');return;}
  function fallbackImages(scope=document){scope.querySelectorAll('img[data-fallback]').forEach(img=>{
    if(img.dataset.fallbackBound)return;
    img.dataset.fallbackBound='yes';
    img.addEventListener('error',()=>{if(!img.src.endsWith('placeholder.svg'))img.src=img.dataset.fallback;});
  });}

  function initHeroCarousel(){
    const slides=[...document.querySelectorAll('.hero__slide')];
    const dots=[...document.querySelectorAll('[data-hero-dot]')];
    if(!slides.length||!dots.length)return;
    const total=slides.length;
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let isHovered=false;
    function renderHero(){
      heroIndex=((heroIndex%total)+total)%total;
      slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===heroIndex));
      dots.forEach((dot,i)=>{const active=i===heroIndex;dot.classList.toggle('is-active',active);dot.setAttribute('aria-pressed',String(active));});
    }
    function restart(){
      if(heroTimer)window.clearInterval(heroTimer);
      heroTimer=null;
      if(document.hidden || reduceMotion?.matches || isHovered)return;
      heroTimer=window.setInterval(()=>{heroIndex=(heroIndex+1)%total;renderHero();},6000);
    }
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>{heroIndex=i;renderHero();restart();}));
    const carousel=byId('heroCarousel');
    carousel?.addEventListener('mouseenter',()=>{isHovered=true;restart();});
    carousel?.addEventListener('mouseleave',()=>{isHovered=false;restart();});
    document.addEventListener('visibilitychange',restart);
    reduceMotion?.addEventListener?.('change',restart);
    renderHero();restart();
  }

  function getScrollTarget(hash){
    const map={
      '#home':'.hero',
      '#services':'#services-title',
      '#about':'#about-title',
      '#pricing':'#pricing-title',
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
    byId('serviceNext').disabled=list.length<2;
    const offset=serviceOffset%list.length;
    grid.innerHTML=list.slice(offset).concat(list.slice(0,offset)).map((s,i)=>ui.serviceCard(s,i)).join('');
    fallbackImages(grid);
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
    const amount=Math.min(visibleBlogCount,blogs.length);
    grid.innerHTML=blogs.slice(0,amount).map((blog,index)=>ui.blogCard(blog,index,language)).join('');
    fallbackImages(grid);
    wrap.hidden=blogs.length<=3;
    if(blogs.length<=3)return;
    const complete=amount===blogs.length;
    const labels=activeSite.labels||{};
    const text=complete?(labels.showLessArticles||(language==='th'?'แสดงน้อยลง':'Show fewer articles'))
      :(labels.viewMoreArticles||(language==='th'?'ดูบทความเพิ่มเติม':'View more articles'));
    button.innerHTML=ui.escape(text)+` <span aria-hidden="true">${complete?'↑':'↓'}</span>`;
    button.setAttribute('aria-label',text);
    button.setAttribute('aria-expanded',String(complete));
  }
  function renderTestimonial(){
    const list=activeSite.testimonials||[];const card=byId('testimonialCard');if(!list.length){card.textContent=activeSite.labels?.emptyTestimonials||'No testimonials configured.';return;}
    testimonialIndex=((testimonialIndex%list.length)+list.length)%list.length;
    card.innerHTML=ui.testimonial(list[testimonialIndex]);fallbackImages(card);
  }
  function draw(){
    document.documentElement.lang=language;
    activeSite=i18n.resolve(site,language);
    window.PROCLEANING_SITE=activeSite;
    window.PROCLEANING_APPLY_SITE(activeSite,window.PROCLEANING_IMAGE_OVERRIDES||{});
    renderServices();
    byId('teamGrid').innerHTML=(activeSite.team||[]).map((p,i)=>ui.teamCard(p,i)).join('');
    byId('featureGrid').innerHTML=(activeSite.features||[]).map(x=>`<div class="feature-pill">${ui.escape(x)}</div>`).join('');
    renderPricing();renderTestimonial();
    renderBlogs();
    const photos=activeSite.photos||{};
    const images={quoteMainImage:photos.quoteMain,quoteSmallImage:photos.quoteSmall,aboutMainImage:photos.aboutMain,aboutSmallImage:photos.aboutSmall};
    Object.entries(images).forEach(([id,url])=>{const el=byId(id);if(el)el.src=url||'./assets/images/placeholder.svg';});
    // Hero images remain replaceable in the Unified Image Manager preview.
    const overrides=window.PROCLEANING_IMAGE_OVERRIDES||{};
    const heroSlideImages=[
      './assets/images/hero/hero-scene.webp',
      './assets/images/hero/slide-02-labels.webp',
      './assets/images/hero/slide-03-cut.webp',
      './assets/images/hero/slide-04-branding.webp'
    ];
    document.querySelectorAll('.hero__slide img').forEach((img,index)=>{
      const path=heroSlideImages[index];
      if(path)img.src=overrides[path.replace(/^\.\//,'')]||path;
    });
    const cn=activeSite.contact||{},labels=activeSite.labels||{};
    byId('contactMethods').innerHTML=[ui.contactMethod('☎',labels.contactCall||'Call Us',cn.phone||''),ui.contactMethod('✉',labels.contactEmail||'Email Now',cn.email||''),ui.contactMethod('●',labels.contactAddress||'Address',cn.address||'')].join('');
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
  byId('blogMoreButton')?.addEventListener('click',()=>{
    const blogs=activeSite.blogs||[];
    const allShown=visibleBlogCount>=blogs.length;
    visibleBlogCount=allShown?3:Math.min(blogs.length,visibleBlogCount+3);
    renderBlogs();
    if(allShown){const blogTitle=byId('blog-title');if(blogTitle){const top=window.pageYOffset+blogTitle.getBoundingClientRect().top-12;window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?'auto':'smooth'});}}
  });
  byId('serviceNext').addEventListener('click',()=>{serviceOffset++;renderServices();});
  byId('testimonialPrev').addEventListener('click',()=>{testimonialIndex--;renderTestimonial();});
  byId('testimonialNext').addEventListener('click',()=>{testimonialIndex++;renderTestimonial();});
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
      serviceOffset=0;testimonialIndex=0;draw();
    });
    window.parent.postMessage({kind:'PROCLEANING_PREVIEW_READY'},'*');
  }
})();
