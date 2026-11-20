/* Reads the team's latest published status. No automatic data submission. */
(() => {
  'use strict';
  const api=window.SCWORK_ORDER_FOLLOWUP;
  if(!api)return;
  const $=id=>document.getElementById(id);
  const all=s=>[...document.querySelectorAll(s)];
  const EN={skip:'Skip to content',back:'Product labels',title:'Track a project or reorder',
    lead:'Use the project’s tracking link to see the latest update from SCWork. To reorder, use the specification file provided by the team.',
    statusTitle:'Latest project status',idle:'Open the tracking link from SCWork or enter its code below.',
    hold:'The team is reviewing an issue. Check with your coordinator before relying on the previous schedule.',
    refresh:'Refresh status',tokenLabel:'Tracking code from your link',open:'View status',
    reorderTitle:'Reorder from saved specs',
    reorderLead:'Open the JSON spec file supplied by the team, then choose which SKUs and quantities to request. The team confirms materials, pricing and delivery for the new request.',
    reorder:'Open a reorder spec file',privateNote:'Anyone with the link can see this status. Share it only with people involved. Contact names, addresses, prices and artwork are not shown here.'};
  const labels={
    th:['รับงานแล้ว','ตรวจไฟล์และชุดแบบ','กำลังผลิต','ตรวจคุณภาพ','พร้อมส่งมอบ','ส่งมอบแล้ว'],
    en:['Received','Artwork review','In production','Quality check','Ready for handover','Handed over']
  };
  const messages={
    invalid:['ใช้รหัสท้ายลิงก์จาก SCWork ความยาว 32 ตัวอักษร','Enter the 32-character code from the SCWork link.'],
    loading:['กำลังโหลดสถานะล่าสุด…','Loading the latest status…'],
    missing:['ยังไม่พบสถานะที่เผยแพร่สำหรับลิงก์นี้ ตรวจรหัสหรือติดต่อผู้ประสานงาน','No published status was found for this code. Check the link or contact your coordinator.'],
    error:['เปิดสถานะไม่ได้ ลองอีกครั้งหรือติดต่อผู้ประสานงาน','We could not load the status. Try again or contact your coordinator.'],
    stale:['สถานะที่โหลดเก่ากว่าฉบับก่อนหน้า โปรดโหลดใหม่หรือตรวจสอบกับทีม','The returned update was older than the last one viewed. Refresh or contact your coordinator.']
  };
  const th=new WeakMap(),params=new URLSearchParams(location.search);
  let lang=params.has('lang')&&params.get('lang')!=='th'?'en':'th';
  let mode='idle',snapshot=null,last=null,active='',serial=0;
  const pick=(a,b)=>lang==='th'?a:b;
  function url(opts){
    try{
      const u=new URL(location.href);
      u.searchParams.set('lang',lang);
      if(opts)u.hash=opts;
      history.replaceState(null,'',u);
    }catch{}
  }
  function render(){
    const status=$('trackMessage');
    const ready=mode==='ready'&&!!snapshot;
    $('statusPanel').hidden=!ready;
    status.textContent=mode==='idle'?pick(th.get(status),EN.idle):ready?'':pick(...messages[mode]);
    status.hidden=ready;
    $('trackOpen').disabled=mode==='loading';
    if(!ready)return;
    const idx=api.stages.indexOf(snapshot.stage),date=stamp=>new Intl.DateTimeFormat(pick('th-TH','en-GB'),{
      timeZone:'Asia/Bangkok',calendar:'gregory',day:'numeric',month:'short',year:'numeric'
    }).format(new Date(stamp));
    const datetime=new Intl.DateTimeFormat(pick('th-TH','en-GB'),{
      timeZone:'Asia/Bangkok',calendar:'gregory',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
    }).format(new Date(snapshot.updatedAt));
    $('trackRef').textContent=snapshot.reference;
    $('currentStage').textContent=(snapshot.onHold?pick('พักงาน · ','On hold · '):'')+labels[lang][idx];
    $('holdNote').hidden=!snapshot.onHold;
    $('trackTarget').textContent=snapshot.target&&!snapshot.onHold&&snapshot.stage!=='delivered'?pick('กำหนดส่งที่ทีมแจ้งล่าสุด','Latest target from the team')+' · '+date(snapshot.target+'T12:00:00Z'):'';
    $('trackTarget').hidden=!$('trackTarget').textContent;
    $('trackUpdated').textContent=pick('ทีมอัปเดตล่าสุด','Updated by SCWork')+' · '+datetime+' '+pick('เวลาไทย','Bangkok time');
    $('stepList').replaceChildren(...labels[lang].map((text,i)=>{
      const li=document.createElement('li'),num=document.createElement('span');
      num.setAttribute('aria-hidden','true');num.textContent=String(i+1).padStart(2,'0');
      if(i===idx)li.setAttribute('aria-current','step');
      if(i<idx)li.className='o-done';
      li.append(num,text);return li;
    }));
  }
  function language(next){
    lang=next;document.documentElement.lang=lang;
    document.title=pick('ติดตามงานฉลาก | SCWork','Track your label project | SCWork');
    all('[data-track]').forEach(el=>{
      if(!th.has(el))th.set(el,el.textContent);
      el.textContent=pick(th.get(el),EN[el.dataset.track]||th.get(el));
    });
    for(const a of [$('logo'),$('return')])a.href='./product-labels.html?lang='+lang;
    $('reorder').href='./project-quote.html?mode=reorder&lang='+lang;
    all('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
    url();render();
  }
  async function load(raw){
    const attempt=++serial,code=String(raw).trim().toLowerCase();
    snapshot=null;
    if(!api.validToken(code)){active='';mode='invalid';render();return;}
    active=code;$('trackToken').value=code;
    url(code);mode='loading';render();
    try{
      const resp=await fetch('./order-status/'+code+'.json',{cache:'no-store',credentials:'omit',redirect:'error',referrerPolicy:'no-referrer'});
      if(attempt!==serial)return;
      if(resp.status===404||resp.status===410){mode='missing';render();return;}
      if(!resp.ok)throw Error('Unavailable');
      const text=await resp.text();
      if(attempt!==serial)return;
      if(text.length>2048)throw Error('Invalid status');
      const s=api.status(JSON.parse(text),code);
      if(last?.token===code&&s.version<last.version){mode='stale';render();return;}
      mode='ready';snapshot=s;last=s;
    }catch{if(attempt!==serial)return;mode='error';}
    render();
  }
  const initial=location.hash.slice(1);
  $('trackOpen').addEventListener('click',()=>load($('trackToken').value));
  $('trackToken').addEventListener('keydown',e=>{if(e.key==='Enter')load(e.target.value);});
  $('refreshStatus').addEventListener('click',()=>active&&load(active));
  all('[data-lang]').forEach(b=>b.addEventListener('click',()=>language(b.dataset.lang)));
  language(lang);
  if(initial&&initial!=='main')load(initial);
})();
