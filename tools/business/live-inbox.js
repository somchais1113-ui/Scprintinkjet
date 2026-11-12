(() => {
 'use strict';
 const cfg=window.PROCLEANING_PUBLIC_CONFIG||{};
 const enabled=cfg.mode==='connected'&&/^https:\/\/[^/]+\.supabase\.co\/?$/.test(cfg.supabaseUrl||'')&&!!cfg.publishableKey;
 const $=id=>document.getElementById(id);
 let access='',rows=[],emails=[];
 const base=(cfg.supabaseUrl||'').replace(/\/$/,'');
 function show(id){for(const x of ['setup','login','inbox'])$(x).hidden=x!==id;}
 $('modePill').textContent=enabled?'Backend configured':'Demo / not connected';
 if(!enabled){show('setup');return;}show('login');
 async function call(path,opts={}){
  const res=await fetch(base+path,{...opts,headers:{apikey:cfg.publishableKey,...(access?{Authorization:'Bearer '+access}:{}),...(opts.headers||{})},cache:'no-store'});
  const data=await res.json().catch(()=>null);
  if(!res.ok)throw Error((data?.msg||data?.message||data?.error||'HTTP '+res.status).slice(0,160));
  return data;
 }
 async function signIn(evt){evt.preventDefault();const f=new FormData(evt.target);$('authMessage').textContent='Signing in…';
  try{
   const d=await call('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:f.get('email'),password:f.get('password')})});
   if(!d.access_token)throw Error('Missing access token');access=d.access_token;
   const membership=await call('/rest/v1/admin_users?select=user_id&limit=1');
   if(!Array.isArray(membership)||membership.length===0)throw Error('STAFF_ACCESS_REQUIRED');
   evt.target.reset();await load();show('inbox');$('authMessage').textContent='';
  }catch(e){access='';$('authMessage').textContent='Login or staff authorization failed: '+e.message;show('login');}
 }
 async function load(){
  const [r,n]=await Promise.all([
   call('/rest/v1/rfqs?select=id,reference,project_title,category,quantity,unit,specs,language,status,received_at,customers(name,email,phone)&order=received_at.desc&limit=100'),
   call('/rest/v1/notification_outbox?select=rfq_id,kind,status&order=created_at.desc&limit=250')
  ]);
  rows=r||[];emails=n||[];
  $('countAll').textContent=String(rows.length);
  $('countNew').textContent=String(rows.filter(x=>x.status==='received').length);
  $('countEmail').textContent=String(emails.filter(x=>x.kind==='customer_receipt'&&x.status==='sent'&&rows.some(r=>r.id===x.rfq_id)).length);
  $('updated').textContent='Latest '+rows.length+' records · Refreshed '+new Date().toLocaleTimeString('th-TH');
  $('list').replaceChildren();
  if(!rows.length){$('list').textContent='ยังไม่มีคำขอราคาที่เข้าระบบ';$('detail').textContent='—';return;}
  for(const rfq of rows){const b=document.createElement('button');b.type='button';b.className='entry';
    const x=document.createElement('span');x.textContent=rfq.reference+' • '+new Date(rfq.received_at).toLocaleString('th-TH');
    const y=document.createElement('b');y.textContent=rfq.project_title;
    const z=document.createElement('span');z.textContent=rfq.category+' · '+rfq.quantity+' '+rfq.unit;
    b.append(x,y,z);b.addEventListener('click',()=>detail(rfq));$('list').append(b);
  }
  detail(rows[0]);
 }
 function detail(r){const node=$('detail');node.replaceChildren();
  const dl=document.createElement('dl');
  const customer=Array.isArray(r.customers)?r.customers[0]:r.customers||{};
  const values={'เลขอ้างอิง':r.reference,'ชื่อ':customer.name||'—','อีเมล':customer.email||'—','เบอร์โทร':customer.phone||'—','บริการ':r.category,'โปรเจกต์':r.project_title,'จำนวน':r.quantity+' '+r.unit,'สถานะ':r.status,'ขนาด':r.specs?.width+' × '+r.specs?.height+' '+(r.specs?.dimensionUnit||''),'วัสดุ':r.specs?.material||'—','Finishing':r.specs?.finish||'—','หมายเหตุ':r.specs?.notes||'—','อีเมลลูกค้า':emails.find(e=>e.rfq_id===r.id&&e.kind==='customer_receipt')?.status||'Not scheduled'};
  for(const [k,v] of Object.entries(values)){const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent=String(v);dl.append(dt,dd);}node.append(dl);
 }
 $('loginForm').addEventListener('submit',signIn);
 $('refresh').addEventListener('click',()=>load().catch(e=>{if(/401|JWT|403/i.test(e.message)){access='';show('login');$('authMessage').textContent='Session expired. Please log in again.';}else alert('Unable to refresh data: '+e.message);}));
 $('signout').addEventListener('click',()=>{access='';rows=[];emails=[];show('login');});
})();
