/* SCWork V2.1.26 — work types portfolio. Twenty separate illustrative photographs. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const items=Array.isArray(window.SCWORK_PORTFOLIO_ITEMS)?window.SCWORK_PORTFOLIO_ITEMS:[];
  const supported=window.PROCLEANING_I18N?.supported||['th','en'];
  const langFromUrl=new URLSearchParams(location.search).get('lang');
  let lang=supported.includes(langFromUrl)?langFromUrl:(window.PROCLEANING_I18N?.initial?.(window.PROCLEANING_SITE)||'th');
  const validCats=['all','labels','diecut','retail','process'];
  const fromUrl=new URLSearchParams(location.search).get('category');
  let activeCategory=validCats.includes(fromUrl)?fromUrl:'all';
  let lastFocus=null;
  const categories={
    th:{all:'ทั้งหมด',labels:'ฉลากสินค้า',diecut:'สติกเกอร์ไดคัท',retail:'งานหน้าร้านและขนาดใหญ่',process:'ทีมงานและกระบวนการ'},
    en:{all:'All work',labels:'Product labels',diecut:'Die-cut stickers',retail:'Retail & large format',process:'Production process'}
  };
  const locale={
    th:{home:'หน้าแรก',knowledge:'ความรู้งานพิมพ์',quote:'ปรึกษางาน',crumb:'หน้าแรก / ผลงาน',eyebrow:'SCWORK / DESIGN & PRODUCTION',title:'ตัวอย่างงานและกระบวนการผลิต',intro:'สำรวจประเภทงานที่เราสามารถช่วยวางแผนผลิต พร้อมตัวอย่างตั้งแต่การเตรียมไฟล์ ตรวจวัสดุ พิมพ์ ไดคัท ไปจนถึงการติดตั้ง',visual:'ภาพตัวอย่าง',browseEyebrow:'EXPLORE THE WORK',browse:'สำรวจกรณีตัวอย่าง',browseLead:'เลือกหมวดเพื่อดูโจทย์ แนวทางออกแบบ และข้อควรพิจารณาก่อนผลิต',show:n=>`แสดง ${n} จาก ${items.length} กรณีตัวอย่าง`,fit:'เหมาะกับ',see:'อ่านรายละเอียดโปรเจกต์',note:'ข้อควรพิจารณา',disclaimer:'',consult:'มีงานแบบนี้ที่อยากผลิต?',consultText:'แจ้งประเภทงาน ขนาด วัสดุ จำนวน และวิธีใช้งาน เพื่อให้ทีมงานช่วยพิจารณาสเปกและแนวทางผลิตก่อนเสนอราคา',consultCta:'ปรึกษางานของคุณ',footer:'ภาพตัวอย่าง ไม่ใช่หลักฐานผลงานลูกค้าหรือคำรับรองวัสดุ',dialogNotice:'ภาพประกอบใช้แสดงแนวคิดและขั้นตอน ไม่ใช่ภาพงานลูกค้าจริง',dialogQuote:'ปรึกษางานประเภทนี้',close:'ปิดภาพขยาย'},
    en:{home:'Home',knowledge:'Print knowledge',quote:'Discuss a project',crumb:'Home / Portfolio',eyebrow:'SCWORK / DESIGN & PRODUCTION',title:'Work types & production process',intro:'Explore the sticker applications we can help plan—from artwork and material checks to printing, cutting, finishing and installation.',visual:'illustrations',browseEyebrow:'EXPLORE THE WORK',browse:'Explore project studies',browseLead:'Explore the brief, design approach and production considerations by category',show:n=>`Showing ${n} of ${items.length} examples`,fit:'Best suited for',see:'Read project study',note:'Production consideration',disclaimer:'',consult:'Thinking of a similar project?',consultText:'Share the application, size, material, quantity and site requirements to discuss feasible production specifications.',consultCta:'Discuss your project',footer:'Illustrative visuals, not documented client projects or material warranties',dialogNotice:'Illustrative scene, not a documented client order or team photograph',dialogQuote:'Discuss this type of work',close:'Close enlarged image'}
  };
  const th=()=>lang==='th';
  const language=()=>th()?'th':'en';
  function setText(id,text){const node=$(id);if(node)node.textContent=text;}
  function withLang(path){return path+(path.includes('?')?'&':'?')+'lang='+encodeURIComponent(lang);}
  function updateAddress(){try{const u=new URL(location.href);u.searchParams.set('category',activeCategory);u.searchParams.set('lang',lang);history.replaceState(null,'',u);}catch{}}
  function openItem(item){
    const d=$('portfolioDialog');if(!d)return;
    lastFocus=document.activeElement;
    const l=language();setText('portfolioDialogCategory',categories[l][item.category]);setText('portfolioDialogTitle',item.title[l]);
    setText('portfolioDialogFit',(l==='th'?'เหมาะกับ: ':'Best suited for: ')+item.fit[l]);
    setText('portfolioDialogNote',(l==='th'?'สิ่งที่ควรรู้: ':'Note: ')+item.note[l]);
    setText('portfolioDialogNotice',locale[l].dialogNotice);
    const img=$('portfolioDialogImage');img.src=item.cover||item.image;img.alt=item.title[l];
    const quote=$('portfolioDialogQuote');quote.textContent=locale[l].dialogQuote+' →';quote.href=withLang('./smart-quote.html?mode=help');
    if(!d.open)d.showModal();
    $('portfolioDialogClose').focus();
  }
  function createCard(item,index){
    const l=language();const art=document.createElement('article');
    art.className='portfolio-card'+(item.featured?' portfolio-card--featured':'');
    art.dataset.category=item.category;art.setAttribute('data-sc-reveal','');
    const button=document.createElement('a');button.href=withLang('./portfolio-detail.html?work='+encodeURIComponent(item.id));button.className='portfolio-card__open';
    button.setAttribute('aria-label',`${item.title[l]} — ${locale[l].see}`);
    const imageWrap=document.createElement('span');imageWrap.className='portfolio-card__media';
    const img=document.createElement('img');img.src=item.cover||item.image;img.alt=item.title[l];img.loading=index<3?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{if(!img.src.includes('placeholder.svg'))img.src='./assets/images/placeholder.svg';},{once:true});
    imageWrap.append(img);
    const top=document.createElement('span');top.className='sc-gallery-project-top';
    if(item.mockBrand){const brand=document.createElement('span');brand.className='sc-mock-brand';const mark=document.createElement('img');mark.src=item.mockBrand.logo;mark.alt=item.mockBrand.name;mark.width=168;mark.height=48;brand.append(mark);top.append(brand);}
    const arrow=document.createElement('span');arrow.className='sc-work-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');top.append(arrow);
    const body=document.createElement('span');body.className='portfolio-card__body sc-gallery-project-heading';
    const kicker=document.createElement('span');kicker.className='sc-project-service';kicker.textContent=item.service||categories[l][item.category];
    const title=document.createElement('h3');title.textContent=item.mockBrand?.name||item.title[l];
    const name=document.createElement('span');name.className='sc-project-name';name.textContent=item.title[l];
    const desc=document.createElement('span');desc.className='sc-gallery-project-description';
    const summary=document.createElement('span');summary.className='sc-project-summary';summary.textContent=item.summary?.[l]||item.fit[l];desc.append(summary);
    body.append(kicker,title,name);button.append(top,body,imageWrap,desc);art.append(button);return art;
  }
  function paint(){
    const l=language(),d=locale[l];document.documentElement.lang=lang;
    setText('portfolioHomeLink',d.home);setText('portfolioKnowledgeLink',d.knowledge);setText('portfolioQuoteLink',d.quote);
    setText('portfolioBreadcrumb',d.crumb);setText('portfolioEyebrow',d.eyebrow);setText('portfolioTitle',d.title);setText('portfolioIntroduction',d.intro);
    setText('portfolioVisualCount',d.visual);setText('portfolioBrowseEyebrow',d.browseEyebrow);setText('portfolioBrowseTitle',d.browse);setText('portfolioDirectoryLead',d.browseLead);
    setText('portfolioDisclaimer',d.disclaimer);setText('portfolioConsultTitle',d.consult);setText('portfolioConsultText',d.consultText);setText('portfolioFooter',d.footer);
    const cta=$('portfolioConsultCta');cta.textContent=d.consultCta+' →';cta.href=withLang('./smart-quote.html?mode=help');
    $('portfolioHomeLink').href=withLang('./index.html')+'#portfolio';$('portfolioKnowledgeLink').href=withLang('./knowledge.html');$('portfolioQuoteLink').href=withLang('./smart-quote.html?mode=help');$('portfolioBrand').href=withLang('./index.html');
    document.title=`${d.title} | SCWork`;
    const filters=$('portfolioFilters');filters.replaceChildren();
    for(const key of validCats){
      const b=document.createElement('button');b.type='button';b.className='portfolio-filter__button';b.textContent=categories[l][key];
      b.setAttribute('aria-pressed',String(activeCategory===key));b.classList.toggle('is-active',activeCategory===key);
      b.addEventListener('click',()=>{activeCategory=key;updateAddress();paint();});filters.append(b);
    }
    const matching=items.filter(x=>activeCategory==='all'||x.category===activeCategory);
    $('portfolioGallery').replaceChildren(...matching.map((x,i)=>createCard(x,i)));
    setText('portfolioResults',d.show(matching.length));window.SCWORK_REVEAL?.();
    $('portfolioDialogClose')?.setAttribute('aria-label',d.close);
    updateAddress();
  }
  $('portfolioDialogClose')?.addEventListener('click',()=>$('portfolioDialog')?.close());
  $('portfolioDialog')?.addEventListener('click',e=>{
    const d=$('portfolioDialog');if(e.target===d)d.close();
  });
  $('portfolioDialog')?.addEventListener('close',()=>{lastFocus?.focus?.();});
  window.addEventListener('scwork:locale-change',e=>{
    const proposed=e.detail?.code;if(!supported.includes(proposed))return;
    lang=proposed;window.PROCLEANING_I18N?.persist?.(lang);paint();
    window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));
  });
  paint();
})();
