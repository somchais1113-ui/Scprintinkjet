(() => {
 'use strict';
 const q=new URLSearchParams(location.search);
 if(q.get('type')!=='general')return;
 const general=document.getElementById('generalInquiry');
 const print=document.querySelector('.rfq-main-grid');const intro=document.querySelector('.rfq-intro');
 general.hidden=false;print.hidden=true;intro.hidden=true;
 const form=document.getElementById('generalForm'),feedback=document.getElementById('generalFeedback');
 const network=window.PCRFQNetwork;
 const enabled=!!network?.enabled;
 if(!enabled){
   document.getElementById('generalNotice').textContent='โหมดตัวอย่าง: ยังไม่เชื่อมฐานข้อมูล กรุณาอย่าใส่ข้อมูลส่วนบุคคล / Demo only: no backend connected.';
   form.querySelectorAll('input,select,textarea').forEach(el=>el.disabled=true);
   document.getElementById('generalSubmit').disabled=true;
 }else network.renderChallenge('generalTurnstile');
 form.addEventListener('submit',async e=>{
   e.preventDefault();if(!enabled)return;
   if(!form.reportValidity())return;
   const v=Object.fromEntries(new FormData(form).entries());
   if(!v.consent){feedback.textContent='Please confirm the privacy notice';return;}
   const submit=document.getElementById('generalSubmit');
   submit.disabled=true;submit.textContent='กำลังส่ง / Submitting…';feedback.textContent='';
   try{
     const out=await network.submit({name:v.name,email:v.email,phone:v.phone||'',title:String(v.message).slice(0,160),category:v.service,quantity:1,unit:'jobs',language:document.documentElement.lang==='th'?'th':'en',specs:{width:1,height:1,dimensionUnit:'mm',material:'Not applicable',finish:'None',printSides:'1',artwork:'not_applicable',deadline:'',notes:v.message}});
     form.hidden=true;const success=document.getElementById('generalSuccess');success.hidden=false;
     const icon=document.createElement('div');icon.className='check';icon.textContent='✓';
     const title=document.createElement('h2');title.textContent='ได้รับคำขอแล้ว / Request received';
     const reference=document.createElement('p');reference.textContent='Reference: '+out.reference;
     const note=document.createElement('p');note.textContent='Saved to database. An acknowledgement email is queued; it may arrive later.';
     success.append(icon,title,reference,note);
   }catch(err){feedback.textContent='ยังยืนยันการรับคำขอไม่ได้ / Unable to confirm receipt: '+(err.message||'NETWORK_ERROR')+' — Retry with same submission ID.';}
   finally{submit.disabled=false;submit.textContent='ส่งคำขอ / Submit request →';}
 });
})();
