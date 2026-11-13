/* SCWORK V1.7.5 private Pricing Master. Export only the customer price card. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const all=s=>[...document.querySelectorAll(s)];
const {SCWORK_PRICING_DEMO:catalog,SCWORK_RATE_CARD_BUILDER:builder,SCWORK_PRICING_MASTER:masterAPI,SCWORK_PRICING_ENGINE:engine}=window;
if(!catalog||!builder||!masterAPI||!engine)return;
const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname)||location.protocol==='file:';
if(!local){
  $('privacyNote').textContent='เปิดเครื่องมือนี้บน localhost เพื่อจัดการไฟล์ภายใน';
  all('input,button').forEach(el=>el.disabled=true);
  return;
}
const sticker=catalog.categories.find(c=>c.id==='sticker');
const materials=sticker.materials;
const money=new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt=n=>n===null?'—':money.format(n);
const oldKey='scwork-cost-draft-v17-private-local-only',key='scwork-pricing-master-v175';
const fixedDate='2000-01-01T00:00:00.000Z';
let master=masterAPI.fresh(catalog,builder),history=[],current='pp-white';
const readNumber=masterAPI.readNumber;
const cardFor=(state,stamp=fixedDate)=>masterAPI.makeCard(state,catalog,builder,stamp);
const msg=id=>({
 SELECT_MATERIAL:'เลือกวัสดุที่จะเปิดราคาอย่างน้อยหนึ่งชนิด',
 BAD_VAT:'ตรวจค่า VAT ที่กำหนด',
 BAD_VERSION:'ระบุเวอร์ชันด้วยตัวอักษรอังกฤษ ตัวเลข ขีด จุด หรือขีดล่าง',
 INCOMPLETE_COST:'กรอกต้นทุนของวัสดุที่เลือกให้ครบ ใส่ 0 หากไม่มีรายการนั้น',
 INCOMPLETE_SHARED_RATES:'กรอกเรทต้นทุนกลางให้ครบ ใส่ 0 หากไม่ใช้',
 INCOMPLETE_USAGE:'กรอกปริมาณที่ใช้ต้นทุนกลางให้ครบ ใส่ 0 หากไม่ใช้',
 COST_NOT_SET:'ระบุค่าผลิตต่อหน่วยของวัสดุที่เลือก',
 BAD_MARGIN:'กำไรขั้นต้นเป้าหมายต้องอยู่ระหว่าง 5–85%',
 BAD_MASTER_FILE:'ไฟล์ไม่ใช่ Pricing Master หรือ Draft ที่รองรับ',
 BAD_TIER_BOUNDARY:'ช่วงจำนวนไม่ต่อเนื่อง ตรวจตารางช่วงราคาก่อนส่งออก',
 BAD_WASTE:'เผื่อเสียได้ไม่เกิน 80%'
})[id]||'ตรวจความครบถ้วนของตัวเลขในวัสดุที่เลือก';
function set(id,value){$(id).textContent=value;}
function restore(data){
 const next=masterAPI.normalize(data,catalog,builder);
 const loaded=[];
 for(const entry of (Array.isArray(data.history)?data.history:[]).slice(0,24)){
   try{
     if(!Number.isFinite(Date.parse(entry.at)))continue;
     const snapshot=masterAPI.normalize(entry.snapshot,catalog,builder);
     cardFor(snapshot,entry.at);loaded.push({at:entry.at,snapshot});
   }catch{}
 }
 master=next;history=loaded;
}
try{
 const raw=localStorage.getItem(key)||localStorage.getItem(oldKey);
 if(raw)restore(JSON.parse(raw));
}catch{}
function save(){
 try{localStorage.setItem(key,JSON.stringify({...master,history}));}
 catch{set('privacyNote','เบราว์เซอร์ไม่บันทึกร่างในเครื่อง กรุณาสำรอง Pricing Master เป็นไฟล์ JSON ก่อนปิดหน้า');}
}
function change(){
 $('approval').checked=false;save();preview();
}
function render(){
 const m=materials.find(m=>m.id===current),r=master.rules[current];
 set('materialTitle',m.name);set('materialMode',m.mode==='area_sqm'?'ต่อ ตร.ม.':'ต่อแผ่น A3+');
 $('includeMaterial').checked=master.selected.includes(current);
 $('priceVersion').value=master.version;$('vatPct').value=master.vatPct??'';$('changeReason').value=master.reason;
 all('[data-shared]').forEach(el=>el.value=master.globalRates[el.dataset.shared]??'');
 all('[data-cost]').forEach(el=>el.value=r[el.dataset.cost]??'');
 const nav=$('materialNav');nav.replaceChildren();
 for(const item of materials){
   const b=document.createElement('button');b.type='button';b.textContent=item.name;
   b.classList.toggle('is-selected',item.id===current);b.setAttribute('aria-pressed',String(item.id===current));
   b.addEventListener('click',()=>{current=item.id;render();});nav.append(b);
 }
 const addons=$('addonFields');addons.replaceChildren();
 for(const a of m.addons||[]){
   const l=document.createElement('label'),input=document.createElement('input');l.textContent=a.name+' ('+(a.type==='flat'?'บาท/งาน':'บาท/หน่วย')+')';
   input.type='number';input.min='0';input.step='0.01';input.value=r.addonCosts[a.id]??'';
   input.addEventListener('input',()=>{r.addonCosts[a.id]=readNumber(input.value);input.setCustomValidity(input.value!==''&&r.addonCosts[a.id]===null?'ระบุต้นทุนที่ไม่ติดลบ':'');change();});
   l.append(input);addons.append(l);
 }
 preview();
}
function standardSpec(m,qty){
 const width=m.mode==='area_sqm'?100:5;
 return {categoryId:'sticker',materialId:m.id,widthCm:width,heightCm:width,desiredPieces:qty,quantity:qty,areaWidthCm:width,areaHeightCm:width,addonIds:[]};
}
function estimate(card,m,qty){try{return engine.calculate(standardSpec(m,qty),card).total;}catch{return null;}}
function impact(after){
 const last=history[0];let before=null;
 if(last)try{before=cardFor(last.snapshot,last.at);}catch{}
 set('baselineLabel',last?'เทียบกับเวอร์ชัน '+last.snapshot.version+' ที่ส่งออกล่าสุดจาก Master นี้':'ยังไม่มีเรทเดิมสำหรับเทียบ เมื่อส่งออกครั้งแรก ระบบจะใช้เรทนั้นเป็นฐาน');
 const body=$('impactRows');body.replaceChildren();
 const scope=new Set([...master.selected,...(last?.snapshot.selected||[])]);
 for(const m of materials.filter(m=>scope.has(m.id))){
   const quantities=m.mode==='area_sqm'?[1,5,10]:[100,500,1000];
   for(const n of quantities){
     const from=estimate(before,m,n),to=estimate(after,m,n),diff=from===null||to===null?null:Math.round((to-from)*100)/100;
     const prefix=(m.mode==='area_sqm'?'100 × 100':'5 × 5')+' ซม. · ';
     const draft=after&&to===null&&!master.selected.includes(m.id)?'ปิดราคา':fmt(to);
     const tr=document.createElement('tr');
     [m.name+' · '+prefix+n.toLocaleString('th-TH')+' ชิ้น',fmt(from),draft,diff===null?'—':(diff>0?'+':'')+fmt(diff)].forEach((value,i)=>{
       const cell=document.createElement(i===0?'th':'td');if(i===0)cell.scope='row';cell.textContent=value;tr.append(cell);
     });body.append(tr);
   }
 }
}
function historyUI(){
 const list=$('historyList');list.replaceChildren();
 if(!history.length){list.textContent='ยังไม่มีรายการส่งออก';return;}
 for(const entry of history){
   const row=document.createElement('div'),summary=document.createElement('span'),button=document.createElement('button');
   row.className='log-entry';
   const when=new Date(entry.at).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'});
   summary.textContent=entry.snapshot.version+' · '+when+(entry.snapshot.reason?' · '+entry.snapshot.reason:'');
   button.type='button';button.textContent='นำกลับเป็นร่าง';
   button.addEventListener('click',()=>{
     if(!confirm('แทนร่างที่กำลังแก้ด้วยเวอร์ชัน '+entry.snapshot.version+' หรือไม่?'))return;
     master=masterAPI.normalize(entry.snapshot,catalog,builder);
     master.version='';master.reason='นำเรท '+entry.snapshot.version+' กลับมาตรวจ';
     $('approval').checked=false;save();render();
   });
   row.append(summary,button);list.append(row);
 }
}
function preview(){
 let card=null,error='';
 try{card=cardFor(master);if(history.some(h=>h.snapshot.version===master.version))error='ใช้หมายเลขเวอร์ชันใหม่ก่อนส่งออก';}
 catch(e){error=msg(e.message);}
 let ready=false;
 try{
   const out=masterAPI.effectiveRule(master.rules[current],master.globalRates,builder);ready=true;
   set('sharedEffect','ต้นทุนกลางในวัสดุนี้ · ค่าไฟ '+fmt(out.variable)+' บาท/หน่วย · น้ำมันและขนส่ง '+fmt(out.fixed)+' บาท/งาน');
 }catch{set('sharedEffect','กรอกต้นทุนและปริมาณให้ครบเพื่อดูผล');}
 $('validationPill').classList.toggle('is-ready',ready);set('validationPill',ready?'พร้อมคำนวณ':'ยังไม่พร้อม');
 set('progressStatus','เลือกเปิดราคา '+master.selected.length+' / '+materials.length+' วัสดุ');
 set('auditResult',error||'ตรวจผลก่อน–หลัง แล้วเลือกอนุมัติเพื่อส่งออก');
 $('auditResult').classList.toggle('ok',!error);
 $('downloadPublic').disabled=!!error||!$('approval').checked;
 impact(card);
}
function download(name,data,mime){
 const url=URL.createObjectURL(new Blob([data],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
all('[data-shared]').forEach(el=>el.addEventListener('input',()=>{master.globalRates[el.dataset.shared]=readNumber(el.value);change();}));
all('[data-cost]').forEach(el=>el.addEventListener('input',()=>{master.rules[current][el.dataset.cost]=readNumber(el.value);change();}));
$('includeMaterial').addEventListener('change',e=>{
 master.selected=materials.filter(m=>m.id===current?e.target.checked:master.selected.includes(m.id)).map(m=>m.id);change();
});
$('priceVersion').addEventListener('input',e=>{master.version=e.target.value.trim();change();});
$('vatPct').addEventListener('input',e=>{master.vatPct=readNumber(e.target.value);change();});
$('changeReason').addEventListener('input',e=>{master.reason=e.target.value;change();});
$('approval').addEventListener('change',preview);
$('downloadPublic').addEventListener('click',()=>{
 if(!$('approval').checked)return;
 try{
  if(history.some(h=>h.snapshot.version===master.version))return;
  const at=new Date().toISOString(),card=cardFor(master,at);
  download('pricing-public-data.js','/* SCWORK customer selling rates only. */\nwindow.SCWORK_PRICING_PUBLIC = '+JSON.stringify(card,null,2)+';\n','text/javascript');
  history=[{at,snapshot:structuredClone(master)},...history].slice(0,24);
  $('approval').checked=false;save();preview();historyUI();set('auditResult','ส่งออกเรท '+card.version+' แล้ว · นำไฟล์ไปอัปเดตเว็บเมื่อพร้อม');
 }catch(e){set('auditResult',msg(e.message));}
});
$('exportPrivate').addEventListener('click',()=>{
 download('SCWORK-PRIVATE-pricing-master.json',JSON.stringify({...master,history},null,2),'application/json');
});
$('importPrivate').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
   if(file.size>1000000)throw Error('BAD_MASTER_FILE');
   restore(JSON.parse(await file.text()));$('approval').checked=false;save();render();historyUI();
 }catch{set('auditResult',msg('BAD_MASTER_FILE'));}
 finally{e.target.value='';}
});
render();historyUI();
})();
