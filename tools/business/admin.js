/* Unified Business Admin v2.3 — sample data, localStorage, no network calls */
(()=>{'use strict';
const A=window.PCAdminCore;
if(!A)return;
const page=document.body.dataset.page;
const $=id=>document.getElementById(id);
const clean=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(v)||0);
const money=v=>'฿'+num(v);
const pct=v=>v===null||v===undefined?'—':v.toFixed(1)+'%';
const date=v=>v?new Date(v+'T12:00:00').toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'numeric'}):'—';
const byCustomer=(id,data)=>clean(A.getCustomer(id,data)?.name||'Unknown');
const statusLabels={new:'รับคำขอใหม่',contacted:'กำลังประเมิน',quoted:'เสนอราคาแล้ว',won:'ปิดการขาย',lost:'ไม่ปิดการขาย',draft:'Draft',sent:'ส่งราคาแล้ว',accepted:'ยืนยัน',rejected:'ปฏิเสธ',expired:'หมดอายุ',confirmed:'ยืนยันงาน',in_production:'กำลังผลิต',quality_check:'ตรวจคุณภาพ',shipped:'จัดส่ง',delivered:'ส่งมอบแล้ว',cancelled:'ยกเลิก'};
const stclass=k=>(['won','accepted','delivered'].includes(k)?'good':['lost','rejected','cancelled'].includes(k)?'bad':['new','draft','expired'].includes(k)?'neutral':'warn');
const pill=v=>`<span class="status-pill ${stclass(v)}">${clean(statusLabels[v]||v)}</span>`;
let filter={period:'all',source:'all',query:'',tab:'rfqs',status:'all'};
const sources=['all','Website','LINE','Facebook','Referral','Direct','Instagram'];
const categories=['Sticker & Label','Large Format Inkjet','Display & Signage','Packaging Prototype','POSM & Retail','Artwork & Prepress'];
const opts=(items,selected)=>items.map(i=>{const v=typeof i==='string'?i:i.value;const label=typeof i==='string'?i:i.label;return `<option value="${clean(v)}" ${selected===v?'selected':''}>${clean(label)}</option>`}).join('');
const periodBtns=()=>`<div class="segmented" role="group" aria-label="ช่วงเวลาวิเคราะห์">${[['7','7 วัน'],['30','30 วัน'],['90','90 วัน'],['all','ทั้งหมด']].map(([p,label])=>`<button type="button" data-period="${p}" class="${filter.period===p?'is-on':''}" aria-pressed="${filter.period===p}">${label}</button>`).join('')}</div>`;
const sourceDropdown=()=>`<select id="sourceFilter" class="select" aria-label="กรองตามแหล่งที่มา">${opts(sources.map(s=>({value:s,label:s==='all'?'ทุกช่องทาง':s})),filter.source)}</select>`;
const searchBox=placeholder=>`<input class="search" data-filter="query" aria-label="ค้นหา" placeholder="${clean(placeholder)}" value="${clean(filter.query)}">`;
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3600);}
function download(name,text,mime='application/json;charset=utf-8'){const blob=new Blob([text],{type:mime});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function csv(rows,columns){const sanitize=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return '\ufeff'+[columns.map(c=>sanitize(c.label)).join(','),...rows.map(r=>columns.map(c=>sanitize(c.fn(r))).join(','))].join('\r\n');}
function topAction(buttons){$('headingAction').innerHTML=buttons;}
function table(headers,rows){return `<div class="table-scroll"><table class="data-table"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.join(''):`<tr><td colspan="${headers.length}"><div class="empty-state"><strong>ไม่พบข้อมูล</strong>ลองเปลี่ยนช่วงเวลาหรือเงื่อนไขการค้นหา</div></td></tr>`}</tbody></table></div>`;}
function kpi(label,value,note,icon){return `<article class="kpi-card"><div class="kpi-label">${label}<span>${icon}</span></div><strong class="kpi-value">${value}</strong><div class="kpi-note">${note}</div></article>`;}
function panel(title,sub,content,extra=''){return `<section class="panel ${extra}"><div class="panel-head"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div></div>${content}</section>`;}
function monthKey(date){return String(date||'').slice(0,7);}
function recentMonths(data){const dates=data.rfqs.map(r=>r.receivedAt).sort();const last=dates.at(-1)||A.today();let year=Number(last.slice(0,4)),month=Number(last.slice(5,7));const months=[];for(let i=0;i<6;i++){months.unshift(`${year}-${String(month).padStart(2,'0')}`);month--;if(month<1){month=12;year--;}}return months;}
function chartSvg(data){const months=recentMonths(data),width=710,height=236,base=190,top=16,left=34,right=16;
 const counts=months.map(m=>({m,leads:data.rfqs.filter(r=>monthKey(r.receivedAt)===m&&(filter.source==='all'||r.source===filter.source)).length,won:data.orders.filter(o=>{const rfq=A.getRfq(o.rfqId,data);return rfq&&monthKey(rfq.receivedAt)===m&&(filter.source==='all'||rfq.source===filter.source);}).length}));
 const max=Math.max(4,...counts.map(c=>c.leads));const round=Math.ceil(max/4)*4;
 const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 let svg=`<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="เปรียบเทียบจำนวน RFQ และ Order ตามเดือน โดยนับ Order ตามเดือนที่ RFQ เข้ามา">`;
 for(let i=0;i<=4;i++){const y=base-i*(base-top)/4;svg+=`<line class="gridline" x1="${left}" x2="${width-right}" y1="${y}" y2="${y}"/><text x="${left-8}" y="${y+4}" text-anchor="end">${Math.round(round*i/4)}</text>`;}
 const step=(width-left-right)/months.length,bar=22;
 counts.forEach((v,i)=>{const center=left+step*(i+.5),lh=(base-top)*v.leads/round,wh=(base-top)*v.won/round;
 svg+=`<rect x="${center-25}" y="${base-lh}" width="${bar}" height="${lh}" rx="5" fill="#2eb773"/><rect x="${center+3}" y="${base-wh}" width="${bar}" height="${wh}" rx="5" fill="#c9e8d3"/><text x="${center}" y="${base+22}" text-anchor="middle">${labels[Number(v.m.slice(5,7))-1]} ${v.m.slice(2,4)}</text>`;});
 return svg+'</svg><div class="chart-legend"><span><i class="legend-dot"></i> RFQ received</span><span><i class="legend-dot secondary"></i> Orders from RFQ cohort</span></div>';
}
function filteredRfqs(data){return data.rfqs.filter(r=>A.inPeriod(r.receivedAt,filter.period)&&(filter.source==='all'||r.source===filter.source));}
function renderDashboard(){const data=A.read(),m=A.metrics(data,filter),rfqs=filteredRfqs(data),ordered=[...rfqs].sort((a,b)=>b.receivedAt.localeCompare(a.receivedAt));
 topAction(`<button type="button" class="btn btn-outline" data-action="export-json">↓ Backup JSON</button><button type="button" class="btn btn-primary" data-action="new-rfq">+ เพิ่ม RFQ ทดลอง</button>`);
 let content=`<div class="control-row"><div class="filter-bar">${periodBtns()}${sourceDropdown()}</div><div class="summary-inline">Cohort: ${m.rfqs} RFQs · ${filter.period==='all'?'ข้อมูลทั้งหมด':filter.period+' วันล่าสุด'}</div></div>`;
 content+=`<div class="kpi-grid">${kpi('RFQ RECEIVED',num(m.rfqs),'คำขอราคาในกลุ่มที่เลือก','↗')}${kpi('QUOTE WIN RATE',pct(m.winRate),m.decided+' ใบที่ทราบผลแล้ว','%')}${kpi('CONFIRMED ORDERS',num(m.orderCount),'จำนวน Order จาก RFQ กลุ่มนี้','✓')}${kpi('RFQ → ORDER',pct(m.conversion),'Order ต่อคำขอราคา (cohort)','→')}</div>`;
 content+=`<div class="dashboard-grid">${panel('Sales performance','ช่วง 6 เดือนล่าสุดของข้อมูลตัวอย่าง (ไม่จำกัดช่วงวันที่ด้านบน)',chartSvg(data))}${panel('Lead acquisition','แหล่งที่มาของ RFQ ตามตัวกรอง',sourceBars(rfqs))}${panel('Conversion funnel','สถานะการไหลของ RFQ แบบ Unique ไม่รวมใบเสนอราคาเวอร์ชันซ้ำ',funnel(m))}${panel('Business indicators','รายได้และกำไรขั้นต้นประมาณการจาก Order ใน RFQ cohort',indicators(m))}</div>`;
 const recent=ordered.slice(0,6).map(r=>`<tr><td><strong>${clean(r.id)}</strong><small>${date(r.receivedAt)}</small></td><td>${byCustomer(r.customerId,data)}</td><td>${clean(r.title)}</td><td>${clean(r.source)}</td><td>${pill(r.status)}</td></tr>`);
 content+=`<div class="sub-grid">${panel('Recent RFQ activity','คำขอราคาล่าสุดตามตัวกรอง',table(['RFQ / DATE','CUSTOMER','JOB SCOPE','SOURCE','STATUS'],recent))}${panel('Operational snapshot','งานค้างตามขั้นตอนการผลิต',orderSnapshot(data))}</div>`;
 content+=`<p class="footer-note">วิธีคำนวณ: RFQ→Order = RFQ ที่เกิด Order อย่างน้อย 1 ครั้ง ÷ RFQ ที่รับเข้ามาใน Cohort; Quote Win Rate = ใบเสนอราคาล่าสุดที่ Accepted ÷ ใบล่าสุดที่ตัดสินใจแล้ว (Accepted/Rejected/Expired). โปรดระวังการตีความตัวเลขจากตัวอย่างจำลอง.</p>`;
 $('pageContent').innerHTML=content;
}
function sourceBars(rfqs){const counts=sources.slice(1).map(source=>({source,n:rfqs.filter(r=>r.source===source).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);const max=Math.max(1,...counts.map(x=>x.n));return counts.length?counts.map(r=>`<div class="source-line"><span>${clean(r.source)}</span><small>${r.n}</small></div><div class="progress-track"><span class="progress-fill" style="width:${100*r.n/max}%"></span></div>`).join(''):'<div class="empty-state">ยังไม่มี RFQ ในช่วงนี้</div>';}
function funnel(m){const list=[['Received RFQ',m.rfqs],['Quote sent',m.quoted],['Confirmed order',m.won]];const base=Math.max(1,m.rfqs);return list.map(([label,n])=>`<div class="funnel-item"><span>${label}</span><div class="funnel-track"><div class="funnel-fill" style="width:${100*n/base}%"></div></div><strong>${n}</strong></div>`).join('')+`<div class="insight"><strong>สิ่งที่ต้องรู้เพิ่ม</strong><p>${m.lost} RFQ ที่มีผลปฏิเสธ/หมดอายุ ตามใบเสนอราคาล่าสุด — ควรเก็บ Lost Reason เพื่อนำไปปรับบริการและราคา</p></div>`;}
function indicators(m){return `<div class="chart-status-cards"><div class="pillstat"><strong>${money(m.revenue)}</strong><span>Confirmed order value</span></div><div class="pillstat"><strong>${money(m.grossProfit)}</strong><span>Est. gross profit</span></div><div class="pillstat"><strong>${pct(m.grossMargin)}</strong><span>Est. gross margin</span></div><div class="pillstat"><strong>${num(m.newCustomers)}</strong><span>New customers</span></div></div><div class="warning-note">Gross profit = Order value − Estimated direct cost; ไม่รวมค่าแรงบริหาร ค่าเช่า ภาษี ค่าแก้งาน และค่าใช้จ่ายอื่น</div>`;}
function orderSnapshot(data){const statuses=['confirmed','in_production','quality_check','shipped','delivered'];const counts=statuses.map(s=>({s,n:data.orders.filter(o=>o.status===s).length}));return counts.map(({s,n})=>`<div class="source-line"><span>${clean(statusLabels[s])}</span><small>${n}</small></div><div class="progress-track"><span class="progress-fill" style="width:${data.orders.length?100*n/data.orders.length:0}%"></span></div>`).join('')+`<p class="footer-note">สถานะทั้งหมดของ Order ใน Demo Dataset</p>`;}
function renderCustomers(){const d=A.read();topAction(`<button class="btn btn-outline" data-action="export-csv">↓ Export CSV</button><button class="btn btn-primary" data-action="new-customer">+ เพิ่มลูกค้าทดลอง</button>`);
 const q=filter.query.toLowerCase();const visible=d.customers.filter(c=>([c.name,c.contact,c.email,c.id,c.segment].join(' ').toLowerCase().includes(q))&&(filter.source==='all'||c.source===filter.source)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const rows=visible.map(c=>{const custOrders=d.orders.filter(o=>o.customerId===c.id);const custRfqs=d.rfqs.filter(r=>r.customerId===c.id);return `<tr><td><strong>${clean(c.name)}</strong><small>${clean(c.id)} · ${clean(c.email)}</small></td><td>${clean(c.segment)}</td><td>${clean(c.source)}</td><td>${custRfqs.length} RFQs</td><td>${custOrders.length} Orders</td><td>${date(c.createdAt)}</td><td><button type="button" class="btn btn-outline btn-sm" data-action="new-rfq" data-customer="${clean(c.id)}">+ RFQ</button></td></tr>`;});
 $('pageContent').innerHTML=`<div class="kpi-grid">${kpi('ALL CUSTOMERS',num(d.customers.length),'ระเบียนตัวอย่าง','◉')}${kpi('ACTIVE PROSPECTS',num(new Set(d.rfqs.map(r=>r.customerId)).size),'ลูกค้าที่มี RFQ','↗')}${kpi('ORDERING CLIENTS',num(new Set(d.orders.map(o=>o.customerId)).size),'ลูกค้าที่ยืนยันงาน','✓')}${kpi('REFERRAL CLIENTS',num(d.customers.filter(c=>c.source==='Referral').length),'ลูกค้าที่มาจากการบอกต่อ','→')}</div><div class="panel"><div class="control-row"><div class="filter-bar">${searchBox('ค้นหาชื่อ บริษัท อีเมล หรือ Segment')}${sourceDropdown()}</div><span class="summary-inline">แสดง ${visible.length} / ${d.customers.length} รายการ</span></div>${table(['CUSTOMER','SEGMENT','SOURCE','RFQ','ORDER','ADDED','ACTION'],rows)}</div><p class="footer-note">ข้อมูลรายชื่อในหน้านี้ถูกสมมติทั้งหมด ห้ามนำข้อมูลลูกค้าจริงมาใส่ในเวอร์ชัน Static Demo</p>`;
}
function quoteRow(q,d){const rfq=A.getRfq(q.rfqId,d);const canConfirm=['sent'].includes(q.status)&&!d.orders.some(o=>o.rfqId===q.rfqId);
 return `<tr><td><strong>${clean(q.id)}</strong><small>${clean(q.rfqId)} · v${q.version}</small></td><td>${byCustomer(q.customerId,d)}<small>${clean(rfq?.title||'')}</small></td><td>${money(q.amount)}</td><td>${money(q.estimatedCost)}</td><td>${pill(q.status)}</td><td>${clean(q.lostReason||'—')}</td><td><div class="table-actions">${q.status==='draft'?`<button class="btn btn-outline btn-sm" data-action="send-quote" data-id="${clean(q.id)}">ส่งราคา</button>`:''}${q.status==='sent'?`<button class="btn btn-primary btn-sm" data-action="confirm-order" data-id="${clean(q.id)}">ปิดการขาย</button><button class="btn btn-outline btn-sm" data-action="lose-quote" data-id="${clean(q.id)}">Lost</button>`:''}${`<a class="btn btn-outline btn-sm" href="quote-print.html?id=${encodeURIComponent(q.id)}" target="_blank" rel="noopener">เอกสาร</a>`}${!d.orders.some(o=>o.rfqId===q.rfqId)?`<a class="btn btn-outline btn-sm" href="quote-builder.html?rfq=${encodeURIComponent(q.rfqId)}">Revise</a>`:''}${canConfirm?'':''}</div></td></tr>`;}
function rfqRow(r,d){const q=A.latestQuotes(d).find(q=>q.rfqId===r.id);return `<tr><td><strong>${clean(r.id)}</strong><small>${date(r.receivedAt)}</small></td><td>${byCustomer(r.customerId,d)}</td><td><strong>${clean(r.title)}</strong><small>${clean(r.category)} · ${num(r.quantity)} ${clean(r.unit)}</small></td><td>${clean(r.source)}</td><td>${pill(r.status)}</td><td>${q?`${clean(q.id)} · v${q.version}`:'—'}</td><td>${q?.lostReason?`<small>${clean(q.lostReason)}</small>`:r.deadline?`<small>Due: ${date(r.deadline)}</small>`:'—'}</td><td>${r.status!=='won'?`<a class="btn btn-outline btn-sm" href="quote-builder.html?rfq=${encodeURIComponent(r.id)}">+ เสนอราคา</a>`:''}</td></tr>`;}
function renderQuotations(){const d=A.read(),rfqs=d.rfqs.filter(r=>A.inPeriod(r.receivedAt,filter.period)&&(filter.source==='all'||r.source===filter.source));const ids=new Set(rfqs.map(r=>r.id));const latest=A.latestQuotes(d).filter(q=>ids.has(q.rfqId));const term=filter.query.toLowerCase();
 const searched=r=>[r.id,r.title,r.category,r.source,A.getCustomer(r.customerId,d)?.name].join(' ').toLowerCase().includes(term);
 const qRows=latest.filter(q=>{const rfq=A.getRfq(q.rfqId,d);return rfq&&searched(rfq)&&(filter.status==='all'||q.status===filter.status);}).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(q=>quoteRow(q,d));
 const rRows=rfqs.filter(r=>searched(r)&&(filter.status==='all'||r.status===filter.status)).sort((a,b)=>b.receivedAt.localeCompare(a.receivedAt)).map(r=>rfqRow(r,d));
 topAction(`<button class="btn btn-outline" data-action="export-csv">↓ Export CSV</button><button class="btn btn-outline" data-action="new-rfq">+ RFQ</button><a class="btn btn-primary" href="quote-builder.html">+ Quote Builder</a>`);
 const m=A.metrics(d,filter);
 $('pageContent').innerHTML=`<div class="kpi-grid">${kpi('RECEIVED RFQs',num(m.rfqs),'คำขอราคาใน Cohort','↗')}${kpi('QUOTE SENT',num(m.quoted),'ไม่รวม Revision ซ้ำ','⇧')}${kpi('DECIDED QUOTES',num(m.decided),'Won / Lost / Expired','✓')}${kpi('QUOTE WIN RATE',pct(m.winRate),'Accepted ÷ Decided','%')}</div><div class="panel"><div class="control-row"><div class="filter-bar">${periodBtns()}${sourceDropdown()}${searchBox('ค้นหา RFQ, บริษัท, ประเภทงาน')}</div></div><div class="control-row"><div class="filter-bar"><div class="segmented"><button type="button" data-tab="rfqs" class="${filter.tab==='rfqs'?'is-on':''}" aria-pressed="${filter.tab==='rfqs'}">RFQ Pipeline</button><button type="button" data-tab="quotes" class="${filter.tab==='quotes'?'is-on':''}" aria-pressed="${filter.tab==='quotes'}">Quotations</button></div><select id="statusFilter" class="select" aria-label="กรองสถานะ">${opts([{value:'all',label:'ทุกสถานะ'},...Object.entries(filter.tab==='rfqs'?{new:1,contacted:1,quoted:1,won:1,lost:1}:{draft:1,sent:1,accepted:1,rejected:1,expired:1}).map(([value])=>({value,label:statusLabels[value]}))],filter.status)}</select></div><span class="summary-inline">${filter.tab==='rfqs'?rRows.length:qRows.length} รายการ · ใบเสนอราคาที่แสดงคือเวอร์ชันล่าสุดของแต่ละ RFQ</span></div>${filter.tab==='rfqs'?table(['RFQ / DATE','CUSTOMER','REQUEST','SOURCE','STAGE','LAST QUOTE','INFO','ACTION'],rRows):table(['QUOTE / VERSION','CUSTOMER / SCOPE','VALUE','DIRECT COST EST.','STATUS','LOST REASON','ACTIONS'],qRows)}<div class="warning-note">ใบเสนอราคาเวอร์ชันใหม่ไม่เพิ่มจำนวน RFQ · การกดปิดการขายจะสร้าง Demo Order และเปลี่ยนสถานะเป็น Won</div></div>`;
}
function renderOrders(){const d=A.read(),term=filter.query.toLowerCase();const rows=d.orders.filter(o=>A.inPeriod(o.createdAt,filter.period)&&[o.id,o.quoteId,o.rfqId,A.getCustomer(o.customerId,d)?.name].join(' ').toLowerCase().includes(term)&&(filter.status==='all'||o.status===filter.status)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const total=rows.reduce((s,o)=>s+Number(o.amount),0),cost=rows.reduce((s,o)=>s+Number(o.estimatedCost),0);
 topAction(`<button class="btn btn-outline" data-action="export-csv">↓ Export CSV</button><a class="btn btn-primary" href="./quotations.html">+ สร้างผ่านใบเสนอราคา ↗</a>`);
 const content=rows.map(o=>`<tr><td><strong>${clean(o.id)}</strong><small>${clean(o.quoteId)} · ${date(o.createdAt)}</small></td><td>${byCustomer(o.customerId,d)}</td><td>${money(o.amount)}</td><td>${money(o.estimatedCost)}</td><td><strong>${money(Number(o.amount)-Number(o.estimatedCost))}</strong></td><td>${date(o.dueDate)}</td><td><select class="select order-status" data-order-status="${clean(o.id)}" aria-label="สถานะ ${clean(o.id)}">${opts(['confirmed','in_production','quality_check','shipped','delivered','cancelled'].map(value=>({value,label:statusLabels[value]})),o.status)}</select></td></tr>`);
 $('pageContent').innerHTML=`<div class="kpi-grid">${kpi('TOTAL ORDERS',num(rows.length),'ตามช่วงเวลาที่เลือก','▤')}${kpi('ORDER VALUE',money(total),'มูลค่าขายจาก Order','฿')}${kpi('EST. DIRECT COST',money(cost),'ต้นทุนผลิตโดยประมาณ','↓')}${kpi('EST. GROSS MARGIN',pct(total?100*(total-cost)/total:null),'ไม่รวม Overhead','%')}</div><div class="panel"><div class="control-row"><div class="filter-bar">${periodBtns()}${searchBox('ค้นหา Order, บริษัท, ใบเสนอราคา')}<select class="select" id="statusFilter" aria-label="กรองสถานะ">${opts([{value:'all',label:'ทุกสถานะ'},...['confirmed','in_production','quality_check','shipped','delivered','cancelled'].map(value=>({value,label:statusLabels[value]}))],filter.status)}</select></div><span class="summary-inline">แสดง ${rows.length} ออร์เดอร์ · แก้สถานะในตารางได้</span></div>${table(['ORDER / QUOTE','CUSTOMER','ORDER VALUE','DIRECT COST','EST. GROSS PROFIT','DUE DATE','PRODUCTION STATUS'],content)}<div class="warning-note">Order เป็นข้อมูลจำลอง การเปลี่ยนสถานะจะเก็บใน Browser นี้เท่านั้น · ยอดขายยังไม่ใช่รายรับที่ชำระเงินจริง</div></div>`;
}
function render(){if(page==='dashboard')renderDashboard();else if(page==='customers')renderCustomers();else if(page==='quotations')renderQuotations();else if(page==='orders')renderOrders();}
function formField(name,label,type='text',value='',required=false,items=[],span=''){
 const id='form-'+name;let control='';const attrs=`id="${id}" name="${name}" ${required?'required':''}`;
 if(type==='select')control=`<select class="input" ${attrs}>${opts(items,value)}</select>`;
 else if(type==='textarea')control=`<textarea class="input" ${attrs} maxlength="500">${clean(value)}</textarea>`;
 else control=`<input class="input" ${attrs} type="${type}" value="${clean(value)}" ${type==='number'?'min="0" step="any"':''} maxlength="200">`;
 return `<div class="field ${span}"><label for="${id}">${label}${required?' *':''}</label>${control}</div>`;
}
let modalKind='',modalRef='';
function openForm(kind,ref=''){
 modalKind=kind;modalRef=ref;const data=A.read();let title='',html='';
 if(kind==='customer'){title='เพิ่มลูกค้าตัวอย่าง';html=formField('name','Company / Customer Name','text','',true)+formField('contact','Contact person','text','Demo Contact')+formField('email','Email — .example เท่านั้น','email','')+formField('segment','Segment','select','SME',false,['SME','Corporate','Agency','Retail','Event'])+formField('source','Source','select','Website',false,sources.slice(1))+formField('notes','Notes','textarea','',false,[],'full');}
 if(kind==='rfq'){
 title='สร้าง RFQ ทดลอง';const selected=data.customers.some(c=>c.id===ref)?ref:(data.customers.at(-1)?.id||'');const cOpts=data.customers.map(c=>({value:c.id,label:c.name}));
 html=formField('customerId','Customer','select',selected,true,cOpts)+formField('title','Project / request title','text','',true)+formField('category','Print category','select',categories[0],true,categories)+formField('quantity','Quantity','number',100,true)+formField('unit','Unit','select','pcs',false,['pcs','sqm','sets','units'])+formField('source','Lead source','select','Website',true,sources.slice(1))+formField('deadline','Desired delivery date','date','')+formField('notes','Scope / Requirements','textarea','',false,[],'full');}
 if(kind==='quote'){
 title='เพิ่มใบเสนอราคาทดลอง';const eligible=data.rfqs.filter(r=>!data.orders.some(o=>o.rfqId===r.id));const value=eligible.some(r=>r.id===ref)?ref:(eligible[0]?.id||'');
 html=formField('rfqId','RFQ reference','select',value,true,eligible.map(r=>({value:r.id,label:`${r.id} · ${r.title}`})))+formField('amount','Selling price (THB)','number',5900,true)+formField('estimatedCost','Estimated direct cost (THB)','number',3400,true)+formField('notes','Quote notes','textarea','',false,[],'full');}
 if(kind==='lost'){title='บันทึกเหตุผลที่ไม่ปิดการขาย';html=`<div class="full warning-note">Lost Reason ช่วยแยกปัญหาราคา เวลา และเงื่อนไขผลิต เพื่อใช้ตัดสินใจเรื่องธุรกิจ</div>`+formField('reason','Reason','select','ราคาไม่ตรงงบประมาณ',true,['ราคาไม่ตรงงบประมาณ','กำหนดส่งไม่ทัน','จำนวนขั้นต่ำไม่เหมาะ','เลือก Supplier อื่น','ไม่มีการตอบกลับ','สเปกงานไม่ตรง','อื่น ๆ']);}
 $('dialogTitle').textContent=title;$('dialogFields').innerHTML=`<div class="form-grid">${html}</div>`;$('recordDialog').showModal();
}
function formObject(form){return Object.fromEntries(new FormData(form).entries());}
$('recordForm').addEventListener('submit',e=>{e.preventDefault();try{const values=formObject(e.currentTarget);if(modalKind==='customer')A.addCustomer(values);else if(modalKind==='rfq')A.addRfq(values);else if(modalKind==='quote')A.addQuote(values);else if(modalKind==='lost')A.updateQuoteStatus(modalRef,'rejected',values.reason);$('recordDialog').close();toast('บันทึกข้อมูลตัวอย่างแล้ว');render();}catch(err){toast(err.message);}});
document.addEventListener('click',e=>{
 const period=e.target.closest('[data-period]');if(period){filter.period=period.dataset.period;render();return;}
 const tab=e.target.closest('[data-tab]');if(tab){filter.tab=tab.dataset.tab;filter.status='all';render();return;}
 const action=e.target.closest('[data-action]');if(!action)return;
 const name=action.dataset.action,id=action.dataset.id;
 if(name==='close-modal'){$('recordDialog').close();return;}
 if(name==='new-customer')return openForm('customer');
 if(name==='new-rfq')return openForm('rfq',action.dataset.customer);
 if(name==='new-quote')return openForm('quote',action.dataset.rfq);
 if(name==='lose-quote')return openForm('lost',id);
 if(name==='send-quote'){try{A.updateQuoteStatus(id,'sent');toast('บันทึกสถานะส่งราคาแล้ว');render();}catch(err){toast(err.message)}return;}
 if(name==='confirm-order'){if(!window.confirm('ยืนยันการสร้างคำสั่งซื้อจำลองจากใบเสนอราคานี้?'))return;try{A.confirmOrder(id);toast('สร้าง Demo Order แล้ว');render();}catch(err){toast(err.message)}return;}
 if(name==='export-json'){download('procleaning-demo-backup-v23.json',JSON.stringify(A.snapshot(),null,2));toast('ดาวน์โหลด Demo JSON แล้ว');return;}
 if(name==='reset-demo'){if(!window.confirm('รีเซ็ตข้อมูลทดลองกลับค่าเริ่มต้น? ข้อมูลที่แก้ใน Browser จะหายไป'))return;A.reset();toast('รีเซ็ตข้อมูลจำลองแล้ว');render();return;}
 if(name==='import-json'){$('importJSON').click();return;}
 if(name==='export-csv')return exportCsv();
});
document.addEventListener('change',e=>{
 if(e.target.id==='sourceFilter'){filter.source=e.target.value;render();}
 if(e.target.id==='statusFilter'){filter.status=e.target.value;render();}
 if(e.target.matches('[data-order-status]')){try{A.updateOrderStatus(e.target.dataset.orderStatus,e.target.value);toast('อัปเดตสถานะงานตัวอย่างแล้ว');render();}catch(err){toast(err.message)}}
 if(e.target.id==='importJSON')readImport(e.target);
});
document.addEventListener('input',e=>{if(!e.target.matches('[data-filter="query"]'))return;const caret=e.target.selectionStart;filter.query=e.target.value;render();const target=document.querySelector('[data-filter="query"]');if(target){target.focus();target.setSelectionRange(caret,caret);}});
function exportCsv(){const d=A.read();let rows=[],columns=[],filename='';
 if(page==='customers'){filename='customers-demo.csv';rows=d.customers;columns=[['id','ID'],['name','Company'],['contact','Contact'],['email','Email'],['segment','Segment'],['source','Source'],['createdAt','Created']].map(([k,label])=>({label,fn:r=>r[k]}));}
 else if(page==='quotations'){filename='quotations-demo.csv';rows=A.latestQuotes(d);columns=[['id','Quote ID'],['rfqId','RFQ ID'],['customerId','Customer ID'],['version','Version'],['amount','Amount THB'],['estimatedCost','Est. Direct Cost THB'],['status','Status'],['lostReason','Lost Reason'],['createdAt','Created']].map(([k,label])=>({label,fn:r=>r[k]}));}
 else if(page==='orders'){filename='orders-demo.csv';rows=d.orders;columns=[['id','Order ID'],['quoteId','Quote'],['customerId','Customer ID'],['amount','Order Value'],['estimatedCost','Est. Cost'],['status','Status'],['createdAt','Created'],['dueDate','Due date']].map(([k,label])=>({label,fn:r=>r[k]}));}
 if(rows.length){download(filename,csv(rows,columns),'text/csv;charset=utf-8');toast('ดาวน์โหลด CSV ข้อมูลจำลองแล้ว');}
}
async function readImport(input){if(!input.files?.length)return;const f=input.files[0];if(f.size>1024*1024*3){toast('ไฟล์ Demo JSON เกิน 3 MB');input.value='';return;}if(!confirm('นำเข้าข้อมูลจะเขียนทับข้อมูลจำลองปัจจุบันทั้งหมด ยืนยัน?')){input.value='';return;}
 try{const data=JSON.parse(await f.text());A.importData(data);toast('นำเข้า Demo JSON เรียบร้อย');render();}catch(err){toast('นำเข้าล้มเหลว: '+err.message);}finally{input.value='';}}
function addBottomToolbar(){const div=document.createElement('div');div.className='control-row';div.style.marginTop='24px';div.innerHTML=`<div class="filter-bar"><button class="btn btn-outline btn-sm" data-action="export-json">Backup Demo JSON</button><button class="btn btn-outline btn-sm" data-action="import-json">Import Demo JSON</button><button class="btn btn-danger btn-sm" data-action="reset-demo">Reset Demo</button><input id="importJSON" type="file" accept=".json,application/json" hidden></div><span class="summary-inline">${A.storageAvailable()?'Local Browser Storage':'Warning: Browser Storage unavailable — changes not persistent'} · No cloud sync</span>`;
 const content=$('pageContent');content.after(div);
}
// Bottom toolbar is persistent and outside data re-render to preserve file selection.
render();addBottomToolbar();
})();
