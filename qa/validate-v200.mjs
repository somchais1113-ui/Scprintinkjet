import assert from 'node:assert/strict';
import {cpSync,existsSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const req=createRequire(import.meta.url);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const project=req('../src/scripts/project-brief.js'),desk=req('../tools/project-desk-core.js');
const follow=req('../src/scripts/order-followup-core.js'),ops=req('../tools/order-desk-core.js');
const ref='SCW-PRJ-20261119-AABBCCDDEEFF',code='91a0b2c3d4e5f60123ffeeddccbbaa01';
assert(!follow.validToken('1234')&&!follow.validToken('..'.repeat(16)));
assert.equal(follow.token({getRandomValues:a=>{a.fill(18);return a;}}),'12'.repeat(16));
const spec=[{name:'QA-SKU-01',qty:300,width:50,height:45,material:'pp-white',note:'Gloss lamination'},
  {name:'QA-SKU-02',qty:1300,width:70,height:25,material:'other',note:'Ask for FSC paper'}];
const request=project.prepare({name:'Sample project',organization:'QA private organization',artwork:'https://example.com/private-art',due:'2027-01-01',notes:'QA private request comment',items:spec},null,()=>ref);
const job={reference:ref,briefRevision:1,quoteRevision:2,proofRevision:3,owner:'QA staff',quoteNumber:'QA official quotation',proofFile:'QA private proof.pdf'};
const approval=desk.record(job,{confirmed:desk.refs(job).proof,date:'2026-01-01',evidence:'QA private confirmation',allSKUs:true});
const backed=desk.pack(job,request,approval);
let state=ops.open(backed,()=>code);
assert.equal(state.token,code);
assert(ops.approval(state));
const noApproval=ops.open(desk.pack(job,request,null),()=>code);
assert.throws(()=>ops.nextStatus(noApproval,{stage:'production',onHold:false,target:''}),/APPROVAL/);
assert.throws(()=>ops.nextStatus(noApproval,{stage:'delivered',onHold:true,target:''}),/APPROVAL/);
assert.throws(()=>ops.repeatFile(state,spec,true),/REPEAT_NOT_READY/);
const t1=new Date('2026-11-19T05:00:00.000Z'),t2=new Date('2026-11-20T05:00:00.000Z'),t3=new Date('2026-11-21T05:00:00.000Z');
state=ops.recordStatus(state,{stage:'artwork',onHold:false,target:'2026-11-24'},t1);
const first=state.lastExport;
assert.equal(first.version,1);
assert.deepEqual(Object.keys(first).sort(),['onHold','reference','schema','stage','target','token','updatedAt','version']);
assert(!JSON.stringify(first).includes('QA'));
assert.throws(()=>ops.nextStatus(state,{stage:'received',onHold:false,target:''},t2),/BACKWARD/);
assert.throws(()=>follow.status({...first,owner:'QA private'},code),/STATUS/);
assert.throws(()=>follow.status(first,'ab'.repeat(16)),/STATUS/);
assert.throws(()=>follow.status({...first,updatedAt:'2026-02-30T05:00:00.000Z'},code),/STATUS/);
assert.throws(()=>ops.link('javascript:invalid',code),/BASE/);
assert.throws(()=>ops.link('https://user:pass@example.com',code),/BASE/);
assert.equal(ops.link('https://example.com/sub',code,'en'),'https://example.com/sub/order-tracking.html?lang=en#'+code);
assert.deepEqual(ops.open(JSON.parse(JSON.stringify(state))),state);
state=ops.recordStatus(state,{stage:'production',onHold:false,target:'2026-11-26'},t2);
assert.equal(state.lastExport.version,2);
assert.equal(state.lastExport.token,first.token);
const revertedApproval=ops.merge(state,desk.pack({...job,proofRevision:4},request,null));
assert.throws(()=>ops.nextStatus(revertedApproval,{stage:'quality',onHold:true,target:''},t3),/APPROVAL/);
const paused=ops.recordStatus(revertedApproval,{stage:'production',onHold:true,target:'2026-11-26'},t3);
assert(paused.lastExport.onHold&&paused.lastExport.version===3);
assert.throws(()=>ops.merge(paused,backed),/OLDER/);
state=ops.recordStatus(state,{stage:'delivered',onHold:false,target:''},t3);
assert(state.deliveredKey);
const exported=ops.repeatFile(state,spec,true);
assert.deepEqual(Object.keys(exported).sort(),['items','proof','reference','schema']);
assert(!JSON.stringify(exported).includes('private'));
assert.deepEqual(follow.repeat(exported),exported);
assert.throws(()=>follow.repeat({...exported,price:1234}),/REPEAT/);
assert.throws(()=>follow.repeat({...exported,proof:ref+'-P00'}),/ORIGIN/);
assert.throws(()=>ops.repeatFile(state,[spec[0]],true),/ITEMS/);
assert.throws(()=>ops.repeatFile(state,[spec[0],spec[0]],true),/DUPLICATE/);
assert.throws(()=>ops.repeatFile(state,[spec[0],{...spec[1],note:''}],true),/SPECS/);
assert.throws(()=>ops.repeatFile(state,[spec[0],{...spec[1],material:'undecided'}],true),/SPECS/);
assert.throws(()=>ops.repeatFile(state,spec,false),/REPEAT_NOT_READY/);
assert.throws(()=>ops.repeatFile({...state,deliveredKey:''},spec,true),/REPEAT_NOT_READY/);
assert.throws(()=>ops.merge(state,desk.pack({...job,proofRevision:4},request,null)),/DELIVERED_SCOPE/);
const newBrief=project.prepare({name:'New request',items:exported.items,repeatOf:exported},null,()=>ref.replace('EEFF','EE01'));
assert.equal(newBrief.data.repeatOf.reference,ref);
assert.equal(newBrief.data.due,'');
assert.match(project.format(newBrief,'en'),/Reorder from proof:/);

// Run the public tracking controller using stubbed status files, never a real customer URL.
class El{
  constructor(tag='x'){this.tag=tag;this.attrs={};this.dataset={};this.events={};this.textContent='';this.value='';}
  addEventListener(k,f){this.events[k]=f;}
  setAttribute(k,v){this.attrs[k]=v;}
  append(...items){this.children=(this.children||[]).concat(items);}
  replaceChildren(...items){this.children=items;}
}
const tracking=read('order-tracking.html');
const els=Object.fromEntries([...tracking.matchAll(/\sid="([^"]+)"/g)].map(x=>[x[1],new El()]));
els.trackMessage.dataset.track='idle';els.trackMessage.textContent='เปิดลิงก์';
const buttons=['th','en'].map(lang=>Object.assign(new El('button'),{dataset:{lang}}));
const dom={documentElement:{lang:'th'},getElementById:id=>els[id],createElement:t=>new El(t),
  querySelectorAll:q=>q==='[data-track]'?[els.trackMessage]:q==='[data-lang]'?buttons:[]};
let response=first,calls=[];
const location={search:'?lang=th',hash:'#'+code,href:'https://example.com/order-tracking.html?lang=th#'+code};
const fetch=async(url,opts)=>{
  calls.push({url,opts});
  if(response===404)return {status:404,ok:false};
  if(response===500)throw Error('Network');
  return {status:200,ok:true,text:async()=>JSON.stringify(response)};
};
vm.runInNewContext(read('src/scripts/order-tracking.js'),{document:dom,location,history:{replaceState(){}},URL,URLSearchParams,fetch,window:{SCWORK_ORDER_FOLLOWUP:follow}});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(calls[0].url,'./order-status/'+code+'.json');
assert.equal(calls[0].opts.cache,'no-store');assert.equal(calls[0].opts.credentials,'omit');
assert(!els.statusPanel.hidden&&els.currentStage.textContent.includes('ตรวจ'));
assert.equal(els.stepList.children[1].attrs['aria-current'],'step');
buttons[1].events.click();assert.equal(els.currentStage.textContent,'Artwork review');
response=paused.lastExport;await els.refreshStatus.events.click();
assert(!els.statusPanel.hidden&&!els.holdNote.hidden&&els.trackTarget.hidden);
assert(els.trackUpdated.textContent.includes('Bangkok time'));
response=first;await els.refreshStatus.events.click();assert(els.statusPanel.hidden);assert.match(els.trackMessage.textContent,/older/);
response=404;await els.trackOpen.events.click();assert.match(els.trackMessage.textContent,/No published status/);
response=500;await els.trackOpen.events.click();assert.match(els.trackMessage.textContent,/could not load/);
const before=calls.length;els.trackToken.value='../../a';await els.trackOpen.events.click();
assert.equal(calls.length,before);assert.match(els.trackMessage.textContent,/32-character/);
assert(!tracking.includes('<script src="https://'));
assert.match(tracking,/<meta name="referrer" content="no-referrer">/);

// Validate the real release builder against approved-only files and reject privacy/schema mistakes.
const root=fileURLToPath(new URL('../',import.meta.url)),tmp=mkdtempSync(join(tmpdir(),'scwork-build-qa-'));
try{
  const source=join(tmp,'source');
  cpSync(root,source,{recursive:true});
  const statusDir=join(source,'order-status');
  const build=output=>spawnSync(process.execPath,[join(source,'qa','build-public-v200.mjs'),output],{encoding:'utf8'});
  const good=join(tmp,'good');
  writeFileSync(join(statusDir,code+'.json'),JSON.stringify(first));
  const valid=build(good);assert.equal(valid.status,0,valid.stderr);
  assert.deepEqual(JSON.parse(readFileSync(join(good,'order-status',code+'.json'))),first);
  for(const name of ['tools','qa','supabase','render-source'])assert(!existsSync(join(good,name)));
  writeFileSync(join(statusDir,code+'.json'),JSON.stringify({...first,customer:'QA label test'}));
  const bad=join(tmp,'bad');
  assert.notEqual(build(bad).status,0);assert(!existsSync(bad));
  rmSync(join(statusDir,code+'.json'));
  writeFileSync(join(statusDir,'private-repeat.json'),JSON.stringify(exported));
  const privatePath=join(tmp,'private');
  assert.notEqual(build(privatePath).status,0);assert(!existsSync(privatePath));
}finally{rmSync(tmp,{recursive:true,force:true});}
console.log('PASS V2.0: same tracking link, safe status publication, holds and missing/stale states, proof-bound repeat files, no private artifacts in Public build.');
