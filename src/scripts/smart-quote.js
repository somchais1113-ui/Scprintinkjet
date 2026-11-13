/* SCWORK V1.5 — Unified public quote: calculates locally, never uploads or submits anything. */
(() => {
  'use strict';
  const maybePublic=window.SCWORK_PRICING_PUBLIC;
  const approved=maybePublic?.status==='approved'&&maybePublic.categories?.some(c=>c.id==='sticker'&&c.materials?.some(m=>m.id==='pp-white')&&c.materials?.some(m=>m.id==='pvc-sqm'));
  const data=approved?maybePublic:window.SCWORK_PRICING_DEMO,engine=window.SCWORK_PRICING_ENGINE,line=window.SCWORK_QUOTE_TO_LINE;
  if(!data||!engine||!line)return;
  const $=id=>document.getElementById(id);
  const matList=data.categories.find(c=>c.id==='sticker').materials;
  const namesEn={
    'paper-sticker':'Paper sticker', 'kraft-sticker':'Kraft paper', 'pp-white':'White PP (water resistant)',
    'pp-clear':'Transparent PP','pp-silver':'Metallic silver PP','pvc-sqm':'PVC vinyl (large format)'
  };
  const localeText={
    th:{backHome:'กลับหน้าเว็บไซต์',pageTitle:'เช็กราคาสติกเกอร์|ง่าย ๆ ในหน้าเดียว',pageLead:'เลือกสเปก ดูราคาอ้างอิง และติดต่อผ่าน LINE ได้ทันที ไม่ต้องสมัครสมาชิกหรืออัปโหลด Artwork',demoNotice:'ตารางราคาในหน้านี้เป็น DEMO ไม่ใช่ราคาขายจริง กรุณาให้เจ้าหน้าที่ยืนยันก่อนผลิต',modeTitle:'คุณอยากเริ่มแบบไหน?',modeLead:'เลือกวิธีที่สะดวกสำหรับคุณ',quickTitle:'รู้สเปกแล้ว',quickDesc:'เลือกวัสดุและขนาดได้เลย',guidedTitle:'ให้เราช่วยเลือก',guidedDesc:'ไม่แน่ใจว่าสติกเกอร์แบบไหนดี',purposeLabel:'นำสติกเกอร์ไปใช้กับอะไร?',guidedTip:'ระบบจะแนะนำวัสดุเบื้องต้น สามารถเปลี่ยนเองได้',specTitle:'รายละเอียดสติกเกอร์',specLead:'กรอกข้อมูลเพียงเท่าที่จำเป็น',presetLabel:'ฉลากสินค้า',presetDie:'สติกเกอร์ไดคัท',presetLarge:'สติกเกอร์ขนาดใหญ่',materialLabel:'วัสดุสติกเกอร์',materialHelp:'เลือกตามการใช้งานได้เลย',widthLabel:'กว้าง (ซม.)',heightLabel:'สูง (ซม.)',quantityLabel:'จำนวนที่ต้องการ (ชิ้น)',advancedTitle:'ตัวเลือกเพิ่มเติม เช่น เคลือบ / ออกแบบ / ไดคัท',cutLabel:'การตัดสติกเกอร์',cutStandard:'แบบมาตรฐาน',cutCustom:'ไดคัทตามรูปทรง (ให้ร้านประเมินเพิ่ม)',artTitle:'ไฟล์ Artwork ของคุณ',artLead:'ยังไม่มีไฟล์ก็เช็กราคาก่อนได้',artNone:'ยังไม่มีไฟล์ / ให้ร้านช่วยออกแบบ',artLine:'มีไฟล์แล้ว จะส่งใน LINE',artLink:'มีลิงก์ไฟล์แล้ว',linkLabel:'ลิงก์ Google Drive / OneDrive / Dropbox',linkHelp:'ตรวจสอบสิทธิ์การเข้าถึงก่อนส่ง และอย่าใส่ลิงก์ที่มีข้อมูลลับ',summaryEyebrow:'LIVE ESTIMATE',summaryTitle:'สรุปราคาเบื้องต้น',sumUnitLabel:'จำนวนที่คิดราคา',sumBaseLabel:'ค่าพิมพ์',sumAddonLabel:'ตัวเลือกเสริม',sumVatLabel:'VAT 7%',sumTotalLabel:'ยอดประมาณการ',priceInfo:'ราคาอ้างอิงจากข้อมูลทดสอบ ไม่ใช่ใบเสนอราคา',lineHelp:'เมื่อกดเปิด LINE ระบบจะเตรียมข้อความสเปกให้ คุณต้องกดส่งด้วยตนเองในแอป LINE อีกครั้ง',lineCtaText:'ส่งรายละเอียดไป LINE',copyCtaText:'คัดลอกรายละเอียดงาน',privacyText:'ไม่ต้อง Login · ไม่อัปโหลดไฟล์ · ไม่ส่งข้อมูลส่วนตัวเข้าเซิร์ฟเวอร์',footerBack:'กลับเว็บไซต์',mobileTotalLabel:'ราคาเบื้องต้น',mobileAction:'ดูสรุป ↗',needLine:'ยังไม่ได้ตั้งค่า LINE OA ของ SCWORK กรุณากรอก LINE ID ใน Website Manager ก่อนเปิดปุ่มนี้',badLink:'ลิงก์ไฟล์ต้องเป็น http:// หรือ https:// ที่ถูกต้อง',badData:'กรุณาตรวจสอบขนาดและจำนวนให้ถูกต้อง',bigA3:'ขนาดใหญ่กว่าแผ่น A3+ กรุณาเปลี่ยนเป็น PVC ขนาดใหญ่ หรือให้ร้านประเมิน',specialCut:'งานไดคัทตามรูปทรงอาจมีค่าใช้จ่ายเพิ่มเติมที่ยังไม่รวมในราคานี้',approvedNotice:'ราคาเบื้องต้นจาก Rate Card ที่ตรวจสอบแล้ว (ยังต้องยืนยัน Artwork, ค่าส่ง และสเปกก่อนผลิต)',demoTag:'DEMO ราคาอ้างอิง',copied:'คัดลอกสเปกเรียบร้อยแล้ว กรุณาวางในแชท LINE',copyFail:'เบราว์เซอร์ไม่อนุญาตให้คัดลอก กรุณาลองใหม่',needPrice:'รอกรอกข้อมูล',noFile:'ยังไม่มีไฟล์ / ขอคำแนะนำ',sendViaLine:'ส่งไฟล์ผ่าน LINE',withLink:'ลิงก์ไฟล์แนบ',standard:'มาตรฐาน',custom:'ไดคัทตามรูปทรง',noAddon:'ไม่มี',notConfigured:'กรุณาตั้งค่า LINE OA ก่อนเปิดใช้งานจริง',selectQty:'จำนวน',sizePresetLabel:'ขนาดยอดนิยม',qtyPresetLabel:'จำนวนยอดนิยม',minimumLabel:'ยอดขั้นต่ำ',perPieceLabel:'เฉลี่ยต่อชิ้น (รวม VAT)',demoStatus:'ราคา DEMO',approvedStatus:'Rate Card ตรวจแล้ว',approvedMeta:'Rate Card เวอร์ชัน {version} · ยังต้องยืนยันสเปกก่อนผลิต',demoMeta:'อัตราราคาตัวอย่างสำหรับทดลองเท่านั้น',approvedPrice:'ราคาประเมินจาก Rate Card ที่ตรวจแล้ว ยังไม่ใช่ใบเสนอราคายืนยัน',customSize:'กำหนดเอง',optionPurpose:['ติดสินค้า / บรรจุภัณฑ์','ติดขวด / ต้องการกันน้ำ','อยากให้พื้นฉลากโปร่งใส','ติดกระจก / ป้ายใหญ่ / ภายนอก']},
    en:{backHome:'Back to website',pageTitle:'Sticker pricing|made simple',pageLead:'Choose a specification, view a reference estimate and continue via LINE — no account or artwork upload required.',demoNotice:'This page uses DEMO rates, not SCWORK sale prices. All final prices must be confirmed before production.',modeTitle:'How would you like to begin?',modeLead:'Choose what works for you',quickTitle:'I know the specs',quickDesc:'Choose material and dimensions',guidedTitle:'Help me choose',guidedDesc:'Not sure about sticker materials',purposeLabel:'How will you use these stickers?',guidedTip:'We suggest a starting material. You can change it.',specTitle:'Sticker specifications',specLead:'Only the essentials to get started',presetLabel:'Product labels',presetDie:'Die-cut stickers',presetLarge:'Large-format vinyl',materialLabel:'Sticker material',materialHelp:'Choose based on intended use',widthLabel:'Width (cm)',heightLabel:'Height (cm)',quantityLabel:'Quantity (pieces)',advancedTitle:'Optional finishing, design and custom cutting',cutLabel:'Cutting style',cutStandard:'Standard',cutCustom:'Custom die cut (review required)',artTitle:'Your artwork',artLead:'You can get a quote without a file',artNone:'No file yet / need design support',artLine:'I will send it through LINE',artLink:'I have an artwork link',linkLabel:'Google Drive / OneDrive / Dropbox URL',linkHelp:'Check sharing permissions and avoid sharing sensitive files publicly',summaryEyebrow:'LIVE ESTIMATE',summaryTitle:'Reference price summary',sumUnitLabel:'Billable units',sumBaseLabel:'Printing',sumAddonLabel:'Extras',sumVatLabel:'VAT 7%',sumTotalLabel:'Estimated total',priceInfo:'Demo reference estimate only; not a binding quote',lineHelp:'LINE opens with a prepared draft. Please review it and tap Send in LINE yourself.',lineCtaText:'Continue in LINE',copyCtaText:'Copy job specifications',privacyText:'No login · No uploads · No customer data sent to our server',footerBack:'Back to website',mobileTotalLabel:'Reference estimate',mobileAction:'View summary ↗',needLine:'SCWORK LINE OA is not configured. Enter the real LINE ID in Website Manager first.',badLink:'Please enter a valid http:// or https:// artwork link',badData:'Please check width, height and quantity',bigA3:'Too large for an A3+ sheet. Try large-format PVC or request manual review.',specialCut:'Custom shape cutting may incur extra charges not included in this estimate',approvedNotice:'Preliminary estimate from a reviewed rate card. Artwork, shipping and production specifications still require confirmation.',demoTag:'DEMO estimate',copied:'Specifications copied. Paste them into your LINE chat.',copyFail:'Clipboard access failed. Please try again.',needPrice:'Enter specifications',noFile:'No file / need design help',sendViaLine:'Will send through LINE',withLink:'Artwork link provided',standard:'Standard',custom:'Custom die cut',noAddon:'None',notConfigured:'Please configure LINE OA before going live',selectQty:'Quantity',sizePresetLabel:'Popular sizes',qtyPresetLabel:'Popular quantities',minimumLabel:'Minimum charge',perPieceLabel:'Average / piece (incl. VAT)',demoStatus:'DEMO rates',approvedStatus:'Reviewed Rate Card',approvedMeta:'Rate Card version {version} · final specifications still require confirmation',demoMeta:'Demonstration rate card only; not a selling price',approvedPrice:'Estimated price from a reviewed rate card; not a confirmed quotation',customSize:'Custom',optionPurpose:['Product / packaging labels','Bottles / water resistance','Clear / transparent labels','Windows / signs / outdoor']}
  };
  let lang='th';try{const query=new URLSearchParams(location.search).get('lang'),saved=localStorage.getItem('procleaning-language');lang=['th','en','ar','my','zh','ru','nl','es','fr','vi','de','it','ja','ko'].includes(query)?query: ['th','en','ar','my','zh','ru','nl','es','fr','vi','de','it','ja','ko'].includes(saved)?saved:'th';}catch{}
  document.documentElement.lang=lang;
  let journey='quick',preset='label',materialId='pp-white',result=null,priceError='';
  const t=key=>(localeText[lang]||localeText.en)[key]??localeText.en[key]??key;
  const th=()=>lang==='th';
  const selectMat=()=>matList.find(x=>x.id===materialId)||matList[0];
  const currency=n=>new Intl.NumberFormat(th()?'th-TH':'en-US',{style:'currency',currency:'THB',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const number=n=>new Intl.NumberFormat(th()?'th-TH':'en-US',{maximumFractionDigits:2}).format(n);
  const materialName=m=>th()?m.name:namesEn[m.id]||m.name;
  const state=()=>{
    const m=selectMat();const area=m.mode==='area_sqm';const width=Number($('width').value),height=Number($('height').value),qty=Number($('quantity').value);
    const addonIds=[...document.querySelectorAll('[data-addon]:checked')].map(el=>el.dataset.addon);
    return {categoryId:'sticker',materialId,widthCm:width,heightCm:height,desiredPieces:qty,areaWidthCm:width,areaHeightCm:height,quantity:qty,addonIds,area};
  };
  function renderMaterialOptions(){
    const sel=$('material'),previous=materialId;sel.replaceChildren();
    for(const m of matList){const opt=document.createElement('option');opt.value=m.id;opt.textContent=materialName(m);sel.append(opt);}sel.value=previous;
    $('materialHelp').textContent=materialId==='pvc-sqm'?(th()?'งานนี้คิดตามพื้นที่ตารางเมตร':'This material is priced by square meter'):t('materialHelp');
  }
  function renderAddons(){const m=selectMat(),target=$('addonList'),checked=[...target.querySelectorAll('input:checked')].map(el=>el.dataset.addon);target.replaceChildren();
    for(const a of m.addons||[]){const label=document.createElement('label'),inp=document.createElement('input'),txt=document.createElement('span'),fee=document.createElement('small');inp.type='checkbox';inp.dataset.addon=a.id;inp.checked=checked.includes(a.id);txt.textContent=th()?a.name:(a.id==='lamination'?'Gloss / matte lamination':'Artwork design service');fee.textContent='+'+currency(a.price)+(a.type==='per_unit'?' / unit':'');label.append(inp,txt,fee);target.append(label);inp.addEventListener('change',calculate);}
  }
  function artworkState(){return document.querySelector('input[name="artwork"]:checked')?.value||'none';}
  function renderArtwork(){const isLink=artworkState()==='link';$('artLinkPanel').hidden=!isLink;calculate();}
  function quoteContact(){const site=window.PROCLEANING_SITE?.contact||{},fallback=window.SCWORK_PUBLIC_CONTACT||{};return line.lineId(String(site.lineId||fallback.lineId||''));}
  function getSpec(){const st=state(),m=selectMat(),art=artworkState(),custom=document.querySelector('input[name="cut"]:checked')?.value==='custom';return {category:th()?({label:'ฉลากสินค้า',diecut:'สติกเกอร์ไดคัท',large:'สติกเกอร์ขนาดใหญ่'})[preset]:({label:'Product label',diecut:'Die-cut sticker',large:'Large-format vinyl'})[preset],material:materialName(m),width:st.widthCm,height:st.heightCm,quantity:st.quantity,cut:custom?t('custom'):t('standard'),addons:result?.addons?.length?result.addons.map(a=>th()?a.name:(a.id==='lamination'?'Lamination':a.id==='design'?'Design service':a.name)).join(', '):t('noAddon'),result,rateVersion:approved?(data.version||'approved'):'DEMO',artwork:art==='none'?t('noFile'):art==='line'?t('sendViaLine'):t('withLink'),artworkUrl:art==='link'?$('artUrl').value.trim():''};}
  function updateActions(){
    const feedback=$('quoteFeedback'),url=$('artUrl').value.trim(),validUrl=artworkState()!=='link'||line.validArtworkLink(url),validData=!priceError;
    const id=quoteContact(),enabled=!!id&&validUrl&&validData;const cta=$('lineCta');cta.setAttribute('aria-disabled',String(!enabled));cta.tabIndex=enabled?0:-1;
    cta.href=enabled?line.lineUrl(id,line.buildMessage(getSpec(),lang)):'#';cta.target=enabled?'_blank':'_self';cta.rel=enabled?'noopener noreferrer':'';
    // On mobile, let the persistent footer action open LINE directly when ready,
    // avoiding an unnecessary tap through the summary card.
    const mobile=$('mobileAction');if(mobile){mobile.href=enabled?cta.href:'#summaryTitle';mobile.target=enabled?'_blank':'_self';mobile.rel=enabled?'noopener noreferrer':'';mobile.textContent=enabled?t('lineCtaText')+' ↗':t('mobileAction');}
    let message='';if(!id)message=t('needLine');else if(!validUrl)message=t('badLink');else if(!validData)message=priceError;feedback.textContent=message;
    $('copyCta').disabled=!validUrl||!validData;
  }
  function calculate(){
    priceError='';let reason='';try{result=engine.calculate(state(),data);}catch(error){result=null;reason=error.message==='TOO_LARGE_FOR_A3'?t('bigA3'):t('badData');priceError=reason;}
    const m=selectMat(),st=state(),custom=document.querySelector('input[name="cut"]:checked')?.value==='custom';
    $('summaryMaterial').textContent=materialName(m);$('summarySpecs').textContent=`${number(st.widthCm)} × ${number(st.heightCm)} cm · ${number(st.quantity)} ${th()?'ชิ้น':'pieces'}`;
    $('sumUnits').textContent=result?`${number(result.units)} ${m.mode==='area_sqm'?'m²':th()?'แผ่น A3+':'A3+ sheets'}`:'—';
    $('sumBase').textContent=result?currency(result.basePrint):'—';$('sumAddons').textContent=result?currency(result.addonsTotal):'—';$('sumVat').textContent=result?currency(result.vat):'—';
    const total=result?currency(result.total):'—';$('sumTotal').textContent=total;$('mobileTotal').textContent=total;
    const warn=$('priceWarning');warn.hidden=!reason&&!custom;warn.textContent=reason||t('specialCut');
    const status=$('rateStatus');status.textContent=approved?t('approvedStatus'):t('demoStatus');status.classList.toggle('is-approved',!!approved);
    $('priceInfo').textContent=approved?t('approvedPrice'):t('priceInfo');
    $('rateMeta').textContent=approved?t('approvedMeta').replace('{version}',data.version||'—'):t('demoMeta');
    const minimum=result?.minimumSurcharge||0;$('minimumRow').hidden=minimum<=0;$('minimumValue').textContent=currency(minimum);
    $('perPieceValue').textContent=result&&Number.isInteger(st.quantity)&&st.quantity>0?currency(result.total/st.quantity):'—';
    syncShortcuts();updateActions();
  }
  function syncShortcuts(){
    const size=`${Number($('width').value)}x${Number($('height').value)}`;
    document.querySelectorAll('[data-size]').forEach(b=>b.classList.toggle('is-selected',b.dataset.size===size||(b.dataset.size==='custom'&&!['3x3','5x5','8x10'].includes(size))));
    document.querySelectorAll('[data-qty]').forEach(b=>b.classList.toggle('is-selected',Number(b.dataset.qty)===Number($('quantity').value)));
  }
  function changeMaterial(id){
    const before=selectMat().mode;
    materialId=matList.some(m=>m.id===id)?id:materialId;
    const after=selectMat().mode;
    if(before!==after){
      if(after==='area_sqm'){$('width').value='100';$('height').value='100';$('quantity').value='1';}
      else{$('width').value='5';$('height').value='5';$('quantity').value='500';}
    }
    $('material').value=materialId;renderMaterialOptions();renderAddons();calculate();
  }
  function choosePreset(next){preset=next;
    document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('is-selected',b.dataset.preset===preset));
    if(next==='label'){document.querySelector('input[name="cut"][value="standard"]').checked=true;changeMaterial('pp-white');}if(next==='diecut'){document.querySelector('input[name="cut"][value="custom"]').checked=true;changeMaterial('pp-white');}
    if(next==='large'){changeMaterial('pvc-sqm');if(Number($('width').value)<30)$('width').value='100';if(Number($('height').value)<30)$('height').value='100';$('quantity').value='1';calculate();}
  }
  function chooseJourney(next){journey=next;$('guidedPanel').hidden=next!=='guided';document.querySelectorAll('[data-mode]').forEach(b=>{const yes=b.dataset.mode===next;b.classList.toggle('is-selected',yes);b.setAttribute('aria-pressed',String(yes));});if(next==='guided')guidedChoice();}
  function guidedChoice(){const id=$('purpose').value;const ids={label:'paper-sticker',waterproof:'pp-white',transparent:'pp-clear',outdoor:'pvc-sqm'};if(id==='outdoor')choosePreset('large');else{preset='label';document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('is-selected',b.dataset.preset==='label'));changeMaterial(ids[id]||'pp-white');}}
  function renderLabels(){const labelIds=['backHome','pageLead','demoNotice','modeTitle','modeLead','quickTitle','quickDesc','guidedTitle','guidedDesc','purposeLabel','guidedTip','specTitle','specLead','presetLabel','presetDie','presetLarge','materialLabel','widthLabel','heightLabel','quantityLabel','advancedTitle','cutLabel','cutStandard','cutCustom','artTitle','artLead','artNone','artLine','artLink','linkLabel','linkHelp','summaryEyebrow','summaryTitle','sumUnitLabel','sumBaseLabel','sumAddonLabel','sumVatLabel','sumTotalLabel','lineHelp','lineCtaText','copyCtaText','privacyText','footerBack','mobileTotalLabel','sizePresetLabel','qtyPresetLabel','minimumLabel','perPieceLabel'];
    labelIds.forEach(id=>{if($(id))$(id).textContent=t(id);});if(approved)$('demoNotice').textContent=t('approvedNotice');$('pageTitle').innerHTML=t('pageTitle').split('|').map((v,i)=>i?'<em>'+v+'</em>':v).join('<br>');$('purpose').querySelectorAll('option').forEach((el,i)=>el.textContent=t('optionPurpose')[i]);$('mobileAction').textContent=t('mobileAction');
    const note=document.getElementById('translationNote');if(note)note.remove();if(lang!=='th'&&lang!=='en'){const p=document.createElement('p');p.id='translationNote';p.className='q-translation-note';p.textContent='The Smart Quote technical interface is currently in English for this language. The main website retains your language selection.';p.style.cssText='color:#805c2a;background:#fff6e7;padding:10px 14px;border-radius:8px;font-size:11px;';document.querySelector('.q-intro').after(p);}
    renderMaterialOptions();renderAddons();calculate();
  }
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>chooseJourney(b.dataset.mode)));
  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>choosePreset(b.dataset.preset)));
  $('purpose').addEventListener('change',guidedChoice);
  document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.size==='custom'){$('width').focus();return;}const [w,h]=b.dataset.size.split('x').map(Number);$('width').value=w;$('height').value=h;calculate();}));
  document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{$('quantity').value=b.dataset.qty;calculate();}));
  $('material').addEventListener('change',e=>changeMaterial(e.target.value));
  ['width','height','quantity','artUrl'].forEach(id=>$(id).addEventListener('input',calculate));
  $('quantityPlus').addEventListener('click',()=>{const v=Math.min(1000000,(Number($('quantity').value)||0)+100);$('quantity').value=v;calculate();});
  $('quantityMinus').addEventListener('click',()=>{const v=Math.max(1,(Number($('quantity').value)||1)-100);$('quantity').value=v;calculate();});
  document.querySelectorAll('input[name="cut"]').forEach(el=>el.addEventListener('change',calculate));
  document.querySelectorAll('input[name="artwork"]').forEach(el=>el.addEventListener('change',renderArtwork));
  $('lineCta').addEventListener('click',e=>{if(e.currentTarget.getAttribute('aria-disabled')==='true'){e.preventDefault();$('quoteFeedback').textContent=quoteContact()?t('badData'):t('needLine');}});
  $('copyCta').addEventListener('click',async()=>{const msg=line.buildMessage(getSpec(),lang);try{await navigator.clipboard.writeText(msg);$('quoteFeedback').textContent=t('copied');}catch{try{const ta=document.createElement('textarea');ta.value=msg;ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();if(!document.execCommand('copy'))throw Error('copy');ta.remove();$('quoteFeedback').textContent=t('copied');}catch{$('quoteFeedback').textContent=t('copyFail');}}});
  $('mobileAction').addEventListener('click',()=>{});
  window.addEventListener('scwork:locale-change',e=>{if(!e.detail?.code)return;lang=e.detail.code;renderLabels();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));});
  // Open with the best matching preset when entered from a product card.
  // Never require the customer to reselect an obvious service type.
  let chosenCategory='';try{chosenCategory=(new URLSearchParams(location.search).get('category')||'').toLowerCase();}catch{}
  if(chosenCategory){
    if(/large|sign|vinyl|glass|retail|outdoor|shop|window/.test(chosenCategory))choosePreset('large');
    else if(/die.?cut|contour|shape/.test(chosenCategory))choosePreset('diecut');
  }
  renderLabels();renderArtwork();
})();
