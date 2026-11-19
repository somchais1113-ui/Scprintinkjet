/* Internal paper-trail helper. A recorded approval is a manual note, not a signature. */
(function(root){
  'use strict';
  const core=root.SCWORK_PROJECT_BRIEF||(typeof require==='function'?require('../src/scripts/project-brief.js'):null);
  const schema='scwork-project-desk-v1';
  const clean=(v,n)=>typeof v==='string'?v.trim().replace(/\s+/g,' ').slice(0,n):'';
  const revision=n=>Number.isSafeInteger(n)&&n>=1&&n<=9999?n:null;
  const pn=n=>String(n).padStart(2,'0');
  function normalize(input){
    const ref=String(input?.reference||'').trim().toUpperCase();
    const s={reference:core.validRef(ref)?ref:'',briefRevision:revision(input?.briefRevision),quoteRevision:revision(input?.quoteRevision),
      proofRevision:revision(input?.proofRevision),quoteNumber:clean(input?.quoteNumber,100),proofFile:clean(input?.proofFile,150),
      owner:clean(input?.owner,100),confirmedDocs:core.docs.filter(d=>Array.isArray(input?.confirmedDocs)&&input.confirmedDocs.includes(d)),
      otherDoc:'',timeline:clean(input?.timeline,160)};
    if(s.confirmedDocs.includes('other'))s.otherDoc=clean(input?.otherDoc,110);
    return s;
  }
  function refs(input){
    const s=normalize(input);
    const reference=s.reference;
    return {reference,brief:reference&&s.briefRevision?reference+'-BR'+pn(s.briefRevision):'',
      quote:reference&&s.quoteRevision?reference+'-Q'+pn(s.quoteRevision):'',
      proof:reference&&s.proofRevision?reference+'-P'+pn(s.proofRevision):''};
  }
  function binding(input){
    const s=normalize(input),ids=refs(s);
    if(!ids.brief||!ids.quote||!ids.proof||!s.quoteNumber||!s.proofFile)return '';
    return JSON.stringify([ids.brief,ids.quote,s.quoteNumber,ids.proof,s.proofFile]);
  }
  function record(input,details,today=core.bangkokDate()){
    const s=normalize(input),r=refs(s),key=binding(s);
    const date=details?.date,evidence=clean(details?.evidence,180);
    if(!key||!s.owner)throw Error('INCOMPLETE');
    if(details?.confirmed!==r.proof)throw Error('REVISION');
    if(details?.allSKUs!==true)throw Error('COVERAGE');
    if(!core.validDate(date)||date>today)throw Error('DATE');
    if(!evidence)throw Error('EVIDENCE');
    return {key,proof:r.proof,date,evidence,by:s.owner,allSKUs:true};
  }
  function applicable(input,approval,today=core.bangkokDate()){
    const key=binding(input);
    return !!(key&&approval?.key===key&&approval.proof===refs(input).proof&&approval.allSKUs===true&&
      typeof approval.by==='string'&&approval.by.trim()&&typeof approval.evidence==='string'&&approval.evidence.trim()&&
      core.validDate(approval.date)&&approval.date<=today);
  }
  function compose(input,approval,today=core.bangkokDate()){
    const s=normalize(input),r=refs(s);
    const available={quote:'ใบเสนอราคา',tax:'ใบกำกับภาษี',company:'เอกสารขึ้นทะเบียนผู้ขาย',other:s.otherDoc||'เอกสารอื่น ๆ โปรดระบุ'};
    const docs=s.confirmedDocs.map(d=>available[d]).join(', ')||'รอตรวจสอบกับทีม';
    const headline=[r.reference?'เลขอ้างอิงโครงการ: '+r.reference:'',r.brief?'บรีฟอ้างอิง: '+r.brief:''].filter(Boolean);
    const quote=(r.quote&&r.brief&&s.owner)?[...headline,'เลขอ้างอิงฉบับเสนอราคา: '+r.quote,s.quoteNumber?'เลขใบเสนอราคาของบริษัท: '+s.quoteNumber:'',
      'ผู้ประสานงาน: '+s.owner,'เอกสารที่แจ้งว่าออกได้: '+docs,s.timeline?'กำหนดงานที่ตกลง: '+s.timeline:'', 'เริ่มผลิตหลังยืนยันชุดแบบและเงื่อนไขที่ตกลง'].filter(Boolean).join('\n'):'';
    const proof=(binding(s)&&s.owner)?[...headline,'ใบเสนอราคา: '+s.quoteNumber+' · '+r.quote,'ชุดแบบตรวจ: '+r.proof,'ไฟล์ชุดแบบ: '+s.proofFile,
      'ผู้ประสานงาน: '+s.owner,'กรุณาตรวจข้อความ ขนาด และแนวตัดให้ครบทุก SKU แล้วตอบ “ยืนยันแบบ '+r.proof+' ครบทุก SKU” หรือแจ้งรายการแก้ไขก่อนผลิต'].join('\n'):'';
    const release=(applicable(s,approval,today)&&s.owner)?[...headline,'ใบเสนอราคา: '+s.quoteNumber+' · '+r.quote,'ชุดแบบที่ลูกค้ายืนยัน: '+r.proof,'ไฟล์ชุดแบบ: '+s.proofFile,
      'ครอบคลุม: ครบทุก SKU','วันที่ยืนยัน: '+approval.date,'หลักฐาน (อ้างอิงภายใน): '+approval.evidence,'บันทึกโดย: '+approval.by,'ผู้ประสานงานปัจจุบัน: '+s.owner,
      s.timeline?'กำหนดงานที่ตกลง: '+s.timeline:'','บันทึกส่งต่องานภายใน โปรดตรวจหลักฐานจริงและเงื่อนไขอื่นก่อนเริ่มผลิต'].filter(Boolean).join('\n'):'';
    return {quote,proof,release};
  }
  function pack(input,brief,approval){
    const project=normalize(input);
    if(!project.reference||!project.briefRevision)throw Error('REFERENCE');
    const cleaned=brief?core.envelope(brief):null;
    if(cleaned&&(cleaned.reference!==project.reference||cleaned.revision!==project.briefRevision))throw Error('MISMATCH');
    return {schema,project,brief:cleaned,approval:applicable(project,approval)?{
      key:approval.key,proof:approval.proof,date:approval.date,evidence:clean(approval.evidence,180),by:clean(approval.by,100),allSKUs:true
    }:null};
  }
  function unpack(value){
    if(value?.schema===core.schema)return {brief:core.envelope(value)};
    if(value?.schema!==schema)throw Error('SCHEMA');
    return pack(value.project,value.brief,value.approval);
  }
  const api=Object.freeze({schema,normalize,refs,binding,record,applicable,compose,pack,unpack});
  root.SCWORK_PROJECT_DESK=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
