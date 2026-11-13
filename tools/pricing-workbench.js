/* SCWORK V1.7 local-only costing UI. Public export is allowlisted by rate-card-builder. */
(()=>{'use strict';
 const catalog=window.SCWORK_PRICING_DEMO,builder=window.SCWORK_RATE_CARD_BUILDER;
 if(!catalog||!builder)return;
 // Prototype only: disable confidential supplier-cost editing on a public hosted origin.
 const trustedLocal=['localhost','127.0.0.1','[::1]'].includes(location.hostname)||['file:','about:'].includes(location.protocol);
 if(!trustedLocal){
   document.querySelector('.alert').textContent='SECURITY LOCK: Cost Workbench ปิดการใช้งานบน Public Hosting โปรดเปิดบนเครื่องส่วนตัวผ่าน localhost หรือใช้ Backend ที่มี Authentication ก่อนกรอกข้อมูลต้นทุน Supplier';
   document.querySelectorAll('input,button').forEach(el=>{el.disabled=true;});
   document.getElementById('auditResult').textContent='Disabled on public origin';
   return;
 }
 const sticker=catalog.categories.find(c=>c.id==='sticker');const $=id=>document.getElementById(id);
 const storageKey='scwork-cost-draft-v17-private-local-only';
 let rules=builder.defaultRules(catalog),current=sticker.materials[0].id;
 try{const old=JSON.parse(localStorage.getItem(storageKey)||'null');if(old?.schemaVersion===1&&old?.rules){for(const m of sticker.materials){const r=old.rules[m.id];if(r)rules[m.id]={...rules[m.id],...r,addonCosts:{...rules[m.id].addonCosts,...r.addonCosts}};}if(old.version)$('priceVersion').value=old.version;if(Number.isFinite(old.vatPct))$('vatPct').value=old.vatPct;}}catch{}
 const btnDownload=$('downloadPublic');const cur=()=>sticker.materials.find(m=>m.id===current);
 function validate(id){try{builder.validateRule(rules[id]);const m=sticker.materials.find(x=>x.id===id);return (m.addons||[]).every(a=>rules[id].addonCosts?.[a.id]!=null&&Number.isFinite(Number(rules[id].addonCosts[a.id]))&&Number(rules[id].addonCosts[a.id])>=0);}catch{return false;}}
 function refreshNav(){const nav=$('materialNav');nav.replaceChildren();for(const m of sticker.materials){const b=document.createElement('button');b.type='button';b.textContent=m.name;b.classList.toggle('is-selected',m.id===current);b.setAttribute('aria-pressed',String(m.id===current));if(validate(m.id)){const s=document.createElement('span');s.className='ready';s.textContent='✓';b.append(s);}b.addEventListener('click',()=>{current=m.id;render();});nav.append(b);}
 const done=sticker.materials.filter(m=>validate(m.id)).length;$('progressStatus').textContent=`${done} / ${sticker.materials.length} วัสดุพร้อมตรวจ`;}
 function money(n){return new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify({schemaVersion:1,version:$('priceVersion').value,vatPct:Number($('vatPct').value),rules}));}catch{$('costError').textContent='Browser ไม่อนุญาตให้เก็บ Draft — กรุณา Export Private JSON';}}
 function render(){const m=cur(),r=rules[current];$('materialTitle').textContent=m.name;$('materialDescription').textContent=m.description;$('materialMode').textContent=m.mode==='area_sqm'?'PRICE / m²':'PRICE / A3+ SHEET';
 document.querySelectorAll('[data-cost]').forEach(i=>{i.value=String(r[i.dataset.cost]??0);});const ads=$('addonFields');ads.replaceChildren();for(const a of m.addons||[]){const l=document.createElement('label');l.textContent=`${a.name} (${a.type==='flat'?'เหมาจ่าย':'ต่อหน่วย'})`;const input=document.createElement('input');input.type='number';input.min='0';input.step='0.01';input.value=r.addonCosts?.[a.id]==null?'':String(r.addonCosts[a.id]);input.dataset.addonCost=a.id;input.addEventListener('input',()=>{r.addonCosts[a.id]=input.value.trim()===''?null:Number(input.value);persist();preview();});l.append(input);ads.append(l);}refreshNav();preview();}
 function preview(){const r=rules[current],m=cur(),el=$('ratePreview');el.replaceChildren();const ok=validate(current);$('validationPill').textContent=ok?'ต้นทุนครบ':'ยังไม่พร้อม';$('validationPill').classList.toggle('is-ready',ok);$('costError').textContent='';
 if(ok){try{const units=m.mode==='area_sqm'?[m.minAreaSqm||1]:m.tiers.map(t=>t.min);
  for(let idx=0;idx<units.length;idx++){const u=units[idx],price=builder.suggestedRate(r,u);const info=builder.auditSale(r,u,price*u);const div=document.createElement('div');const label=document.createElement('span');label.textContent=m.mode==='area_sqm'?`ขั้นต่ำ ${u} m²`:m.tiers[idx].label;const value=document.createElement('strong');value.textContent=`฿${money(price)}/หน่วย · GM ${info.margin}%`;div.append(label,value);el.append(div);}
  $('marginPreview').textContent=r.marginPct+'%';$('fixedPreview').textContent='฿'+money(builder.model(r).fixed);
 }catch(e){$('costError').textContent=e.message;}}else{el.textContent='กรอกต้นทุนวัสดุและค่าพิมพ์ให้มากกว่า 0 เพื่อดูราคาแนะนำ';$('marginPreview').textContent='—';$('fixedPreview').textContent='—';}refreshNav();audit();}
 function audit(){const ok=sticker.materials.every(m=>validate(m.id));let warning=ok?'':`ยังกรอกต้นทุนไม่ครบ ${sticker.materials.filter(m=>!validate(m.id)).length} วัสดุ`;
 if(ok){try{builder.buildPublic(catalog,rules,{version:$('priceVersion').value,vatRate:Number($('vatPct').value)/100,approvedAt:'2026-01-01T00:00:00.000Z'});}catch(e){warning=e.message;}}
 const checked=$('approval').checked;$('auditResult').textContent=warning||'Cost Model ผ่าน Validation ครบทุกวัสดุ ต้องยืนยันอนุมัติก่อน Export';$('auditResult').classList.toggle('ok',!warning);btnDownload.disabled=!!warning||!checked;}
 function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
 document.querySelectorAll('[data-cost]').forEach(i=>i.addEventListener('input',()=>{const value=Number(i.value);rules[current][i.dataset.cost]=i.value.trim()===''?NaN:value;persist();preview();}));
 $('priceVersion').addEventListener('input',()=>{persist();audit();});$('vatPct').addEventListener('input',()=>{persist();audit();});$('approval').addEventListener('change',audit);
 btnDownload.addEventListener('click',()=>{try{const output=builder.buildPublic(catalog,rules,{version:$('priceVersion').value.trim(),vatRate:Number($('vatPct').value)/100});const text='/* SCWORK Approved Public Sticker Price Card. NO supplier costs in this file. */\nwindow.SCWORK_PRICING_PUBLIC = '+JSON.stringify(output,null,2)+';\n';download('pricing-public-data.js',text,'text/javascript');$('auditResult').textContent='ดาวน์โหลดแล้ว: นำไฟล์ไปแทน data/pricing-public-data.js แล้ว Deploy ด้วยตนเอง';}catch(e){$('auditResult').textContent='Export ไม่สำเร็จ: '+e.message;}});
 $('exportPrivate').addEventListener('click',()=>download('SCWORK-PRIVATE-cost-draft.json',JSON.stringify({schemaVersion:1,version:$('priceVersion').value,vatPct:Number($('vatPct').value),rules},null,2),'application/json'));
 $('importPrivate').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>250000)throw Error('FILE_TOO_LARGE');const x=JSON.parse(await f.text());if(x.schemaVersion!==1||!x.rules||typeof x.rules!=='object')throw Error('BAD_SCHEMA');for(const m of sticker.materials){if(!x.rules[m.id])throw Error('MISSING_'+m.id);rules[m.id]={...builder.defaultRules(catalog)[m.id],...x.rules[m.id]};}if(x.version)$('priceVersion').value=x.version;if(Number.isFinite(x.vatPct))$('vatPct').value=x.vatPct;$('approval').checked=false;persist();render();$('auditResult').textContent='นำเข้า Draft แล้ว กรุณาตรวจแต่ละวัสดุอีกครั้งก่อนอนุมัติ';}catch(err){$('auditResult').textContent='Import ไม่สำเร็จ: '+err.message;}e.target.value='';});
 $('resetDraft').addEventListener('click',()=>{if(!confirm('ลบ Draft ใน Browser เครื่องนี้? หากไม่ได้ Export Private JSON จะกู้คืนไม่ได้'))return;localStorage.removeItem(storageKey);rules=builder.defaultRules(catalog);$('approval').checked=false;render();});
 render();
})();
