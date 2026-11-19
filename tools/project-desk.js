/* Local operator workspace. No browser persistence, no auth or automatic release. */
(() => {
  'use strict';
  const briefAPI=window.SCWORK_PROJECT_BRIEF,desk=window.SCWORK_PROJECT_DESK;
  if(!briefAPI||!desk)return;
  const $=id=>document.getElementById(id),form=$('deskForm');
  const available=[...form.querySelectorAll('[data-available]')];
  const fields={reference:'deskRef',briefRevision:'deskBriefRev',owner:'deskOwner',quoteRevision:'deskQuoteRev',quoteNumber:'deskQuoteNo',timeline:'deskTimeline',
    otherDoc:'deskOtherDoc',proofRevision:'deskProofRev',proofFile:'deskProofFile'};
  const numberSet=new Set(['briefRevision','quoteRevision','proofRevision']);
  let brief=null,approval=null,lastScope='',invalidated=false,importRevision=0;
  const note=s=>$('deskFeedback').textContent=s;
  function read(){
    return desk.normalize({...Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,numberSet.has(key)?$(id).valueAsNumber:$(id).value])),
      confirmedDocs:available.filter(e=>e.checked).map(e=>e.dataset.available)});
  }
  function populate(state){
    for(const [key,id] of Object.entries(fields))$(id).value=state[key]??'';
    for(const e of available)e.checked=state.confirmedDocs.includes(e.dataset.available);
  }
  function clearApprovalFields(){
    $('deskConfirmed').value='';$('deskApprovalDate').value='';$('deskProofEvidence').value='';$('deskAll').checked=false;
  }
  function draw(track=true){
    const state=read(),refs=desk.refs(state),key=desk.binding(state),scope=JSON.stringify([refs.brief,refs.quote,refs.proof,state.quoteNumber,state.proofFile]);
    if(track&&lastScope&&scope!==lastScope){
      if(approval)invalidated=true;
      approval=null;clearApprovalFields();
    }
    lastScope=scope;
    const current=brief&&brief.reference===state.reference&&brief.revision===state.briefRevision;
    $('deskBriefPanel').hidden=!current;
    $('deskBriefContent').textContent=current?briefAPI.format(brief,'th'):'';
    $('deskOtherLabel').hidden=!state.confirmedDocs.includes('other');
    $('deskRefView').textContent=[refs.brief,refs.quote,refs.proof].filter(Boolean).join('\n')||'ยังไม่มีเลขอ้างอิงที่ถูกต้อง';
    $('proofExpected').textContent=refs.proof?'เลขชุดแบบที่ต้องตรงกับหลักฐาน: '+refs.proof:'กรอกเลขโครงการและฉบับชุดแบบเพื่อสร้างเลขชุดสำหรับอ้างอิง';
    const composed=desk.compose(state,approval);
    for(const [kind,id] of [['quote','Quote'],['proof','Proof'],['release','Release']]){
      $('desk'+id+'Text').value=composed[kind];
      $('copy'+id+'Ref').disabled=!composed[kind];
    }
    $('recordApproval').disabled=!key||!state.owner;
    $('saveDesk').disabled=!refs.brief;
    $('approvalState').textContent=composed.release?'มีบันทึกการยืนยันสำหรับชุดแบบปัจจุบัน โปรดเทียบกับหลักฐานจริงก่อนผลิต':
      invalidated?'ฉบับบรีฟ ใบเสนอราคา หรือชุดแบบเปลี่ยนแล้ว ต้องตรวจหลักฐานและบันทึกการยืนยันใหม่ก่อนส่งต่อ':
      'ยังไม่มีบันทึกยืนยันชุดแบบปัจจุบัน';
    return {state,current};
  }
  function register(){
    try{
      approval=desk.record(read(),{confirmed:$('deskConfirmed').value.trim(),date:$('deskApprovalDate').value,evidence:$('deskProofEvidence').value,allSKUs:$('deskAll').checked});
      invalidated=false;draw(false);note('บันทึกผลยืนยันแบบไว้ในหน้านี้แล้ว ดาวน์โหลดไฟล์งานเพื่อเก็บหลักฐานอ้างอิง');
    }catch(e){
      const reasons={INCOMPLETE:'ตรวจเลขโครงการ เลขใบเสนอราคา ชื่อไฟล์ชุดแบบ และผู้ประสานงาน',REVISION:'เลขชุดแบบที่กรอกไม่ตรงกับชุดแบบปัจจุบัน',COVERAGE:'ตรวจว่าลูกค้ายืนยันครบทุก SKU และไม่มีรายการแก้ค้าง',DATE:'ใส่วันที่ลูกค้ายืนยันจริงที่ไม่อยู่ในอนาคต',EVIDENCE:'ใส่รายการอ้างอิงหลักฐานการยืนยัน'};
      $('approvalState').textContent=reasons[e.message]||'ตรวจข้อมูลยืนยันอีกครั้ง';
    }
  }
  function importProject(value){
    const incoming=desk.unpack(value),present=read();
    const next=incoming.project?.reference||incoming.brief.reference;
    if(present.reference&&present.reference!==next){note('เลขโครงการไม่ตรงกัน เปิดหน้า Project Desk ใหม่เพื่อทำอีกโครงการ');return;}
    if(incoming.project){
      if(present.reference){note('เปิดไฟล์งานที่บันทึกไว้ในแท็บ Project Desk ใหม่เพื่อไม่ให้เขียนทับงานที่กำลังทำ');return;}
      populate(incoming.project);brief=incoming.brief;approval=incoming.approval;invalidated=false;clearApprovalFields();draw(false);
      note('เปิดไฟล์งานแล้ว โปรดตรวจตัวเอกสารและหลักฐานจริงก่อนส่งต่อ');return;
    }
    if(present.reference&&present.briefRevision>incoming.brief.revision){note('บรีฟที่เปิดเป็นฉบับเก่ากว่าที่ระบุในโครงการนี้');return;}
    if(brief&&brief.reference===next&&brief.revision===incoming.brief.revision&&JSON.stringify(brief.data)!==JSON.stringify(incoming.brief.data)){
      note('ไฟล์ใช้เลขฉบับเดียวกันแต่ข้อมูลไม่ตรงกัน ขอให้ลูกค้ายืนยันว่าต้องใช้ฉบับไหน');return;
    }
    if(!brief&&approval){approval=null;invalidated=true;clearApprovalFields();}
    brief=incoming.brief;$('deskRef').value=brief.reference;$('deskBriefRev').value=brief.revision;draw();note('เปิดบรีฟลูกค้าแล้ว');
  }
  $('deskImport').addEventListener('change',async e=>{
    const file=e.target.files[0],ticket=++importRevision;e.target.value='';
    if(!file)return;
    if(file.size>briefAPI.maxFileBytes){note('ไฟล์มีขนาดเกินกว่าที่เครื่องมือนี้รองรับ');return;}
    try{
      const value=JSON.parse(await file.text());
      if(ticket===importRevision)importProject(value);
    }catch{if(ticket===importRevision)note('เปิดไฟล์ไม่ได้ ให้ใช้ JSON จากหน้าบรีฟโครงการหรือ Project Desk รุ่นนี้');}
  });
  form.addEventListener('input',e=>{if(e.target.id!=='deskImport'){note('');draw();}});
  form.addEventListener('change',e=>{if(e.target.id!=='deskImport')draw();});
  $('recordApproval').addEventListener('click',register);
  for(const id of ['Quote','Proof','Release'])$('copy'+id+'Ref').addEventListener('click',async()=>{
    const field=$('desk'+id+'Text');if(!field.value)return;
    const ok=await briefAPI.safeCopy(field,field.value,navigator);
    note(ok?'คัดลอกข้อความแล้ว':'เลือกข้อความให้แล้ว กรุณากดคัดลอก');
  });
  $('saveDesk').addEventListener('click',()=>{
    try{
      const {state,current}=draw(false);
      const saved=desk.pack(state,current?brief:null,approval);
      briefAPI.download(saved,state.reference+'-desk.json');note('ดาวน์โหลดไฟล์งานแล้ว ให้เก็บในโฟลเดอร์โครงการภายใน');
    }catch{note('ตรวจเลขโครงการและฉบับบรีฟก่อนดาวน์โหลด');}
  });
  draw(false);
})();
