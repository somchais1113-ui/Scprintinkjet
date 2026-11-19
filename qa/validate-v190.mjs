import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const req=createRequire(import.meta.url);
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const brief=req('../src/scripts/project-brief.js'),desk=req('../tools/project-desk-core.js'),line=req('../src/scripts/quote-to-line.js');
const follow=req('../src/scripts/order-followup-core.js');
const reference=brief.newRef({getRandomValues:a=>{a.set([1,35,69,103,137,171]);return a;}},new Date('2026-11-18T19:30:00Z'));
assert.equal(reference,'SCW-PRJ-20261119-0123456789AB');
assert(!brief.validRef('SCW-PRJ-20260229-0123456789AB'));
assert(brief.validDate('2028-02-29')&&!brief.validDate('2027-02-29'));
const input={
  name:' Spring 2027 ',organization:'SCWork QA Fixture',due:'2027-01-28',documents:['company','quote','tax','other'],otherDoc:'Sample spec sheet',
  artwork:'https://example.com/proof/index?x=a%20b',notes:'Test only',
  items:[{name:'BOTTLE-01',qty:100,width:48.5,height:50,material:'pp-white',note:'rounded'},{name:'BOX-02',qty:500,material:'undecided'}]
};
const b1=brief.prepare(input,null,()=>reference);
const th=brief.format(b1,'th'),en=brief.format(b1,'en');
for(const message of [th,en])for(const value of [reference,'BR01','BOTTLE-01','BOX-02','48.5 × 50','2027-01-28',input.artwork,'Sample spec sheet'])assert(message.includes(value));
assert(en.includes('not confirmed')&&en.includes('Documents requested'));
assert.deepEqual(brief.envelope(JSON.parse(JSON.stringify(b1))),b1);
const b2=brief.prepare({...input,items:[{...input.items[0],qty:300},input.items[1]]},b1,()=>{throw Error('new reference unexpectedly');});
assert.equal(b2.reference,b1.reference);assert.equal(b2.revision,2);
assert.strictEqual(brief.prepare(b2.data,b2),b2);
assert.throws(()=>brief.prepare({...input,name:''},b1),/NAME/);
assert.throws(()=>brief.payload({...input,artwork:'javascript:invalid'}),/ARTWORK/);
assert.throws(()=>brief.payload({...input,artwork:'https://user:pass@example.com/file'}),/ARTWORK/);
assert.throws(()=>brief.payload({...input,due:'2027-02-30'}),/DATE/);
assert.throws(()=>brief.payload({...input,items:Array.from({length:13},()=>input.items[0])}),/ITEMS/);
for(const [patch,error] of [[{width:30,height:null},'SIZE'],[{qty:2.5},'QUANTITY'],[{name:''},'SKU'],[{material:'invalid'},'MATERIAL']]){
  assert.throws(()=>brief.payload({...input,items:[{...input.items[0],...patch}]}),new RegExp(error));
}
assert.equal(decodeURIComponent(new URL(line.lineUrl('@scwork_qa',th)).search.slice(1)),th);
assert.deepEqual(desk.unpack(b2),{brief:b2});
const state={reference,briefRevision:2,quoteRevision:1,proofRevision:3,quoteNumber:'Q-SAMPLE-51',proofFile:'All_SKUs-P03.pdf',owner:'QA Staff',timeline:'Confirmed delivery sample',confirmedDocs:['quote']};
const ids=desk.refs(state),details={confirmed:ids.proof,date:'2026-01-31',evidence:'QA chat screenshot reference',allSKUs:true};
assert.equal(ids.brief,reference+'-BR02');assert.equal(ids.quote,reference+'-Q01');assert.equal(ids.proof,reference+'-P03');
assert.throws(()=>desk.record(state,{...details,confirmed:reference+'-P02'}),/REVISION/);
assert.throws(()=>desk.record(state,{...details,allSKUs:false}),/COVERAGE/);
assert.throws(()=>desk.record(state,{...details,date:'2028-01-01'},'2027-12-01'),/DATE/);
assert.throws(()=>desk.record(state,{...details,evidence:''}),/EVIDENCE/);
assert.throws(()=>desk.record({...state,proofFile:''},details),/INCOMPLETE/);
const stored=desk.record(state,details);
const out=desk.compose(state,stored);
assert(out.quote.includes(ids.quote)&&out.quote.includes('QA Staff')&&!out.quote.includes('ใบกำกับภาษี'));
assert(out.proof.includes(ids.proof)&&out.proof.includes(ids.quote)&&out.proof.includes('ครบทุก SKU'));
assert(out.release.includes(ids.proof)&&out.release.includes(details.evidence));
assert.equal(desk.compose(state,null).release,'');
for(const change of [{briefRevision:3},{quoteRevision:2},{proofRevision:4},{proofFile:'v2.pdf'},{quoteNumber:'Q-SAMPLE-52'},{reference:reference.replace('89AB','89AC')}]){
  assert(!desk.applicable({...state,...change},stored));
  assert.equal(desk.compose({...state,...change},stored).release,'');
}
const packed=desk.pack(state,b2,stored);
assert.deepEqual(desk.unpack(JSON.parse(JSON.stringify(packed))),packed);
assert.equal(desk.unpack({...packed,project:{...packed.project,proofRevision:5}}).approval,null);
assert.throws(()=>desk.pack(state,b1,stored),/MISMATCH/);
assert.throws(()=>desk.unpack({schema:'not-ours'}),/SCHEMA/);
assert.match(read('qa/build-public-v190.mjs'),/project-quote\.html/);
assert.doesNotMatch(read('qa/build-public-v190.mjs'),/project-desk|tools\//);
for(const page of ['smart-quote.html','product-labels.html','project-quote.html','tools/project-desk.html']){
  const html=read(page);
  for(const [,uri] of html.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)){
    if(!/^[a-z]+:/i.test(uri))assert(existsSync(new URL(uri,new URL('../'+page,import.meta.url))),page+' '+uri);
  }
  const idsFound=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(idsFound.length,new Set(idsFound).size,page+' duplicate ID');
  if(page==='project-quote.html'){
    assert.doesNotMatch(html,/<form[^>]+action=|<script[^>]+https?:/);
    assert.match(html,/<input type="file" id="repeatFile"/);
    assert.doesNotMatch(html.split('<form class="p-form"')[1],/type="file"/);
  }
}
assert.doesNotMatch(read('src/scripts/project-quote.js'),/fetch\(|localStorage|sessionStorage|XMLHttpRequest/);
assert.doesNotMatch(read('tools/project-desk.js'),/fetch\(|localStorage|sessionStorage|XMLHttpRequest/);

// Use UI controllers in the same DOM contract used by the existing quote tests.
class El{
  constructor(attr={},value=''){this.attrs={...attr};this.value=attr.value??value;this.textContent='';this.dataset={};this.events={};this.hidden='hidden'in attr;this.checked='checked'in attr;this.children=[];}
  setAttribute(k,v){this.attrs[k]=v;}
  removeAttribute(k){delete this.attrs[k];if(k==='href')this.href='';}
  get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
  addEventListener(name,fn){this.events[name]=fn;}
  fire(name,evt={target:this}){return this.events[name]?.(evt);}
  focus(){this.focused=true;}
  select(){this.selected=true;}
  reportValidity(){return true;}
  append(el){this.children.push(el);}
  replaceChildren(...nodes){this.children=nodes;}
}
function elements(html){
  return Object.fromEntries([...html.matchAll(/<([\w-]+)\s+([^<>]*?\bid="([^"]+)"[^<>]*)>/g)].map(m=>{
    const attrs=Object.fromEntries([...m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(a=>[a[1],a[2]??'']));
    const node=new El(attrs);node.id=m[3];return [node.id,node];
  }));
}
function publicUI(config,canCopy,search='?lang=th'){
  const html=read('project-quote.html'),els=elements(html),form=els.projectForm,items=els.items;
  const langs=['th','en'].map(lang=>Object.assign(new El(),{dataset:{lang}}));
  const routes=['labels','standard'].map(back=>Object.assign(new El(),{dataset:{back}}));
  const docs=['quote','tax','company','other'].map(doc=>Object.assign(new El(),{dataset:{doc},checked:doc==='quote'}));
  form.querySelectorAll=()=>docs.filter(d=>d.checked);
  items.querySelectorAll=()=>items.children;
  els.skuTemplate.content={firstElementChild:{cloneNode(){
    const row=new El(),keys=['name','qty','width','height','material','note'];
    const fields=Object.fromEntries(keys.map(key=>[key,Object.assign(new El({},key==='material'?'undecided':''),{dataset:{key},type:key==='material'?'select-one':'text'})]));
    const legend=new El(),remove=new El();
    row.fields=fields;row.querySelector=k=>k==='legend'?legend:k==='[data-remove]'?remove:fields[k.match(/"([^"]+)"/)?.[1]];
    row.querySelectorAll=k=>k==='[data-key]'?Object.values(fields):[];
    row.remove=()=>{items.children=items.children.filter(x=>x!==row);};
    return row;
  }}};
  const title=Object.assign(new El(),{dataset:{i:'title'},textContent:'ขอราคาโครงการฉลากสินค้า'});
  const doc={documentElement:{lang:'th'},getElementById(id){return els[id]||items.children.flatMap(r=>Object.values(r.fields)).find(e=>e.id===id);},
    querySelectorAll(query){return ({'[data-i]':[title],'[data-lang]':langs,'[data-back]':routes})[query]||[];}};
  let copied='';
  const context={document:doc,location:{search,href:'http://localhost/project-quote.html'+search},history:{replaceState(){}},URL,URLSearchParams,
    window:{SCWORK_PROJECT_BRIEF:{...brief,download:(file,name)=>{context.output={file,name};}},SCWORK_QUOTE_TO_LINE:line,SCWORK_PUBLIC_CONTACT:config,SCWORK_ORDER_FOLLOWUP:follow,confirm:()=>true},
    navigator:{clipboard:{writeText:async text=>{if(!canCopy)throw Error('not allowed');copied=text;}}}};
  vm.runInNewContext(read('src/scripts/project-quote.js'),context);
  return {els,rows:()=>items.children,langs,context,doc,copied:()=>copied};
}
const u=publicUI({lineId:'@scwork_qa'},true);
assert.equal(u.rows().length,1);assert(u.els.summaryActions.hidden);
u.els.projectName.value='Test project';
u.rows()[0].fields.name.value='SKU X';u.rows()[0].fields.qty.value=99;
u.els.addSKU.fire('click');
u.rows()[1].fields.name.value='SKU Y';u.rows()[1].fields.qty.value=111;
u.els.prepare.fire('click');assert(!u.els.summaryActions.hidden);
const uiRef=u.els.projectRef.textContent;assert.match(uiRef,/BR01$/);
assert(u.els.briefText.value.includes('SKU X')&&u.els.briefText.value.includes('SKU Y'));
assert.equal(decodeURIComponent(new URL(u.els.projectLine.href).search.slice(1)),u.els.briefText.value);
await u.els.copyBrief.fire('click');assert.equal(u.copied(),u.els.briefText.value);
u.langs[1].fire('click');assert.equal(u.doc.documentElement.lang,'en');
assert.equal(u.els.projectRef.textContent,uiRef);assert.match(u.els.briefText.value,/Project quote request/);
u.rows()[1].fields.qty.value=150;u.els.projectForm.fire('input');
assert(u.els.summaryActions.hidden&&u.els.projectLine.hidden&&!u.els.projectLine.href);
u.els.prepare.fire('click');assert.equal(u.els.projectRef.textContent,uiRef.replace('BR01','BR02'));
u.els.saveBrief.fire('click');assert.equal(u.context.output.file.data.items[1].qty,150);
const offline=publicUI({},false);offline.els.projectName.value='Offline';offline.rows()[0].fields.name.value='SKU X';offline.rows()[0].fields.qty.value=10;
offline.els.prepare.fire('click');assert(offline.els.projectLine.hidden);await offline.els.copyBrief.fire('click');assert(offline.els.briefText.selected);
const long=publicUI({lineId:'@scwork_qa'},true);long.els.projectName.value='Long';long.rows()[0].fields.name.value='SKU X';long.rows()[0].fields.qty.value=10;long.els.projectNotes.value='ก'.repeat(440);
long.els.prepare.fire('click');assert(!long.els.projectLine.hidden&&!new URL(long.els.projectLine.href).search);
const repeatUI=publicUI({},true,'?mode=reorder&lang=en');
assert(repeatUI.els.repeatOptions.open);
const file={schema:follow.repeatSchema,reference,proof:ids.proof,items:[
  {name:'TEST-A',qty:450,width:45,height:50,material:'pp-white',note:'Standard cut'},
  {name:'TEST-B',qty:300,width:60,height:40,material:'paper',note:''}
]};
await repeatUI.els.repeatFile.fire('change',{target:{files:[{size:450,text:async()=>JSON.stringify(file)}]}});
assert.equal(repeatUI.rows().length,2);assert.equal(Number(repeatUI.rows()[0].fields.qty.value),450);
assert.equal(repeatUI.els.projectArtwork.value,'');assert.equal(repeatUI.els.projectDue.value,'');
assert.match(repeatUI.els.repeatOrigin.textContent,/Reorder from proof/);
repeatUI.els.projectName.value='Repeat confirmed spec';repeatUI.rows()[0].fields.qty.value=650;
repeatUI.els.prepare.fire('click');repeatUI.els.saveBrief.fire('click');
const repeatBrief=repeatUI.context.output.file;
assert.notEqual(repeatBrief.reference,reference);assert.equal(repeatBrief.revision,1);assert.equal(repeatBrief.data.items[0].qty,650);
assert.deepEqual(repeatBrief.data.repeatOf,{reference,proof:ids.proof});
assert.match(repeatUI.els.briefText.value,/Reorder from proof.*P03/);

const staff=elements(read('tools/project-desk.html'));
staff.deskForm.querySelectorAll=()=>[];
const staffContext={document:{getElementById:id=>staff[id]},navigator:{clipboard:{writeText:async()=>{}}},
  window:{SCWORK_PROJECT_BRIEF:{...brief,download:(file,name)=>{staffContext.output={file,name};}},SCWORK_PROJECT_DESK:desk}};
vm.runInNewContext(read('tools/project-desk.js'),staffContext);
assert(staff.recordApproval.disabled&&staff.copyReleaseRef.disabled);
await staff.deskImport.fire('change',{target:{files:[{size:600,text:async()=>JSON.stringify(b2)}]}});
assert.equal(staff.deskRef.value,reference);assert.equal(staff.deskBriefRev.value,2);
assert.match(staff.deskBriefContent.textContent,/BOX-02/);
staff.deskOwner.value='QA Staff';staff.deskQuoteNo.value='Quote X';staff.deskProofFile.value='Proof1.pdf';staff.deskForm.fire('input');
staff.deskApprovalDate.value='2026-01-01';staff.deskProofEvidence.value='Proof in LINE';staff.deskConfirmed.value=reference+'-P01';staff.deskAll.checked=true;
staff.recordApproval.fire('click');assert(!staff.copyReleaseRef.disabled);assert.match(staff.deskReleaseText.value,/P01/);
staff.saveDesk.fire('click');assert(staffContext.output.file.approval);
staff.deskProofRev.value=2;staff.deskForm.fire('input');assert(staff.copyReleaseRef.disabled&&!staff.deskConfirmed.value);
staff.deskProofRev.value=1;staff.deskForm.fire('input');assert(staff.copyReleaseRef.disabled);
await staff.deskImport.fire('change',{target:{files:[{size:600,text:async()=>JSON.stringify(b1)}]}});
assert.equal(staff.deskBriefRev.value,2);
console.log('PASS V1.9: bilingual multi-SKU intake, stable and revised project references, private desk import/export, current-proof-only release, LINE and copy fallback.');
