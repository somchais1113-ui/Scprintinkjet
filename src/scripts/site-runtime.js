(() => {
  'use strict';
  const q = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  function setText(selector, value) {
    const node=q(selector);if(node && value!==undefined && value!==null)node.textContent=String(value);
  }
  const mappings = {
    '.hero__eyebrow':'hero.eyebrow','#hero-title':'hero.title','.hero__description':'hero.description',
    '.hero .button--primary':'hero.ctaPrimary','.hero .button--outline':'hero.ctaSecondary',
    '#services-title':'headings.servicesTitle','.services .section-intro__aside h3':'headings.servicesEyebrow',
    '.services .section-intro__aside p':'headings.servicesDescription',
    '.quote-copy .eyebrow':'headings.quoteEyebrow','#quote-title':'headings.quoteTitle',
    '.quote-copy > p':'headings.quoteDescription','.quote-copy .button':'headings.quoteButton',
    '#team-title':'headings.teamTitle','.team-section .section-intro__aside h3':'headings.teamEyebrow',
    '.team-section .section-intro__aside p':'headings.teamDescription',
    '#about-title':'headings.aboutTitle','.about-copy > p':'headings.aboutDescription',
    '.about-copy .button--primary':'headings.aboutPrimary','.about-copy .button--outline':'headings.aboutSecondary',
    '.pricing-heading .eyebrow':'headings.pricingEyebrow','#pricing-title':'headings.pricingTitle',
    '#testimonials-title':'headings.testimonialsTitle','.testimonial-intro > p':'headings.testimonialsDescription',
    '#blog-title':'headings.blogTitle','.blog-section .section-intro__aside h3':'headings.blogEyebrow',
    '.blog-section .section-intro__aside p':'headings.blogDescription',
    '.contact-info .eyebrow':'headings.contactEyebrow','#contact-title':'headings.contactTitle',
    '.contact-info > p':'headings.contactDescription','.contact-form-wrap .eyebrow':'headings.formEyebrow',
    '.contact-form-wrap h3':'headings.formTitle',
    '.header-cta':'navigation.quote','.main-nav a[href="#home"]':'navigation.home',
    '.main-nav a[href="#about"]':'navigation.about','.main-nav a[href="#services"]':'navigation.services',
    '.main-nav a[href="#blog"]':'navigation.blog','.main-nav a[href="#contact"]':'navigation.contact',
    '.pricing-note':'labels.pricingDemoNote',
    '.contact-form-wrap button[type="submit"]':'labels.submit','.form-note':'labels.formNote',
    '.footer-brand > p':'footer.description','.footer-grid > div:nth-child(2) h3':'footer.quickTitle',
    '.footer-grid > div:nth-child(3) h3':'footer.servicesTitle','.footer-grid > div:nth-child(4) h3':'footer.contactTitle',
    '.footer-grid > div:nth-child(4) p':'footer.contactQuestion',
    '.footer-bottom > span:last-child':'footer.disclaimer'
  };
  function readPath(obj, path){return path.split('.').reduce((o,k)=>o?.[k],obj);}
  function cssColor(s, fallback){return /^#[0-9a-f]{6}$/i.test(String(s))?s:fallback;}
  function numeric(n,min,max,def){const x=Number(n);return Number.isFinite(x)?Math.min(max,Math.max(min,x)):def;}
  function formLabel(selector,value){const l=q(selector);if(!l||value===undefined)return;const text=[...l.childNodes].find(n=>n.nodeType===3);if(text)text.nodeValue=value+' ';}
  function apply(site, overrides={}) {
    if(!site || typeof site!=='object')return;
    const root=document.documentElement,st=root.style,d=site.design||{};
    st.setProperty('--color-primary',cssColor(d.primary,'#FF6900'));
    st.setProperty('--color-cta',cssColor(d.primary,'#FF6900'));
    st.setProperty('--color-primary-hover',cssColor(d.primaryHover,'#FF6900'));
    st.setProperty('--color-ink',cssColor(d.ink,'#082E66'));
    st.setProperty('--color-body',cssColor(d.body,'#5b6b84'));
    st.setProperty('--color-border',cssColor(d.border,'#c7d7ef'));
    st.setProperty('--color-footer',cssColor(d.footer,'#061B3D'));
    const fonts={'Be Vietnam Pro':"'Be Vietnam Pro','Montserrat',Arial,sans-serif",'Montserrat':"'Montserrat','Be Vietnam Pro',Arial,sans-serif",'System':"system-ui,-apple-system,'Segoe UI',sans-serif"};
    st.setProperty('--font-body',root.lang==='th'?"'Noto Sans Thai','Be Vietnam Pro',sans-serif":fonts[d.font]||fonts['Be Vietnam Pro']);
    st.setProperty('--font-secondary',root.lang==='th'?"'Noto Sans Thai','Montserrat',sans-serif":"'Montserrat',Arial,sans-serif");
    st.setProperty('--pc-heading-scale',String(numeric(d.headingScale,75,140,100)/100));
    st.setProperty('--section-space',`${numeric(d.sectionSpacing,55,140,95)}px`);
    st.setProperty('--container',`${numeric(d.containerWidth,960,1400,1170)}px`);
    st.setProperty('--radius-card',`${numeric(d.cardRadius,0,45,20)}px`);
    st.setProperty('--radius-image',`${numeric(d.imageRadius,0,50,30)}px`);
    for(const [selector,path] of Object.entries(mappings))setText(selector,readPath(site,path));
    const brand=site.brand||{};
    all('.brand__copy strong').forEach(el=>{
      el.replaceChildren();const first=document.createElement('span');first.className='brand__accent';first.textContent=brand.prefix||'';
      el.append(first,document.createTextNode(brand.name||''));
    });
    all('.brand__copy small').forEach(el=>el.textContent=brand.tagline||'');
    all('.brand[aria-label]').forEach(el=>el.setAttribute('aria-label',`${brand.prefix||''}${brand.name||''} home`));
    if(brand.pageTitle)document.title=brand.pageTitle;
    const meta=q('meta[name="description"]');if(meta)meta.setAttribute('content',brand.metaDescription||'');
    const nav=site.navigation||{};
    all('.footer-grid > div:nth-child(2) a').forEach((el,i)=>{const paths=['home','about','services','quote'];el.textContent=nav[paths[i]]||['Home','About us','Service','Get a quote'][i];});
    const footerServices=q('.footer-grid > div:nth-child(3) ul');
    if(footerServices){footerServices.replaceChildren();[...(site.services||[]).slice(0,3).map(s=>({title:s.title,href:'#services'})),{title:nav.quote||'Get a quote',href:'./smart-quote.html'}].forEach(item=>{
      const li=document.createElement('li'),a=document.createElement('a');a.href=item.href;a.textContent=item.title;li.append(a);footerServices.append(li);
    });}
    setText('.footer-grid > div:nth-child(4) > a',site.contact?.email||'');
    const mail=q('.footer-grid > div:nth-child(4) > a');if(mail){if(site.contact?.email){mail.href='mailto:'+encodeURIComponent(site.contact.email);}else{mail.removeAttribute('href');mail.textContent='';}}
    const footerHint=q('#footerContactHint');if(footerHint)footerHint.textContent=root.lang==='th'?'สอบถามผ่านฟอร์ม Smart RFQ':'Please use the Smart RFQ form';
    const copyright=q('.footer-bottom > span:first-child');if(copyright){const yr=document.createElement('span');yr.id='year';yr.textContent=String(new Date().getFullYear());copyright.replaceChildren('© ',yr,` ${brand.prefix||''}${brand.name||''}. ${site.footer?.copyright||''}`);}
    const labels=site.labels||{};
    const language= root.lang==='th'?'th':'en';
    all('.language-switch__btn').forEach(btn=>{
      const chosen=btn.dataset.language===language;
      btn.classList.toggle('is-active',chosen);
      btn.setAttribute('aria-pressed',String(chosen));
    });
    const switcher=q('.language-switch');if(switcher)switcher.setAttribute('aria-label',language==='th'?'เลือกภาษาของเว็บไซต์':'Website language');
    setText('.skip-link',labels.skipLink);
    all('nav.main-nav').forEach(el=>el.setAttribute('aria-label',labels.navAria||'Main navigation'));
    const menuToggle=q('#menuToggle');if(menuToggle)menuToggle.setAttribute('aria-label',menuToggle.getAttribute('aria-expanded')==='true'?labels.closeNav:labels.openNav);
    const serviceNext=q('#serviceNext');if(serviceNext)serviceNext.setAttribute('aria-label',labels.nextServices||'Next services');
    for(const [id,label] of [['testimonialPrev','previousTestimonial'],['testimonialNext','nextTestimonial']]){const e=document.getElementById(id);if(e)e.setAttribute('aria-label',labels[label]||'');}
    const billingSwitch=q('.billing-switch');if(billingSwitch)billingSwitch.setAttribute('aria-label',labels.billingAria||'Billing interval');
    const heroCarousel=q('#heroCarousel');if(heroCarousel)heroCarousel.setAttribute('aria-label',labels.heroImageAlt||'SCWORK inkjet sticker printing hero images');
    const altMap={quoteMainImage:'quoteMainAlt',quoteSmallImage:'quoteSmallAlt',aboutMainImage:'aboutMainAlt',aboutSmallImage:'aboutSmallAlt'};
    for(const [id,k] of Object.entries(altMap)){const el=document.getElementById(id);if(el)el.alt=labels[k]||'';}
    const feedback=q('#formFeedback');if(feedback){feedback.textContent='';feedback.className='form-feedback';}
    const billingButtons=all('[data-billing]');for(const b of billingButtons)b.textContent=labels[b.dataset.billing]||b.dataset.billing;
    const names=['fullName','email','service','message'];const selectors=['.form-row label:first-child','.form-row label:last-child','.contact-form-wrap label:has(select)','.contact-form-wrap label:has(textarea)'];
    names.forEach((k,i)=>formLabel(selectors[i],labels[k]));
    const placeholders=[['#quoteForm input[name="name"]','namePlaceholder'],['#quoteForm input[name="email"]','emailPlaceholder'],['#quoteForm textarea','messagePlaceholder']];
    placeholders.forEach(([selector,k])=>{const el=q(selector);if(el)el.placeholder=labels[k]||'';});
    const select=q('#quoteForm select[name="service"]');if(select){const active=select.value;select.replaceChildren();const first=new Option(labels.servicePlaceholder||'Select a service','');select.append(first);(site.services||[]).forEach(s=>select.add(new Option(s.title,s.title)));select.add(new Option(labels.otherService||'Other Service',labels.otherService||'Other Service'));if([...select.options].some(o=>o.value===active))select.value=active;}
    const imageMap=overrides||{};
    const heroD=imageMap['assets/images/hero/hero-scene.webp'];const heroM=imageMap['assets/images/hero/hero-mobile.webp'];
    // CSS var accepts data URLs produced by user-uploaded WebP, never arbitrary input from text fields.
    st.setProperty('--pc-hero-desktop',`url("${heroD||new URL('./assets/images/hero/hero-scene.webp',document.baseURI).href}")`);
    st.setProperty('--pc-hero-mobile',`url("${heroM||new URL('./assets/images/hero/hero-mobile.webp',document.baseURI).href}")`);
  }
  window.PROCLEANING_APPLY_SITE=apply;
  window.PROCLEANING_SITE_MAPPINGS=mappings;
})();
