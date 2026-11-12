/* SCWork bilingual price-estimator UI. All catalog rates are DEMONSTRATION ONLY. */
(() => {
'use strict';
const data=window.SCWORK_PRICING_DEMO,engine=window.SCWORK_PRICING_ENGINE;
const $=id=>document.getElementById(id);
if(!data||!engine){console.error('Missing pricing modules');return;}
const categoriesEn={sticker:'Stickers & Product Labels',print:'Print & Cards',acrylic:'Gifts & Acrylic',signage:'Signs & Displays'};
const materialsEn={'paper-sticker':'Paper Sticker','kraft-sticker':'Kraft Sticker','pp-white':'White PP Sticker','pp-clear':'Clear PP Sticker','pp-silver':'Metallic Silver PP','pvc-sqm':'PVC Sticker (sqm)','business-card':'Business Cards','pvc-card':'PVC Cards','nfc-card':'NFC Cards','rfid-mifare':'RFID Mifare Cards','rfid-proximity':'RFID Proximity Cards','acrylic-keychain':'Acrylic Keychain / Pin','j-flag':'J-Flag','vinyl-banner':'Vinyl Banner (sqm)','rollup':'Roll-Up Display','x-stand':'X-Stand Display'};
const unitsEn={'แผ่น A3+':'A3+ sheets','ตร.ม.':'sqm','ใบ':'pcs','ชิ้น':'pcs','ชุด':'sets'};
const displayUnit=m=>lang==='th'?m.unitLabel:(unitsEn[m.unitLabel]||m.unitLabel);
const addonsEn={'lamination':'Gloss / Matte lamination','design':'Graphic design service','lamination-card':'Card lamination','spot-uv':'Spot UV / Metallic effect','duck-clip':'Silver duckbill clip','pearl-strap':'Pearl strap'};
const tr={
 th:{home:'กลับเว็บไซต์',title:'คำนวณราคางานพิมพ์เบื้องต้น',lead:'เลือกวัสดุ ขนาด จำนวน และตัวเลือกเสริม เพื่อดูราคาอ้างอิงก่อนส่งรายละเอียดงาน',demo:'อัตราราคาในหน้านี้เป็นข้อมูลสาธิตจาก ZIP อ้างอิง ไม่ใช่ราคาขายจริงของ SCWork',step1:'ประเภทสินค้าและวัสดุ',step2:'ขนาดและจำนวน',step3:'ตัวเลือกเสริม',step4:'ตารางช่วงราคา',tierQty:'ช่วงจำนวน',tierPrice:'ราคาต่อหน่วย',tierSelection:'สถานะ',summary:'สรุปราคาโดยประมาณ',units:'จำนวนที่คิดราคา',rate:'ราคาต่อหน่วย',base:'ค่าพิมพ์เบื้องต้น',addons:'ค่า Add-ons / ออกแบบ',subtotal:'ยอดก่อน VAT',vat:'VAT 7%',total:'รวมโดยประมาณ',toRfq:'ส่งสเปกนี้ไป Smart RFQ ↗',copy:'คัดลอกข้อมูล (JSON)',fineprint:'อัตราตัวอย่างเพื่อทดสอบ Logic เท่านั้น ไม่รวมค่าจัดส่ง การเตรียมไฟล์ การสูญเสียวัสดุหรือเงื่อนไขจริง และไม่ใช่ใบเสนอราคาที่อนุมัติแล้ว',width:'กว้าง (ซม.)',height:'สูง (ซม.)',pieces:'จำนวนดวงที่ต้องการ',qty:'จำนวนที่ต้องการ',quantity:'จำนวนชิ้น/ผืน',preset:'เลือกขนาด',areaW:'กว้าง (ซม.)',areaH:'ยาว (ซม.)',none:'ไม่มีตัวเลือกเสริม',price:'อัตรา',selected:'✓ ช่วงที่ใช้',minimum:'ขั้นต่ำการคิดราคา',minsheet:'ขั้นต่ำ',sheets:'แผ่น A3+',sqm:'ตร.ม.',unit:'หน่วย',ready:'พร้อมใช้ข้อมูลสเปกเพื่อส่งต่อ (ไม่ส่งคำขอจริง)',error:'กรุณาตรวจสอบขนาดและจำนวน',tooLarge:'ขนาดชิ้นงานใหญ่เกินพื้นที่ A3+ ที่กำหนด กรุณาเลือกบริการพื้นที่ตารางเมตรหรือขอประเมินตรง',copied:'คัดลอกแล้ว',copyFail:'คัดลอกไม่ได้ โปรดใช้ JSON Download หรือเลือกข้อความเอง',sent:'กำลังเปิด Smart RFQ พร้อมสเปกงานที่เลือก',tierEmpty:'ไม่มีช่วงราคาแบบปริมาณสำหรับวัสดุนี้',unavailable:'ไม่สามารถคำนวณได้'},
 en:{home:'Back to website',title:'Instant Reference Price Calculator',lead:'Explore materials, dimensions, quantities and optional services before requesting a confirmed quote.',demo:'The rates below come from the supplied reference ZIP and are for demonstration ONLY—not SCWork selling prices.',step1:'Choose product & material',step2:'Dimensions & quantity',step3:'Optional services',step4:'Quantity pricing tiers',tierQty:'Quantity band',tierPrice:'Rate per unit',tierSelection:'Selection',summary:'Estimated price breakdown',units:'Billable quantity',rate:'Unit rate',base:'Reference print charge',addons:'Add-ons / design',subtotal:'Subtotal excl. VAT',vat:'VAT 7%',total:'Illustrative total',toRfq:'Use specifications in Smart RFQ ↗',copy:'Copy details (JSON)',fineprint:'Illustrative formulas and rates only; freight, file preparation, material waste and actual production conditions are not included. This is not an approved quotation.',width:'Width (cm)',height:'Height (cm)',pieces:'Required sticker pieces',qty:'Quantity',quantity:'Number of pieces',preset:'Choose size',areaW:'Width (cm)',areaH:'Length (cm)',none:'No add-ons for this product',price:'Unit rate',selected:'✓ Applied',minimum:'Billable minimum',minsheet:'Minimum',sheets:'A3+ sheets',sqm:'sqm',unit:'unit',ready:'Ready to transfer specs (no real submission)',error:'Check dimensions and quantity',tooLarge:'This size cannot fit the configured A3+ layout. Use sqm material or ask for a manual quote.',copied:'Copied',copyFail:'Clipboard unavailable. Try a supported browser.',sent:'Opening Smart RFQ with selected specifications',tierEmpty:'No quantity bands for this material',unavailable:'Calculation unavailable'}
};
for(const [code,pack] of Object.entries(window.SCWORK_EXTRA_LOCALES||{})){tr[code]={...tr.en,...(pack.calculator||{})};}
function savedLang(){try{const search=new URLSearchParams(location.search).get('lang'),saved=localStorage.getItem('procleaning-language');const all=['ar','my','zh','ru','nl','es','en','th','fr','vi','de','it','ja','ko'];return all.includes(search)?search:all.includes(saved)?saved:'th';}catch{return 'th';}}
let lang=savedLang();
const initial=data.categories[0].materials[0];
let state={categoryId:data.categories[0].id,materialId:initial.id,widthCm:5,heightCm:5,desiredPieces:500,areaWidthCm:100,areaHeightCm:100,quantity:100,presetId:null,addonIds:[]};
let result=null;
const T=key=>(tr[lang]||tr.en)[key]||tr.en[key]||key;
const matName=m=>lang==='th'?m.name:(materialsEn[m.id]||m.name);
const catName=c=>lang==='th'?c.name:(categoriesEn[c.id]||c.name);
const currentCategory=()=>data.categories.find(c=>c.id===state.categoryId);
const currentMaterial=()=>currentCategory().materials.find(m=>m.id===state.materialId);
const number=x=>Number(x).toLocaleString(lang==='th'?'th-TH':'en-US',{maximumFractionDigits:2,minimumFractionDigits:0});
const money=x=>Number(x).toLocaleString(lang==='th'?'th-TH':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ฿';
const htmlEscape=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const set=(id,s)=>{const el=$(id);if(el)el.textContent=s;};
function showLabels(){
 document.documentElement.lang=lang;
 const ids={estTitle:'title',estLead:'lead',estDemoNotice:'demo',estStep1:'step1',estStep2:'step2',estStep3:'step3',estStep4:'step4',estTierQty:'tierQty',estTierPrice:'tierPrice',estTierSelection:'tierSelection',estSummaryTitle:'summary',estUnitsLabel:'units',estRateLabel:'rate',estBaseLabel:'base',estAddonsLabel:'addons',estSubtotalLabel:'subtotal',estVatLabel:'vat',estTotalLabel:'total',estToRfq:'toRfq',estCopy:'copy',estFinePrint:'fineprint'};
 for(const [id,key] of Object.entries(ids))set(id,T(key));
 $('estHome').querySelector('span').textContent=T('home');
 document.querySelectorAll('[data-language]').forEach(btn=>{const on=btn.dataset.language===lang;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});
}
function defaultsFor(mat){state.addonIds=[];state.presetId=mat.sizePresets?.[0]?.id||null;state.quantity=mat.defaultQty||mat.minQty||1;}
function renderCategories(){ $('estCategories').innerHTML=data.categories.map(c=>`<button data-category="${c.id}" class="${c.id===state.categoryId?'active':''}" type="button">${htmlEscape(catName(c))}</button>`).join(''); }
function renderMaterials(){ $('estMaterials').innerHTML=currentCategory().materials.map(m=>`<button type="button" data-material="${m.id}" class="${m.id===state.materialId?'active':''}"><strong>${htmlEscape(matName(m))}</strong><small>${htmlEscape(lang==='th'?m.description:m.mode==='a3_sheet'?'Calculated on A3+ sheets':m.mode==='area_sqm'?'Calculated by square meter':m.mode==='size_preset'?'Choose a standard size':'Quantity-based tier pricing')}</small></button>`).join(''); }
function field(name,label,value,min,step='1'){return `<label class="est-field">${htmlEscape(label)}<input type="number" data-field="${name}" value="${htmlEscape(value)}" step="${step}" min="${min}" required></label>`;}
function renderFields(){
 const m=currentMaterial();let html='';
 if(m.mode==='a3_sheet'){html=field('widthCm',T('width'),state.widthCm,.1,'.1')+field('heightCm',T('height'),state.heightCm,.1,'.1')+field('desiredPieces',T('pieces'),state.desiredPieces,1);}
 else if(m.mode==='area_sqm'){html=field('areaWidthCm',T('areaW'),state.areaWidthCm,1)+field('areaHeightCm',T('areaH'),state.areaHeightCm,1)+field('quantity',T('quantity'),state.quantity,1);}
 else if(m.mode==='quantity_tier'){html=field('quantity',T('qty'),state.quantity,1);}
 else if(m.mode==='size_preset'){html=`<label class="est-field">${T('preset')}<select data-field="presetId">${m.sizePresets.map(p=>`<option value="${htmlEscape(p.id)}" ${p.id===state.presetId?'selected':''}>${htmlEscape(lang==='th'?p.label:p.label.replace('ชุดขาตั้ง 2 ด้าน','Double-sided stand'))} — ${money(p.price)}</option>`).join('')}</select></label>`+field('quantity',T('qty'),state.quantity,1);}
 $('estFields').innerHTML=html;
 const unit=m.mode==='area_sqm'?' '+T('sqm'):m.mode==='a3_sheet'?' '+T('sheets'):' '+displayUnit(m);
 set('estRules',`${T('minsheet')}: ${m.minSheets||m.minQty||m.minAreaSqm||1}${unit} · ${T('minimum')} / minimum billable quantity`);
}
function renderAddons(){const m=currentMaterial();$('estAddons').innerHTML=(m.addons||[]).length?m.addons.map(a=>`<div class="est-addon"><label><input type="checkbox" data-addon="${htmlEscape(a.id)}" ${state.addonIds.includes(a.id)?'checked':''}><span>${htmlEscape(lang==='th'?a.name:(addonsEn[a.id]||a.name))}</span></label><small>+${money(a.price)} ${a.type==='per_unit'?'/ '+(lang==='th'?'หน่วย':'unit'):''}</small></div>`).join(''):`<p class="est-note">${T('none')}</p>`;}
function renderTiers(){const m=currentMaterial();const rows=m.tiers||[];
 $('estTierRows').innerHTML=rows.length?rows.map(tier=>{const active=result?.activeTier===tier.label;const max=Number.isFinite(tier.max)?number(tier.max):'∞';return `<tr class="${active?'active':''}"><td>${number(tier.min)}–${max}</td><td>${money(tier.price)} / ${htmlEscape(displayUnit(m))}</td><td>${active?T('selected'):'—'}</td></tr>`;}).join(''):`<tr><td colspan="3">${T('tierEmpty')}</td></tr>`;}
function update(){
 const m=currentMaterial();let error='';
 try{result=engine.calculate(state,data);}catch(err){result=null;error=err.message==='TOO_LARGE_FOR_A3'?T('tooLarge'):T('error')+' ('+err.message+')';}
 $('estWarning').hidden=!error;set('estWarning',error);$('estToRfq').disabled=!result;$('estCopy').disabled=!result;
 renderTiers();set('estSummaryMaterial',matName(m));
 if(!result){['estUnits','estRate','estBase','estExtras','estSubtotal','estVat','estTotal'].forEach(id=>set(id,'—'));set('estFormula','');set('estSummaryDetail',T('unavailable'));return;}
 const d=result.details;
 const unitLabel=m.mode==='a3_sheet'?T('sheets'):m.mode==='area_sqm'?T('sqm'):displayUnit(m);
 set('estUnits',number(result.units)+' '+unitLabel);set('estRate',money(result.unitRate));set('estBase',money(result.basePrint));set('estExtras',money(result.addonsTotal));set('estSubtotal',money(result.subtotal));set('estVat',money(result.vat));set('estTotal',money(result.total));
 let detail='';
 if(m.mode==='a3_sheet')detail=`${d.columns} × ${d.rows} = ${d.piecesPerSheet} ${lang==='th'?'ดวง/แผ่น':'pieces/sheet'} · ${number(d.sheetsRequired)} ${unitLabel}`;
 else if(m.mode==='area_sqm')detail=`${number(d.actualSqm)} sqm · ${number(d.chargedSqm)} ${lang==='th'?'ตร.ม.ที่คิดราคา':'billable sqm'}`;
 else if(m.mode==='size_preset')detail=d.presetLabel;
 else detail=`${number(result.units)} ${unitLabel}`;
 set('estSummaryDetail',detail);set('estFormula',`${T('base')}: ${number(result.units)} × ${money(result.unitRate)} + ${T('addons')} ${money(result.addonsTotal)} + VAT ${number(result.vatRate*100)}%`);
}
function renderAll(){showLabels();renderCategories();renderMaterials();renderFields();renderAddons();update();}
$('estCategories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.categoryId=b.dataset.category;const m=currentCategory().materials[0];state.materialId=m.id;defaultsFor(m);renderAll();});
$('estMaterials').addEventListener('click',e=>{const b=e.target.closest('[data-material]');if(!b)return;state.materialId=b.dataset.material;defaultsFor(currentMaterial());renderAll();});
$('estFields').addEventListener('input',e=>{const target=e.target;const f=target.dataset.field;if(!f)return;if(target.tagName==='INPUT'){state[f]=target.value===''?NaN:Number(target.value);update();}});
$('estFields').addEventListener('change',e=>{const f=e.target.dataset.field;if(f==='presetId'){state.presetId=e.target.value;update();}});
$('estAddons').addEventListener('change',e=>{const id=e.target.dataset.addon;if(!id)return;state.addonIds=e.target.checked?[...new Set([...state.addonIds,id])]:state.addonIds.filter(x=>x!==id);update();});
document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.language;try{localStorage.setItem('procleaning-language',lang);}catch{}renderAll();}));
window.addEventListener('scwork:locale-change',e=>{const next=e.detail?.code;if(!next)return;lang=next;try{localStorage.setItem('procleaning-language',lang);}catch{}renderAll();window.dispatchEvent(new CustomEvent('scwork:locale-applied',{detail:{code:lang}}));});
$('estCopy').addEventListener('click',async()=>{if(!result)return;const payload={...result,brand:'SCWork',note:'DEMO REFERENCE RATE; NOT A FINAL QUOTE'};try{await navigator.clipboard.writeText(JSON.stringify(payload,null,2));set('estCopyFeedback',T('copied'));}catch{set('estCopyFeedback',T('copyFail'));}});
$('estToRfq').addEventListener('click',()=>{
 if(!result)return;
 const handoff={schemaVersion:1,at:Date.now(),language:lang,categoryId:state.categoryId,materialId:state.materialId,materialName:currentMaterial().name,mode:result.mode,details:result.details,units:result.units,subtotal:result.subtotal,vat:result.vat,total:result.total,nonBinding:true};
 try{sessionStorage.setItem('scwork-pricing-handoff',JSON.stringify(handoff));}catch{set('estCopyFeedback',lang==='th'?'Browser ไม่อนุญาตให้บันทึกสเปกชั่วคราว':'Browser storage unavailable');return;}
 set('estCopyFeedback',T('sent'));
 const q=state.categoryId==='signage'?'Display & Signage':state.materialId==='pvc-sqm'?'Large Format Inkjet':'Sticker & Label';
 window.location.href='./request-quote.html?fromEstimator=1&category='+encodeURIComponent(q)+'&lang='+lang;
});
renderAll();
})();
