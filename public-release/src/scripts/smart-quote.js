/* SCWORK V1.8.2 — standard label estimates, manual quotes and LINE handoff. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const all=s=>[...document.querySelectorAll(s)];
  const params=new URLSearchParams(location.search);
  const languages=['th','en','ar','my','zh','ru','nl','es','fr','vi','de','it','ja','ko'];
  let saved='';try{saved=localStorage.getItem('procleaning-language');}catch{}
  let lang=[params.get('lang'),saved,'th'].find(l=>languages.includes(l));
  const engine=window.SCWORK_PRICING_ENGINE,line=window.SCWORK_QUOTE_TO_LINE;
  const card=window.SCWORK_PRICING_PUBLIC,baseCatalog=window.SCWORK_QUOTE_CATALOG;
  if(!engine||!line||!Array.isArray(baseCatalog))return;
  const phase=window.SCWORK_LABEL_QUOTE_PLAN, liveEstimate=window.SCWORK_LIVE_QUOTE_ENGINE;
  const bill=window.SCWORK_QUOTE_BILLING,billUI=window.SCWORK_QUOTE_BILLING_UI;
  let plan=null;
  function refreshApprovedBuyerPlan(){
    const buyer=document.getElementById('billBuyer')?.value||'individual';
    const buyerCard=engine.forBuyer?engine.forBuyer(card,buyer):card;
    const original=phase?.prepare(buyerCard,engine);
    plan=bill?bill.rated(original,window.SCWORK_BILLING_CONFIG):original;
  }
  refreshApprovedBuyerPlan();
  const strings={
    th:{
      title:'เช็กราคาสติกเกอร์ | SCWORK',quoteKicker:'SCWORK / ราคาสติกเกอร์',quoteSkip:'ข้ามไปยังแบบเลือกสเปก',quoteNav:'เมนูหน้าเช็กราคา',backHome:'กลับหน้าเว็บไซต์',
      pageTitle:'เช็กราคาสติกเกอร์|ตามสเปก',pageLead:'เลือกวัสดุ ขนาด และจำนวนเพื่อเตรียมขอราคา ไม่ต้องสมัครสมาชิกหรืออัปโหลดไฟล์บนเว็บ',
      rateNotice:'ราคาที่แสดงเป็นราคาอ้างอิง ทีม SCWORK ยืนยันหลังตรวจสเปกและไฟล์งาน',noRateNotice:'ทีม SCWORK ประเมินราคาตามสเปกและไฟล์งาน',
      modeTitle:'เริ่มจากสิ่งที่คุณรู้',modeLead:'เลือกวิธีที่สะดวก เราช่วยคุณในขั้นตอนถัดไป',quickTitle:'มีสเปกแล้ว',quickDesc:'เลือกวัสดุ ขนาด และจำนวน',guidedTitle:'ช่วยเลือกวัสดุ',guidedDesc:'แนะนำตามลักษณะการใช้งาน',helpTitle:'ปรึกษาทีมงาน',helpDesc:'บอกความต้องการให้เราช่วย',
      projectQuotePrompt:'มีหลาย SKU วันที่ต้องใช้ หรือเอกสารจัดซื้อที่ต้องขอ?',projectQuoteEntry:'ขอราคาโครงการ',
      purposeLabel:'จะนำสติกเกอร์ไปใช้กับอะไร?',guidedTip:'วัสดุที่แนะนำเป็นจุดเริ่มต้น เปลี่ยนได้ในช่องวัสดุ',helpPurposeLabel:'จะนำไปใช้กับอะไร? (ไม่บังคับ)',helpBriefLabel:'รายละเอียดเพิ่มเติม (ไม่บังคับ)',helpPlaceholder:'เช่น อยากได้ฉลากกันน้ำสำหรับขวด 100 ใบ',unsure:'ยังไม่แน่ใจ',
      purposes:['ติดสินค้า / บรรจุภัณฑ์','ติดขวด / ต้องการกันน้ำ','อยากได้ฉลากใส','ติดกระจก / ป้ายใหญ่ / ภายนอก'],
      specTitle:'สเปกสติกเกอร์',specLead:'เลือกแบบที่ใกล้เคียงกับงานของคุณ',presetLabel:'ฉลากสินค้า',presetDie:'สติกเกอร์ไดคัท',presetLarge:'สติกเกอร์ขนาดใหญ่',
      materialLabel:'วัสดุสติกเกอร์',materialHelp:'เลือกตามลักษณะการใช้งาน',sqmHelp:'วัสดุนี้คิดราคาตามพื้นที่ (ตร.ม.)',widthLabel:'กว้าง (ซม.)',heightLabel:'สูง (ซม.)',quantityLabel:'จำนวน (ชิ้น)',sizePresetLabel:'ขนาดยอดนิยม',qtyPresetLabel:'จำนวนยอดนิยม',customSizeButton:'กำหนดเอง',minus:'ลดจำนวน',plus:'เพิ่มจำนวน',
      advancedTitle:'การเคลือบ ไดคัท และบริการออกแบบ',cutLabel:'การตัดสติกเกอร์',cutStandard:'ตัดมาตรฐาน',cutCustom:'ไดคัทตามรูปทรง',lamination:'เคลือบเงา / ด้าน',design:'บริการออกแบบ',perUnit:'ต่อหน่วย',
      artTitle:'คุณมีไฟล์งานพร้อมพิมพ์หรือยัง?',artLead:'ไม่จำเป็นต้องอัปโหลดไฟล์บนเว็บไซต์ เลือกวิธีที่สะดวกได้เลย',artNone:'ยังไม่มีไฟล์',artNoneDesc:'สามารถส่งไฟล์เพิ่มเติมภายหลังได้',artLine:'มีไฟล์แล้ว ส่งผ่าน LINE',artLineDesc:'ส่งไฟล์ให้ทีมหลังจากเช็กราคา',artLink:'มีลิงก์ไฟล์',artLinkDesc:'วางลิงก์ Google Drive, OneDrive หรือ Dropbox',linkLabel:'ลิงก์ไฟล์ (เช่น Google Drive)',linkHelp:'ใช้ลิงก์ที่ทีม SCWORK เปิดได้โดยไม่ต้องขอรหัสผ่าน',
      summaryEyebrow:'สรุปงาน',summaryTitle:'สรุปราคา',manualTitle:'สรุปสเปกขอราคา',adviceTitle:'ขอคำแนะนำ',advicePending:'บอกเท่าที่ทราบได้เลย',sumUnitLabel:'จำนวนที่คิดราคา',sumBaseLabel:'ค่าพิมพ์',sumAddonLabel:'ตัวเลือกเสริม',minimumLabel:'ส่วนต่างถึงยอดขั้นต่ำ',sumTotalLabel:'ยอดประมาณการ',
      vat:'ภาษีมูลค่าเพิ่ม',perPiece:'เฉลี่ยต่อดวง',rateStatus:'ราคาอ้างอิง',rateMeta:'ตารางราคา',priced:'',manual:'ส่งสเปกเพื่อให้ทีม SCWork ประเมินราคา',advice:'ทีม SCWork ช่วยแนะนำวัสดุ ขนาด และงานหลังพิมพ์ได้',custom:'งานไดคัทตามรูปทรงต้องให้ทีมประเมินเพิ่มเติม',
      labelPricesTitle:'เทียบราคา 3 จำนวน',labelPricesSpec:'PP ขาว · 5 × 5 ซม. · ตัดมาตรฐาน',
      vatIncluded:'รวม VAT {rate}%',vatNotApplied:'ไม่คิด VAT ในยอดนี้',shippingExcluded:'ไม่รวมค่าส่ง',labels:'ดวง',
      manualScope:'สเปกนี้ไม่มีราคาออนไลน์ ส่งรายละเอียดให้ทีมประเมินได้เลย',
      badSpec:'ระบุขนาดตั้งแต่ 0.1 ซม. และจำนวนเต็มมากกว่า 0',badLink:'กรุณาใส่ลิงก์ไฟล์ที่ขึ้นต้นด้วย https:// หรือ http:// หรือเลือกส่งไฟล์ภายหลัง',
      lineHelp:'LINE จะเปิดพร้อมข้อความร่าง กรุณากดส่งในแชตด้วยตัวเอง',lineCtaText:'ส่งสเปกทาง LINE',lineAdvice:'ขอคำแนะนำทาง LINE',lineManual:'เปิดแชต LINE',lineManualHelp:'คัดลอกข้อความก่อนเปิด LINE แล้ววางในแชตเพื่อส่ง',noLine:'ยังไม่เปิดรับข้อความผ่าน LINE จากหน้านี้ คุณคัดลอกรายละเอียดไว้ได้',longLine:'ข้อความยาว กรุณาคัดลอกก่อนเปิด LINE แล้ววางในแชต',
      copyCtaText:'คัดลอกรายละเอียดงาน',manualCopyLabel:'คัดลอกข้อความจากช่องนี้',copied:'คัดลอกแล้ว วางข้อความในแชตได้เลย',privacyText:'ไม่ต้องสมัครสมาชิกหรืออัปโหลดไฟล์บนเว็บ',footerBack:'กลับเว็บไซต์',call:'โทรหา SCWORK',facebook:'ติดต่อทาง Facebook',messenger:'ติดต่อทาง Messenger',
      mobileTotalLabel:'ราคาอ้างอิง',mobileAction:'ดูสรุป',request:'ขอประเมิน',centimeter:'ซม.',pieces:'ชิ้น',sheets:'แผ่น A3+',area:'ตร.ม.',fallback:'หน้านี้รองรับภาษาไทยและอังกฤษ กำลังแสดงภาษาอังกฤษ'
    },
    en:{
      title:'Sticker price estimate | SCWORK',quoteKicker:'SCWORK / STICKER PRICING',quoteSkip:'Skip to quote options',quoteNav:'Quote page navigation',backHome:'Back to website',
      pageTitle:'Sticker pricing|made simple',pageLead:'Choose a material, size and quantity to prepare a quote request. No account or file upload required.',
      rateNotice:'Online estimates are preliminary. SCWORK confirms pricing after reviewing your specifications and artwork.',noRateNotice:'SCWORK will quote based on your specifications and artwork.',
      modeTitle:'Start with what you know',modeLead:'Choose an easy starting point. We will guide you through the next step.',quickTitle:'I have my specs',quickDesc:'Select material, size and quantity',guidedTitle:'Help me choose',guidedDesc:'Recommendations for your use case',helpTitle:'Talk to our team',helpDesc:'Tell us what you want to make',
      projectQuotePrompt:'Multiple SKUs, a target date or purchasing documents?',projectQuoteEntry:'Request a project quote',
      purposeLabel:'How will you use the stickers?',guidedTip:'This is a starting suggestion. You can change the material below.',helpPurposeLabel:'Intended use (optional)',helpBriefLabel:'Extra details (optional)',helpPlaceholder:'For example, water-resistant labels for 100 bottles',unsure:'Not sure yet',
      purposes:['Products / packaging','Bottles / water resistance','Clear labels','Windows / large signs / outdoor use'],
      specTitle:'Sticker specifications',specLead:'Select the options closest to what you need.',presetLabel:'Product labels',presetDie:'Die-cut stickers',presetLarge:'Large-format stickers',
      materialLabel:'Sticker material',materialHelp:'Choose the material that fits your use.',sqmHelp:'This material is priced by square metre.',widthLabel:'Width (cm)',heightLabel:'Height (cm)',quantityLabel:'Quantity (pieces)',sizePresetLabel:'Popular sizes',qtyPresetLabel:'Popular quantities',customSizeButton:'Custom size',minus:'Decrease quantity',plus:'Increase quantity',
      advancedTitle:'Lamination, die cutting and design support',cutLabel:'Cutting',cutStandard:'Standard cut',cutCustom:'Custom contour cut',lamination:'Gloss / matte lamination',design:'Design service',perUnit:'per unit',
      artTitle:'Is your artwork ready to print?',artLead:'No upload required on this website. Choose how you would like to share your artwork.',artNone:'No artwork yet',artNoneDesc:'You can send your artwork later',artLine:'I will send it via LINE',artLineDesc:'Send your file after checking the price',artLink:'I have an artwork link',artLinkDesc:'Paste a Google Drive, OneDrive or Dropbox link',linkLabel:'Artwork link (e.g. Google Drive)',linkHelp:'Make sure SCWORK can open the link without a password.',
      summaryEyebrow:'JOB SUMMARY',summaryTitle:'Estimated price',manualTitle:'Quote request summary',adviceTitle:'Request advice',advicePending:'Share as much as you know',sumUnitLabel:'Billable units',sumBaseLabel:'Printing',sumAddonLabel:'Add-ons',minimumLabel:'Minimum order adjustment',sumTotalLabel:'Estimated total',
      vat:'VAT',perPiece:'Average per label',rateStatus:'Estimate',rateMeta:'Rate card',priced:'',manual:'Send your specifications for a quote from SCWork.',advice:'SCWork can help with material, size and finishing.',custom:'Custom contour cutting requires a separate review.',
      labelPricesTitle:'Compare 3 quantities',labelPricesSpec:'White PP · 5 × 5 cm · Standard cut',
      vatIncluded:'Includes {rate}% VAT',vatNotApplied:'No VAT applied to this estimate',shippingExcluded:'Shipping excluded',labels:'labels',
      manualScope:'This specification is not priced online. Share your details for a quote.',
      badSpec:'Enter dimensions of at least 0.1 cm and a positive whole-number quantity.',badLink:'Enter a valid https:// or http:// link, or choose to send artwork later.',
      lineHelp:'LINE opens with a draft. Tap Send in the chat to submit it.',lineCtaText:'Send specs via LINE',lineAdvice:'Ask via LINE',lineManual:'Open LINE chat',lineManualHelp:'Copy the details before opening LINE, then paste and send them in chat.',noLine:'LINE is not available from this page yet. You can still copy your details.',longLine:'This message is long. Copy it before opening LINE, then paste it in the chat.',
      copyCtaText:'Copy job details',manualCopyLabel:'Copy the text from this field',copied:'Copied. You can paste the details into your chat.',privacyText:'No account or website file upload required',footerBack:'Back to website',call:'Call SCWORK',facebook:'Contact on Facebook',messenger:'Contact on Messenger',
      mobileTotalLabel:'Estimated price',mobileAction:'View summary',request:'Request quote',centimeter:'cm',pieces:'pcs',sheets:'A3+ sheets',area:'m²',fallback:'The quote form is available in Thai and English. English is shown here.'
    }
  };
  const namesEn={'paper-sticker':'Paper sticker','kraft-sticker':'Kraft paper','pp-white':'White PP (water resistant)','pp-clear':'Clear PP','pp-silver':'Metallic silver PP','pvc-sqm':'Adhesive PVC vinyl (large format)','vinyl-banner':'Banner vinyl (non-adhesive)'};
  let journey='quick',preset='label',materialId='pp-white',result=null,message='';
  const t=k=>(strings[lang]||strings.en)[k];
  const pick=(th,en)=>lang==='th'?th:en;
  const number=n=>new Intl.NumberFormat(pick('th-TH','en-US'),{maximumFractionDigits:2}).format(n);
  const currency=n=>new Intl.NumberFormat(pick('th-TH','en-US'),{style:'currency',currency:'THB',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const selection=()=>baseCatalog.find(m=>m.id===materialId);
  const matName=m=>pick(m.name,namesEn[m.id]||m.name);
  const text=(id,value)=>{$(id).textContent=value;};
  const hide=(id,on)=>{$(id).hidden=on;};
  const selectedAddons=()=>all('[data-addon]:checked').map(el=>el.dataset.addon);
  const addonLabel=id=>t(id==='lamination'?'lamination':'design');
  const art=()=>document.querySelector('input[name="artwork"]:checked').value;
  const customCut=()=>document.querySelector('input[name="cut"]:checked').value==='custom';
  const raw=()=>({categoryId:'sticker',materialId,widthCm:$('width').valueAsNumber,heightCm:$('height').valueAsNumber,desiredPieces:$('quantity').valueAsNumber,quantity:$('quantity').valueAsNumber,areaWidthCm:$('width').valueAsNumber,areaHeightCm:$('height').valueAsNumber,addonIds:selectedAddons()});
  const validSpec=st=>st.widthCm>=0.1&&st.widthCm<=100000&&st.heightCm>=0.1&&st.heightCm<=100000&&Number.isInteger(st.quantity)&&st.quantity>=1&&st.quantity<=1000000;
  function contacts(){
    const site=window.PROCLEANING_SITE?.contact||{},cfg=window.SCWORK_PUBLIC_CONTACT||{};
    const value=k=>String(site[k]||cfg[k]||'').trim();
    const safeUrl=(key,pattern)=>{const v=value(key);return pattern.test(v)?v:'';};
    const phone=['mobilePhone','officePhone','phone'].map(value).find(v=>/^[+\d() .-]{7,24}$/.test(v)&&v.replace(/\D/g,'').length>=8);
    const contact=line.resolveContact(value('lineId'),value('lineUrl'));
    const facebook=safeUrl('facebookUrl',/^https:\/\/(www\.)?(facebook\.com|fb\.com)\//i);
    const messenger=safeUrl('messengerUrl',/^https:\/\/(m\.me|www\.facebook\.com|facebook\.com)\//i);
    return {...contact,backup:phone?['tel:'+phone.replace(/[^+\d]/g,''),'call']:facebook?[facebook,'facebook']:messenger?[messenger,'messenger']:null};
  }
  function renderOptions(){
    $('material').replaceChildren(...baseCatalog.map(m=>new Option(matName(m),m.id)));
    $('material').value=materialId;
    text('materialHelp',selection().mode==='area_sqm'?t('sqmHelp'):t('materialHelp'));
    const kept=selectedAddons();
    $('addonList').replaceChildren();
    const ids=new Set(['lamination','design']);
    for(const id of ids){
      const label=document.createElement('label'),input=document.createElement('input'),name=document.createElement('span');
      input.type='checkbox';input.dataset.addon=id;input.checked=kept.includes(id);
      name.textContent=addonLabel(id);
      label.append(input,name);
      input.addEventListener('change',calculate);$('addonList').append(label);
    }
  }
  function requestMessage(st){
    const hasPurpose=$('helpPurpose').selectedIndex>0;
    return line.buildMessage({
      help:journey==='help',purpose:hasPurpose?$('helpPurpose').selectedOptions[0].textContent:'',
      brief:$('helpBrief').value.trim(),category:t({label:'presetLabel',diecut:'presetDie',large:'presetLarge'}[preset]),
      buyerType:document.getElementById('billBuyer')?.value||'individual',material:matName(selection()),width:st.widthCm,height:st.heightCm,quantity:st.quantity,
      cut:t(customCut()?'cutCustom':'cutStandard'),addons:st.addonIds.map(addonLabel).join(', '),
      result,rateVersion:plan?.version,artwork:t({none:'artNone',line:'artLine',link:'artLink'}[art()]),artworkUrl:art()==='link'?$('artUrl').value.trim():''
    },lang);
  }
  function calculate(){
    refreshApprovedBuyerPlan();
    const st=raw(),help=journey==='help',valid=help||validSpec(st);
    const urlOK=art()!=='link'||line.validArtworkLink($('artUrl').value.trim());
    const matches=phase?.matches({...st,preset,standardCut:!customCut()});
    const showPlan=!!(!help&&matches&&plan&&st.materialId!=='vinyl-banner');
    // Shared live quote, only when approved rates actually exist for this exact specification.
    // The separate sample-amount tax calculator has been removed from customer checkout.
    const buyer=document.getElementById('billBuyer')?.value||'individual';
    result=(!help&&valid&&liveEstimate)?liveEstimate.estimate({
      card,engine,billing:bill,billingConfig:window.SCWORK_BILLING_CONFIG,buyer,
      raw:st,customCut:customCut()
    }):null;
    hide('labelPrices',!showPlan);
    hide('quoteQuantities',showPlan);
    const terms=vatRate=>(vatRate>0?t('vatIncluded').replace('{rate}',number(vatRate*100)):t('vatNotApplied'))+' · '+t('shippingExcluded');
    if(showPlan){
      text('labelPricesTerms',terms(plan.vatRate));
      for(const q of plan.options){
        text('planQty'+q.quantity,number(q.quantity)+' '+t('labels'));
        text('planTotal'+q.quantity,currency(q.total));
        text('planEach'+q.quantity,currency(q.perPiece)+' / '+pick('ดวง','label'));
      }
    }
    text('summaryTitle',t(help?'adviceTitle':result?'summaryTitle':'manualTitle'));
    text('scLiveCaption',help?pick('ข้อมูลปรึกษาอัปเดตทันที','Consultation details update live'):!valid?pick('กรอกขนาดและจำนวนที่ถูกต้องเพื่อดูผล','Enter valid dimensions and quantity'):result?pick('คำนวณทันทีจากเรทราคาที่มีอยู่','Live calculation from available rate card'):pick('สเปกอัปเดตทันที · ราคานี้ต้องให้ทีมประเมิน','Specifications update live · manual quote needed'));
    text('summaryMaterial',help?($('helpPurpose').selectedIndex>0?$('helpPurpose').selectedOptions[0].textContent:t('advicePending')):matName(selection()));
    text('summarySpecs',help?$('helpBrief').value.trim():valid?number(st.widthCm)+' × '+number(st.heightCm)+' '+t('centimeter')+' · '+number(st.quantity)+' '+t('pieces'):'');
    for(const id of ['priceRows','perPieceRow','totalRow','rateStatus','rateMeta'])hide(id,!result);
    text('rateStatus',t('rateStatus'));$('rateStatus').classList.toggle('is-approved',!!result);
    text('rateMeta',card?.version?t('rateMeta')+' '+card.version:'');hide('rateMeta',!result||!card?.version);
    const pricedCopy=t('priced');
    text('priceInfo',help?t('advice'):result?(pricedCopy?terms(result.vatRate)+' · '+pricedCopy:terms(result.vatRate)):t(plan?'manualScope':'manual'));
    text('demoNotice',t(plan?'rateNotice':'noRateNotice'));
    hide('priceWarning',help||valid&&!customCut());text('priceWarning',t(!valid?'badSpec':'custom'));
    if(result){
      text('sumUnitLabel',t('sumUnitLabel'));text('sumUnits',number(result.units)+' '+t(selection().mode==='area_sqm'?'area':'sheets'));
      text('sumBase',currency(result.basePrint));text('sumAddons',currency(result.addonsTotal));
      text('sumVatLabel',result.vatRate>0?t('vat')+' '+number(result.vatRate*100)+'%':pick('VAT ไม่เรียกเก็บ','VAT not charged'));text('sumVat',currency(result.vat));
      hide('minimumRow',!result.minimumSurcharge);text('minimumValue',currency(result.minimumSurcharge));
      text('perPieceLabel',t('perPiece'));
      text('perPieceValue',currency(result.perPiece));text('sumTotal',currency(result.total));
    }
    text('mobileTotalLabel',t(help?'adviceTitle':result?'mobileTotalLabel':'summaryEyebrow'));
    text('mobileTotal',result?currency(result.total):t(help?'helpTitle':'request'));
    const ready=valid&&urlOK,contact=contacts();
    message=ready?requestMessage(st):'';
    if(!$('manualCopyPanel').hidden)$('manualCopy').value=message;
    if(!ready)hide('manualCopyPanel',true);
    const draft=ready&&contact.id?line.lineUrl(contact.id,message):'';
    const compact=draft&&draft.length<=1900;
    const href=ready?(compact?draft:contact.url||line.lineUrl(contact.id)):'';
    const cta=$('lineCta'),mobile=$('mobileAction');
    hide('lineCta',!href);
    if(href){cta.href=href;cta.target='_blank';cta.rel='noopener noreferrer';}else cta.removeAttribute('href');
    const action=t(compact?(help?'lineAdvice':'lineCtaText'):'lineManual');
    text('lineCtaText',action);
    const direct=!billUI&&href&&compact;
    mobile.href=direct?href:'#quoteSummary';
    mobile.target=direct?'_blank':'_self';mobile.rel=direct?'noopener noreferrer':'';
    text('mobileAction',direct?action:t('mobileAction'));
    const hasLine=!!(contact.id||contact.url);
    hide('lineHelp',!!billUI&&!hasLine);
    text('lineHelp',t(!hasLine?'noLine':!contact.id?'lineManualHelp':ready&&!compact?'longLine':'lineHelp'));
    text('quoteFeedback',!valid?t('badSpec'):!urlOK?t('badLink'):'');
    $('copyCta').disabled=!ready;
    const fallback=$('fallbackContact');hide('fallbackContact',!contact.backup);
    if(contact.backup){const [link,label]=contact.backup;fallback.href=link;fallback.target=link.startsWith('https:')?'_blank':'_self';fallback.rel='noopener noreferrer';fallback.textContent=t(label);}
    const size=st.widthCm+'x'+st.heightCm;
    all('[data-size]').forEach(b=>mark(b,b.dataset.size===size||b.dataset.size==='custom'&&!['3x3','5x5','8x10'].includes(size)));
    all('[data-qty]').forEach(b=>mark(b,Number(b.dataset.qty)===st.quantity));
    all('[data-plan-qty]').forEach(b=>mark(b,Number(b.dataset.planQty)===st.quantity));
    if(billUI)billUI.render({
      lang:lang==='th'?'th':'en',result,ready,version:plan?.version,material:$('summaryMaterial').textContent,specs:$('summarySpecs').textContent,
      extra:help?'':[
        t({label:'presetLabel',diecut:'presetDie',large:'presetLarge'}[preset]),t(customCut()?'cutCustom':'cutStandard'),...st.addonIds.map(addonLabel)
      ].join(' · ')
    });
  }
  function mark(b,on){b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on));}
  function material(next){
    const oldArea=selection().mode==='area_sqm';
    if(baseCatalog.some(m=>m.id===next))materialId=next;
    const area=selection().mode==='area_sqm';
    if(oldArea!==area){
      $('width').value=area?100:5;$('height').value=area?100:5;$('quantity').value=area?1:500;
      preset=area?'large':preset==='large'?'label':preset;
    }
    all('[data-preset]').forEach(b=>mark(b,b.dataset.preset===preset));
    renderOptions();calculate();
  }
  function presetChoice(next){
    preset=next;
    document.querySelector('input[name="cut"][value="'+(next==='diecut'?'custom':'standard')+'"]').checked=true;
    material(next==='large'?'pvc-sqm':'pp-white');
  }
  function chooseGuided(){
    const id=$('purpose').value;
    presetChoice(id==='outdoor'?'large':'label');
    if(id!=='outdoor')material({label:'paper-sticker',waterproof:'pp-white',transparent:'pp-clear'}[id]||'pp-white');
  }
  function chooseMode(next){
    journey=next;
    hide('guidedPanel',next!=='guided');hide('helpPanel',next!=='help');hide('specPanel',next==='help');
    all('[data-mode]').forEach(b=>mark(b,b.dataset.mode===next));
    if(next==='guided')chooseGuided();else calculate();
  }
  function renderLabels(){
    document.documentElement.lang=lang;
    $('quoteForm').lang=lang==='th'?'th':'en';
    document.title=t('title');
    const keys=['quoteKicker','quoteSkip','backHome','pageLead','modeTitle','modeLead','quickTitle','quickDesc','guidedTitle','guidedDesc','helpTitle','helpDesc','purposeLabel','guidedTip','helpPurposeLabel','helpBriefLabel','specTitle','specLead','presetLabel','presetDie','presetLarge','materialLabel','widthLabel','heightLabel','quantityLabel','sizePresetLabel','qtyPresetLabel','customSizeButton','advancedTitle','cutLabel','cutStandard','cutCustom','artTitle','artLead','artNone','artNoneDesc','artLine','artLineDesc','artLink','artLinkDesc','linkLabel','linkHelp','summaryEyebrow','sumBaseLabel','sumAddonLabel','minimumLabel','sumTotalLabel','copyCtaText','manualCopyLabel','privacyText','footerBack'];
    keys.forEach(id=>text(id,t(id)));
    for(const id of ['labelPricesTitle','labelPricesSpec'])text(id,t(id));
    for(const id of ['projectQuotePrompt','projectQuoteEntry'])text(id,t(id));
    $('projectQuoteEntry').href='./project-quote.html?lang='+pick('th','en');
    const [first,second]=t('pageTitle').split('|'),em=document.createElement('em');em.textContent=second;$('pageTitle').replaceChildren(first,document.createElement('br'),em);
    $('helpBrief').placeholder=t('helpPlaceholder');
    [...$('purpose').options].forEach((el,i)=>el.textContent=t('purposes')[i]);
    [...$('helpPurpose').options].forEach((el,i)=>el.textContent=i?t('purposes')[i-1]:t('unsure'));
    for(const [id,key] of [['quoteNav','quoteNav'],['quoteWorkspace','specTitle'],['quoteModes','modeTitle'],['quoteTypes','specTitle'],['quoteSizes','sizePresetLabel'],['quoteQuantities','qtyPresetLabel'],['quoteSummary','summaryEyebrow'],['quantityMinus','minus'],['quantityPlus','plus']])$(id).setAttribute('aria-label',t(key));
    all('[data-size]:not([data-size="custom"])').forEach(b=>b.textContent=b.dataset.size.replace('x',' × ')+' '+t('centimeter'));
    all('[data-qty]').forEach(b=>b.textContent=number(Number(b.dataset.qty)));
    for(const id of ['backHome','footerBack'])$(id).href='./index.html?lang='+encodeURIComponent(lang);
    document.querySelector('.q-brand').href='./index.html?lang='+encodeURIComponent(lang);
    const old=$('translationNote');if(old)old.remove();
    if(!['th','en'].includes(lang)){
      const note=document.createElement('p');note.id='translationNote';note.className='q-translation-note';note.textContent=t('fallback');
      document.querySelector('.q-intro').after(note);
    }
    renderOptions();calculate();
  }
  all('[data-mode]').forEach(b=>b.addEventListener('click',()=>chooseMode(b.dataset.mode)));
  all('[data-preset]').forEach(b=>b.addEventListener('click',()=>presetChoice(b.dataset.preset)));
  $('purpose').addEventListener('change',chooseGuided);
  $('helpPurpose').addEventListener('change',calculate);
  all('[data-size]').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.size==='custom'){$('width').focus();$('width').select();return;}
    const [w,h]=b.dataset.size.split('x');$('width').value=w;$('height').value=h;calculate();
  }));
  all('[data-qty]').forEach(b=>b.addEventListener('click',()=>{$('quantity').value=b.dataset.qty;calculate();}));
  all('[data-plan-qty]').forEach(b=>b.addEventListener('click',()=>{$('quantity').value=b.dataset.planQty;calculate();}));
  $('material').addEventListener('change',e=>material(e.target.value));
  for(const id of ['width','height','quantity','artUrl','helpBrief']){
    $(id).addEventListener('input',calculate);
    $(id).addEventListener('change',calculate);
  }
  for(const [id,delta] of [['quantityPlus',100],['quantityMinus',-100]])$(id).addEventListener('click',()=>{
    $('quantity').value=Math.max(1,Math.min(1000000,(Number($('quantity').value)||1)+delta));calculate();
  });
  all('input[name="cut"]').forEach(el=>el.addEventListener('change',calculate));
  all('input[name="artwork"]').forEach(el=>el.addEventListener('change',()=>{hide('artLinkPanel',art()!=='link');calculate();}));
  $('copyCta').addEventListener('click',async()=>{
    if(!message)return;
    try{await navigator.clipboard.writeText(message);hide('manualCopyPanel',true);text('quoteFeedback',t('copied'));}
    catch{const field=$('manualCopy');field.value=message;hide('manualCopyPanel',false);field.focus();field.select();text('quoteFeedback',t('manualCopyLabel'));}
  });
  $('mobileAction').addEventListener('click',()=>{if($('mobileAction').getAttribute('href')==='#quoteSummary')$('quoteSummary').focus({preventScroll:true});});
  window.addEventListener('scwork:buyer-change',calculate);
  window.addEventListener('scwork:locale-change',e=>{
    if(!languages.includes(e.detail?.code))return;
    lang=e.detail.code;params.set('lang',lang);
    try{history.replaceState(null,'',location.pathname+'?'+params+location.hash);}catch{}
    renderLabels();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));
  });
  const category=(params.get('category')||'').toLowerCase();
  if(/large|sign|vinyl|glass|retail|outdoor|shop|window/.test(category))presetChoice('large');
  else if(/die.?cut|contour|shape/.test(category))presetChoice('diecut');
  else presetChoice('label');
  const requestedMaterial=params.get('material');
  if(baseCatalog.some(m=>m.id===requestedMaterial))material(requestedMaterial);
  if(params.get('mode')==='help')chooseMode('help');
  renderLabels();
})();
