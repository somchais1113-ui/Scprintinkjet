/* Local display only. No upload, submission, or live artwork approval. */
(() => {
  'use strict';
  const lang=document.documentElement.lang==='en'?'en':'th';
  const en={
    processLink:'See what happens before printing',processKicker:'How it works',processTitle:'Review your artwork before production',
    processLead:'See what information we need from you and when you can check and confirm your artwork.',
    step1:'Share your specs',step1Detail:'Tell us the label size, quantity and surface. Ask us for help if you are unsure about material.',
    step2:'Artwork check',step2Detail:'We check file readiness, size and cut lines and flag anything to address before printing.',
    step3:'Approve the proof',step3Detail:'Check text, placement, size and cut lines, then confirm the version to print.',
    step4:'Production and delivery',step4Detail:'Production starts after proof approval. We ship according to the schedule agreed with you.',
    proofLink:'See an example proof',proofKicker:'Print proof / Artwork review',proofTitle:'What should you check before approval?',
    proofLead:'A digital proof shows where text and artwork sit, the finished dimensions and where the labels will be cut.',
    check1:'Read the text and check the logo and placement.',check2:'Compare the finished dimensions and shape with your packaging.',check3:'Confirm which version will be used for printing.',
    proofLimit:'On-screen colour is not a guarantee of printed colour. If colour or finish matters, ask about a physical print sample before approval.',
    sampleBadge:'Example only',specSize:'Finished size',sampleSize:'50 × 50 mm',specMaterial:'Material',sampleMaterial:'White PP sticker',
    specCut:'Dark dashed line',sampleCut:'Rounded cut line',sampleCaption:'Illustrative proof for review. Not a production file or a client project.',
    evidenceKicker:'FORM 01 / Physical print photographs',evidenceTitle:'From concept render to printed sample',
    evidenceLead:'Three views of SCWork’s white PP test print. This is an in-house sample, not a client project.',
    office:'Call office',mobile:'Call mobile',line:'LINE OA'
  };
  if(lang==='en')document.querySelectorAll('[data-trust-copy]').forEach(node=>{
    const key=node.dataset.trustCopy;
    if(Object.hasOwn(en,key))node.textContent=en[key];
  });

  const cleanPhone=value=>{
    if(typeof value!=='string'||!/^[+\d().\s-]+$/.test(value))return '';
    const digits=value.replace(/[().\s-]/g,'');
    return /^(?:0[1-9]\d{7,8}|\+66[1-9]\d{7,8})$/.test(digits)?'tel:'+digits:'';
  };
  const lineLink=(url,id)=>{
    try{
      const u=new URL(url);
      const known=(u.hostname==='lin.ee'&&/^\/[A-Za-z0-9]+\/?$/.test(u.pathname))||
        (u.hostname==='line.me'&&/^\/(?:R\/)?(?:ti\/p|oaMessage)\/(?:@|%40)[A-Za-z0-9_.-]+\/?$/i.test(u.pathname));
      if(u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&!u.search&&!u.hash&&known)return u.href;
    }catch{}
    const account=typeof id==='string'?id.trim():'';
    return /^@[A-Za-z0-9_.-]{2,30}$/.test(account)?'https://line.me/R/ti/p/'+encodeURIComponent(account):'';
  };
  const channels=window.SCWORK_PUBLIC_CONTACT||{};
  const urls={office:cleanPhone(channels.officePhone),mobile:cleanPhone(channels.mobilePhone),line:lineLink(channels.lineUrl,channels.lineId)};
  const contact=document.querySelector('[data-contact]');
  if(contact){
    if(lang==='en')contact.setAttribute('aria-label','SCWork contact channels');
    contact.querySelectorAll('[data-contact-channel]').forEach(a=>{
      const href=urls[a.dataset.contactChannel];
      if(href){a.href=href;a.hidden=false;contact.hidden=false;}
    });
  }

  const slots=[
    ['sheet','แผ่นฉลากหลังพิมพ์','Printed label sheet','ภาพถ่ายแผ่นฉลากตัวอย่าง FORM 01 หลังพิมพ์','Photograph of the printed FORM 01 label sheet'],
    ['edge','ขอบไดคัตระยะใกล้','Close-up of die-cut edge','ภาพถ่ายระยะใกล้ของขอบตัดฉลากตัวอย่าง FORM 01','Photograph of the die-cut edge of a FORM 01 label'],
    ['bottle','ฉลากหลังติดบนขวด','Label applied to bottle','ภาพถ่ายฉลากตัวอย่าง FORM 01 หลังติดบนขวด','Photograph of a printed FORM 01 label applied to a bottle']
  ];
  const sample=window.SCWORK_LABEL_EVIDENCE;
  const panel=document.getElementById('print-sample');
  const grid=panel?.querySelector('[data-sample-photos]');
  const paths=slots.map(([key])=>sample?.photos?.[key]);
  const localPhoto=/^\.\/assets\/images\/labels\/print-sample\/[a-z0-9-]+\.(webp|avif|jpe?g|png)$/i;
  if(sample?.approvedForPublication===true&&grid&&new Set(paths).size===3&&paths.every(path=>typeof path==='string'&&localPhoto.test(path))){
    Promise.all(slots.map(([,captionTh,captionEn,altTh,altEn],index)=>{
      const img=new Image();
      img.alt=lang==='en'?altEn:altTh;
      img.decoding='async';
      img.fetchPriority='low';
      const loaded=typeof img.decode==='function'?null:new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;});
      img.src=paths[index];
      return (loaded||img.decode()).then(()=>{
        const figure=document.createElement('figure');
        const caption=document.createElement('figcaption');
        caption.textContent=lang==='en'?captionEn:captionTh;
        figure.append(img,caption);
        return figure;
      });
    })).then(figures=>{
      grid.replaceChildren(...figures);
      panel.hidden=false;
    }).catch(()=>{ /* Missing photos must not turn the sample into a partial or broken gallery. */ });
  }
})();
