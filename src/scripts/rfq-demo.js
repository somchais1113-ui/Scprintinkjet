/* SCWork public-facing Smart Print RFQ v2.4 — intentionally demo-only. */
(() => {
  'use strict';
  const A = window.PCAdminCore;
  const form = document.getElementById('smartRfqForm');
  if (!form || !A) return;
  const $ = id => document.getElementById(id);
  const copy = {
    en: {
      eyebrow:'SCWORK · STICKER RFQ',title:'Get production-ready<br><em>requirements.</em>',intro:'Tell us the print specifications in three simple steps. This interactive demonstration creates a local-only sample RFQ; it does not submit data to a real business.',securityHead:'Demo environment',securityBody:'Do not enter real names, emails, phone numbers, confidential artwork or customer data. The artwork selector only checks whether a file was selected—it never uploads it.',step1:'Service',step2:'Specifications',step3:'Review',section1:'THE PROJECT',h2step1:'What would you like to produce?',category:'Product category',choose:'Select a product',project:'Sample project title',projectExample:'Example: Bottle labels for a new product',popular:'Quick select:',section2:'PRODUCT SPECIFICATION',h2step2:'Define the details.',width:'Width',height:'Height',unit:'Measurement unit',quantity:'Quantity',qtyUnit:'Quantity unit',material:'Material',finish:'Finishing',sides:'Printing sides',date:'Target date (optional)',artwork:'Artwork readiness',file:'Select local sample file (not uploaded)',fileNote:'The file stays on your device. Only a true/false selection flag is recorded.',notes:'Requirements / notes',notesExample:'Example: White ink, outdoor use, contour cut',section3:'REVIEW THE REQUEST',h2step3:'One last check.',acknowledge:'I understand this is a local demonstration, not a real submission, and I have not entered personal or confidential data.',back:'← Back',next:'Continue →',submit:'Save demo RFQ →',sideTitle:'Better requirements.<br>Better estimates.',sideIntro:'Capture specifications consistently before a price is estimated. In the demo, you can continue to the Quotation Builder in the same browser.',sideOne:'Product and quantity',sideTwo:'Dimensions, material & finish',sideThree:'Workflow and quote versioning',where:'Where does my RFQ go?',whereAnswer:'Same-browser localStorage only. Open Admin → RFQ & Quotations to find the demo record. No cross-device sync or real submission.',openAdmin:'Open demo admin ↗',homeLink:'← Website',noInput:'Please complete the required fields before continuing.',mustAccept:'Please confirm the demo-only notice.',successTitle:'Your demo RFQ is saved.',successText:'No request was sent to a company. Find it in the local admin dashboard on this browser, or download the sample JSON.',openQuote:'Open Quotation Builder ↗',openRfq:'View RFQ Pipeline ↗',downloadJson:'Download demo RFQ JSON',newForm:'Start another demo',saveFailed:'Could not save the demo RFQ.',reviewLabels:['Category','Project','Size','Quantity','Material','Finish','Artwork','Date','Additional notes'],artReady:{ready:'Artwork ready',need_design:'Needs design',review:'Needs preflight'}
    },
    th: {
      eyebrow:'SCWORK · STICKER RFQ',title:'เก็บสเปกงานให้ครบ<br><em>ก่อนเสนอราคา</em>',intro:'รวบรวมรายละเอียดงานพิมพ์ใน 3 ขั้นตอน เพื่อทดลองสร้าง RFQ ในเครื่องนี้เท่านั้น ไม่ใช่การส่งข้อมูลไปยังบริษัทจริง',securityHead:'พื้นที่ทดลองระบบ',securityBody:'ห้ามใส่ชื่อ เบอร์โทร อีเมลลูกค้าจริง หรือไฟล์งานลับ ตัวเลือกไฟล์ Artwork ไม่ได้อัปโหลดไฟล์ใด ๆ',step1:'ประเภทงาน',step2:'รายละเอียด',step3:'ตรวจสอบ',section1:'ข้อมูลโปรเจกต์',h2step1:'ต้องการผลิตงานประเภทไหน?',category:'ประเภทบริการ',choose:'เลือกประเภทสินค้า',project:'ชื่อโปรเจกต์ตัวอย่าง',projectExample:'เช่น สติกเกอร์ฉลากสินค้าตัวอย่าง',popular:'หมวดที่ใช้บ่อย:',section2:'สเปกงานผลิต',h2step2:'กำหนดรายละเอียดงาน',width:'ความกว้าง',height:'ความสูง',unit:'หน่วยขนาด',quantity:'จำนวนที่ต้องการ',qtyUnit:'หน่วยจำนวน',material:'วัสดุ',finish:'งานหลังพิมพ์',sides:'จำนวนด้านที่พิมพ์',date:'วันที่ต้องการ (ไม่บังคับ)',artwork:'ความพร้อมของไฟล์',file:'เลือกไฟล์ตัวอย่าง (ไม่อัปโหลด)',fileNote:'ไฟล์อยู่ในเครื่องเท่านั้น ระบบบันทึกเพียงว่ามีการเลือกไฟล์หรือไม่',notes:'เงื่อนไขเพิ่มเติม',notesExample:'เช่น ใช้ภายนอกอาคาร หมึกขาว ไดคัท',section3:'ตรวจสอบรายละเอียด',h2step3:'ตรวจให้ครบก่อนบันทึก',acknowledge:'ยืนยันว่าเข้าใจว่านี่คือข้อมูลทดลองที่เก็บบนเครื่อง และไม่ได้ใส่ข้อมูลส่วนตัวหรือไฟล์งานลับ',back:'← ย้อนกลับ',next:'ถัดไป →',submit:'บันทึก RFQ ตัวอย่าง →',sideTitle:'สเปกครบขึ้น<br>ประเมินราคาง่ายขึ้น',sideIntro:'เก็บรายละเอียดงานก่อนเสนอราคาแบบเป็นระบบ แล้วทดลองส่งข้อมูลไปยัง Quote Builder ใน Browser เดียวกัน',sideOne:'ประเภทสินค้าและจำนวน',sideTwo:'ขนาด วัสดุ และการเคลือบ',sideThree:'ติดตามงานและเวอร์ชันใบเสนอราคา',where:'ข้อมูล RFQ ถูกส่งไปที่ไหน?',whereAnswer:'เก็บเฉพาะ localStorage ใน Browser นี้เท่านั้น เปิด Admin → RFQ & Quotations เพื่อดูข้อมูล ไม่ได้ส่งผ่านเครือข่ายหรือซิงก์ข้ามเครื่อง',openAdmin:'เปิด Admin ทดลอง ↗',homeLink:'← เว็บไซต์',noInput:'กรุณาระบุข้อมูลที่จำเป็นให้ครบ',mustAccept:'กรุณายืนยันเงื่อนไขข้อมูลทดลอง',successTitle:'บันทึก RFQ ตัวอย่างแล้ว',successText:'ไม่มีการส่งข้อมูลไปยังบริษัท คุณสามารถดูข้อมูลใน Admin เครื่องเดียวกันหรือดาวน์โหลด JSON ตัวอย่าง',openQuote:'สร้างใบเสนอราคา ↗',openRfq:'ดูรายการ RFQ ↗',downloadJson:'ดาวน์โหลด JSON ตัวอย่าง',newForm:'เริ่มตัวอย่างใหม่',saveFailed:'ไม่สามารถบันทึก RFQ ตัวอย่างได้',reviewLabels:['ประเภทงาน','ชื่อโปรเจกต์','ขนาด','จำนวน','วัสดุ','งานหลังพิมพ์','ความพร้อมไฟล์','วันที่','หมายเหตุ'],artReady:{ready:'ไฟล์พร้อม',need_design:'ต้องการให้ออกแบบ',review:'ต้องตรวจ Preflight'}
    }
  };
  const network=window.PCRFQNetwork||{enabled:false};
  const connected=network.enabled;
  const liveCopy={
    en:{eyebrow:'CONNECTED SMART RFQ · V2.5',intro:'Send one quotation request directly to our team. Once saved to the system you will receive a reference number; an email acknowledgement is queued automatically.',securityHead:'One-step submission',securityBody:'No email app is needed. Your request is recorded to our secure database when the form confirms success. Artwork uploads are not available yet.',acknowledge:'',submit:'Submit request →',sideIntro:'Enter print specifications once. We will review the submission and respond by email.',whereAnswer:'Submitted securely to our central RFQ database. Your acknowledgement email may arrive shortly after the reference is issued.',successTitle:'Request received successfully',successText:'Your request was saved. We will follow up by email. Automatic acknowledgement can be delayed if our email provider is unavailable.',contactHeading:'Contact details for the acknowledgement',customerName:'Full name',customerEmail:'Email address',customerPhone:'Phone number (optional)',noFileUpload:'Artwork uploads are not enabled. Files selected locally are NOT sent.',liveConsent:'I agree to use of my contact details to respond to this quotation request (see Privacy Notice).',pending:'Submitting securely…',saveFailed:'Could not confirm receipt',noVerification:'Complete the security check before submitting.',liveMissing:'Please enter a valid name, email address and consent.'},
    th:{eyebrow:'CONNECTED SMART RFQ · V2.5',intro:'ส่งคำขอราคาเข้าระบบโดยตรงเพียงครั้งเดียว เมื่อบันทึกสำเร็จจะได้รับหมายเลขอ้างอิง และระบบจะจัดคิวส่งอีเมลยืนยันให้อัตโนมัติ',securityHead:'ส่งข้อมูลครั้งเดียว',securityBody:'ไม่ต้องเปิดแอป Mail ระบบยืนยันสำเร็จหลังบันทึกเข้าฐานข้อมูลแล้วเท่านั้น ขณะนี้ยังไม่รองรับการอัปโหลด Artwork',acknowledge:'',submit:'ส่งคำขอราคา →',sideIntro:'กรอกสเปกงานพิมพ์ให้ครบเพียงครั้งเดียว ทีมงานจะตรวจสอบและติดต่อกลับผ่านอีเมล',whereAnswer:'บันทึกเข้าฐานข้อมูลกลางของเรา อีเมลตอบรับอาจใช้เวลาเพิ่มเติมหากผู้ให้บริการอีเมลขัดข้อง',successTitle:'ได้รับคำขอราคาแล้ว',successText:'บันทึกคำขอสำเร็จแล้ว ทีมงานจะติดต่อกลับผ่านอีเมล ระบบตอบรับอัตโนมัติอาจล่าช้าได้',contactHeading:'ข้อมูลผู้ติดต่อเพื่อรับการยืนยัน',customerName:'ชื่อ–นามสกุล',customerEmail:'อีเมล',customerPhone:'เบอร์โทร (ไม่บังคับ)',noFileUpload:'ยังไม่รองรับการอัปโหลดไฟล์ Artwork ระบบจะไม่ส่งไฟล์ที่เลือกจากเครื่อง',liveConsent:'ยินยอมให้ใช้ข้อมูลผู้ติดต่อเพื่อดำเนินการคำขอใบเสนอราคา (ดูประกาศความเป็นส่วนตัว)',pending:'กำลังบันทึกคำขอ…',saveFailed:'ยังยืนยันการรับคำขอไม่ได้',noVerification:'กรุณาผ่านการตรวจสอบความปลอดภัยก่อนส่ง',liveMissing:'กรุณากรอกชื่อ อีเมลที่ถูกต้อง และยืนยันการใช้ข้อมูล'}
  };
  if(connected){for(const lang of ['th','en'])Object.assign(copy[lang],liveCopy[lang]);}
  const productNames = {
    'Sticker & Label':['Sticker & Label','สติกเกอร์และฉลาก'],
    'Large Format Inkjet':['Large Format Inkjet','งานอิงค์เจ็ตขนาดใหญ่'],
    'Display & Signage':['Display & Signage','ป้ายและงานดิสเพลย์'],
    'Packaging Prototype':['Packaging Prototype','ต้นแบบบรรจุภัณฑ์'],
    'POSM & Retail':['POSM & Retail','สื่อส่งเสริมการขาย'],
    'Artwork & Prepress':['Artwork & Prepress','งานอาร์ตเวิร์กและเตรียมพิมพ์']
  };
  // Product-specific material / finish choices are suggestions, NOT supplier pricing rules.
  const presets = {
    'Sticker & Label': {unit:'pcs',measure:'mm',quantity:500, materials:['PVC Sticker','PP Sticker','Paper Sticker','Clear Sticker','Other / To be advised'], finishes:['None','Matte Lamination','Gloss Lamination','Die Cut','Kiss Cut']},
    'Large Format Inkjet': {unit:'sqm',measure:'cm',quantity:10, materials:['Vinyl Banner','Mesh Banner','Backlit Film','Synthetic PP','Photo Paper','Other / To be advised'], finishes:['None','Eyelets','Hem & Eyelets','Mounting','Matte Lamination']},
    'Display & Signage': {unit:'pcs',measure:'cm',quantity:2,materials:['Foamboard','Acrylic','Aluminium Composite','Corrugated Board','Other / To be advised'],finishes:['Die Cut','Mounting','Lamination','None']},
    'Packaging Prototype': {unit:'pcs',measure:'mm',quantity:100,materials:['Duplex Board','Kraft Paper','Ivory Board','Corrugated Board','Other / To be advised'],finishes:['Die Cut','Matte Lamination','Gloss Lamination','Scoring / Folding','None']},
    'POSM & Retail': {unit:'sets',measure:'cm',quantity:5,materials:['Foamboard','PP Synthetic','Acrylic','Corrugated Board','Other / To be advised'],finishes:['Mounting','Die Cut','Matte Lamination','None']},
    'Artwork & Prepress': {unit:'jobs',measure:'mm',quantity:1,materials:['Digital Artwork','Print-ready PDF','Other / To be advised'],finishes:['Preflight review','Design and layout','Color separation','None']}
  };
  function applyPreset(category) {
    const p=presets[category];if(!p)return;
    const pick=(name,values)=>{const select=form.elements[name];select.innerHTML=values.map(v=>`<option value="${v}">${v}</option>`).join('');};
    pick('material',p.materials);pick('finish',p.finishes);
    form.elements.unit.value=p.unit;
    form.elements.dimensionUnit.value=p.measure;
    form.elements.quantity.value=String(p.quantity);
  }
  for(const [code,pack] of Object.entries(window.SCWORK_EXTRA_LOCALES||{})){copy[code]={...copy.en,...(pack.rfq||{})};}
  const languageSaved=()=>{try{return localStorage.getItem('procleaning-language')||'en';}catch{return'en';}};
  const supported=window.SCWORK_LANGUAGES||['ar','my','zh','ru','nl','es','en','th','fr','vi','de','it','ja','ko'];
  let language = supported.includes(new URLSearchParams(location.search).get('lang'))?new URLSearchParams(location.search).get('lang'):(supported.includes(languageSaved())?languageSaved():'th');
  let step=1,submittedId='';
  if(connected){
    $('rfqLiveFields').hidden=false;
    $('demoConsent').hidden=true;
    const file=$('artworkFile');file.disabled=true;file.closest('.rfq-field').hidden=true;
    form.elements.customerName.required=true;form.elements.customerEmail.required=true;
  }

  const t=key=>(copy[language]||copy.en)[key]||copy.en[key]||key;
  const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  function setLanguage(next) {
    if(!supported.includes(next))return; language=next;document.documentElement.lang=next;
    try{localStorage.setItem('procleaning-language',next);}catch{}
    document.querySelectorAll('[data-language]').forEach(b=>{const on=b.dataset.language===next;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(key==='title'||key==='sideTitle')el.innerHTML=t(key);else el.textContent=t(key);});
    document.querySelectorAll('[data-placeholder]').forEach(el=>el.placeholder=t(el.dataset.placeholder));
    $('homeLink').textContent=t('homeLink');
    for(const op of $('category').options){if(productNames[op.value])op.textContent=productNames[op.value][next==='th'?1:0];}
    if(step===3)review();
  }
  function stepValid(current) {
    if(current===3){
      if(!connected)return $('demoAcknowledged').checked;
      const name=form.elements.customerName,email=form.elements.customerEmail;
      if(!name.checkValidity()){name.reportValidity();return false;}
      if(!email.checkValidity()){email.reportValidity();return false;}
      if(!$('liveAcknowledged').checked)return false;
      return true;
    }
    const fields=[...document.querySelector(`.rfq-step[data-step="${current}"]`).querySelectorAll('input,select,textarea')];
    const bad=fields.find(el=>el.type!=='file'&&!el.checkValidity());if(bad){bad.reportValidity();return false;}return true;
  }
  function showFeedback(message) {const box=$('rfqFormFeedback');box.hidden=false;box.textContent=message;}
  function clearFeedback(){const box=$('rfqFormFeedback');box.hidden=true;box.textContent='';}
  function values(){const fd=new FormData(form);return Object.fromEntries([...fd.entries()].filter(([k])=>k!=='artworkFile'));}
  function review(){const v=values(),items=[v.category,v.title,`${v.width} × ${v.height} ${v.dimensionUnit}`,`${v.quantity} ${v.unit}`,v.material,v.finish,t('artReady')[v.artwork]||v.artwork,v.deadline||'—',v.notes||'—'];$('rfqReview').innerHTML=copy[language].reviewLabels.map((label,i)=>`<div class="review-row"><span>${escape(label)}</span><strong>${escape(items[i])}</strong></div>`).join('');}
  function showStep(next){if(next<1||next>3)return;step=next;clearFeedback();document.querySelectorAll('.rfq-step').forEach(el=>el.hidden=Number(el.dataset.step)!==step);document.querySelectorAll('[data-step-target]').forEach(el=>{const n=Number(el.dataset.stepTarget);el.classList.toggle('active',n===step);el.classList.toggle('done',n<step);el.setAttribute('aria-current',n===step?'step':'false');});$('rfqBack').hidden=step===1;$('rfqNext').hidden=step===3;$('rfqSubmit').hidden=step!==3;if(step===3){review();if(connected)network.renderChallenge();}}
  function triggerDownload(filename,body){const blob=new Blob([JSON.stringify(body,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
  async function finish() {
    if(!stepValid(3)){showFeedback(connected?t('liveMissing'):t('mustAccept'));return;}
    if(connected){
      const v=values();
      const button=$('rfqSubmit');button.disabled=true;
      const original=button.textContent;button.textContent=t('pending');clearFeedback();
      try{
        const outcome=await network.submit({name:v.customerName,email:v.customerEmail,phone:v.customerPhone||'',title:v.title,category:v.category,quantity:Number(v.quantity),unit:v.unit,language,
          specs:{width:Number(v.width),height:Number(v.height),dimensionUnit:v.dimensionUnit,material:v.material,finish:v.finish,printSides:v.printSides,artwork:v.artwork,deadline:v.deadline||'',notes:v.notes||''}});
        form.hidden=true;document.querySelector('.rfq-steps').hidden=true;$('rfqSuccess').hidden=false;
        $('rfqSuccess').innerHTML=`<div class="rfq-success"><div class="check">✓</div><div class="section-kicker">${escape(outcome.reference)} • DATABASE CONFIRMED</div><h2>${escape(t('successTitle'))}</h2><p>${escape(t('successText'))}</p><p><strong>${escape(v.title)}</strong> · ${escape(v.quantity)} ${escape(v.unit)}</p><button type="button" id="copyRfqReference">${language==='th'?'คัดลอกเลขอ้างอิง':'Copy reference'}</button><a href="./index.html">${escape(t('homeLink'))}</a></div>`;
        $('copyRfqReference').addEventListener('click',()=>navigator.clipboard?.writeText(outcome.reference));
      }catch(err){showFeedback(t('saveFailed')+': '+String(err.message||'NETWORK_ERROR')+(language==='th'?' · โปรดลองใหม่ ระบบจะตรวจสอบเลขคำขอเดิมก่อนบันทึกซ้ำ':' · Retry safely using the same submission ID'));}
      finally{button.disabled=false;button.textContent=original;}
      return;
    }
    try{
      const v=values();
      const before=A.read().rfqs.length;
      A.addWebsiteDemoRfq({...v,fileSelected:!!$('artworkFile').files?.length});
      const snap=A.snapshot();if(snap.rfqs.length!==before+1)throw Error('Save incomplete');
      const rfq=snap.rfqs.at(-1),customer=snap.customers.find(c=>c.id===rfq.customerId);
      submittedId=rfq.id;
      form.hidden=true;document.querySelector('.rfq-steps').hidden=true;
      $('rfqSuccess').hidden=false;
      $('rfqSuccess').innerHTML=`<div class="rfq-success"><div class="check">✓</div><div class="section-kicker">${escape(rfq.id)} • LOCAL DEMO</div><h2>${escape(t('successTitle'))}</h2><p>${escape(t('successText'))}</p><p><strong>${escape(rfq.title)}</strong> · ${escape(rfq.quantity)} ${escape(rfq.unit)} · ${escape(rfq.category)}</p><a href="./tools/business/quote-builder.html?rfq=${encodeURIComponent(rfq.id)}">${escape(t('openQuote'))}</a><a href="./tools/business/quotations.html">${escape(t('openRfq'))}</a><button type="button" id="downloadRfq">${escape(t('downloadJson'))}</button><button type="button" id="resetRfq">${escape(t('newForm'))}</button></div>`;
      $('downloadRfq').addEventListener('click',()=>triggerDownload(`RFQ-demo-${rfq.id}.json`,{demoOnly:true,schemaVersion:1,customer,rfq}));
      $('resetRfq').addEventListener('click',()=>location.reload());
    }catch(err){showFeedback(t('saveFailed')+': '+err.message);}
  }
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  window.addEventListener('scwork:locale-change',e=>{setLanguage(e.detail?.code);window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:language}}));});
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{$('category').value=button.dataset.category;applyPreset(button.dataset.category);}));
  $('category').addEventListener('change',()=>applyPreset($('category').value));
  $('rfqNext').addEventListener('click',()=>{if(!stepValid(step)){showFeedback(t('noInput'));return;}showStep(step+1);});
  $('rfqBack').addEventListener('click',()=>showStep(step-1));
  document.querySelectorAll('[data-step-target]').forEach(button=>button.addEventListener('click',()=>{const n=Number(button.dataset.stepTarget);if(n<step)showStep(n);else if(n===step+1&&stepValid(step))showStep(n);}));
  form.addEventListener('submit',e=>{e.preventDefault();finish();});
  // Product deep-link from the storefront; only allow known categories.
  const requestedCategory=new URLSearchParams(location.search).get('category');
  if(requestedCategory && Object.prototype.hasOwnProperty.call(presets,requestedCategory)){
    $('category').value=requestedCategory;applyPreset(requestedCategory);
  }else if(!new URLSearchParams(location.search).has('type')){
    $('category').value='Sticker & Label';applyPreset('Sticker & Label');
  }
  // Optional one-tab handoff from the demonstrator; no personal details or artwork are transferred.
  function takeEstimatorHandoff(){
    if(new URLSearchParams(location.search).get('fromEstimator')!=='1')return;
    let item;
    try { item=JSON.parse(sessionStorage.getItem('scwork-pricing-handoff')||'null'); }
    catch { return; }
    if(!item || item.schemaVersion!==1 || !item.nonBinding || Date.now()-item.at>15*60*1000)return;
    const safe=x=>Number.isFinite(Number(x))&&Number(x)>0?Number(x):null;
    const details=item.details||{};
    let category='Sticker & Label';
    if(item.categoryId==='signage')category='Display & Signage';
    else if(item.materialId==='pvc-sqm')category='Large Format Inkjet';
    $('category').value=category;applyPreset(category);
    const materialSelect=form.elements.material;
    const options={
      'paper-sticker':'Paper Sticker','kraft-sticker':'Paper Sticker',
      'pp-white':'PP Sticker','pp-clear':'PP Sticker','pp-silver':'PP Sticker',
      'pvc-sqm':'PVC Sticker','vinyl-banner':'Vinyl Banner'
    };
    const suggested=options[item.materialId];
    if(suggested && [...materialSelect.options].some(o=>o.value===suggested))materialSelect.value=suggested;
    const wh=item.mode==='area_sqm'?[safe(details.widthCm),safe(details.heightCm)]:[safe(details.widthCm),safe(details.heightCm)];
    if(wh[0]&&wh[1]){form.elements.width.value=String(wh[0]);form.elements.height.value=String(wh[1]);form.elements.dimensionUnit.value='cm';}
    const qty=safe(item.mode==='a3_sheet'?details.requestedPieces:item.mode==='area_sqm'?details.quantity:item.mode==='size_preset'?details.requestedQuantity:details.requestedQuantity);
    if(qty&&Number.isInteger(qty))form.elements.quantity.value=String(qty);
    const safeName=String(item.materialName||'Sticker').slice(0,80).replace(/[<>]/g,'');
    form.elements.title.value=(language==='th'?'สอบถามผลิต ':'Quote request for ')+safeName;
    const estimateNumber=safe(item.total);
    const note=(language==='th'?'สเปกจากเครื่องคำนวณราคา SCWork (ข้อมูลราคาสาธิต ไม่ผูกพัน): ':'Specifications from SCWork demo estimator (non-binding reference rates): ')+
      safeName+'; '+(wh[0]&&wh[1]?wh.join('×')+' cm; ':'')+'qty '+(qty||'—')+'; '+
      (estimateNumber?'illustrative total ฿'+estimateNumber.toFixed(2)+'. ':'')+
      (language==='th'?'ต้องตรวจสอบวัสดุและต้นทุนก่อนเสนอราคาจริง':'Final price subject to production review');
    form.elements.notes.value=note.slice(0,500);
    const notice=document.getElementById('scEstimateHandoffNotice');
    if(notice){notice.textContent=language==='th'?'นำสเปกจากเครื่องคำนวณมาใส่ให้แล้ว · ราคาที่เห็นเป็นเพียงตัวอย่าง ไม่ใช่ราคายืนยัน':'Specifications imported from estimator · demo price is not a confirmed quote';notice.hidden=false;}
    try{sessionStorage.removeItem('scwork-pricing-handoff');}catch{}
  }
  takeEstimatorHandoff();
  setLanguage(language);showStep(1);
})();
