(()=>{'use strict';
const $=id=>document.getElementById(id),materials=new Set(['paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner']);
function clean(approved,master){
 if(approved?.private!==true||approved?.notPublicRateCard!==true||!Array.isArray(approved.items)||approved.items.length>500)throw Error('ไฟล์ Admin Cloud ไม่ใช่รายการต้นทุนที่อนุมัติ');
 if(!master||typeof master!=='object'||!master.rules)throw Error('ไฟล์ Pricing Master ไม่ถูกต้อง');
 const out=structuredClone(master),seen=new Set(),logs=[];
 // Reject duplicate material updates: only one explicit approved cost per material may be imported.
 for(const item of approved.items){
  if(!materials.has(item.materialId)||seen.has(item.materialId)||!out.rules[item.materialId])throw Error('วัสดุซ้ำ/ไม่ตรงกับ Master: '+item.materialId);
  seen.add(item.materialId);
  const cost=Number(item.landedUnitCost);
  if(!Number.isFinite(cost)||cost<=0||cost>10000000||!item.documentNo||!item.reviewedAt)throw Error('ต้นทุน Supplier ไม่มีหลักฐานการอนุมัติครบ');
  out.rules[item.materialId].materialCost=cost;
  logs.push(item.materialId+': '+cost.toFixed(2)+' บาท · '+item.documentNo);
 }
 if(!logs.length)throw Error('ยังไม่มีต้นทุนที่อนุมัติ');
 out.version='';out.reason=('Admin Cloud import '+new Date().toISOString().slice(0,10)+' · '+logs.join('; ')).slice(0,160);
 return {draft:out,logs};
}
if(typeof document !== 'undefined') $('build').addEventListener('click',async()=>{try{
 const a=$('cloudFile').files[0],m=$('masterFile').files[0];if(!a||!m)throw Error('เลือกไฟล์ทั้งสองก่อน');
 if(a.size>1000000||m.size>1000000)throw Error('ไฟล์เกินขนาดที่รองรับ');
 const {draft,logs}=clean(JSON.parse(await a.text()),JSON.parse(await m.text()));
 if(!confirm('ยืนยันข้อมูลจาก Admin และสร้างร่าง Master ใหม่? ระบบจะไม่แก้ Master เดิมหรือราคา Public'))return;
 const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='SCWORK-PRIVATE-pricing-master-CLOUD-DRAFT.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
 $('result').textContent='สร้างไฟล์ร่างแล้ว\n'+logs.join('\n')+'\n\nเปิด Pricing Workbench → นำเข้า Pricing Master / Draft เดิม → ตรวจต้นทุนทั้งหมด → ตั้ง Version ใหม่ → อนุมัติราคาขาย';
 }catch(e){$('result').textContent='ไม่สามารถนำเข้า: '+e.message;}});
if(typeof module!=='undefined'&&module.exports)module.exports={clean};
})();
