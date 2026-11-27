(() => {
  'use strict';
  const isThai=() => document.documentElement.lang === 'th';
  const t = () => isThai() ? {
    socialEyebrow:'',
    socialTitle:'ได้รับความไว้วางใจจาก',
    socialDescription:'',
    socialNav:'ลูกค้าของเรา',
    previewLogos:'โลโก้ตัวอย่างสำหรับดูการจัดวาง',
    pauseLogos:'หยุดเลื่อนโลโก้',
    resumeLogos:'เลื่อนโลโก้ต่อ',
    footerMiniTitle:'ปรึกษาเบื้องต้นได้รวดเร็ว',
    footerMiniText:'ส่งขนาด วัสดุ จำนวน หรือรายละเอียดเบื้องต้นทาง LINE ได้เลย',
    secondaryLinksTitle:'วิธีสั่งและข้อมูลช่วยเหลือ',
    howItWorks:'ขั้นตอนขอราคางาน 4 ขั้นตอน',
    smartRfq:'เช็กราคา',
    helpfulArticles:'บทความช่วยเตรียมงานพิมพ์',
    contactCardTitle:'ติดต่อสอบถาม',
    contactCardText:'บอกลักษณะงานเบื้องต้น แล้วให้ทีม SCWORK ช่วยแนะนำ',
    footerOffice:'เบอร์สำนักงาน',
    footerMobile:'เบอร์มือถือ',
    footerLine:'LINE Official',
    footerFacebook:'Facebook Page',
    footerAddress:'ช่องทางติดต่อ',
    assistantTitle:'ผู้ช่วยติดต่อด่วน',
    assistantOpen:'เปิดเมนูติดต่อด่วน',
    phone:'โทรศัพท์',
    line:'LINE',
    facebook:'Facebook',
    messenger:'Messenger'
  } : {
    socialEyebrow:'',
    socialTitle:'Trusted by',
    socialDescription:'',
    socialNav:'Clients',
    previewLogos:'Logo mockups for layout preview',
    pauseLogos:'Pause logo animation',
    resumeLogos:'Resume logo animation',
    footerMiniTitle:'Quick consultation',
    footerMiniText:'Send size, material, quantity or a short brief on LINE.',
    secondaryLinksTitle:'Ordering & helpful information',
    howItWorks:'4-step quotation flow',
    smartRfq:'Check price',
    helpfulArticles:'Helpful printing articles',
    contactCardTitle:'Contact us',
    contactCardText:'Share a short brief and let SCWORK help with the specifications.',
    footerOffice:'Office phone',
    footerMobile:'Mobile phone',
    footerLine:'LINE Official',
    footerFacebook:'Facebook page',
    footerAddress:'Contact channel',
    assistantTitle:'Quick contact helper',
    assistantOpen:'Contact channels',
    phone:'Call',
    line:'LINE',
    facebook:'Facebook',
    messenger:'Messenger'
  };

  const contactValue=(field)=>String(window.PROCLEANING_SITE?.contact?.[field]||window.SCWORK_PUBLIC_CONTACT?.[field]||'').trim();
  const socialValue=(field)=>String(window.SCWORK_PUBLIC_CONTACT?.[field]||window.PROCLEANING_SITE?.contact?.[field]||'').trim();
  const safePhone=(raw)=>{const str=String(raw||'').trim();return /^[+\d() .-]{7,24}$/.test(str)&&str.replace(/\D/g,'').length>=8?str:'';};
  const safeUrl=(raw, rx)=>{const str=String(raw||'').trim();return rx.test(str)?str:'';};
  const unavailableContactHref=() => location.pathname.endsWith('/') || location.pathname.endsWith('/index.html') ? '#contact' : './index.html#contact';
  const byId=(id)=>document.getElementById(id);
  function setText(id, value){const el=byId(id);if(el && value!==undefined)el.textContent=String(value);}
  function setLink(id, value, href, fallback=unavailableContactHref()){
    const el=byId(id); if(!el) return;
    el.textContent = value || el.textContent || '—';
    el.href = href && href !== '#contact' ? href : fallback;
    if(href && /^https?:/i.test(href)){el.target='_blank'; el.rel='noopener noreferrer';} else {el.removeAttribute('target'); el.removeAttribute('rel');}
  }

  const validLogoName=item=>typeof item?.name==='string'&&item.name.trim();
  const validLogo=item=>item?.approved===true && validLogoName(item) &&
    /^\.\/assets\/images\/client-logos\/(?:actual\/)?[\w.-]+\.(png|webp|svg|jpg|jpeg)$/i.test(String(item.src||'').trim());
  const validMockup=item=>validLogoName(item)&&
    /^\.\/assets\/images\/client-logos\/mockups\/logo-mockup-0[1-6]\.svg$/.test(String(item.src||'').trim());
  let logoSignature, logosPaused=false;
  const brokenLogoSources=new Set();
  function availableLogos(items,valid){
    const logos=[],seen=new Set();
    for(const item of Array.isArray(items)?items:[]){
      if(!valid(item))continue;
      const src=item.src.trim();
      if(seen.has(src)||brokenLogoSources.has(src))continue;
      seen.add(src);
      logos.push({name:item.name.trim(),src});
      if(logos.length===24)break;
    }
    return logos;
  }
  function renderClientLogos(){
    const track=byId('scClientLogoTrack'),logosArea=byId('client-logos'),marquee=byId('scClientLogoMarquee'),pause=byId('scClientLogoPause'),note=byId('scClientLogoPreviewNote');
    if(!track||!logosArea||!marquee)return;
    const actual=availableLogos(window.SCWORK_CLIENT_LOGOS,validLogo);
    const logos=actual.length?actual:availableLogos(window.SCWORK_CLIENT_LOGO_MOCKUPS,validMockup);
    const isPreview=!actual.length&&logos.length>0;
    if(note){note.hidden=!isPreview;note.textContent=t().previewLogos;}
    function updatePause(){
      marquee.classList.toggle('is-paused',logosPaused);
      if(pause){
        pause.textContent=logosPaused?t().resumeLogos:t().pauseLogos;
        pause.setAttribute('aria-label',logosPaused?t().resumeLogos:t().pauseLogos);
        pause.setAttribute('title',logosPaused?t().resumeLogos:t().pauseLogos);
        pause.setAttribute('aria-pressed',String(logosPaused));
      }
    }
    updatePause();
    const signature=JSON.stringify([isPreview,logos]);
    if(signature===logoSignature)return;
    logoSignature=signature;
    const moves=logos.length>1;
    logosArea.hidden=!logos.length;
    if(pause){
      pause.hidden=true;
      pause.onclick=()=>{logosPaused=!logosPaused;updatePause();};
    }
    marquee.classList.toggle('has-loop',moves);
    const second=byId('scClientLogoTrackSecond');const rows=moves?[logos.filter((_,i)=>i%2===0),logos.filter((_,i)=>i%2===1)]:[logos,[]];
    [track,second].forEach((row,index)=>{if(!row)return;const list=rows[index];row.hidden=!list.length;if(!list.length){row.replaceChildren();return;}const repeats=moves?Math.ceil(12/list.length):1;row.style.setProperty('--logo-duration',Math.max(45,repeats*list.length*3)+'s');function group(clone){const g=document.createElement('div');g.className='sc-client-credits__group'+(clone?' sc-client-credits__group--clone':'');if(clone)g.setAttribute('aria-hidden','true');for(let pass=0;pass<repeats;pass++)for(const {name,src} of list){const chip=document.createElement('span'),img=document.createElement('img');chip.className='sc-client-credits__logo'+(pass?' sc-client-credits__logo--repeat':'');if(pass)chip.setAttribute('aria-hidden','true');img.alt=clone||pass?'':name;img.decoding='async';img.addEventListener('error',()=>{if(signature!==logoSignature||brokenLogoSources.has(src))return;brokenLogoSources.add(src);renderClientLogos();},{once:true});img.src=src;chip.append(img);g.append(chip);}return g;}row.replaceChildren(...(moves?[group(false),group(true)]:[group(false)]));});if(pause)pause.hidden=!moves;

  }

  function renderStaticCopy(){
    const copy=t();
    setText('socialProofEyebrow',copy.socialEyebrow);
    setText('socialProofTitle',copy.socialTitle);
    setText('socialProofDescription',copy.socialDescription);
    setText('clientCreditsNav',copy.socialNav);
    setText('clientCreditsFooter',copy.socialNav);
    setText('footerMiniContactTitle', copy.footerMiniTitle);
    setText('footerMiniContactText', copy.footerMiniText);
    setText('footerSecondaryLinksTitle', copy.secondaryLinksTitle);
    setText('footerHowItWorksLink', copy.howItWorks);
    setText('footerRFQLink', copy.smartRfq);
    setText('footerArticlesLink', copy.helpfulArticles);
    setText('footerContactCardTitle', copy.contactCardTitle);
    setText('footerContactCardText', copy.contactCardText);
  }

  function renderFooterContacts(){
    const copy=t();
    const office=safePhone(contactValue('officePhone')||contactValue('phone'));
    const mobile=safePhone(contactValue('mobilePhone'));
    const rawLineId=contactValue('lineId');
    const lineId=/^@[a-z0-9_.-]{2,30}$/i.test(rawLineId)?rawLineId:'';
    const lineUrl=safeUrl(contactValue('lineUrl'), /^https:\/\/(line\.me|lin\.ee)\//i) || (lineId ? 'https://line.me/R/ti/p/' + encodeURIComponent(lineId) : '');
    const facebook=safeUrl(socialValue('facebookUrl'), /^https:\/\/(www\.)?(facebook\.com|fb\.com)\//i);
    const messenger=safeUrl(socialValue('messengerUrl'), /^https:\/\/(m\.me|www\.facebook\.com|facebook\.com)\//i);
    const address=contactValue('address') || copy.footerAddress;
    setText('footerAddressText', address);
    setLink('footerOfficePhone', office || copy.footerOffice, office ? 'tel:' + office.replace(/[^+\d]/g,'') : unavailableContactHref());
    setLink('footerMobilePhone', mobile || copy.footerMobile, mobile ? 'tel:' + mobile.replace(/[^+\d]/g,'') : unavailableContactHref());
    setLink('footerLineId', lineId || copy.footerLine, lineUrl || unavailableContactHref());
    setLink('footerFacebookLink', facebook ? 'Facebook' : copy.footerFacebook, facebook || messenger || unavailableContactHref());
    setLink('footerSocialLine', 'LINE', lineUrl || unavailableContactHref());
    setLink('footerSocialFacebook', 'f', facebook || messenger || unavailableContactHref());
    setLink('footerSocialCall', copy.phone, mobile ? 'tel:' + mobile.replace(/[^+\d]/g,'') : office ? 'tel:' + office.replace(/[^+\d]/g,'') : unavailableContactHref());
    const footerCall=byId('footerSocialCall');
    if(footerCall){footerCall.innerHTML=iconMarkup('phone');footerCall.setAttribute('aria-label',copy.phone);footerCall.title=copy.phone;}
    const hide=(id,on,list=false)=>{const el=byId(id);if(el)(list?el.closest('li')||el:el).hidden=on;};
    hide('footerOfficePhone',!office,true);hide('footerMobilePhone',!mobile,true);hide('footerLineId',!lineUrl,true);
    hide('footerFacebookLink',!(facebook||messenger),true);hide('footerAddressText',!contactValue('address'),true);
    hide('footerSocialLine',!lineUrl);hide('footerSocialFacebook',!(facebook||messenger));hide('footerSocialCall',!(mobile||office));
    hide('footerContactHint',!(mobile||office||lineUrl||facebook||messenger));
    setText('footerContactHint',document.documentElement.lang==='th'?'เลือกช่องทางติดต่อ':'Choose a contact channel');
    const methods=byId('contactMethods');
    if(methods){
      methods.replaceChildren();
      const add=(name,href,value=name)=>{if(!href)return;const a=document.createElement('a');a.className='sc-real-contact';a.href=href;a.textContent=value;if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}methods.appendChild(a);};
      const phone=mobile||office;
      add(copy.phone,phone?'tel:'+phone.replace(/[^+\d]/g,''):'',phone);
      add(copy.line,lineUrl,lineId||'LINE');
      add(copy.facebook,facebook);
      add(copy.messenger,messenger);
    }
  }

  function ensureAssistant(){
    let root=byId('scContactAssistant');
    if(!root){
      root=document.createElement('div');
      root.className='sc-contact-assistant';
      root.id='scContactAssistant';
      root.innerHTML=`<div class="sc-contact-assistant__actions" id="scContactAssistantActions"></div><button class="sc-contact-assistant__toggle" id="scContactAssistantToggle" type="button" aria-expanded="false" aria-controls="scContactAssistantActions"><span>${iconMarkup('phone')}</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></span></button>`;
      document.body.appendChild(root);
      const toggle=root.querySelector('#scContactAssistantToggle');
      toggle.addEventListener('click',()=>{const open=root.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label', t().assistantOpen);});
      document.addEventListener('click',(event)=>{if(!root.contains(event.target)){root.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false');}});
    }
    return root;
  }



  function iconMarkup(kind){
    const icons={
      phone:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 3.8c.5-.5 1.3-.6 1.9-.2l2.2 1.5c.7.5 1 1.4.7 2.2l-.7 1.8c-.1.4 0 .8.2 1.1 1 1.6 2.4 3 4 4 .3.2.7.3 1.1.2l1.8-.7c.8-.3 1.7 0 2.2.7l1.5 2.2c.4.6.3 1.4-.2 1.9l-1.3 1.3c-.7.7-1.8 1-2.8.8-2.8-.6-5.5-2.1-8-4.5C7.8 14 6.3 11.3 5.7 8.5c-.2-1 .1-2.1.8-2.8l.7-.7Z" fill="currentColor"/></svg>`,
      line:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4C7 4 3 7.2 3 11.1c0 3.5 3.2 6.4 7.3 6.9l-.5 2.4c-.1.3.3.6.6.4l3-2.2h.6c4.4 0 8-3.3 8-7.5S16.4 4 12 4Z" fill="currentColor"/><circle cx="8.4" cy="11.2" r="1.1" fill="#fff"/><circle cx="12" cy="11.2" r="1.1" fill="#fff"/><circle cx="15.6" cy="11.2" r="1.1" fill="#fff"/></svg>`,
      facebook:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.7 21v-7h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7v2.1H8.7V14H11v7h2.7Z" fill="currentColor"/></svg>`,
      messenger:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.8c-4.8 0-8.7 3.6-8.7 8 0 2.5 1.2 4.8 3.2 6.3v2.9c0 .3.4.5.7.3l2.8-1.5c.6.2 1.3.2 2 .2 4.8 0 8.7-3.6 8.7-8s-3.9-8.2-8.7-8.2Z" fill="currentColor"/><path d="m8.2 14.1 2.5-2.7 2.3 1.8 2.7-3.1-2.4 1.4-2.3-1.8-2.8 4.4Z" fill="#fff"/></svg>`
    };
    return icons[kind]||'';
  }

  function renderAssistant(){
    const copy=t();
    const root=ensureAssistant();
    const panel=root.querySelector('#scContactAssistantActions');
    const office=safePhone(contactValue('officePhone')||contactValue('phone'));
    const mobile=safePhone(contactValue('mobilePhone'));
    const phone=mobile || office;
    const rawLineId=contactValue('lineId');
    const lineId=/^@[a-z0-9_.-]{2,30}$/i.test(rawLineId)?rawLineId:'';
    const lineUrl=safeUrl(contactValue('lineUrl'), /^https:\/\/(line\.me|lin\.ee)\//i) || (lineId ? 'https://line.me/R/ti/p/' + encodeURIComponent(lineId) : '');
    const facebook=safeUrl(socialValue('facebookUrl'), /^https:\/\/(www\.)?(facebook\.com|fb\.com)\//i);
    const messenger=safeUrl(socialValue('messengerUrl'), /^https:\/\/(m\.me|www\.facebook\.com|facebook\.com)\//i);
    const actions=[
      {key:'phone', label:copy.phone, href:phone ? 'tel:'+phone.replace(/[^+\d]/g,'') : '', cls:'phone'},
      {key:'line', label:copy.line, href:lineUrl, cls:'line'},
      {key:'facebook', label:copy.facebook, href:facebook, cls:'facebook'},
      {key:'messenger', label:copy.messenger, href:messenger, cls:'messenger'}
    ];
    panel.replaceChildren();
    root.hidden=!actions.some(action=>action.href);
    actions.filter(action=>action.href).forEach(action=>{
      const item=document.createElement('div'); item.className='sc-contact-assistant__quick';
      const link=document.createElement('a');link.className='sc-contact-assistant__action sc-contact-assistant__action--'+action.cls;
      link.href=action.href;link.innerHTML=iconMarkup(action.cls);link.setAttribute('aria-label',action.label);link.title=action.label;
      if(/^https?:/i.test(action.href)){link.target='_blank';link.rel='noopener noreferrer';}
      item.append(link);panel.appendChild(item);
    });
    const toggle=root.querySelector('#scContactAssistantToggle');
    toggle.setAttribute('aria-label', copy.assistantOpen);
    root.title = copy.assistantTitle;
  }

  function apply(){ renderStaticCopy(); renderFooterContacts(); renderAssistant(); renderClientLogos(); }
  window.addEventListener('scwork-site-updated', apply);
  new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('DOMContentLoaded', apply);
  apply();
})();
