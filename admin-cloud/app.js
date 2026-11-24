/* SCWork v2.1.32 — Separate cloud-admin client. All private access is gated by Supabase RLS + MFA.
 * Publishable key in config.js is public by design; secret/service_role keys must NEVER be used here. */
const $=id=>document.getElementById(id);
const config=window.SCWORK_ADMIN_CONFIG || {};
const materialLabels={'pp-white':'PP ขาว','pp-clear':'PP ใส','pvc-sqm':'PVC Sticker','paper-sticker':'กระดาษขาว','kraft-sticker':'กระดาษคราฟท์','vinyl-banner':'ไวนิลแบนเนอร์'};
const sqm=new Set(['pvc-sqm','vinyl-banner']);
const money=n=>'฿'+Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const show=id=>{for(const x of ['setup','login','mfa','denied','workspace'])$(x).hidden=id!==x;};
const msg=(id,s)=>{$(id).textContent=s;};
const configured=typeof config.supabaseUrl==='string'&&/^https:\/\/[^ ]+\.supabase\.co\/?$/.test(config.supabaseUrl)&&typeof config.supabasePublishableKey==='string'&&config.supabasePublishableKey.length>20;
let db,sessionUser=null,member=null,activeFactor=null,selectedQuoteId=null,quotes=[],events=[];
if(!configured||!window.supabase?.createClient) {
 show('setup');
 if(configured) $('setup').querySelector('p').textContent='โหลดไลบรารีเชื่อม Supabase ไม่สำเร็จ กรุณาตรวจสอบเครือข่ายและ Content Security Policy';
} else {
 db=window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 initialize();
}
async function initialize(){
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user){show('login');return;}
 sessionUser=user;
 const {data:level,error:levelError}=await db.auth.mfa.getAuthenticatorAssuranceLevel();
 if(levelError){show('login');msg('loginMsg',levelError.message);return;}
 if(level.currentLevel!=='aal2'){await openMfa();return;}
 const {data:m,error:roleErr}=await db.from('scwork_admin_members').select('user_id,role,active').eq('user_id',user.id).maybeSingle();
 if(roleErr||!m?.active){show('denied');return;}
 member=m;show('workspace');$('signOut').hidden=false;
 $('identity').textContent=user.email||'สมาชิก SCWork';$('roleName').textContent=({owner:'Owner / อนุมัติต้นทุน',editor:'Pricing Editor / บันทึกต้นทุน',viewer:'Viewer / ดูข้อมูล'})[m.role];
 $('quoteDate').value=new Date().toISOString().slice(0,10);
 $('saveQuote').disabled=m.role==='viewer';
 await refresh();
}
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();const btn=$('loginForm').querySelector('button');btn.disabled=true;try{
 const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});
 if(error)throw error;$('password').value='';await initialize();
 }catch(err){msg('loginMsg',err.message||'เข้าสู่ระบบไม่สำเร็จ')}finally{btn.disabled=false;}});
async function openMfa(){show('mfa');const {data,error}=await db.auth.mfa.listFactors();if(error){msg('mfaMsg',error.message);return;}
 const verified=(data?.totp||[]).find(f=>f.status==='verified');if(verified){activeFactor=verified.id;$('mfaEnroll').hidden=true;$('mfaExplanation').textContent='ป้อนรหัส 6 หลักจากแอป Authenticator';return;}
 const {data:enrollment,error:enrollErr}=await db.auth.mfa.enroll({factorType:'totp',friendlyName:'SCWork Pricing Admin'});
 if(enrollErr){msg('mfaMsg',enrollErr.message);return;}
 activeFactor=enrollment.id;$('mfaEnroll').hidden=false;$('mfaQr').src=enrollment.totp.qr_code;
 $('mfaExplanation').textContent='ลงทะเบียน Authenticator ด้วย QR ด้านล่าง แล้วกรอกรหัส 6 หลัก';}
$('mfaForm').addEventListener('submit',async e=>{e.preventDefault();const code=$('mfaCode').value.trim();if(!/^\d{6}$/.test(code)||!activeFactor){msg('mfaMsg','กรอกรหัส 6 หลักให้ถูกต้อง');return;}
 try{const {data:challenge,error:ce}=await db.auth.mfa.challenge({factorId:activeFactor});if(ce)throw ce;
 const {error:ve}=await db.auth.mfa.verify({factorId:activeFactor,challengeId:challenge.id,code});if(ve)throw ve;
 $('mfaCode').value='';await initialize();}catch(err){msg('mfaMsg',err.message||'ยืนยันรหัสไม่สำเร็จ')}});
async function logout(){if(db)await db.auth.signOut();member=null;sessionUser=null;$('signOut').hidden=true;show('login');}
$('signOut').addEventListener('click',logout);$('deniedOut').addEventListener('click',logout);
function tab(name){document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('section.tab').forEach(el=>el.hidden=el.id!=='tab-'+name);}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>tab(b.dataset.tab)));
function info(text){msg('globalMsg',text);}
async function refresh(){
 const [q,a]=await Promise.all([db.from('scwork_supplier_quotes').select('*').order('created_at',{ascending:false}).limit(300),
 db.from('scwork_price_events').select('id,quote_id,event_type,event_time,actor,detail').order('event_time',{ascending:false}).limit(300)]);
 if(q.error||a.error){info('อ่านข้อมูลไม่สำเร็จ: '+(q.error||a.error).message);return;}
 quotes=q.data||[];events=a.data||[];renderQuotes();renderAudit();
 $('mTotal').textContent=quotes.length;$('mPending').textContent=quotes.filter(x=>x.status==='draft').length;$('mApproved').textContent=quotes.filter(x=>x.status==='approved').length;
}
$('reload').addEventListener('click',refresh);
function renderQuotes(){const el=$('quoteRows');if(!quotes.length){el.innerHTML='<tr><td colspan="5">ยังไม่มีใบราคา Supplier ในฐานข้อมูล</td></tr>';return;}
 el.innerHTML=quotes.map(r=>{
 let prior=quotes.filter(x=>x.status==='approved'&&x.material_id===r.material_id&&x.id!==r.id&&x.created_at<r.created_at).sort((a,b)=>b.created_at.localeCompare(a.created_at))[0];
 let delta=prior&&Number(prior.landed_unit_cost)>0?((Number(r.landed_unit_cost)/Number(prior.landed_unit_cost)-1)*100).toFixed(1)+'%':'–';
 const evidence=r.evidence_path?`<button class="mini" data-doc="${safe(r.id)}">ดูหลักฐาน</button>`:'';
 const approve=member?.role==='owner'&&r.status==='draft'?`<button class="mini" data-approve="${safe(r.id)}">ตรวจอนุมัติ</button>`:'';
 return `<tr><td><strong>${safe(r.supplier)}</strong><small>${safe(materialLabels[r.material_id]||r.material_id)}</small></td><td>${safe(r.document_no)}<small>${safe(r.quote_date||'')}</small></td><td><strong>${money(r.landed_unit_cost)} / ${r.unit==='sqm'?'ตร.ม.':'แผ่น A3+'}</strong><small>เทียบรายการก่อน: ${safe(delta)}</small></td><td><span class="status ${safe(r.status)}">${r.status==='approved'?'อนุมัติแล้ว':r.status==='draft'?'รอตรวจ':'ปฏิเสธ'}</span></td><td><div class="action-row">${evidence}${approve}${r.source_url?`<a class="mini" href="${safe(r.source_url)}" target="_blank" rel="noopener noreferrer">ใบราคา URL</a>`:''}</div></td></tr>`;
 }).join('');
 el.querySelectorAll('[data-doc]').forEach(b=>b.addEventListener('click',()=>openEvidence(b.dataset.doc)));
 el.querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click',()=>review(b.dataset.approve)));
}
async function openEvidence(id){const r=quotes.find(x=>x.id===id);if(!r?.evidence_path)return;
 const {data,error}=await db.storage.from('scwork-supplier-evidence').createSignedUrl(r.evidence_path,60);
 if(error||!data?.signedUrl){info('ไม่สามารถเปิดเอกสารได้: '+(error?.message||'ไม่มีสิทธิ์'));return;}
 window.open(data.signedUrl,'_blank','noopener,noreferrer');}
function review(id){const r=quotes.find(x=>x.id===id);if(!r||r.status!=='draft')return;
 selectedQuoteId=id;tab('quotes');$('reviewPanel').hidden=false;
 $('reviewContext').textContent=`${r.supplier} · ${materialLabels[r.material_id]} · ${money(r.landed_unit_cost)} ต่อ ${r.unit==='sqm'?'ตร.ม.':'แผ่น A3+'} · เอกสาร ${r.document_no}`;
 $('reviewReason').value='';$('reviewPanel').scrollIntoView({behavior:'smooth',block:'center'});}
$('cancelReview').addEventListener('click',()=>{$('reviewPanel').hidden=true;selectedQuoteId=null;});
$('approveQuote').addEventListener('click',async()=>{if(member?.role!=='owner'||!selectedQuoteId)return;
 const reason=$('reviewReason').value.trim();if(reason.length<8){info('ระบุเหตุผลการอนุมัติอย่างน้อย 8 ตัวอักษร');return;}
 if(!window.confirm('ยืนยันว่าตรวจหลักฐาน Supplier, เกรดวัสดุ, หน่วยราคา และภาษีในใบเสนอราคาแล้ว?\n\nการอนุมัตินี้ไม่เปลี่ยนราคาบนเว็บไซต์ลูกค้า'))return;
 $('approveQuote').disabled=true;const {error}=await db.rpc('scwork_approve_supplier_quote',{p_id:selectedQuoteId,p_reason:reason});
 $('approveQuote').disabled=false;if(error){info('ไม่อนุมัติ: '+error.message);return;}
 $('reviewPanel').hidden=true;selectedQuoteId=null;info('อนุมัติต้นทุนสำเร็จ (ยังไม่เผยแพร่ราคาขาย)');await refresh();});
function updateCost(){const n=Number($('packPrice').value),q=Number($('packUnits').value),freight=Number($('freightCost').value)||0;
 try{$('landedEstimate').textContent=money(window.SCWORK_CLOUD_PRICING.supplierCost({materialId:$('material').value,packPrice:n,packUnits:q,freightCost:freight,taxTreatment:$('taxTreatment').value}));}catch{$('landedEstimate').textContent='–';}
 $('unitEstimate').textContent=sqm.has($('material').value)?'ต่อ ตร.ม.':'ต่อแผ่น A3+';}
for(const id of ['packPrice','packUnits','taxTreatment','freightCost','material'])$(id).addEventListener('input',updateCost);
$('quoteForm').addEventListener('submit',async e=>{e.preventDefault();if(!member||member.role==='viewer')return;
 const file=$('evidence').files[0];let source=$('sourceUrl').value.trim();if(!file&&!source){info('ต้องมีเอกสารแนบหรือ URL อ้างอิง Supplier');return;}
 if(file&&file.size>12*1024*1024){info('ไฟล์เกิน 12MB');return;}
 if(source&&!/^https:\/\//i.test(source)){info('URL อ้างอิงต้องเป็น HTTPS');return;}
 const material=$('material').value,unit=sqm.has(material)?'sqm':'a3_sheet';
 const row={material_id:material,supplier:$('supplier').value.trim(),document_no:$('documentNo').value.trim(),quote_date:$('quoteDate').value,
 valid_until:$('validUntil').value||null,unit,pack_price:Number($('packPrice').value),pack_units:Number($('packUnits').value),
 tax_treatment:$('taxTreatment').value,freight_cost:Number($('freightCost').value)||0,source_url:source||null,notes:$('notes').value.trim()||null,created_by:sessionUser.id,status:'draft'};
 try{window.SCWORK_CLOUD_PRICING.supplierCost({materialId:material,packPrice:row.pack_price,packUnits:row.pack_units,freightCost:row.freight_cost,taxTreatment:row.tax_treatment});}catch(err){info(err.message);return;}
 $('saveQuote').disabled=true;
 try{const {data,error}=await db.from('scwork_supplier_quotes').insert(row).select('id').single();if(error)throw error;
 if(file){try{await uploadEvidence(data.id,file);}catch(err){info('บันทึกใบราคาเป็นร่างแล้ว แต่แนบไฟล์ไม่สำเร็จ: '+err.message+' — กรุณาแนบ URL และตรวจหลักฐานก่อนอนุมัติ');await refresh();return;}}
 info('บันทึกใบราคาเป็นร่างแล้ว กรุณาให้ Owner ตรวจและอนุมัติต้นทุน');$('quoteForm').reset();$('quoteDate').value=new Date().toISOString().slice(0,10);updateCost();tab('quotes');await refresh();
 }catch(err){info('บันทึกไม่สำเร็จ: '+err.message)}finally{$('saveQuote').disabled=false;}});
async function uploadEvidence(id,file){const allowed=new Set(['application/pdf','image/jpeg','image/png','image/webp','text/csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
 if(!allowed.has(file.type))throw Error('ชนิดไฟล์ไม่รองรับ');
 const bytes=await file.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
 const ext=({'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png','image/webp':'webp','text/csv':'csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx'})[file.type];
 const path=`${sessionUser.id}/${id}/${crypto.randomUUID()}.${ext}`;
 const {error:ue}=await db.storage.from('scwork-supplier-evidence').upload(path,file,{contentType:file.type,upsert:false});if(ue)throw ue;
 const {error:de}=await db.from('scwork_supplier_quotes').update({evidence_path:path,evidence_sha256:hash}).eq('id',id).eq('status','draft');if(de)throw de;
}
function renderAudit(){const el=$('auditRows');if(!events.length){el.innerHTML='<tr><td colspan="4">ยังไม่มีการเปลี่ยนแปลง</td></tr>';return;}
 el.innerHTML=events.map(e=>`<tr><td>${safe(new Date(e.event_time).toLocaleString('th-TH'))}</td><td>${safe(e.event_type)}</td><td>${safe(e.quote_id.slice(0,8))}…</td><td>${safe(JSON.stringify(e.detail||{}).slice(0,250))}</td></tr>`).join('');}
function download(filename,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('downloadHistory').addEventListener('click',()=>download('scwork-private-audit-'+new Date().toISOString().slice(0,10)+'.json',{private:true,exportedAt:new Date().toISOString(),events}));
$('downloadApproved').addEventListener('click',()=>download('scwork-private-approved-costs-'+new Date().toISOString().slice(0,10)+'.json',{
 private:true,notPublicRateCard:true,exportedAt:new Date().toISOString(),items:[...new Map(quotes.filter(x=>x.status==='approved').sort((a,b)=>String(a.reviewed_at).localeCompare(String(b.reviewed_at))).map(x=>[x.material_id,x])).values()].map(x=>({materialId:x.material_id,unit:x.unit,landedUnitCost:Number(x.landed_unit_cost),supplier:x.supplier,documentNo:x.document_no,quoteDate:x.quote_date,reviewedAt:x.reviewed_at,evidenceHash:x.evidence_sha256}))}));
