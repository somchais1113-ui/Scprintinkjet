/* V2.1.31 private, local-first supplier price review workflow. No network publish. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const F=$('quoteForm');
const C=window.SCWORK_PRICING_CONTROL_CORE,M=window.SCWORK_PRICING_MASTER,B=window.SCWORK_RATE_CARD_BUILDER;
const catalog=window.SCWORK_PRIVATE_COST_CATALOG;
if(!C||!M||!B||!catalog){$('accessBlock').hidden=false;$('accessBlock').textContent='ไม่พบโมดูล Pricing Master / Catalog กรุณาเปิดจาก Full Package';return;}
const allowed=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
if(!allowed){$('accessBlock').hidden=false;document.querySelectorAll('input,select,textarea,button').forEach(x=>x.disabled=true);return;}
const materials=catalog.categories[0].materials;
const storageKey='scwork-price-watch-v2131-local',masterKey='scwork-pricing-master-v175';
const money=n=>n===null||n===undefined?'—':'฿'+Number(n).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=n=>n===null||n===undefined?'—':(n>0?'+':'')+Number(n).toFixed(2)+'%';
const $get=(name)=>F.elements.namedItem(name);
const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2);
let state={version:C.VERSION,records:[],audit:[]},selectedId='';
try{const raw=localStorage.getItem(storageKey);if(raw){const s=JSON.parse(raw);if(s.version===C.VERSION&&Array.isArray(s.records)&&Array.isArray(s.audit))state={version:C.VERSION,records:s.records.slice(0,500),audit:s.audit.slice(0,1000)};}}catch{}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));return true}catch{flash('พื้นที่จัดเก็บข้อมูลเต็ม โปรดสำรอง JSON และลดจำนวนรายการ',false);return false}}
function flash(message,good=false){$('formMessage').textContent=message;$('formMessage').classList.toggle('ok',good)}
function masterRead(){const raw=localStorage.getItem(masterKey);if(!raw)return M.fresh(catalog,B);const parsed=JSON.parse(raw);const normalized=M.normalize(parsed,catalog,B);return {...normalized,history:Array.isArray(parsed.history)?parsed.history:[]};}
function byId(id){return state.records.find(x=>x.id===id)}
function statusLabel(s){return s==='draft'?'รอตรวจ':s==='approved'?'อนุมัติต้นทุน':'ส่งเข้า Master'}
function unitLabel(m){return m.mode==='area_sqm'?'ตร.ม.':'แผ่น A3+'}
function getMaterial(id){return materials.find(m=>m.id===id)}
function fromForm(){const m=getMaterial($get('materialId').value);return {id:uid(),materialId:m?.id,supplier:$get('supplier').value,documentNo:$get('documentNo').value,packPrice:$get('packPrice').value,packUnits:$get('packUnits').value,unit:C.unitFor(m),taxTreatment:$get('taxTreatment').value,quoteDate:$get('quoteDate').value,validUntil:$get('validUntil').value,sourceURL:$get('sourceURL').value,notes:$get('notes').value};}
function quoteInputPreview(){try{const m=getMaterial($get('materialId').value);const p=Number($get('packPrice').value),q=Number($get('packUnits').value);const tax=$get('taxTreatment').value;
 $('computedUnit').textContent=p>0&&q>0&&['vat-included','vat-excluded','no-vat'].includes(tax)?money(C.round((tax==='vat-excluded'?p*1.07:p)/q))+' / '+unitLabel(m):'—';}catch{$('computedUnit').textContent='—'}}
function updateUnit(){const m=getMaterial($get('materialId').value);$('unitNote').textContent='หน่วยที่ใช้คำนวณ: '+unitLabel(m)+' · ราคาในเอกสาร ÷ จำนวน'+unitLabel(m)+' · รวม VAT ต้นทุนที่เครดิตไม่ได้';quoteInputPreview()}
const DB='scwork-private-price-evidence-v2131';
function dbOpen(){return new Promise((resolve,reject)=>{if(!indexedDB){reject(Error('Browser ไม่รองรับ IndexedDB'));return}const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('files'))req.result.createObjectStore('files',{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('เปิดพื้นที่หลักฐานไม่สำเร็จ'))})}
async function putFile(file,id){const buffer=await file.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))).map(b=>b.toString(16).padStart(2,'0')).join('');const db=await dbOpen();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put({id,name:file.name,type:file.type||'application/octet-stream',bytes:buffer,sha256:hash});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}finally{db.close()}return {id,name:file.name,sha256:hash,size:file.size}}
async function getFile(id){const db=await dbOpen();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('files');const request=tx.objectStore('files').get(id);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error)})}finally{db.close()}}
function download(name,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function writeAudit(rec,action,by,description){state.audit.unshift(C.audit(rec,action,by,description));state.audit=state.audit.slice(0,1000)}
function metrics(){$('metricMaterial').textContent=materials.length;$('metricQuotes').textContent=state.records.length;$('metricPending').textContent=state.records.filter(x=>x.status==='draft').length;$('metricApplied').textContent=state.records.filter(x=>x.status==='applied').length}
function populate(){const options=materials.map(m=>({id:m.id,label:m.name}));for(const opt of options){const el=document.createElement('option');el.value=opt.id;el.textContent=opt.label;$('materialSelect').append(el);const f=el.cloneNode(true);$('filterMaterial').append(f)}$('quoteForm').elements.namedItem('quoteDate').value=today();updateUnit()}
function renderTable(){const body=$('quoteRows'),mat=$('filterMaterial').value,status=$('filterStatus').value;body.replaceChildren();const list=state.records.filter(r=>(mat==='all'||r.materialId===mat)&&(status==='all'||r.status===status));if(!list.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=6;td.textContent='ยังไม่มีข้อมูลตามเงื่อนไขที่เลือก';tr.append(td);body.append(tr);return}
 for(const r of list){const m=getMaterial(r.materialId);const tr=document.createElement('tr');tr.classList.toggle('selected',r.id===selectedId);
 const cells=[`${r.materialName}\n${r.supplier}`,`${r.documentNo}\n${r.quoteDate}`,money(r.landedUnitCost)+' / '+unitLabel(m)];
 for(let i=0;i<3;i++){const td=document.createElement('td');if(i===0){const strong=document.createElement('strong');strong.textContent=r.materialName;td.append(strong);const small=document.createElement('small');small.textContent=r.supplier;td.append(small)}else if(i===1){td.textContent=r.documentNo;const small=document.createElement('small');small.textContent=r.quoteDate;td.append(small)}else td.textContent=cells[i];tr.append(td)}
 const old=(r.status!=='draft'&&r.approvedAgainstCost!==undefined)?r.approvedAgainstCost:masterRead()?.rules?.[r.materialId]?.materialCost;const diff=old>0?(r.landedUnitCost/old-1)*100:null;const d=document.createElement('td');d.textContent=pct(diff);d.className=diff>0?'negative':diff<0?'positive':'';tr.append(d);
 const s=document.createElement('td'),tag=document.createElement('span');tag.className='state '+r.status;tag.textContent=statusLabel(r.status);s.append(tag);tr.append(s);
 const btnCell=document.createElement('td'),btn=document.createElement('button');btn.type='button';btn.textContent='ตรวจราคา';btn.addEventListener('click',()=>{selectedId=r.id;resetCheck();renderAll();document.getElementById('review').scrollIntoView({behavior:'smooth',block:'start'})});btnCell.append(btn);tr.append(btnCell);body.append(tr)} }
function resetCheck(){$('checkedEvidence').checked=false;$('approvalFeedback').textContent='ตรวจหลักฐานและผลคำนวณก่อนอนุมัติ'}
function impactFor(rec){if(!rec)return null;try{const master=masterRead();if(rec.approvedBaseline&&rec.approvedShared){master.rules[rec.materialId]=rec.approvedBaseline;master.globalRates=rec.approvedShared;}return C.getImpact(master,getMaterial(rec.materialId),rec.landedUnitCost,null,B,M)}catch(e){return {ready:false,reason:e.message}}}
function renderReview(){const r=byId(selectedId),summary=$('impactSummary'),tbody=$('impactRows'),label=$('selectedLabel'),d=$('approvalDesc');tbody.replaceChildren();summary.replaceChildren();
 if(!r){label.textContent='เลือกใบราคาจากตารางเพื่อเปรียบเทียบกับ Cost Master ที่มีอยู่';summary.className='impact-summary empty';summary.textContent='ยังไม่ได้เลือกใบราคา';d.textContent='เลือกใบราคาที่มีหลักฐาน แล้วตรวจผลกระทบก่อนส่งให้ Pricing Master';const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.textContent='รอเลือกใบราคา';tr.append(td);tbody.append(tr);$('approveCost').disabled=true;$('applyMaster').disabled=true;return}
 summary.className='impact-summary';label.textContent=r.materialName+' · '+r.supplier+' · '+r.documentNo;
 const lines=[['ต้นทุน Supplier ล่าสุด',money(r.landedUnitCost)+' / '+unitLabel(getMaterial(r.materialId))],['สถานะเอกสาร',r.validUntil?'ใช้ได้ถึง '+r.validUntil:'ไม่ได้ระบุวันหมดอายุ'],['หลักฐาน',r.evidence?'ไฟล์: '+r.evidence.name:'URL อ้างอิง']];
 const impact=impactFor(r);if(impact.ready){lines.push(['ต้นทุนใน Master',money(impact.previousUnit)],['ต้นทุนเพิ่ม/ลด',pct(impact.deltaPct)])}else lines.push(['การจำลองราคา',impact.reason]);
 for(const [k,v]of lines){const el=document.createElement('div'),key=document.createElement('span'),val=document.createElement('strong');key.textContent=k;val.textContent=v;el.append(key,val);summary.append(el)}
 if(impact.ready){for(const row of impact.lines){const tr=document.createElement('tr');const vals=[row.units.toLocaleString('th-TH')+' '+unitLabel(getMaterial(r.materialId)),money(row.newCost),money(row.b2c.recommended),pct(row.b2c.marginIfUnchanged),row.b2b?money(row.b2b.recommended):'ยังไม่กำหนด B2B'];for(const v of vals){const td=document.createElement('td');td.textContent=v;tr.append(td)}tbody.append(tr)}}else{const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.textContent='ไม่แสดงราคาสมมติ — '+impact.reason;tr.append(td);tbody.append(tr)}
 d.textContent=r.status==='draft'?'ใบราคายังเป็นร่าง ตรวจเอกสารก่อนอนุมัติ':r.status==='approved'?'ต้นทุนได้รับอนุมัติแล้ว สามารถส่งเข้า Pricing Master เป็นร่าง': 'ส่งต้นทุนเข้า Pricing Master แล้ว ต้องตรวจและอนุมัติราคาขายต่อ';
 $('approveCost').disabled=r.status!=='draft';$('applyMaster').disabled=r.status!=='approved';
 const extras=document.createElement('div');extras.className='action-row';
 if(r.sourceURL){const a=document.createElement('a');a.href=r.sourceURL;a.target='_blank';a.rel='noopener noreferrer';a.className='outline-btn';a.textContent='เปิดลิงก์ Supplier';extras.append(a)}
 if(r.evidence?.id){const b=document.createElement('button');b.type='button';b.className='outline-btn';b.textContent='ดาวน์โหลดหลักฐาน';b.addEventListener('click',async()=>{try{const f=await getFile(r.evidence.id);if(!f)throw Error('ไม่พบไฟล์บนเครื่องนี้');download(f.name,new Blob([f.bytes],{type:f.type}));$('approvalFeedback').textContent='ดาวน์โหลดหลักฐานแล้ว'}catch(e){$('approvalFeedback').textContent=e.message}});extras.append(b)}summary.append(extras);
}
function renderAudit(){const root=$('auditLog');root.replaceChildren();if(!state.audit.length){root.textContent='ยังไม่มีประวัติ';return}for(const e of state.audit.slice(0,12)){const el=document.createElement('div'),main=document.createElement('span'),date=document.createElement('small');main.textContent=e.action+' · '+(e.by||'ระบบ')+' · '+e.details;date.textContent=new Date(e.at).toLocaleString('th-TH');el.append(main,date);root.append(el)}}
function renderAll(){metrics();renderTable();renderReview();renderAudit()}
F.addEventListener('input',quoteInputPreview);$('materialSelect').addEventListener('change',updateUnit);$('filterStatus').addEventListener('change',renderTable);$('filterMaterial').addEventListener('change',renderTable);
F.addEventListener('submit',async e=>{e.preventDefault();$('saveQuote').disabled=true;flash('กำลังตรวจเอกสารและบันทึก...');let raw=fromForm();let uploaded=null;
 try{const file=$('evidenceFile').files?.[0];if(file){if(file.size>12*1024*1024||file.size===0)throw Error('ขนาดไฟล์ต้องไม่เกิน 12 MB และไม่เป็นไฟล์ว่าง');if(!/\.(pdf|png|jpe?g|webp|xlsx?|csv)$/i.test(file.name))throw Error('รองรับเฉพาะ PDF รูปภาพ และไฟล์ตารางที่กำหนด');uploaded=await putFile(file,raw.id);raw.evidence=uploaded}
 const record=C.normalizeSupplierQuote(raw,getMaterial(raw.materialId));record.id=raw.id;
 state.records.unshift(record);state.records=state.records.slice(0,500);writeAudit(record,'บันทึกใบราคา','ผู้บันทึก','Supplier '+record.supplier+' · '+record.documentNo);
 if(!save())throw Error('บันทึกข้อมูลลง Browser Storage ไม่สำเร็จ');selectedId=record.id;resetCheck();renderAll();F.reset();$get('quoteDate').value=today();updateUnit();flash('บันทึกราคาต้นทุนแล้ว กรุณาตรวจข้อมูลและหลักฐานก่อนอนุมัติ',true);
 }catch(err){flash(err.message||'บันทึกไม่สำเร็จ',false)}finally{$('saveQuote').disabled=false}});
async function proofCheck(r){if(r.sourceURL)return true;if(!r.evidence?.id)return false;const f=await getFile(r.evidence.id);return !!(f&&f.sha256===r.evidence.sha256)}
$('approveCost').addEventListener('click',async()=>{const r=byId(selectedId);if(!r)return;try{
 C.validationForApproval(r,today());if(!$('checkedEvidence').checked)throw Error('ต้องยืนยันว่าได้ตรวจหลักฐานแล้ว');const name=$('approver').value.trim(),reason=$('approvalReason').value.trim();if(name.length<2||reason.length<5)throw Error('ระบุผู้อนุมัติและเหตุผลให้ครบ');if(!await proofCheck(r))throw Error('ตรวจไฟล์หลักฐานบนเครื่องนี้ไม่ได้ โปรดแนบใหม่เป็นใบราคาใหม่หรือใช้ URL แหล่งอ้างอิง');
 if(!confirm('อนุมัติราคาต้นทุนจาก '+r.supplier+'\n'+money(r.landedUnitCost)+' / '+unitLabel(getMaterial(r.materialId))+'\nยืนยันว่าตรวจเอกสารและ VAT Supplier แล้ว?'))return;
 const master=masterRead();r.approvedAgainstCost=master.rules?.[r.materialId]?.materialCost??null;r.approvedBaseline=structuredClone(master.rules?.[r.materialId]||{});r.approvedShared=structuredClone(master.globalRates);r.status='approved';r.approvedBy=name;r.approvedAt=new Date().toISOString();r.approvalReason=reason;r.updatedAt=r.approvedAt;
 writeAudit(r,'อนุมัติต้นทุน',name,reason);if(!save())throw Error('บันทึกผลอนุมัติไม่สำเร็จ');resetCheck();renderAll();$('approvalFeedback').textContent='อนุมัติต้นทุนแล้ว ยังไม่ได้เปลี่ยนราคาขายหรือ Rate Card';
 }catch(err){$('approvalFeedback').textContent=err.message||'อนุมัติไม่สำเร็จ'}});
$('applyMaster').addEventListener('click',async()=>{const r=byId(selectedId);if(!r||r.status!=='approved')return;try{
 if(r.validUntil&&r.validUntil<today())throw Error('เอกสารหมดอายุแล้ว กรุณารับราคาฉบับใหม่');if(!await proofCheck(r))throw Error('ไม่พบหลักฐานต้นฉบับบนเครื่องนี้');
 const master=masterRead();const old=master.rules?.[r.materialId]?.materialCost;if(old===undefined)throw Error('ไม่พบวัสดุใน Pricing Master');
 if(old!==r.approvedAgainstCost)throw Error('ต้นทุน Master เปลี่ยนหลังอนุมัติ กรุณาตรวจและสร้างคำขอใหม่เพื่อป้องกันข้อมูลทับกัน');
 const msg='ส่งต้นทุน '+r.materialName+' จาก '+money(old)+' เป็น '+money(r.landedUnitCost)+' เข้า Pricing Master เป็นร่าง?\n\nขั้นตอนนี้ไม่เผยแพร่ราคาขึ้นเว็บไซต์ และจะยกเลิกการอนุมัติ Rate Card ที่ค้างอยู่';if(!confirm(msg))return;
 master.rules[r.materialId].materialCost=r.landedUnitCost;
 master.reason=('Supplier '+r.supplier+' / '+r.documentNo+' / '+r.approvalReason).slice(0,160);
 // Never overwrite an approved historical rate version or silently re-approve a rate card.
 master.version='';
 localStorage.setItem(masterKey,JSON.stringify(master));
 r.status='applied';r.appliedAt=new Date().toISOString();r.updatedAt=r.appliedAt;writeAudit(r,'ส่งเข้าร่าง Cost Master',r.approvedBy,'วัสดุ '+r.materialId+' · ต้องอนุมัติ Rate Card ต่อ');save();renderAll();
 $('approvalFeedback').textContent='ส่งเข้าร่าง Cost Master แล้ว เปิด Pricing Master ตั้งเวอร์ชัน ตรวจ Margin และอนุมัติเรทขายอีกครั้ง';
 }catch(e){$('approvalFeedback').textContent=e.message||'ส่งต้นทุนไม่สำเร็จ'}});
$('exportJSON').addEventListener('click',()=>{download('SCWORK-PRIVATE-Supplier-Price-History-'+today()+'.json',new Blob([JSON.stringify({type:'SCWORK_PRIVATE_PRICE_WATCH',...state,exportedAt:new Date().toISOString(),filesNotIncluded:true},null,2)],{type:'application/json'}))});
$('importJSON').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2e6)throw Error('ไฟล์ JSON มีขนาดใหญ่เกิน');const obj=JSON.parse(await file.text());if(obj.type!=='SCWORK_PRIVATE_PRICE_WATCH'||obj.version!==C.VERSION||!Array.isArray(obj.records)||!Array.isArray(obj.audit)||obj.records.length>500||obj.audit.length>1000)throw Error('ไฟล์สำรองไม่ถูกต้อง');if(!confirm('นำเข้าข้อมูลจะทับประวัติใบราคาใน Browser นี้ แต่ไม่เปลี่ยน Pricing Master ต้องการดำเนินการหรือไม่?'))return;const clean=obj.records.map(r=>{
  if(!C.MATERIALS.includes(r.materialId)||!Number.isFinite(Number(r.landedUnitCost))||Number(r.landedUnitCost)<=0||
    typeof r.supplier!=='string'||typeof r.documentNo!=='string')throw Error('พบข้อมูลใบราคาไม่ถูกต้อง');
  // Import is backup/transfer, NOT a trustworthy approval credential.
  const {approvedBaseline,approvedShared,approvedAgainstCost,approvedBy,approvedAt,appliedAt,approvalReason,...rest}=r;
  return {...rest,status:'draft',updatedAt:new Date().toISOString(),notes:String(rest.notes||'').slice(0,400)};
 });
 state={version:C.VERSION,records:clean,audit:obj.audit};if(!save())throw Error('พื้นที่จัดเก็บไม่เพียงพอ');selectedId='';renderAll();flash('นำเข้าข้อมูลแล้ว สถานะอนุมัติถูกรีเซ็ตเป็นร่างเพื่อความปลอดภัย และต้องนำไฟล์หลักฐานต้นฉบับมาใหม่หากไม่ได้ใช้ URL',true)}catch(err){flash(err.message||'นำเข้าไม่สำเร็จ')}finally{e.target.value=''}});
$('exportCSV').addEventListener('click',()=>{const esc=v=>{let x=String(v??'');if(/^[=+@\-\t\r]/.test(x))x="'"+x;return '"'+x.replaceAll('"','""')+'"'};const rows=[['เวลา','รายการ','การกระทำ','ผู้ดำเนินการ','รายละเอียด'],...state.audit.map(x=>[x.at,x.id,x.action,x.by,x.details])];const csv='\ufeff'+rows.map(r=>r.map(esc).join(',')).join('\r\n');download('SCWORK-PRIVATE-Price-Audit-'+today()+'.csv',new Blob([csv],{type:'text/csv;charset=utf-8'}))});
populate();renderAll();
})();
