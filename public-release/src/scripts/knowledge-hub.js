/* SCWork 2.1.23 | Knowledge Hub — client-only catalog, bilingual content. */
(() => {
 'use strict';
 const i18n=window.PROCLEANING_I18N;
 let raw=window.PROCLEANING_SITE;
 if(!i18n||!raw)return;
 const params=new URLSearchParams(location.search);
 const preview=params.get('editorPreview')==='1';
 if(preview){try{const draft=JSON.parse(localStorage.getItem('scwork-v14-site-draft')||'null');if(draft?.brand&&Array.isArray(draft.blogs))raw=draft;}catch{}}
 const $=id=>document.getElementById(id);
 const source=i18n.normalize(raw);
 const categories=['all','materials','durability','production','applications'];
 const dict={
  th:{title:'ความรู้งานพิมพ์สติกเกอร์',intro:'คู่มือสั้นที่ช่วยให้เลือกวัสดุ เตรียมไฟล์ และวางแผนใช้งานสติกเกอร์ได้อย่างเหมาะสม',back:'← กลับหน้าหลัก',feature:'เริ่มต้นอย่างมั่นใจ',featureText:'อ่านสิ่งที่ควรรู้จากแต่ละหัวข้อ และนำไปเตรียมสเปกงานก่อนขอราคา',browse:'สำรวจบทความทั้งหมด',search:'ค้นหาหัวข้อหรือคำสำคัญ',searchLabel:'ค้นหาบทความ',count:n=>`${n} บทความ`,empty:'ไม่พบบทความที่ตรงกับคำค้นหา ลองเปลี่ยนคำหรือเลือกหมวดทั้งหมด',consult:'มีงานสติกเกอร์ที่อยากปรึกษา?',consultText:'แจ้งขนาด วัสดุ จำนวน และตัวอย่างงาน เพื่อช่วยประเมินแนวทางผลิต',consultButton:'ปรึกษาเรื่องสเปกงาน ↗',foot:'บทความเพื่อให้ความรู้ทั่วไป · ควรตรวจสอบสเปกวัสดุจริงก่อนผลิต',category:['ทั้งหมด','วัสดุและพื้นผิว','ความทนทาน','ไฟล์และการผลิต','การใช้งาน'],read:'อ่านบทความ',minutes:'นาที'},
  en:{title:'Sticker Printing Knowledge',intro:'Practical guides to materials, artwork preparation and real-world sticker applications.',back:'← Back to homepage',feature:'Start with the essentials',featureText:'Find the right topic and bring the key requirements into your production brief.',browse:'Explore all articles',search:'Search topics or keywords',searchLabel:'Search articles',count:n=>`${n} articles`,empty:'No articles match. Try another term or select All.',consult:'Have a sticker project in mind?',consultText:'Share the material, size, quantity and visual references to discuss your production options.',consultButton:'Discuss specifications ↗',foot:'General educational content · Verify production material specifications before ordering',category:['All','Materials & finishes','Durability','Artwork & production','Applications'],read:'Read article',minutes:'min read'}
 };
 let lang=i18n.initial(source),activeCategory='all';
 const input=$('knowledgeSearch');
 function url(id){return `./article.html?post=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}${preview?'&editorPreview=1':''}`;}
 function readingTime(body){return Math.max(3,Math.ceil(String(body||'').length/(lang==='th'?570:1000)));}
 function categoryLabel(category,d){return d.category[Math.max(0,categories.indexOf(category))];}
 function text(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=value;return el;}
 function card(post,d){
  const item=document.createElement('article');item.className='knowledge-card';
  const cover=document.createElement('a');cover.className='knowledge-card__image';cover.href=url(post.id);cover.setAttribute('aria-label',post.title);
  const img=document.createElement('img');img.src=post.image||'./assets/images/placeholder.svg';img.alt=post.title;img.loading='lazy';img.addEventListener('error',()=>{img.src='./assets/images/placeholder.svg';},{once:true});const overlay=text('span','knowledge-card__cover-title',post.title);overlay.setAttribute('aria-hidden','true');cover.append(img,overlay);
  const body=document.createElement('div');body.className='knowledge-card__body';
  body.append(text('p','knowledge-card__category',categoryLabel(post.category,d)));
  const h3=text('h3','','');const a=text('a','',post.title);a.href=url(post.id);h3.append(a);body.append(h3);
  body.append(text('p','knowledge-card__description',post.text||''));
  const bottom=document.createElement('div');bottom.className='knowledge-card__bottom';bottom.append(text('span','',`${readingTime(post.body)} ${d.minutes}`));
  const more=text('a','knowledge-card__read',d.read+' ↗');more.href=url(post.id);bottom.append(more);body.append(bottom);
  item.append(cover,body);return item;
 }
 function refresh(){
  const contentLang=['th','en'].includes(lang)?lang:'en',d=dict[contentLang];
  document.documentElement.lang=contentLang;
  $('knowledgeTitle').textContent=d.title;$('knowledgeIntro').textContent=d.intro;
  $('knowledgeBack').textContent=d.back;$('knowledgeBack').href=`./index.html?lang=${encodeURIComponent(lang)}#blog`;
  $('knowledgeFeatureLabel').textContent=d.feature;$('knowledgeFeatureText').textContent=d.featureText;
  $('knowledgeBrowseTitle').textContent=d.browse;
  $('knowledgeSearch').placeholder=d.search;$('knowledgeSearchLabel').textContent=d.searchLabel;
  $('knowledgeConsultTitle').textContent=d.consult;$('knowledgeConsultText').textContent=d.consultText;
  $('knowledgeConsultButton').textContent=d.consultButton;$('knowledgeConsultButton').href=`./smart-quote.html?mode=help&lang=${encodeURIComponent(lang)}`;
  $('knowledgeFooterText').textContent=d.foot;$('knowledgeEmpty').textContent=d.empty;
  document.title=`${d.title} | SCWork`;
  const buttons=$('knowledgeCategories');buttons.replaceChildren();
  categories.forEach((cat,index)=>{const b=text('button','knowledge-category',d.category[index]);b.type='button';b.dataset.category=cat;const selected=cat===activeCategory;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',()=>{activeCategory=cat;refresh();});buttons.append(b);});
  const localized=i18n.resolve(source,contentLang),q=input.value.toLocaleLowerCase().trim();
  const matching=(localized.blogs||[]).filter(b=> (activeCategory==='all'||b.category===activeCategory)&&(!q||[b.title,b.text,b.body].join(' ').toLocaleLowerCase().includes(q)));
  const grid=$('knowledgeGrid');grid.replaceChildren(...matching.map(b=>card(b,d)));
  $('knowledgeResultCount').textContent=d.count(matching.length);
  $('knowledgeEmpty').hidden=matching.length>0;
 }
 input.addEventListener('input',refresh);
 window.addEventListener('scwork:locale-change',event=>{
  if(!i18n.supported.includes(event.detail?.code))return;
  lang=event.detail.code;i18n.persist(lang);
  const u=new URL(location.href);u.searchParams.set('lang',lang);try{history.replaceState(null,'',u);}catch{}
  refresh();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));
 });
 refresh();
})();
