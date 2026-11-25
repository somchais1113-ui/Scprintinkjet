/* SCWork · Project brief schema and versioned reference. No network or storage. */
(function(root){
  'use strict';
  const schema='scwork-project-brief-v1';
  const maxItems=12,maxFileBytes=65536;
  const materials=Object.freeze(['undecided','pp-white','pp-clear','paper','other']);
  const docs=Object.freeze(['quote','tax','company','other']);
  const validRef=value=>typeof value==='string'&&/^SCW-PRJ-\d{8}-[0-9A-F]{12}$/.test(value)&&validDate(value.slice(8,12)+'-'+value.slice(12,14)+'-'+value.slice(14,16));
  const issue=(code,field)=>{throw Object.assign(Error(code),{field});};
  const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
  const single=(v,max)=>clean(typeof v==='string'?v.replace(/\s+/g,' '):v,max);
  const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
  function validDate(value){
    if(typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(value))return false;
    const ms=Date.parse(value+'T00:00:00Z');
    return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===value;
  }
  function bangkokDate(now=new Date()){
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(({type,value})=>[type,value]));
    return p.year+'-'+p.month+'-'+p.day;
  }
  function newRef(random=globalThis.crypto,now=new Date()){
    const bytes=random.getRandomValues(new Uint8Array(6));
    return 'SCW-PRJ-'+bangkokDate(now).replace(/-/g,'')+'-'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
  }
  function artworkURL(value){
    try{
      const u=new URL(value);
      return value.length<=1000&&!/\s/.test(value)&&u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password;
    }catch{return false;}
  }
  function repeatOrigin(value){
    const r=value?.reference,p=value?.proof;
    if(!validRef(r)||typeof p!=='string'||!p.startsWith(r+'-P')||!/^\d{2,4}$/.test(p.slice(r.length+2))||Number(p.slice(r.length+2))<1)issue('ORIGIN');
    return {reference:r,proof:p};
  }
  function payload(input){
    const name=single(input?.name,100),organization=single(input?.organization,110);
    const due=clean(input?.due,40),artwork=clean(input?.artwork,1200),notes=clean(input?.notes,440);
    if(!name)issue('NAME','projectName');
    if(due&&!validDate(due))issue('DATE','projectDue');
    if(artwork&&!artworkURL(artwork))issue('ARTWORK','projectArtwork');
    if(!Array.isArray(input?.items)||!input.items.length||input.items.length>maxItems)issue('ITEMS','items');
    const items=input.items.map((item,i)=>{
      const id=single(item?.name,80),qty=item?.qty;
      if(!id)issue('SKU','sku-'+i+'-name');
      if(!integer(qty,1,1000000))issue('QUANTITY','sku-'+i+'-qty');
      const w=item.width??null,h=item.height??null;
      const validSize=n=>Number.isFinite(n)&&n>=1&&n<=10000&&Math.abs(n*10-Math.round(n*10))<1e-8;
      if(w!==null||h!==null){if(!validSize(w)||!validSize(h))issue('SIZE','sku-'+i+'-width');}
      if(!materials.includes(item.material))issue('MATERIAL','sku-'+i+'-material');
      return {name:id,qty,width:w,height:h,material:item.material,note:single(item.note,110)};
    });
    const requested=docs.filter(d=>Array.isArray(input.documents)&&input.documents.includes(d));
    const data={name,organization,due,items,documents:requested,otherDoc:requested.includes('other')?single(input.otherDoc,120):'',artwork,notes};
    if(input.repeatOf!=null)data.repeatOf=repeatOrigin(input.repeatOf);
    return data;
  }
  function envelope(input){
    if(input?.schema!==schema||!validRef(input.reference)||!integer(input.revision,1,9999))issue('ENVELOPE','');
    return {schema,reference:input.reference,revision:input.revision,data:payload(input.data)};
  }
  function prepare(input,last,generate=newRef){
    const data=payload(input);
    if(last&&JSON.stringify(data)===JSON.stringify(last.data))return last;
    return envelope({schema,reference:last?.reference||generate(),revision:(last?.revision||0)+1,data});
  }
  function format(brief,lang){
    const b=envelope(brief),d=b.data,en=lang==='en',p=(a,c)=>en?c:a;
    const labels={
      undecided:p('ขอคำแนะนำ','Advise material'),'pp-white':p('PP ขาว','White PP'),'pp-clear':p('PP ใส','Clear PP'),paper:p('กระดาษ','Paper'),other:p('วัสดุอื่น','Other material'),
      quote:p('ใบเสนอราคา','Quotation'),tax:p('ใบกำกับภาษี','Tax invoice'),company:p('เอกสารขึ้นทะเบียนผู้ขาย','Vendor registration documents'),otherDoc:p('อื่น ๆ','Other')
    };
    const lines=[p('SCWork | ขอราคาโครงการ','SCWork | Project quote request'),b.reference+' · BR'+String(b.revision).padStart(2,'0'),p('โครงการ','Project')+': '+d.name];
    if(d.repeatOf)lines.push(p('สั่งซ้ำจากชุดแบบ','Reorder from proof')+': '+d.repeatOf.proof);
    if(d.organization)lines.push(p('บริษัท/องค์กร','Organization')+': '+d.organization);
    if(d.due)lines.push(p('วันที่ต้องการ (รอยืนยัน)','Requested date (not confirmed)')+': '+d.due);
    lines.push('');
    d.items.forEach((i,index)=>{
      const spec=[i.name,i.qty+' '+p('ดวง','pcs'),labels[i.material]];
      if(i.width!==null)spec.push(i.width+' × '+i.height+' '+p('มม.','mm'));
      if(i.note)spec.push(i.note);
      lines.push((index+1)+'. '+spec.join(' / '));
    });
    if(d.documents.length)lines.push(p('เอกสารที่ขอให้ทีมตรวจสอบ','Documents requested')+': '+d.documents.map(x=>x==='other'?d.otherDoc||labels.otherDoc:labels[x]).join(', '));
    if(d.artwork)lines.push(p('ลิงก์ไฟล์','Artwork link')+': '+d.artwork);
    if(d.notes)lines.push(p('หมายเหตุ','Notes')+': '+d.notes);
    return lines.join('\n');
  }
  function safeCopy(field,text,navigator){
    return Promise.resolve().then(()=>navigator.clipboard.writeText(text)).then(()=>true,()=>{
      field.focus();field.select();return false;
    });
  }
  function download(value,name,doc=document){
    const blob=new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=doc.createElement('a');
    a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  const api=Object.freeze({schema,maxItems,maxFileBytes,materials,docs,validRef,validDate,bangkokDate,newRef,repeatOrigin,payload,envelope,prepare,format,safeCopy,download});
  root.SCWORK_PROJECT_BRIEF=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
