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
    th:{home:'หน้าแรก',knowledge:'ความรู้งานพิมพ์',quote:'ปรึกษางาน',crumb:'หน้าแรก / ผลงาน',eyebrow:'SCWORK / DESIGN & PRODUCTION',title:'ตัวอย่างงานและกระบวนการผลิต',intro:'สำรวจประเภทงานที่เราสามารถช่วยวางแผนผลิต พร้อมตัวอย่างตั้งแต่การเตรียมไฟล์ ตรวจวัสดุ พิมพ์ ไดคัท ไปจนถึงการติดตั้ง',visual:'ภาพตัวอย่าง',browseEyebrow:'EXPLORE THE WORK',browse:'สำรวจรูปแบบงาน',browseLead:'เลือกหมวดเพื่อดูภาพตัวอย่าง จุดเด่น และงานที่เหมาะสม',show:n=>`แสดง ${n} จาก ${items.length} ภาพ`,fit:'เหมาะกับ',see:'ดูภาพและรายละเอียด',note:'ข้อควรพิจารณา',disclaimer:'ภาพประกอบเป็นภาพสาธิตหรือภาพสร้างด้วย AI เพื่ออธิบายประเภทงานและขั้นตอน บุคลากรในภาพไม่ใช่พนักงาน SCWork จริง และภาพไม่ใช่ผลงานลูกค้าที่ผลิตเสร็จแล้ว คุณภาพจริงขึ้นกับสเปกและการทดสอบก่อนผลิต',consult:'มีงานแบบนี้ที่อยากผลิต?',consultText:'แจ้งประเภทงาน ขนาด วัสดุ จำนวน และวิธีใช้งาน เพื่อให้ทีมงานช่วยพิจารณาสเปกและแนวทางผลิตก่อนเสนอราคา',consultCta:'ปรึกษางานของคุณ',footer:'ภาพตัวอย่าง ไม่ใช่หลักฐานผลงานลูกค้าหรือคำรับรองวัสดุ',dialogNotice:'ภาพประกอบใช้แสดงแนวคิดและขั้นตอน ไม่ใช่ภาพงานลูกค้าจริง',dialogQuote:'ปรึกษางานประเภทนี้',close:'ปิดภาพขยาย'},
    en:{home:'Home',knowledge:'Print knowledge',quote:'Discuss a project',crumb:'Home / Portfolio',eyebrow:'SCWORK / DESIGN & PRODUCTION',title:'Work types & production process',intro:'Explore the sticker applications we can help plan—from artwork and material checks to printing, cutting, finishing and installation.',visual:'illustrations',browseEyebrow:'EXPLORE THE WORK',browse:'Explore the work',browseLead:'Browse applications and practical considerations by category',show:n=>`Showing ${n} of ${items.length} images`,fit:'Best suited for',see:'View image & details',note:'Production consideration',disclaimer:'Images are illustrative photographs or AI-generated concepts of work types and processes. Depicted people are not actual SCWork employees and the scenes are not documented completed customer projects. Actual quality must be confirmed against the chosen specifications and tests.',consult:'Thinking of a similar project?',consultText:'Share the application, size, material, quantity and site requirements to discuss feasible production specifications.',consultCta:'Discuss your project',footer:'Illustrative visuals, not documented client projects or material warranties',dialogNotice:'Illustrative scene, not a documented client order or team photograph',dialogQuote:'Discuss this type of work',close:'Close enlarged image'}
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
    const img=$('portfolioDialogImage');img.src=item.image;img.alt=item.title[l];
    const quote=$('portfolioDialogQuote');quote.textContent=locale[l].dialogQuote+' →';quote.href=withLang('./smart-quote.html?mode=help');
    if(!d.open)d.showModal();
    $('portfolioDialogClose').focus();
  }
  function createCard(item,index){
    const l=language();const art=document.createElement('article');
    art.className='portfolio-card'+(item.featured?' portfolio-card--featured':'');
    art.dataset.category=item.category;
    const button=document.createElement('button');button.type='button';button.className='portfolio-card__open';
    button.setAttribute('aria-label',`${item.title[l]} — ${locale[l].see}`);button.addEventListener('click',()=>openItem(item));
    const imageWrap=document.createElement('span');imageWrap.className='portfolio-card__media';
    const img=document.createElement('img');img.src=item.image;img.alt=item.title[l];img.loading=index<3?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{if(!img.src.includes('placeholder.svg'))img.src='./assets/images/placeholder.svg';},{once:true});
    imageWrap.append(img);button.append(imageWrap);
    const body=document.createElement('span');body.className='portfolio-card__body';
    const kicker=document.createElement('span');kicker.className='portfolio-card__category';kicker.textContent=`${String(index+1).padStart(2,'0')} / ${categories[l][item.category]}`;
    const title=document.createElement('h3');title.textContent=item.title[l];
    const fit=document.createElement('p');fit.className='portfolio-card__fit';fit.textContent=item.fit[l];
    const more=document.createElement('span');more.className='portfolio-card__more';more.textContent=locale[l].see;
    const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');more.append(arrow);
    body.append(kicker,title,fit,more);button.append(body);art.append(button);return art;
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
    setText('portfolioResults',d.show(matching.length));
    $('portfolioDialogClose').setAttribute('aria-label',d.close);
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
