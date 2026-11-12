window.PROCLEANING_UI = {
  escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
  img(url,alt,cls='',loading='lazy'){
    const e=this.escape;
    return `<img class="${e(cls)}" src="${e(url)}" alt="${e(alt)}" loading="${loading}" data-fallback="./assets/images/placeholder.svg" />`;
  },
  serviceCard(s,index){
    const e=this.escape,label=window.PROCLEANING_SITE?.labels?.book||'Request a Quote';
    const cat=encodeURIComponent(s.category||'Sticker & Label');
    return `<article class="service-card" data-service-index="${index}"><div class="service-card__image">${this.img(s.image,s.title)}</div><h3>${e(s.title)}</h3><p>${e(s.description)}</p><a href="./request-quote.html?category=${cat}" class="button button--primary">${e(label)} <span aria-hidden="true">↗</span></a></article>`;
  },
  teamCard(p,index){
    const e=this.escape;
    return `<article class="team-card"><div class="team-card__image">${this.img(p.image,p.name)}</div><div class="team-card__body"><h3>${e(p.name)}</h3><p>${e(p.description)}</p><div class="team-process-tag">${e(window.PROCLEANING_SITE?.labels?.processTag||'Production workflow')}</div></div></article>`;
  },
  priceCard(p,mode,discount){
    const e=this.escape,labels=window.PROCLEANING_SITE?.labels||{};
    const cat=encodeURIComponent(p.category||'Sticker & Label');
    return `<article class="price-card price-card--sticker"><div><h3>${e(p.name)}</h3><div class="price-card__amount price-card__amount--quote">${e(labels.priceByQuote||(document.documentElement.lang==='th'?'ประเมินราคาตามสเปก':'Custom quotation'))}</div></div><ul class="price-card__features">${(p.features||[]).map(t=>`<li>${e(t)}</li>`).join('')}</ul><a href="./request-quote.html?category=${cat}" class="button ${p.featured?'button--primary':'button--outline'}">${e(labels.book||'Request a Quote')}</a></article>`;
  },
  testimonial(t){
    const e=this.escape;
    return `${this.img(t.image,t.name,'testimonial-card__photo')}<div class="testimonial-card__text"><h3>${e(t.name)}</h3><p class="testimonial-card__role">${e(t.role)}</p><p class="testimonial-card__quote">${e(t.quote)}</p></div>`;
  },
  blogCard(b,index=0,language='en'){const e=this.escape;const id=encodeURIComponent(String(b.id||`article-${index+1}`));const lang=(window.PROCLEANING_I18N?.supported||['en','th']).includes(language)?language:'en';const editorPreview=typeof URLSearchParams!=='undefined'&&new URLSearchParams(window.location?.search||'').get('editorPreview')==='1';const href=`./article.html?post=${id}&lang=${lang}${editorPreview?'&editorPreview=1':''}`;return `<article class="blog-card">${this.img(b.image,b.title,'blog-card__image')}<div class="blog-card__body"><span class="blog-card__meta">${e(b.meta)}</span><h3>${e(b.title)}</h3><p>${e(b.text)}</p><a class="blog-card__more" href="${e(href)}" aria-label="${e(window.PROCLEANING_SITE?.labels?.readMore||'Read More')}: ${e(b.title)}">${e(window.PROCLEANING_SITE?.labels?.readMore||'Read More')} <span aria-hidden="true">↗</span></a></div></article>`;},
  contactMethod(icon,label,value){const e=this.escape;return `<div class="contact-method"><span class="contact-method__icon" aria-hidden="true">${e(icon)}</span><div><strong>${e(label)}</strong><p>${e(value)}</p></div></div>`;}
};
