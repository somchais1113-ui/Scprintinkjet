/* SCWork v2.5.6 — TH/EN article reader. All article data is local. */
(() => {
  'use strict';
  const locales=window.PROCLEANING_I18N;
  let raw=window.PROCLEANING_SITE;
  if(!raw||!locales)return;
  const params=new URLSearchParams(location.search);
  const preview=params.get('editorPreview')==='1';
  if(preview){try{const draft=JSON.parse(localStorage.getItem('scwork-v14-site-draft')||'null');if(draft?.brand&&Array.isArray(draft.blogs))raw=draft;}catch{}}
  const $=id=>document.getElementById(id);
  let lang=locales.initial(raw);
  const id=params.get('post');
  const source=locales.normalize(raw);
  const article=source.blogs.find((post)=>post.id===id);
  const phrases={
    th:{back:'← กลับไปหน้าบทความ',all:'← บทความทั้งหมด',quote:'เช็กราคาเบื้องต้น',kicker:'บทความและเคล็ดลับ',notFound:'ไม่พบบทความ',missing:'บทความนี้อาจถูกย้ายหรือลบไปแล้ว',empty:'ยังไม่ได้เพิ่มเนื้อหาฉบับเต็ม กรุณาแก้ไขที่ Website Manager',disclaimer:'เนื้อหาตัวอย่าง ควรตรวจสอบก่อนเผยแพร่'},
    en:{back:'← Back to articles',all:'← All articles',quote:'Check estimated price',kicker:'STORIES & INSIGHTS',notFound:'Article not found',missing:'This article may have been moved or removed.',empty:'Full article content has not been added yet. Open Website Manager to edit it.',disclaimer:'Sample content should be verified before publication.'}
  };
  function show(){
    document.documentElement.lang=lang;
    const t=phrases[lang]||phrases.en;
    document.querySelectorAll('[data-lang]').forEach(button=>{const active=button.dataset.lang===lang;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    $('backHeader').textContent=t.back;$('backFooter').textContent=t.all;$('articleQuote').textContent=window.SCWORK_EXTRA_LOCALES?.[lang]?.navigation?.quote||t.quote;$('articleQuote').href='./smart-quote.html?lang='+encodeURIComponent(lang);$('articleKicker').textContent=t.kicker;
    $('articleErrorTitle').textContent=t.notFound;$('articleErrorText').textContent=t.missing;$('articleErrorBack').textContent=t.all;
    $('articleDisclaimer').textContent=t.disclaimer;
    const home=`./index.html?lang=${lang}${preview?'&editorPreview=1':''}#blog`;
    $('backHeader').href=home;$('backFooter').href=home;$('articleErrorBack').href=home;
    const brand=source.brand||{};$('articleBrand').replaceChildren(document.createTextNode(brand.prefix||'SC'),(()=>{const span=document.createElement('span');span.textContent=brand.name||'Work';return span;})());
    $('articleCopyright').textContent='© '+(brand.prefix||'SC')+(brand.name||'Work')+'.';
    if(!article){$('articleError').hidden=false;$('articleContent').hidden=true;document.title=t.notFound;return;}
    $('articleError').hidden=true;$('articleContent').hidden=false;
    const post=locales.resolve(source,lang).blogs.find(a=>a.id===id);
    $('articleMeta').textContent=post.meta||'';$('articleTitle').textContent=post.title||'';$('articleLead').textContent=post.text||'';
    $('articleCover').src=post.image||'./assets/images/placeholder.svg';$('articleCover').alt=post.title||'';
    $('articleCover').onerror=()=>{$('articleCover').onerror=null;$('articleCover').src='./assets/images/placeholder.svg';};
    const body=$('articleBody');body.replaceChildren();
    const paragraphs=String(post.body||'').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
    if(lang!=='en'&&lang!=='th'&&!source.blogs.find(a=>a.id===id)?.translations?.[lang]?.body){const notice=document.createElement('p');notice.className='article-translation-note';notice.textContent='Full article available in English · เนื้อหาบทความฉบับเต็มยังเป็นภาษาอังกฤษ';body.appendChild(notice);}
    for(const text of (paragraphs.length?paragraphs:[t.empty])){const p=document.createElement('p');p.textContent=text;body.appendChild(p);}
    document.title=`${post.title} — ${(brand.prefix||'SC')+(brand.name||'Work')}`;
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=post.text||'';
  }
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{lang=button.dataset.lang;locales.persist(lang);const url=new URL(location.href);url.searchParams.set('lang',lang);try{history.replaceState(null,'',url);}catch{}show();}));
  window.addEventListener('scwork:locale-change',e=>{if(!locales.supported.includes(e.detail?.code))return;lang=e.detail.code;locales.persist(lang);const url=new URL(location.href);url.searchParams.set('lang',lang);try{history.replaceState(null,'',url);}catch{}show();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));});
  show();
})();
