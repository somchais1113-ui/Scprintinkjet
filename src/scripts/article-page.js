/* SCWork V2.1.23 — accessible TH/EN knowledge reader; plain text data, safe structured renderer. */
(() => {
  'use strict';
  const i18n=window.PROCLEANING_I18N;
  let raw=window.PROCLEANING_SITE;
  if(!i18n||!raw)return;
  const params=new URLSearchParams(location.search),preview=params.get('editorPreview')==='1';
  if(preview){try{const draft=JSON.parse(localStorage.getItem('scwork-v14-site-draft')||'null');if(draft?.brand&&Array.isArray(draft.blogs))raw=draft;}catch{}}
  const source=i18n.normalize(raw),id=params.get('post');
  const $=name=>document.getElementById(name);
  let lang=i18n.initial(source);
  const dictionary={
    th:{back:'← ความรู้งานพิมพ์',all:'← บทความทั้งหมด',quote:'เช็กราคาเบื้องต้น',kicker:'SCWORK / ความรู้งานพิมพ์',notFound:'ไม่พบบทความ',missing:'บทความนี้อาจถูกย้ายหรือลบไปแล้ว',empty:'ยังไม่มีเนื้อหาฉบับเต็ม กรุณาแก้ไขใน Site Manager',disclaimer:'ความรู้ทั่วไป · คุณสมบัติจริงขึ้นกับวัสดุและเงื่อนไขการผลิต',related:'อ่านต่อในหัวข้อที่เกี่ยวข้อง',toc:'เนื้อหาในบทความ',minutes:'นาที',noteTitle:'นำข้อมูลไปใช้ก่อนสั่งผลิต',note:'การเลือกวัสดุ กาว หมึก หรือการเคลือบควรอ้างอิงสเปกผลิตภัณฑ์จริง และทดสอบกับสภาพใช้งานก่อนยืนยันงาน',category:{materials:'วัสดุและพื้นผิว',durability:'ความทนทาน',production:'ไฟล์และการผลิต',applications:'การใช้งาน'}},
    en:{back:'← Knowledge hub',all:'← All articles',quote:'Check estimated price',kicker:'SCWORK / PRINT KNOWLEDGE',notFound:'Article not found',missing:'This article may have been moved or removed.',empty:'No full article yet. Update it in Site Manager.',disclaimer:'General guidance · Actual performance depends on tested specifications',related:'Continue exploring',toc:'In this guide',minutes:'min read',noteTitle:'Before placing an order',note:'Verify the exact facestock, adhesive, ink and finishing specifications, and test samples in the real application before approval.',category:{materials:'Materials & finishes',durability:'Durability',production:'Artwork & production',applications:'Applications'}}
  };
  function buildBlocks(body,empty){
    const parent=$('articleBody');parent.replaceChildren();
    const list=[];
    const blocks=String(body||empty).replace(/\r\n?/g,'\n').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
    let headings=0;
    for(const block of blocks){
      if(/^#{2,3}\s/.test(block)){
        const heading=document.createElement(block.startsWith('###')?'h3':'h2');
        heading.textContent=block.replace(/^#{2,3}\s*/, '').trim();
        heading.id=`section-${++headings}`;parent.append(heading);
        if(heading.tagName==='H2')list.push({id:heading.id,title:heading.textContent});
      } else if(block.split('\n').every(line=>/^[-*]\s+/.test(line.trim()))){
        const ul=document.createElement('ul');
        for(const line of block.split('\n')){const li=document.createElement('li');li.textContent=line.replace(/^\s*[-*]\s+/, '');ul.append(li);}parent.append(ul);
      } else if(block.startsWith('> ')){
        const quote=document.createElement('blockquote');quote.textContent=block.replace(/^>\s*/gm,'');parent.append(quote);
      } else {
        const p=document.createElement('p');p.textContent=block.replace(/\n/g,' ');parent.append(p);
      }
    }
    return list;
  }
  function readingTime(body,contentLang){return Math.max(3,Math.ceil(String(body||'').length/(contentLang==='th'?570:1000)));}
  function render(){
    const contentLang=['th','en'].includes(lang)?lang:'en';
    document.documentElement.lang=contentLang;
    const d=dictionary[contentLang],url=`./knowledge.html?lang=${encodeURIComponent(lang)}${preview?'&editorPreview=1':''}`;
    $('backHeader').href=url;$('backHeader').textContent=d.back;
    $('backFooter').href=url;$('backFooter').textContent=d.all;
    $('articleErrorBack').href=url;$('articleErrorBack').textContent=d.all;
    $('articleKicker').textContent=d.kicker;
    $('articleQuote').href=`./smart-quote.html?lang=${encodeURIComponent(lang)}`;$('articleQuote').textContent=d.quote;
    $('articleErrorTitle').textContent=d.notFound;$('articleErrorText').textContent=d.missing;
    $('articleDisclaimer').textContent=d.disclaimer;
    $('articleBrand').href=`./index.html?lang=${encodeURIComponent(lang)}`;
    // IMPORTANT: preserve the approved PNG logo element, never replaceChildren() on articleBrand.
    const site=i18n.resolve(source,contentLang);
    const post=(site.blogs||[]).find(a=>a.id===id);
    $('articleCopyright').textContent='© 2026 SCWork';
    if(!post){$('articleError').hidden=false;$('articleContent').hidden=true;document.title=d.notFound+' | SCWork';return;}
    $('articleError').hidden=true;$('articleContent').hidden=false;
    $('articleMeta').textContent=[d.category[post.category]||post.meta,`${readingTime(post.body,contentLang)} ${d.minutes}`].filter(Boolean).join('  ·  ');
    $('articleTitle').textContent=post.title||'';$('articleLead').textContent=post.text||'';
    const cover=$('articleCover');cover.src=post.image||'./assets/images/placeholder.svg';cover.alt=post.title||'';
    cover.onerror=()=>{cover.onerror=null;cover.src='./assets/images/placeholder.svg';};
    const headings=buildBlocks(post.body,d.empty);
    const toc=$('articleToc'),items=$('articleTocItems');items.replaceChildren();
    toc.hidden=headings.length===0;$('articleTocTitle').textContent=d.toc;
    for(const h of headings){const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.title;items.append(a);}
    $('articleNoteTitle').textContent=d.noteTitle;$('articleNoteText').textContent=d.note;
    $('articleRelatedTitle').textContent=d.related;
    const related=(site.blogs||[]).filter(a=>a.id!==id).sort((a,b)=>Number(b.category===post.category)-Number(a.category===post.category)).slice(0,3);
    const wrap=$('articleRelatedList');wrap.replaceChildren();
    for(const next of related){
      const link=document.createElement('a');link.className='article-related-card';link.href=`./article.html?post=${encodeURIComponent(next.id)}&lang=${encodeURIComponent(lang)}${preview?'&editorPreview=1':''}`;
      const image=document.createElement('img');image.src=next.image||'./assets/images/placeholder.svg';image.alt='';image.loading='lazy';image.onerror=()=>{image.onerror=null;image.src='./assets/images/placeholder.svg';};
      const title=document.createElement('span');title.textContent=next.title;link.append(image,title);wrap.append(link);
    }
    document.title=`${post.title} | SCWork`;
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=post.text||'';
  }
  window.addEventListener('scwork:locale-change',event=>{
    if(!i18n.supported.includes(event.detail?.code))return;
    lang=event.detail.code;i18n.persist(lang);
    const u=new URL(location.href);u.searchParams.set('lang',lang);try{history.replaceState(null,'',u);}catch{}
    render();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));
  });
  render();
})();
