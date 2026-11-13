(() => {
'use strict';
const $=id=>document.getElementById(id);
const rawDefaults=JSON.parse(JSON.stringify(window.PROCLEANING_SITE||{}));
window.PROCLEANING_TRANSLATION_DEFAULTS=rawDefaults;
const i18n=window.PROCLEANING_I18N;
const fresh=i18n.normalize(rawDefaults);
const slots=window.PC_IMAGE_MANIFEST?.images||[];
const STORAGE='scwork-v14-site-draft';
const PREVIOUS_STORAGE='pc-v22-site-draft';
let editLanguage='en';
let site=JSON.parse(JSON.stringify(fresh)), tab='general', selectedImage=0;
let imageSource=null,imageObjectUrl=null,imageUploads={};
let previewReady=false,saveTimer=null,previewTimer=null;
const templates={
 services:{title:'New Service',description:'Describe the service here.',image:'./assets/images/services/office.webp',translations:{th:{title:'บริการใหม่',description:'กรอกรายละเอียดบริการเป็นภาษาไทย'}}},
 pricing:{name:'New Package',monthly:0,featured:false,features:['Feature 1','Feature 2'],translations:{th:{name:'แพ็กเกจใหม่',features:['รายการบริการ 1','รายการบริการ 2']}}},
 team:{name:'Team Member',description:'Add a team member description.',image:'./assets/images/team/person-01.webp',translations:{th:{name:'สมาชิกทีม',description:'กรอกรายละเอียดทีมงาน'}}},
 testimonials:{name:'Customer Name',role:'Customer',quote:'Enter a verified customer review.',image:'./assets/images/testimonials/customer-01.webp',translations:{th:{name:'ชื่อลูกค้า',role:'ลูกค้า',quote:'ใช้ความคิดเห็นจริงที่ได้รับอนุญาตแล้ว'},}},
 blogs:{id:'',title:'New Article',meta:'AUTHOR · DATE',text:'Short excerpt of this article.',body:'Enter the full article text here.\n\nSeparate paragraphs with a blank line.',image:'./assets/images/blog/article-01.webp',translations:{th:{title:'บทความใหม่',meta:'ผู้เขียน · วันที่',text:'สรุปบทความภาษาไทย',body:'เพิ่มเนื้อหาบทความฉบับเต็มภาษาไทยที่นี่'}}}
};
const fieldGroups={
 general:[
 {title:'Brand Identity',desc:'ชื่อแบรนด์และข้อความที่แสดงใน Header / Footer',fields:[['brand.prefix','Brand Prefix'],['brand.name','Brand Name'],['brand.tagline','Tagline (metadata; not beside logo)'],['brand.pageTitle','Browser Title'],['brand.metaDescription','SEO Description','textarea']]},
 {title:'Navigation',fields:[['navigation.home','Home'],['navigation.about','About'],['navigation.services','Services'],['navigation.blog','Blog'],['navigation.contact','Contact'],['navigation.quote','Primary CTA']]},
 {title:'Top Contact Bar & Contact Details',desc:'แก้ข้อมูลติดต่อของ SCWORK (ใช้ร่วมทุกภาษา) | ถ้าไม่มีเลขจริง ระบบแสดง — แทน และปิดลิงก์โทรอัตโนมัติ',fields:[['contact.officePhone','เบอร์สำนักงาน / Office Phone'],['contact.mobilePhone','เบอร์มือถือ / Mobile Phone'],['contact.lineId','LINE OA ID (@...)'],['contact.lineUrl','LINE OA URL (https://line.me/...)'],['contact.phone','เบอร์ติดต่อสำรอง / Legacy Phone'],['contact.email','Email'],['contact.address','Address','textarea'],['contact.bookingSubject','Email Subject']]},
 {title:'Language Settings',desc:'เลือกภาษาที่ลูกค้าจะเห็นเมื่อเข้าชมครั้งแรก (หากยังไม่เคยเลือกภาษา)',fields:[['i18n.defaultLanguage','Default Website Language','select','en|th']]},
 {title:'Legacy Pricing Settings',desc:'โหมดสติกเกอร์ใช้การขอราคา ไม่แสดง Monthly/Yearly บนหน้าเว็บ',fields:[['settings.currency','Currency','select','USD|THB|EUR|GBP|JPY'],['settings.yearlyDiscount','Yearly Discount (%)','number']]}
 ],
 content:[
 {title:'Top Bar / Four-Step Quote Process',desc:'ข้อความใหม่จาก V1.1 ปรับแยกภาษา TH/EN ได้เช่นเดียวกับ Hero',fields:[['commerce.topBenefit','Top contact bar summary','textarea'],['commerce.languageHint','Language menu label'],['commerce.languageNote','Available languages note','textarea'],['commerce.processEyebrow','Process eyebrow'],['commerce.processTitle','Process heading','textarea'],['commerce.processCta','Process CTA'],['commerce.processSteps.0.title','Step 1 title'],['commerce.processSteps.0.text','Step 1 description','textarea'],['commerce.processSteps.1.title','Step 2 title'],['commerce.processSteps.1.text','Step 2 description','textarea'],['commerce.processSteps.2.title','Step 3 title'],['commerce.processSteps.2.text','Step 3 description','textarea'],['commerce.processSteps.3.title','Step 4 title'],['commerce.processSteps.3.text','Step 4 description','textarea'],['commerce.pricingCta','Calculator CTA'],['commerce.pricingDisclaimer','Demo pricing disclaimer','textarea']]},
 {title:'Hero Section',fields:[['hero.eyebrow','Eyebrow'],['hero.title','Headline (H1)','textarea'],['hero.description','Description','textarea'],['hero.ctaPrimary','Primary CTA'],['hero.ctaSecondary','Secondary CTA']]},
 {title:'Services Introduction',fields:[['headings.servicesTitle','Section Title','textarea'],['headings.servicesEyebrow','Eyebrow'],['headings.servicesDescription','Description','textarea']]},
 {title:'Quote Section',fields:[['headings.quoteEyebrow','Eyebrow'],['headings.quoteTitle','Heading','textarea'],['headings.quoteDescription','Description','textarea'],['headings.quoteButton','CTA']]},
 {title:'Team Introduction',fields:[['headings.teamTitle','Heading','textarea'],['headings.teamEyebrow','Eyebrow'],['headings.teamDescription','Description','textarea']]},
 {title:'About Section',fields:[['headings.aboutTitle','Heading','textarea'],['headings.aboutDescription','Description','textarea'],['headings.aboutPrimary','Primary CTA'],['headings.aboutSecondary','Secondary CTA']]},
 {title:'Pricing / Testimonials',fields:[['headings.pricingEyebrow','Pricing Eyebrow'],['headings.pricingTitle','Pricing Title','textarea'],['headings.testimonialsTitle','Testimonials Title','textarea'],['headings.testimonialsDescription','Testimonials Description','textarea']]},
 {title:'Blog Introduction',fields:[['headings.blogTitle','Heading','textarea'],['headings.blogEyebrow','Eyebrow'],['headings.blogDescription','Description','textarea']]},
 {title:'Contact Section',fields:[['headings.contactEyebrow','Eyebrow'],['headings.contactTitle','Heading'],['headings.contactDescription','Description','textarea'],['headings.formEyebrow','Form Eyebrow'],['headings.formTitle','Form Title']]},
 {title:'Global Buttons & Form Labels',fields:[['labels.book','Book Button'],['labels.readMore','Read More'],['labels.fullName','Name Label'],['labels.email','Email Label'],['labels.service','Service Label'],['labels.message','Message Label'],['labels.submit','Submit CTA'],['labels.servicePlaceholder','Service Placeholder'],['labels.otherService','Other Service'],['labels.namePlaceholder','Name Placeholder'],['labels.emailPlaceholder','Email Placeholder'],['labels.messagePlaceholder','Message Placeholder'],['labels.contactCall','Call Label'],['labels.contactEmail','Email Label'],['labels.contactAddress','Address Label'],['labels.formError','Form Error','textarea'],['labels.formSuccess','Form Success','textarea'],['labels.formNote','Form Note','textarea'],['labels.pricingDemoNote','Quotation Pricing Note','textarea'],['labels.skipLink','Skip Link'],['labels.openNav','Open Navigation'],['labels.closeNav','Close Navigation'],['labels.navAria','Navigation Aria Label'],['labels.nextServices','Next Service'],['labels.previousTestimonial','Previous Review'],['labels.nextTestimonial','Next Review'],['labels.billingAria','Billing Label'],['labels.heroImageAlt','Hero Image Alt'],['labels.quoteMainAlt','Quote Main Alt'],['labels.quoteSmallAlt','Quote Detail Alt'],['labels.aboutMainAlt','About Main Alt'],['labels.aboutSmallAlt','About Detail Alt'],['labels.emptyServices','Empty Services'],['labels.emptyPricing','Empty Pricing'],['labels.emptyTestimonials','Empty Reviews'],['labels.ratingLabel','Rating Aria Label'],['labels.blogAskPrefix','Blog Aria Prefix'],['labels.portraitAlt','Portrait Prefix'],['labels.socialPlaceholder','Social Placeholder']]},
 {title:'Footer Text',fields:[['footer.description','Description','textarea'],['footer.quickTitle','Quick Links Header'],['footer.servicesTitle','Services Header'],['footer.contactTitle','Contact Header'],['footer.contactQuestion','Contact Question'],['footer.copyright','Copyright'],['footer.disclaimer','Disclaimer','textarea']]}
 ],
 design:[
 {title:'Brand Colors',desc:'ใช้ HEX #RRGGBB และดูสีเปลี่ยนใน Preview',fields:[['design.primary','CTA Orange — #FF6900','color'],['design.primaryHover','Hover Color','color'],['design.ink','Heading / Ink','color'],['design.body','Body Text','color'],['design.border','Dividers','color'],['design.footer','Footer Background','color']]},
 {title:'Typography & Spacing',desc:'ปรับค่าในขอบเขตที่ Responsive รองรับ',fields:[['design.font','Body Font','select','Be Vietnam Pro|Montserrat|System'],['design.headingScale','Heading Size (%)','number'],['design.sectionSpacing','Section Spacing (px)','number'],['design.containerWidth','Container Max Width (px)','number'],['design.cardRadius','Card Radius (px)','number'],['design.imageRadius','Image Radius (px)','number']]}
 ]
};
const arraySchemas={
 services:[['title','Service Name'],['description','Description','textarea'],['image','Image','image']],
 pricing:[['name','Package Name'],['featured','Featured / Highlight','checkbox'],['features','Features (one per line)','lines']],
 team:[['name','Process Step'],['description','Description','textarea'],['image','Process Image','image']],
 testimonials:[['name','Application Name'],['role','Example Label'],['quote','Application Description','textarea'],['image','Illustration Image','image']],
 blogs:[['title','Article Title'],['meta','Author / Date'],['text','Excerpt (Card Summary)','textarea'],['body','Full Article Body (separate paragraphs with blank lines)','textarea'],['image','Cover Image','image']]
};
const tabMeta={
 general:['Brand & Navigation','ชื่อแบรนด์ เมนู และข้อมูลติดต่อ','BRAND SETTINGS'],content:['Page Text & CTA','ข้อความทุก Section และปุ่มบนเว็บไซต์','PAGE COPY'],
 services:['Services','เพิ่ม ลบ จัดลำดับ และแก้บริการ','COLLECTION EDITOR'],pricing:['Sticker Applications','เพิ่ม ลบ และแก้รูปแบบงาน/รายละเอียดสเปก โดยเสนอราคาตามใบงาน','STICKER PRODUCT CARDS'],
 team:['Production Workflow','จัดการขั้นตอนการผลิตและจุดเด่น','PROCESS EDITOR'],reviews:['Application Examples','ตัวอย่างการใช้งาน ห้ามอ้างเป็นผลงานหรือรีวิวจริง','ILLUSTRATIVE EXAMPLES'],
 blog:['Blog','จัดการชื่อบทความ รายละเอียด และภาพประกอบ','BLOG EDITOR'],images:['Image Assets','อัปโหลด → ครอป → เพิ่มใน Preview → Export เป็น WebP','IMAGE STUDIO'],
 design:['Design Tokens','เปลี่ยนสี ฟอนต์ ขนาดหัวข้อ และระยะห่าง','STYLE SETTINGS'],export:['Import / Export','สำรองข้อมูล และสร้างไฟล์อัปเดตเว็บไซต์','DEPLOYMENT']
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=path=>path.split('.').reduce((v,k)=>v?.[k],site);
const fieldsToTranslate=new Set(['navigation','hero','headings','labels','footer','commerce']);
function localePath(path,type='text'){
 if(editLanguage!=='th'||type==='image'||type==='number'||type==='color'||type==='checkbox'||path.startsWith('design.')||path.startsWith('settings.')||path.startsWith('i18n.'))return path;
 const a=path.split('.'),group=a[0];
 if(fieldsToTranslate.has(group))return 'i18n.th.'+path;
 if(group==='brand'&&['tagline','pageTitle','metaDescription'].includes(a[1]))return 'i18n.th.'+path;
 if(group==='contact'&&['address','bookingSubject'].includes(a[1]))return 'i18n.th.'+path;
 if(group==='features'&&a.length===2)return 'i18n.th.features.'+a[1];
 if(['services','team','testimonials','blogs','pricing'].includes(group)&&a.length===3){
   if(['image','monthly','featured'].includes(a[2]))return path;
   return `${group}.${a[1]}.translations.th.${a[2]}`;
 }
 return path;
}
function valueForField(path,originalPath){const translated=get(path);return translated===undefined||translated===null?get(originalPath):translated;}

function set(path,value){let obj=site;const parts=path.split('.');for(let i=0;i<parts.length-1;i++){if(obj[parts[i]]===undefined)throw Error('Unknown field '+path);obj=obj[parts[i]];}obj[parts.at(-1)]=value;dirty();}
function notify(message){const n=$('toast');n.textContent=message;n.hidden=false;clearTimeout(n._timer);n._timer=setTimeout(()=>n.hidden=true,4200);}
function dirty(){
 $('saveStatus').textContent='กำลังบันทึกร่าง…';
 clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(site));$('saveStatus').textContent='บันทึกร่างใน Browser แล้ว';}catch(e){$('saveStatus').textContent='บันทึกไม่ได้: โปรด Export JSON';}},450);
 clearTimeout(previewTimer);previewTimer=setTimeout(updatePreview,160);
}
function loadDraft(){
  try{
    const current=localStorage.getItem(STORAGE);
    const legacy=!current?localStorage.getItem(PREVIOUS_STORAGE):null;
    const saved=JSON.parse(current||legacy||'null');
    if(!saved?.brand||!saved?.hero)return;
    // Never accidentally import a Cleaning / ProCleaning draft into the SCWORK sticker site.
    if(legacy){
      const id=[saved.brand.pageTitle,saved.brand.name,saved.hero.title,(saved.services||[]).map(s=>s.title).join(' ')].join(' ').toLowerCase();
      if(!/scwork|inkjet|sticker|สติกเกอร์/.test(id))return;
    }
    if(saved.design){
      const d=saved.design;
      if(['#36b864','#2eb767','#23ad65','#ff7a00','#c94a00','#fc6201'].includes(String(d.primary).toLowerCase())){
        Object.assign(d,{primary:'#FF6900',primaryHover:'#FF6900',ink:'#082E66',body:'#5b6b84',border:'#c7d7ef',footer:'#061B3D'});
      }
    }
    site=i18n.normalize(saved);
    if(legacy)localStorage.setItem(STORAGE,JSON.stringify(site));
  }catch(e){console.warn('Draft could not be loaded',e);}
}
function validData(obj){return !!(obj&&obj.schemaVersion===2&&obj.brand&&obj.hero&&obj.headings&&obj.labels&&obj.design&&obj.contact&&obj.settings&&['services','pricing','team','testimonials','blogs','features'].every(k=>Array.isArray(obj[k])));}
function field([path,label,type='text',options]){
 const originalPath=path;path=localePath(path,type);const v=valueForField(path,originalPath);const id='field-'+path.replace(/[^a-z0-9]/gi,'-');let control='';
 if(type==='textarea'||type==='lines')control=`<textarea id="${id}" data-field="${esc(path)}" data-type="${type}" rows="${type==='lines'?5:3}" spellcheck="true">${esc(type==='lines'?(v||[]).join('\n'):v)}</textarea>`;
 else if(type==='checkbox')control=`<input type="checkbox" id="${id}" data-field="${esc(path)}" data-type="checkbox" ${v?'checked':''} />`;
 else if(type==='image'){const optionsHtml=[...new Set([String(v||''),...slots.map(s=>'./'+s.path)])].map(p=>`<option value="${esc(p)}" ${p===v?'selected':''}>${esc(p.replace('./assets/images/',''))}</option>`).join('');control=`<select id="${id}" data-field="${esc(path)}" data-type="image">${optionsHtml}</select><small class="field__hint">เปลี่ยนไฟล์ที่หน้า Image Assets เพื่อใช้งานจริง</small>`;}
 else if(type==='select')control=`<select id="${id}" data-field="${esc(path)}">${options.split('|').map(o=>`<option value="${esc(o)}" ${o===String(v)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
 else if(type==='color')control=`<div class="color-input"><input type="color" data-field="${esc(path)}" value="${/^#[0-9a-f]{6}$/i.test(v)?v:'#FF6900'}" /><input type="text" data-field="${esc(path)}" value="${esc(v)}" aria-label="${esc(label)} hex code" maxlength="7" /></div>`;
 else control=`<input type="${type==='number'?'number':'text'}" id="${id}" data-field="${esc(path)}" value="${esc(v)}" ${type==='number'?'step="any"':'maxlength="500"'} />`;
 return `<label class="field ${type==='checkbox'?'field--checkbox':''}"><span class="field__label">${esc(label)}${editLanguage==='th'&&originalPath!==path?'<span class="field__language">TH</span>':''}</span>${control}</label>`;
}
function formSection(section){return `<section class="form-section"><h3>${esc(section.title)}</h3>${section.desc?`<p>${esc(section.desc)}</p>`:''}<div class="field-grid">${section.fields.map(field).join('')}</div></section>`;}
function editorArray(key){const a=site[key];return `<section class="form-section"><h3>${key==='blogs'?'Blog Articles':key[0].toUpperCase()+key.slice(1)} (${a.length})</h3><p>แก้ค่าได้ทันที กดปุ่มลูกศรเพื่อจัดเรียงรายการ</p>${a.map((item,i)=>`<article class="card-editor"><div class="card-editor__top"><strong>${i+1}. ${esc(editLanguage==='th'?(item.translations?.th?.title||item.translations?.th?.name||item.title||item.name):(item.title||item.name))}</strong><div class="card-editor__buttons"><button class="icon-button" type="button" aria-label="Move up" data-move="${key}:${i}:-1" ${i===0?'disabled':''}>↑</button><button class="icon-button" type="button" aria-label="Move down" data-move="${key}:${i}:1" ${i===a.length-1?'disabled':''}>↓</button><button class="icon-button danger" type="button" aria-label="Delete item" data-remove="${key}:${i}">×</button></div></div><div class="field-grid">${arraySchemas[key].map(([k,l,t])=>field([`${key}.${i}.${k}`,l,t])).join('')}</div></article>`).join('')}<button class="add-item" type="button" data-add="${key}">＋ เพิ่มรายการ ${esc(key)}</button></section>`;}
function featuresEditor(){return `<section class="form-section"><h3>About / Company Features (${site.features.length})</h3><p>จุดเด่นบริษัทที่แสดงเป็น Pills บนหน้า About</p>${site.features.map((t,i)=>`<div class="field-row" style="margin-bottom:10px"><label class="field"><span class="field__label">Feature ${i+1}</span><input data-field="${editLanguage==='th'?`i18n.th.features.${i}`:`features.${i}`}" value="${esc(editLanguage==='th'?(site.i18n.th.features[i]||t):t)}"></label><button type="button" class="icon-button danger" data-remove="features:${i}" style="align-self:end;height:40px">×</button></div>`).join('')}<button class="add-item" data-add="features" type="button">＋ เพิ่ม Feature</button></section>`;}
function exportPanel(){return `<section class="form-section"><h3>Export Changes</h3><p>สร้างไฟล์อัปเดตเฉพาะ <strong>Content + Design + ภาพที่เปลี่ยน</strong> เพื่อแตกไฟล์ทับโปรเจกต์เดิม</p><div class="export-actions"><button class="primary" type="button" id="downloadPatch">↓ Export Changes ZIP</button><button type="button" id="downloadSiteJS">↓ Export data/site-data.js</button><button type="button" id="downloadJSON">↓ Backup Content JSON</button></div></section>
<section class="form-section"><h3>Import / Restore</h3><p>กู้คืนข้อความจาก JSON ที่เคย Export (ไม่รวมไฟล์ภาพ)</p><div class="export-actions"><label for="importJSON">↑ Import JSON Backup<input type="file" id="importJSON" accept=".json,application/json" /></label><button class="warning" type="button" id="resetDraft">↺ Reset to Original V2.2 Content</button></div></section>
<div class="editor-note"><strong>ข้อจำกัดของ Static Website</strong><br>การแก้ใน Browser ไม่เขียนทับไฟล์บนคอมพิวเตอร์หรือ GitHub อัตโนมัติ หลัง Export ZIP ให้แตกไฟล์ลง Root ของโปรเจกต์เดียวกัน โดยคง path เดิมไว้ (เช่น <code>data/site-data.js</code> และ <code>assets/images/hero/hero-scene.webp</code>) จากนั้น Commit / Push ไป GitHub เอง<br><br>การ Backup JSON ไม่ได้รวมภาพที่อัปโหลด ให้ใช้ Export Changes ZIP เพื่อเก็บภาพด้วย</div>`;}
function imagePanel(){return `<section class="form-section"><h3>Image Library · ${slots.length} Slots</h3><p>เลือกตำแหน่งภาพเพื่ออัปโหลดครอปและส่งออก WebP</p><div class="image-list">${slots.map((s,i)=>`<button class="image-slot ${i===selectedImage?'is-selected':''}" type="button" data-slot="${i}"><img src="../${esc(s.path)}" alt=""><span><strong>${esc(s.slot)}</strong><small>${esc(s.path.split('/').slice(-2).join('/'))} · ${s.width}×${s.height}${imageUploads[s.path]?' · ✓ Updated':''}</small></span></button>`).join('')}</div></section>
<section class="form-section"><h3 id="imageEditorTitle">${esc(slots[selectedImage]?.slot)}</h3><p class="image-path">${esc(slots[selectedImage]?.path)}</p><label class="drop-image">เลือกไฟล์ภาพใหม่ (JPG / PNG / WebP)<input type="file" accept="image/*" id="imageUpload" /></label><div class="canvas-shell"><canvas id="imageCanvas" width="600" height="400" aria-label="Image crop preview"></canvas></div><div class="field-grid" style="margin-top:15px"><label class="range-label">Zoom <span id="zoomVal">100%</span><input type="range" id="imgZoom" min="100" max="250" value="100"></label><label class="range-label">Focus X <span id="focusXVal">50%</span><input type="range" id="imgFocusX" min="0" max="100" value="50"></label><label class="range-label">Focus Y <span id="focusYVal">50%</span><input type="range" id="imgFocusY" min="0" max="100" value="50"></label></div><div class="image-actions" style="margin-top:17px"><button type="button" class="primary" id="applyImage" ${imageSource?'':'disabled'}>✓ ใช้ภาพนี้ใน Preview</button><button type="button" id="downloadOneImage" ${imageUploads[slots[selectedImage]?.path]?'':'disabled'}>↓ ดาวน์โหลด WebP</button><button type="button" id="resetImageCrop">Reset Crop</button></div><p class="editor-note" style="margin-top:13px">หลังอัปโหลดกด “ใช้ภาพนี้ใน Preview” เพื่อเพิ่มเข้าไฟล์ Export ZIP ภาพใน Queue จะอยู่จนกว่าจะ Refresh หน้านี้หรือปิด Browser กรุณา Export ZIP เพื่อเก็บภาพถาวร</p></section>`;}
function renderTab(next=tab){tab=next;document.querySelectorAll('[data-tab]').forEach(n=>n.classList.toggle('is-active',n.dataset.tab===tab));const [title,description,eyebrow]=tabMeta[tab];$('panelTitle').textContent=title;$('panelDescription').textContent=description;$('panelEyebrow').textContent=eyebrow;$('fieldCount').textContent=tab==='images'?`${slots.length} images`:tab==='export'?'EXPORT':tab==='content'?'All sections':'Editable';let html='';
 if(fieldGroups[tab])html=fieldGroups[tab].map(formSection).join('');
 else if(tab==='team')html=editorArray('team')+featuresEditor();
 else if(tab==='reviews')html=editorArray('testimonials');
 else if(tab==='services'||tab==='pricing'||tab==='blog')html=editorArray(tab==='blog'?'blogs':tab);
 else if(tab==='images')html=imagePanel();
 else if(tab==='export')html=exportPanel();
 $('editorForm').innerHTML=tab==='images'||tab==='export'||tab==='design'?html:`<div class="editor-note editor-note--lang"><strong>${editLanguage.toUpperCase()} CONTENT</strong> · ${editLanguage==='th'?'กำลังแก้คำแปลไทย · สี ราคา และรูปเป็นค่ากลางใช้ร่วมกัน':'Editing English master copy · TH translations are independent'}</div>`+html;
 if(tab==='images')initImageCanvas();
}
function previewImages(){return Object.fromEntries(Object.entries(imageUploads).map(([path,obj])=>[path,obj.dataUrl]));}
function updatePreview(){if(!previewReady)return;const frame=$('sitePreview');frame.contentWindow?.postMessage({kind:'PROCLEANING_PREVIEW',site,images:previewImages(),lang:editLanguage},'*');}
function downloaded(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function sourceJs(){return `/* ProCleaning v2.2 bilingual content — generated by Unified Website Manager */\nwindow.PROCLEANING_SITE = ${JSON.stringify(site,null,2)};\n`;}
function backupJson(){return JSON.stringify({format:'procleaning-v22-backup',exportedAt:new Date().toISOString(),site,imagesNotIncluded:Object.keys(imageUploads)},null,2);}
async function zipPatch(){
 try{$('saveStatus').textContent='กำลังสร้าง ZIP…';const entries=[{path:'data/site-data.js',data:sourceJs()},{path:'site-content-backup.json',data:backupJson()},{path:'HOW_TO_APPLY_PATCH.txt',data:'ProCleaning V2.2 — HOW TO INSTALL\n\n1. Extract ALL files from this ZIP into your existing website project ROOT.\n2. Overwrite data/site-data.js (BOTH languages) and any assets/images/*.webp inside this ZIP.\n3. Open index.html (or reload server) to check.\n4. Commit and push the changes to GitHub; this tool does not publish online.\n\nNOTICE: Image edits are included only if you pressed Apply Image in the editor.\nThe project root is the folder that contains index.html, data/, assets/, src/.\n'}];
  for(const [path,obj] of Object.entries(imageUploads))entries.push({path,data:obj.blob});
  const zip=await window.PC_ZIP.create(entries);downloaded(zip,'ProCleaning_V2.2_Changes_PATCH.zip');
  $('saveStatus').textContent=`ZIP พร้อมแล้ว · ${Object.keys(imageUploads).length} ภาพ`;notify('ดาวน์โหลดไฟล์ ZIP แล้ว — แตกไฟล์ทับ Project Root และ Commit/Push');
 }catch(err){console.error(err);notify('สร้าง ZIP ไม่สำเร็จ: '+err.message);$('saveStatus').textContent='สร้าง ZIP ไม่สำเร็จ';}
}
function restoreData(obj){const candidate=obj?.site||obj;if(!candidate?.brand||!candidate?.hero)throw Error('ไฟล์นี้ไม่ใช่ ProCleaning Site Data');site=i18n.normalize(candidate);dirty();renderTab();updatePreview();}
// ----- Crop-to-WebP image workflow -----
function resetRanges(){$('imgZoom').value=100;$('imgFocusX').value=50;$('imgFocusY').value=50;updateRangeLabels();}
function updateRangeLabels(){for(const [key,id] of [['imgZoom','zoomVal'],['imgFocusX','focusXVal'],['imgFocusY','focusYVal']])$(id).textContent=$(key).value+'%';}
function drawCover(ctx,img,w,h,zoom,focusX,focusY){const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom;const cw=Math.min(img.naturalWidth,w/scale),ch=Math.min(img.naturalHeight,h/scale);const sx=Math.max(0,(img.naturalWidth-cw)*focusX),sy=Math.max(0,(img.naturalHeight-ch)*focusY);ctx.clearRect(0,0,w,h);ctx.drawImage(img,sx,sy,cw,ch,0,0,w,h);}
function renderCanvas(){const slot=slots[selectedImage];if(!slot)return;const canvas=$('imageCanvas');if(!canvas)return;canvas.width=slot.width;canvas.height=slot.height;const ctx=canvas.getContext('2d');ctx.fillStyle='#f2f6fc';ctx.fillRect(0,0,canvas.width,canvas.height);if(imageSource)drawCover(ctx,imageSource,canvas.width,canvas.height,Number($('imgZoom').value)/100,Number($('imgFocusX').value)/100,Number($('imgFocusY').value)/100);}
function initImageCanvas(){imageSource=null;if(imageObjectUrl){URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=null;}const slot=slots[selectedImage];if(!slot)return;const loaded=new Image();const index=selectedImage;loaded.onload=()=>{if(selectedImage!==index||!$('imageCanvas'))return;imageSource=null;const c=$('imageCanvas');c.width=slot.width;c.height=slot.height;drawCover(c.getContext('2d'),loaded,slot.width,slot.height,1,.5,.5);};loaded.src=imageUploads[slot.path]?.dataUrl||'../'+slot.path;}
function readAsDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});}
function imageBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?.type==='image/webp'?resolve(blob):reject(Error('Browser ไม่รองรับ WebP Canvas Export')), 'image/webp',.86));}
async function applyImage(){if(!imageSource){notify('กรุณาเลือกภาพใหม่ก่อน');return;}try{const slot=slots[selectedImage],blob=await imageBlob($('imageCanvas')),dataUrl=await readAsDataURL(blob);imageUploads[slot.path]={blob,dataUrl};notify(`เพิ่มภาพ ${slot.slot} แล้ว · ${Math.round(blob.size/1024)} KB`);imageSource=null;renderTab('images');updatePreview();}catch(e){notify('บันทึกภาพไม่ได้: '+e.message);}}
// ----- Events -----
document.querySelectorAll('[data-edit-lang]').forEach(btn=>btn.addEventListener('click',()=>{editLanguage=btn.dataset.editLang;document.querySelectorAll('[data-edit-lang]').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});renderTab();updatePreview();}));
$('editorNav').addEventListener('click',event=>{const target=event.target.closest('[data-tab]');if(target){renderTab(target.dataset.tab);$('editing-area')?.scrollTo(0,0);document.querySelector('.editing-area').scrollTop=0;}});
$('editorForm').addEventListener('input',event=>{
 const e=event.target;
 if(e.dataset.field){const type=e.dataset.type;let value=e.type==='checkbox'?e.checked:type==='lines'?e.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean):e.type==='number'?(Number(e.value)||0):e.value;
  if((e.type==='color'||(/^#[0-9a-f]{6}$/i.test(value)))&&e.dataset.field.startsWith('design.')){if(typeof value==='string'&& !/^#[0-9a-f]{6}$/i.test(value))return;}
  set(e.dataset.field,value);if(e.type==='color'){const twin=e.parentElement.querySelector('input[type=text]');if(twin)twin.value=value;}else if(e.dataset.field.startsWith('design.')&&e.type==='text'){const twin=e.parentElement.querySelector('input[type=color]');if(twin&&/^#[0-9a-f]{6}$/i.test(value))twin.value=value;}
 }
 if(['imgZoom','imgFocusX','imgFocusY'].includes(e.id)){updateRangeLabels();renderCanvas();}
});
$('editorForm').addEventListener('change',event=>{const e=event.target;if(e.dataset.field&&e.tagName==='SELECT')set(e.dataset.field,e.value);
 if(e.id==='imageUpload')loadImage(e.files?.[0]);if(e.id==='importJSON')importJsonFile(e.files?.[0]);
});
$('editorForm').addEventListener('click',event=>{
 const btn=event.target.closest('button');if(!btn)return;
 if(btn.dataset.add){const k=btn.dataset.add;const item=k==='features'?'New Feature':JSON.parse(JSON.stringify(templates[k]));if(k==='blogs'){item.id='article-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);}site[k].push(item);if(k==='features')site.i18n.th.features.push('จุดเด่นใหม่');dirty();renderTab();}
 if(btn.dataset.remove){const [k,i]=btn.dataset.remove.split(':');site[k].splice(Number(i),1);if(k==='features')site.i18n.th.features.splice(Number(i),1);dirty();renderTab();}
 if(btn.dataset.move){const [k,ni,step]=btn.dataset.move.split(':'),i=Number(ni),j=i+Number(step);if(j>=0&&j<site[k].length){[site[k][i],site[k][j]]=[site[k][j],site[k][i]];dirty();renderTab();}}
 if(btn.dataset.slot!==undefined){selectedImage=Number(btn.dataset.slot);renderTab('images');}
 if(btn.id==='applyImage')applyImage();
 if(btn.id==='resetImageCrop'){resetRanges();renderCanvas();}
 if(btn.id==='downloadOneImage'){const image=imageUploads[slots[selectedImage].path];if(image)downloaded(image.blob,slots[selectedImage].path.split('/').pop());}
 if(btn.id==='downloadPatch')zipPatch();
 if(btn.id==='downloadSiteJS'){downloaded(new Blob([sourceJs()],{type:'text/javascript'}),'site-data.js');notify('วางไฟล์นี้ทับ data/site-data.js');}
 if(btn.id==='downloadJSON'){downloaded(new Blob([backupJson()],{type:'application/json'}),'ProCleaning_Content_Backup.json');notify('ดาวน์โหลด JSON แล้ว · ไม่รวมรูปภาพ');}
 if(btn.id==='resetDraft'){if(confirm('รีเซ็ตข้อความและดีไซน์ทั้งหมดกลับเป็นค่าเริ่มต้น V2.2? ภาพที่ Queue ไว้จะไม่ถูกลบ')){site=JSON.parse(JSON.stringify(fresh));dirty();renderTab();}}
});
$('exportPatchTop').addEventListener('click',zipPatch);
document.querySelectorAll('[data-viewport]').forEach(btn=>btn.addEventListener('click',()=>{
 const viewport=btn.dataset.viewport;document.querySelectorAll('[data-viewport]').forEach(el=>{const active=el===btn;el.classList.toggle('is-selected',active);el.setAttribute('aria-pressed',String(active));});$('browserFrame').dataset.viewport=viewport;$('previewSize').textContent={desktop:'1440px (scaled)',tablet:'768px',mobile:'390px'}[viewport];resizeIframe();
}));
$('reloadPreview').addEventListener('click',()=>{previewReady=false;$('sitePreview').src='../index.html?editorPreview=1';});
$('sitePreview').addEventListener('load',()=>{const frame=$('sitePreview');frame.contentWindow?.postMessage({kind:'PROCLEANING_PREVIEW_PING'},'*');setTimeout(()=>{frame.contentWindow?.postMessage({kind:'PROCLEANING_PREVIEW_PING'},'*');updatePreview();},250);});
window.addEventListener('message',event=>{if(event.source!==$('sitePreview').contentWindow||event.data?.kind!=='PROCLEANING_PREVIEW_READY')return;previewReady=true;updatePreview();});
async function importJsonFile(file){if(!file)return;try{if(file.size>2e6)throw Error('JSON ใหญ่เกิน 2 MB');restoreData(JSON.parse(await file.text()));notify('นำเข้า Content JSON สำเร็จ');}catch(e){notify('Import ไม่สำเร็จ: '+e.message);}}
function loadImage(file){if(!file)return;if(!file.type.startsWith('image/')){notify('เลือกไฟล์รูปภาพ JPG, PNG หรือ WebP');return;}if(file.size>25*1024*1024){notify('ภาพใหญ่เกิน 25 MB');return;}
 if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);imageObjectUrl=URL.createObjectURL(file);
 const img=new Image();const index=selectedImage;img.onload=()=>{if(index!==selectedImage)return;imageSource=img;resetRanges();renderCanvas();$('applyImage').disabled=false;notify(`โหลดภาพ ${file.name} แล้ว · ปรับครอปและกดใช้ภาพนี้`);};img.onerror=()=>notify('ไม่สามารถเปิดไฟล์ภาพนี้ได้');img.src=imageObjectUrl;
}
function resizeIframe(){const stage=$('iframeStage'),frame=$('sitePreview'),v=$('browserFrame').dataset.viewport||'desktop';const target={desktop:1440,tablet:768,mobile:390}[v];if(!stage.clientWidth)return;const scale=Math.min(1,stage.clientWidth/target);frame.style.width=target+'px';frame.style.height=Math.max(550,stage.clientHeight/scale)+'px';frame.style.transform=`scale(${scale})`; }
if(typeof ResizeObserver!=='undefined')new ResizeObserver(resizeIframe).observe($('iframeStage'));window.addEventListener('resize',resizeIframe);
window.addEventListener('beforeunload',()=>{if(imageObjectUrl)URL.revokeObjectURL(imageObjectUrl);});
loadDraft();renderTab('general');resizeIframe();
})();
