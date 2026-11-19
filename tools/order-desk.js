/* Order Desk only exports files. It never updates the public site on its own. */
(() => {
  'use strict';
  const brief=window.SCWORK_PROJECT_BRIEF,follow=window.SCWORK_ORDER_FOLLOWUP,ops=window.SCWORK_ORDER_DESK;
  if(!brief||!follow||!ops)return;
  const $=id=>document.getElementById(id),rows=()=>$('finalItems').querySelectorAll('.p-sku');
  let state=null,ticket=0;
  const messages={
    PROJECT:'ใช้ไฟล์งานจาก Project Desk ไม่ใช่ไฟล์บรีฟลูกค้า',ORDER:'ไฟล์นี้ไม่ใช่ Order Desk หรือ Project Desk',
    REFERENCE:'เลขโครงการไม่ตรงกัน ให้เปิด Order Desk ในแท็บใหม่',OLDER:'ไฟล์ Project Desk เก่ากว่าหรือใช้ฉบับเดิมแต่เนื้อหาไม่ตรง',
    DELIVERED_SCOPE:'งานนี้ส่งมอบแล้ว ไม่สามารถเปลี่ยนชุดแบบของรายการส่งมอบเดิมได้',
    APPROVAL:'ยังไม่มีการยืนยันชุดแบบปัจจุบันใน Project Desk จึงยังเลื่อนไปสถานะผลิตหรือส่งต่อไม่ได้',
    BACKWARD:'สถานะต้องไม่ย้อนจากฉบับที่สร้างล่าสุด ถ้าต้องแก้ ให้ใช้สถานะพักงานที่ขั้นเดิม',
    HOLD:'งานที่ส่งมอบแล้วไม่สามารถพักงานได้',
    STATUS:'ตรวจสถานะและวันที่ที่กรอกอีกครั้ง',TIME:'เวลาเครื่องเก่ากว่าไฟล์ล่าสุด โปรดตรวจเวลาแล้วลองอีกครั้ง',
    REPEAT_NOT_READY:'ต้องบันทึกว่าส่งมอบแล้ว มีหลักฐานยืนยันแบบฉบับปัจจุบัน และตรวจสเปกครบก่อนสร้างไฟล์สั่งซ้ำ',
    ITEMS:'จำนวนรายการสเปกไม่ตรงกับบรีฟฉบับที่ใช้อ้างอิง',
    DUPLICATE:'ใช้ชื่อหรือรหัส SKU ที่แยกแต่ละแบบได้ ไม่ซ้ำกัน'
  };
  const say=(id,msg)=>{$(id).textContent=msg;};
  const fail=(id,e)=>say(id,messages[e.message]||'ตรวจไฟล์หรือสเปกอีกครั้ง ต้องระบุชื่อ SKU จำนวน ขนาด และวัสดุ');
  const labels=['รับงานแล้ว','ตรวจไฟล์และชุดแบบ','กำลังผลิต','ตรวจคุณภาพ','พร้อมส่งมอบ','ส่งมอบแล้ว'];
  function rowCount(){
    const list=[...rows()],count=list.length;
    for(const [i,row] of list.entries()){
      row.querySelector('legend').textContent='SKU '+String(i+1).padStart(2,'0');
      row.querySelector('[data-remove]').disabled=count===1||!!state?.desk.brief;
    }
    $('addFinal').disabled=count>=brief.maxItems||!!state?.desk.brief;
  }
  function add(values={}){
    if(rows().length>=brief.maxItems)return;
    const row=$('finalTemplate').content.firstElementChild.cloneNode(true);
    row.querySelectorAll('[data-key]').forEach(e=>{e.value=values[e.dataset.key]??(e.dataset.key==='material'?'undecided':'');});
    row.querySelector('[data-remove]').addEventListener('click',()=>{
      if(state?.desk.brief||rows().length<=1)return;
      row.remove();rowCount();invalidate();
    });
    $('finalItems').append(row);rowCount();
  }
  function fillItems(){
    $('finalItems').replaceChildren();
    const seed=state.items||state.desk.brief?.data.items;
    if(seed?.length)seed.forEach(add);else add();
    invalidate();
  }
  function readItems(){
    return [...rows()].map(row=>{
      const el=k=>row.querySelector('[data-key="'+k+'"]');
      return {name:el('name').value,qty:el('qty').valueAsNumber,width:el('width').valueAsNumber,height:el('height').valueAsNumber,
        material:el('material').value,note:el('note').value};
    });
  }
  function invalidate(){
    $('finalChecked').checked=false;
    say('repeatBuildFeedback','');paint();
  }
  function paint(){
    $('orderWorkspace').hidden=!state;
    if(!state)return;
    const last=state.lastExport,approved=ops.approval(state);
    say('orderRef',state.desk.project.reference);
    say('proofState',approved?'ใช้หลักฐานยืนยันชุดแบบ '+state.desk.approval.proof:'รอผลยืนยันชุดแบบจาก Project Desk');
    say('lastExport',last?'ไฟล์สถานะล่าสุด v'+last.version+' · '+labels[follow.stages.indexOf(last.stage)]:'ยังไม่ได้สร้างไฟล์สถานะ');
    let href='';
    try{if(last)href=ops.link($('siteBase').value.trim(),state.token);}catch{}
    $('trackingLink').value=href;
    $('copyTracking').disabled=!href;
    $('makeRepeat').disabled=!(last?.stage==='delivered'&&approved&&state.deliveredKey&&$('finalChecked').checked);
    if($('orderStage').value==='delivered')$('orderHold').checked=false;
    $('orderHold').disabled=$('orderStage').value==='delivered';
  }
  $('orderImport').addEventListener('change',async e=>{
    const file=e.target.files[0],id=++ticket;e.target.value='';
    if(!file)return;
    try{
      if(file.size>brief.maxFileBytes*2)throw Error('ORDER');
      const data=JSON.parse(await file.text());
      if(id!==ticket)return;
      if(state&&data.schema===ops.schema){say('loadState','เปิดไฟล์ Order Desk สำรองในแท็บใหม่เพื่อไม่ให้ทับงานที่กำลังทำ');return;}
      const before=state,merged=!!state;
      state=state?ops.merge(state,data):ops.open(data);
      if(!merged||state.items!==before.items||state.desk.project.briefRevision!==before.desk.project.briefRevision)fillItems();else invalidate();
      $('orderStage').value=state.lastExport?.stage||'received';
      $('orderTarget').value=state.lastExport?.target||'';
      $('orderHold').checked=state.lastExport?.onHold||false;
      say('loadState',merged?'อัปเดตไฟล์ Project Desk แล้ว ลิงก์เดิมยังใช้ได้':'เปิดไฟล์งานแล้ว');
      paint();
    }catch(e){if(ticket===id)fail('loadState',e);}
  });
  $('siteBase').addEventListener('input',paint);
  $('orderStage').addEventListener('change',paint);
  $('finalChecked').addEventListener('change',paint);
  $('finalItems').addEventListener('input',invalidate);
  $('finalItems').addEventListener('change',invalidate);
  $('addFinal').addEventListener('click',()=>{if(state&&!state.desk.brief){add();invalidate();}});
  $('makeStatus').addEventListener('click',()=>{
    if(!state)return;
    try{
      const next=ops.recordStatus(state,{stage:$('orderStage').value,onHold:$('orderHold').checked,target:$('orderTarget').value});
      brief.download(next.lastExport,next.token+'.json');state=next;
      say('statusBuildFeedback','สร้างไฟล์ v'+state.lastExport.version+' แล้ว ยังไม่ได้เผยแพร่ อย่าลืมดาวน์โหลดไฟล์ Order Desk ล่าสุด');
      paint();
    }catch(e){fail('statusBuildFeedback',e);}
  });
  $('copyTracking').addEventListener('click',async()=>{
    const field=$('trackingLink');if(!field.value)return;
    const ok=await brief.safeCopy(field,field.value,navigator);
    say('statusBuildFeedback',ok?'คัดลอกลิงก์แล้ว ตรวจว่าลิงก์แสดงสถานะจริงหลังเผยแพร่ก่อนส่ง':'เลือกข้อความให้แล้ว กรุณากดคัดลอก');
  });
  $('makeRepeat').addEventListener('click',()=>{
    if(!state)return;
    try{
      const spec=ops.repeatFile(state,readItems(),$('finalChecked').checked);
      state={...state,items:spec.items};brief.download(spec,spec.reference+'-repeat.json');
      say('repeatBuildFeedback','ดาวน์โหลดสเปกแล้ว ส่งให้ลูกค้าทางช่องทางโครงการ ไม่ใส่ในเว็บไซต์สาธารณะ');
    }catch(e){fail('repeatBuildFeedback',e);}
  });
  $('backupOrder').addEventListener('click',()=>{
    if(!state)return;
    let complete=true,items=state.items;
    try{items=ops.packItems(readItems(),state.desk);}catch{complete=false;}
    state={...state,items};
    brief.download(state,state.desk.project.reference+'-order-desk.json');
    say('backupFeedback',complete?'บันทึกไฟล์งานพร้อมรายการสเปกแล้ว':'บันทึกไฟล์งานแล้ว รายการสเปกที่ยังกรอกไม่ครบไม่ได้บันทึก');
  });
  paint();
})();
