window.PROCLEANING_UI = {
  iconSvg(kind){
    const icons={
      phone:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 3.8c.5-.5 1.3-.6 1.9-.2l2.2 1.5c.7.5 1 1.4.7 2.2l-.7 1.8c-.1.4 0 .8.2 1.1 1 1.6 2.4 3 4 4 .3.2.7.3 1.1.2l1.8-.7c.8-.3 1.7 0 2.2.7l1.5 2.2c.4.6.3 1.4-.2 1.9l-1.3 1.3c-.7.7-1.8 1-2.8.8-2.8-.6-5.5-2.1-8-4.5C7.8 14 6.3 11.3 5.7 8.5c-.2-1 .1-2.1.8-2.8l.7-.7Z" fill="currentColor"/></svg>',
      email:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 6.5h16A1.5 1.5 0 0 1 21.5 8v8A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Zm0 1.6v.2l8 5 8-5v-.2H4Zm16 7.8v-5.8l-7.5 4.7a1 1 0 0 1-1 0L4 10.1v5.8h16Z" fill="currentColor"/></svg>',
      contact:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Zm0 4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm0 10.2a6.1 6.1 0 0 1-4.4-1.9c.2-1.8 1.8-2.9 4.4-2.9 2.6 0 4.2 1.1 4.4 2.9a6.1 6.1 0 0 1-4.4 1.9Z" fill="currentColor"/></svg>'
    };
    return icons[kind]||'';
  },
  escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
  img(url,alt,cls='',loading='lazy'){
    const e=this.escape;
    return `<img class="${e(cls)}" src="${e(url)}" alt="${e(alt)}" loading="${loading}" data-fallback="./assets/images/placeholder.svg" />`;
  },
  serviceCard(s,index){
    const e=this.escape,label=window.PROCLEANING_SITE?.labels?.book||'Request a Quote';
    const cat=encodeURIComponent(s.category||'Sticker & Label');
    return `<article class="service-card" data-service-index="${index}"><div class="service-card__image">${this.img(s.image,s.title)}</div><h3>${e(s.title)}</h3><p>${e(s.description)}</p><a href="./smart-quote.html?category=${cat}" class="button button--primary">${e(label)} </a></article>`;
  },
  teamCard(p,index){
    const e=this.escape;
    return `<article class="team-card"><div class="team-card__image">${this.img(p.image,p.name)}</div><div class="team-card__body"><h3>${e(p.name)}</h3><p>${e(p.description)}</p><div class="team-process-tag">${e(window.PROCLEANING_SITE?.labels?.processTag||'Production workflow')}</div></div></article>`;
  },
  priceCard(p,mode,discount){
    const e=this.escape,labels=window.PROCLEANING_SITE?.labels||{};
    const cat=encodeURIComponent(p.category||'Sticker & Label');
    const th=document.documentElement.lang==='th';
    const name=String(p.name||'').toLowerCase();
    const kind=/large|retail|signage|ร้าน|หน้าร้าน|กระจก|ใหญ่/.test(name)||/large format/i.test(p.category||'')?'retail':/die.cut|ไดคัท|contour/.test(name)?'diecut':'labels';
    const details={
      labels:{th:[['เหมาะกับ','ขวด กระปุก และบรรจุภัณฑ์'],['จุดเด่น','เลือกวัสดุและผิวงานให้รับกับสินค้า'],['ก่อนผลิต','เช็กพื้นผิว ขนาด และจำนวน']],en:[['BEST FOR','Bottles, jars and packaging'],['WHY CHOOSE IT','Select materials and finishes to suit the product'],['CHECK FIRST','Surface, dimensions and quantity']]},
      diecut:{th:[['เหมาะกับ','ของแจก โปรโมชัน และสติกเกอร์แบรนด์'],['จุดเด่น','ตัดตามรูปทรง เลือกคิสคัทหรือไดคัทขาด'],['ก่อนผลิต','ตรวจเส้นไดคัท วัสดุ และจำนวน']],en:[['BEST FOR','Giveaways, promotions and branding'],['WHY CHOOSE IT','Custom contour, kiss-cut or individual pieces'],['CHECK FIRST','Cutline, material and quantity']]},
      retail:{th:[['เหมาะกับ','ตกแต่งกระจก หน้าร้าน และพื้นที่ขนาดใหญ่'],['จุดเด่น','สื่อสารแบรนด์ได้เต็มพื้นที่'],['ก่อนผลิต','วัดหน้างาน เลือกฟิล์มและวิธีติดตั้ง']],en:[['BEST FOR','Windows, shops and large surfaces'],['WHY CHOOSE IT','Brand graphics tailored to the installation area'],['CHECK FIRST','Measure site, film and mounting method']]}
    };
    const rows=details[kind][th?'th':'en'];
    const prefix=th?'ราคา: ตามรายละเอียดงาน':'Quoted by job specification';
    const facts=rows.map(([key,value])=>`<div class="price-card__fact"><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('');
    return `<article class="price-card price-card--sticker price-card--comparison" data-work-type="${e(kind)}"><header class="price-card__header"><h3>${e(p.name)}</h3><p class="price-card__subline">${e(prefix)}</p></header><dl class="price-card__facts">${facts}</dl><a href="./smart-quote.html?category=${cat}" class="button ${p.featured?'button--primary':'button--outline'}">${e(labels.book||'Request a Quote')}</a></article>`;
  },
  testimonial(t){
    const e=this.escape;
    return `${this.img(t.image,t.name,'testimonial-card__photo')}<div class="testimonial-card__text"><h3>${e(t.name)}</h3><p class="testimonial-card__role">${e(t.role)}</p><p class="testimonial-card__quote">${e(t.quote)}</p></div>`;
  },
  blogCard(b,index=0,language='en'){
    const e=this.escape, id=encodeURIComponent(String(b.id||`article-${index+1}`));
    const lang=(window.PROCLEANING_I18N?.supported||['en','th']).includes(language)?language:'en';
    const editorPreview=typeof URLSearchParams!=='undefined'&&new URLSearchParams(window.location?.search||'').get('editorPreview')==='1';
    const href=`./article.html?post=${id}&lang=${lang}${editorPreview?'&editorPreview=1':''}`;
    const read=window.PROCLEANING_SITE?.labels?.readMore||(language==='th'?'อ่านเพิ่มเติม':'Read More');
    return `<article class="blog-card"><a class="blog-card__image-link" href="${e(href)}" aria-label="${e(b.title)}">${this.img(b.image,b.title,'blog-card__image')}</a><div class="blog-card__body"><span class="blog-card__meta">${e(b.meta)}</span><h3><a class="blog-card__title-link" href="${e(href)}">${e(b.title)}</a></h3><p>${e(b.text)}</p><a class="blog-card__more" href="${e(href)}" aria-label="${e(read)}: ${e(b.title)}">${e(read)} <span aria-hidden="true">↗</span></a></div></article>`;
  },
  contactMethod(icon,label,value){const e=this.escape;return `<div class="contact-method"><span class="contact-method__icon" aria-hidden="true">${this.iconSvg(icon)}</span><div><strong>${e(label)}</strong><p>${e(value)}</p></div></div>`;}
};
