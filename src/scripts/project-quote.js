/* Customer project intake. All form data stays in memory until the customer shares it. */
(() => {
  'use strict';
  const api=window.SCWORK_PROJECT_BRIEF,line=window.SCWORK_QUOTE_TO_LINE;
  const order=window.SCWORK_ORDER_FOLLOWUP;
  if(!api||!line)return;
  const $=id=>document.getElementById(id);
  const all=(query,root=document)=>[...root.querySelectorAll(query)];
  const EN={
    skip:'Skip to content',standard:'Standard pricing',title:'Request a project quote',
    lead:'Combine multiple label SKUs, your target date and purchasing documents in one brief. Use the same project reference from the first discussion through artwork approval.',
    step1:'Prepare the brief',step2:'Specification review and quotation',step3:'Approve artwork before production',
    overview:'Project details',name:'Project name *',org:'Company or organization (optional)',due:'Requested date (optional)',
    dueNote:'This date is for planning only. We confirm the schedule after reviewing your specifications.',
    itemsTitle:'Label items / SKUs',add:'+ Add SKU',itemsNote:'Enter a name and quantity per label. You can leave size blank or ask us to suggest a material.',
    sku:'Design name / SKU code *',qty:'Quantity (labels) *',material:'Material',mat0:'Suggest a material',mat1:'White PP',mat2:'Clear PP',mat3:'Paper',mat4:'Other',
    width:'Width (mm)',height:'Height (mm)',itemNote:'Notes for this item (optional)',remove:'Remove this SKU',
    docsTitle:'Artwork and purchasing documents',docsLegend:'Documents for the team to check',docQuote:'Quotation',docTax:'Tax invoice',docCompany:'Vendor registration documents',docOther:'Other documents',
    docsNote:'These are requests only. SCWork will confirm which documents are available and any conditions.',
    otherDoc:'Name of other document',artwork:'Artwork link (optional)',notes:'Additional details (optional)',
    prepare:'Prepare brief and reference',summary:'Brief to share with SCWork',start:'Enter a project name and at least one SKU, then prepare your brief.',
    preview:'Review your message before sharing',copy:'Copy brief',saveOptions:'Keep a shareable brief file',saveNote:'The SCWork team can open this JSON brief without re-entering the specifications.',save:'Download JSON brief',
    coordinator:'SCWork project coordinator',coordinatorNote:'Quote this reference when contacting us. The team will confirm your contact person, available documents and next steps.',
    privacy:'This page does not save the brief on a server or send it automatically. Keep a copy before closing.',labelsPage:'Back to product labels',
    trackingPage:'Track a project or reorder',repeatTitle:'Reorder from an SCWork specification file',repeatFile:'Open reorder specification file (JSON)',
    repeatNote:'The file is read on your device, not uploaded. It fills label items and the previous reference only. Review quantities and confirm new terms with the team.'
  };
  const params=new URLSearchParams(location.search);
  let lang=params.has('lang')&&params.get('lang')!=='th'?'en':'th',brief=null,dirty=false,repeatOf=null,importTicket=0;
  const thText=new WeakMap();
  const pick=(th,en)=>lang==='th'?th:en;
  const translate=root=>all('[data-i]',root).forEach(e=>{
    if(!thText.has(e))thText.set(e,e.textContent);
    e.textContent=lang==='en'?(EN[e.dataset.i]||thText.get(e)):thText.get(e);
  });
  const form=$('projectForm'),items=$('items'),other=$('projectOtherDoc'),preview=$('briefText'),action=$('projectLine');
  const error={
    SIZE:['กรอกทั้งความกว้างและความสูงเป็นมิลลิเมตร หรือเว้นทั้งสองช่อง','Enter both width and height in millimetres, or leave both blank.'],
    ARTWORK:['ใช้ลิงก์ไฟล์งานที่ขึ้นต้นด้วย https:// หรือเว้นช่องไว้','Use an https:// artwork link or leave the field blank.'],
    DATE:['ตรวจวันที่ที่ต้องการอีกครั้ง','Check the requested date.'],
    NAME:['กรอกชื่อโครงการ','Enter a project name.'],
    SKU:['กรอกชื่อแบบหรือรหัส SKU','Enter a design name or SKU.'],
    QUANTITY:['กรอกจำนวนเต็มมากกว่า 0','Enter a positive whole-number quantity.']
  };
  function chosenDocs(){return all('[data-doc]:checked',form).map(c=>c.dataset.doc);}
  function rows(){return all('.p-sku',items);}
  function updateRows(){
    const set=rows();
    set.forEach((row,i)=>{
      row.querySelector('legend').textContent='SKU '+String(i+1).padStart(2,'0');
      all('[data-key]',row).forEach(el=>{el.id='sku-'+i+'-'+el.dataset.key;});
      row.querySelector('[data-remove]').disabled=set.length===1;
    });
    $('addSKU').disabled=set.length>=api.maxItems;
  }
  function add(focus){
    if(rows().length>=api.maxItems)return;
    const row=$('skuTemplate').content.firstElementChild.cloneNode(true);
    items.append(row);
    translate(row);
    row.querySelector('[data-remove]').addEventListener('click',()=>{
      if(rows().length===1)return;
      const target=row.nextElementSibling||row.previousElementSibling;
      row.remove();updateRows();edited();target?.querySelector('[data-key="name"]')?.focus();
    });
    updateRows();if(focus){edited();row.querySelector('[data-key="name"]').focus();}
  }
  function state(){
    $('summaryActions').hidden=!brief||dirty;
    if(!brief||dirty){
      action.hidden=true;action.removeAttribute('href');
      $('summaryState').textContent=dirty&&brief?pick('มีการแก้ไข กดเตรียมบรีฟอีกครั้งเพื่ออัปเดตเลขฉบับก่อนส่ง','Your brief changed. Prepare it again to update the revision before sharing.'):
        pick('กรอกชื่อโครงการและอย่างน้อยหนึ่ง SKU แล้วกดเตรียมบรีฟ','Enter a project name and at least one SKU, then prepare your brief.');
      return;
    }
    $('summaryState').textContent=pick('บรีฟพร้อมให้ตรวจและส่ง ยังไม่ได้ส่งให้ทีม','Brief ready to review and share. It has not been sent.');
    $('projectRef').textContent=brief.reference+' · BR'+String(brief.revision).padStart(2,'0');
    const message=api.format(brief,lang);preview.value=message;
    const site=window.PROCLEANING_SITE?.contact||{},cfg=window.SCWORK_PUBLIC_CONTACT||{};
    const c=line.resolveContact(site.lineId||cfg.lineId,site.lineUrl||cfg.lineUrl);
    const draft=c.id?line.lineUrl(c.id,message):'';
    const prefill=draft&&draft.length<=1900;
    const href=prefill?draft:c.url||line.lineUrl(c.id);
    action.hidden=!href;
    if(href){
      action.href=href;
      action.textContent=prefill?pick('เปิด LINE พร้อมบรีฟ','Open LINE with brief'):pick('เปิดแชต LINE','Open LINE chat');
    }else action.removeAttribute('href');
    $('contactState').textContent=!href?pick('ยังไม่เปิดช่องทาง LINE ในหน้านี้ คุณคัดลอกบรีฟหรือดาวน์โหลดเพื่อส่งต่อได้','LINE is not configured for this page. Copy or download the brief to share it.'):
      prefill?pick('ตรวจข้อความร่างและกดส่งด้วยตัวเองใน LINE','Review the draft and tap Send in LINE.'):
      pick('คัดลอกบรีฟก่อนเปิดแชต แล้ววางใน LINE โดยไม่ต้องกรอกซ้ำ','Copy the brief first, then paste it in LINE without retyping.');
  }
  function edited(){
    dirty=!!brief;
    $('otherDocGroup').hidden=!chosenDocs().includes('other');
    $('formError').textContent='';$('copyFeedback').textContent='';
    state();
  }
  const value=el=>el.value;
  function read(){
    return {
      name:$('projectName').value,organization:$('projectOrg').value,due:$('projectDue').value,artwork:$('projectArtwork').value,notes:$('projectNotes').value,
      documents:chosenDocs(),otherDoc:other.value,repeatOf,
      items:rows().map(row=>{
        const field=key=>row.querySelector('[data-key="'+key+'"]');
        const dim=key=>value(field(key))===''?null:field(key).valueAsNumber;
        return {name:value(field('name')),qty:field('qty').valueAsNumber,width:dim('width'),height:dim('height'),material:value(field('material')),note:value(field('note'))};
      })
    };
  }
  function showSource(){
    const box=$('repeatOrigin');box.hidden=!repeatOf;
    box.textContent=repeatOf?pick('สั่งซ้ำจากชุดแบบ','Reorder from proof')+' · '+repeatOf.proof:'';
  }
  async function openRepeat(e){
    const file=e.target.files[0],ticket=++importTicket;
    e.target.value='';$('repeatFeedback').textContent='';
    if(!file)return;
    try{
      if(!order||file.size>api.maxFileBytes)throw Error('File');
      const spec=order.repeat(JSON.parse(await file.text()));
      if(ticket!==importTicket)return;
      if((brief||rows().some(r=>all('[data-key]',r).some(el=>el.type!=='select-one'&&el.value)))&&
        !window.confirm(pick('นำเข้าแล้วจะแทนรายการ SKU ในหน้านี้ ต้องการนำเข้าต่อไหม?','Importing will replace the SKU items on this page. Continue?')))return;
      repeatOf={reference:spec.reference,proof:spec.proof};
      brief=null;dirty=false;items.replaceChildren();
      for(const item of spec.items){
        add(false);
        const row=rows().at(-1);
        all('[data-key]',row).forEach(el=>{el.value=item[el.dataset.key]??'';});
      }
      edited();showSource();
      $('repeatFeedback').textContent=pick('เปิดสเปกแล้ว ตรวจจำนวนและกำหนดงานใหม่ก่อนเตรียมบรีฟ','Specs loaded. Review quantities and the new schedule before preparing a brief.');
    }catch{if(ticket===importTicket)$('repeatFeedback').textContent=pick('เปิดไฟล์นี้ไม่ได้ ใช้ไฟล์สเปกสั่งซ้ำที่ได้รับจากทีม SCWork','Could not open this file. Use the reorder spec file supplied by SCWork.');}
  }
  function prepare(){
    if(!form.reportValidity())return;
    try{brief=api.prepare(read(),brief);dirty=false;}catch(e){
      const msg=error[e.message];$('formError').textContent=msg?pick(...msg):pick('ตรวจสเปกแล้วลองเตรียมบรีฟอีกครั้ง','Check the specifications and prepare the brief again.');
      $(e.field)?.focus();return;
    }
    $('formError').textContent='';$('copyFeedback').textContent='';
    state();$('summary').focus();
  }
  function switchLanguage(next){
    lang=next;document.documentElement.lang=lang;
    document.title=pick('ขอราคาโครงการฉลากสินค้า | SCWork','Request a project quote | SCWork');
    translate(document);
    all('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
    for(const a of all('[data-back]'))a.href=({labels:'./product-labels.html?',tracking:'./order-tracking.html?',standard:'./smart-quote.html?category=label&'})[a.dataset.back]+'lang='+lang;
    try{const q=new URL(location.href);q.searchParams.set('lang',lang);history.replaceState(null,'',q);}catch{}
    $('formError').textContent='';$('copyFeedback').textContent='';$('repeatFeedback').textContent='';state();showSource();
  }
  form.addEventListener('submit',e=>{e.preventDefault();prepare();});
  form.addEventListener('input',edited);
  form.addEventListener('change',edited);
  $('prepare').addEventListener('click',prepare);
  $('addSKU').addEventListener('click',()=>add(true));
  $('repeatFile').addEventListener('change',openRepeat);
  $('copyBrief').addEventListener('click',async()=>{
    if(dirty||!brief)return;
    const ok=await api.safeCopy(preview,preview.value,navigator);
    $('copyFeedback').textContent=ok?pick('คัดลอกบรีฟแล้ว','Brief copied.'):pick('เลือกข้อความให้แล้ว กรุณากดคัดลอก','The message is selected. Use Copy on your device.');
  });
  $('saveBrief').addEventListener('click',()=>{
    if(!dirty&&brief)api.download(brief,brief.reference+'-BR'+String(brief.revision).padStart(2,'0')+'.json');
  });
  all('[data-lang]').forEach(b=>b.addEventListener('click',()=>switchLanguage(b.dataset.lang)));
  add(false);switchLanguage(lang);$('prepare').disabled=false;
  if(params.get('mode')==='reorder')$('repeatOptions').open=true;
})();
