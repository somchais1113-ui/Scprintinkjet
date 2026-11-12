/* v2.4 Smart Quote Builder — use only synthetic demo records */
(() => {
  'use strict';
  const Core = window.PCAdminCore, Engine = window.PCQuoteEngine;
  const root = document.getElementById('builder-root');
  if (!root || !Core || !Engine) return;
  const $ = id => document.getElementById(id);
  const safe = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => '฿' + new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const costs = ['material', 'outsourcing', 'labor', 'finishing', 'logistics', 'other'];
  const costNames = {material:'Additional material',outsourcing:'Supplier / Outsourcing',labor:'Production labor',finishing:'Finishing / QC',logistics:'Shipping direct cost',other:'Other direct costs'};
  const idQuery = new URLSearchParams(window.location.search).get('rfq');
  const data = Core.read();
  const eligible = data.rfqs.filter(r => !data.orders.some(o => o.rfqId === r.id));
  let activeId = eligible.some(r => r.id === idQuery) ? idQuery : eligible[0]?.id || '';
  let itemRows = [];
  let lastSaved = '';
  const describeRfq = r => [r?.title || '', r?.category || 'Print service'].filter(Boolean).join(' — ');
  function initialModel(id) {
    const d = Core.read(), r = Core.getRfq(id, d), last = Core.latestQuotes(d).find(q => q.rfqId === id);
    const spec = r?.spec || {};
    const previous = last?.quotation;
    const items = previous?.items?.length ? previous.items.map(i=>({...i})) : [{description:describeRfq(r) || 'Print service',quantity:r?.quantity || 100,unit:r?.unit || 'pcs',unitPrice:0,unitCost:0}];
    return {
      items, costs:{...Object.fromEntries(costs.map(k => [k, 0])), ...(previous?.costs || {})},
      discountType:previous?.discountType || 'amount',discountValue:previous?.discountValue || 0,
      shippingCharge:previous?.shippingCharge || 0,vatEnabled:previous?.vatEnabled ?? true,
      vatRate:previous?.vatRate ?? 7,validityDays:previous?.validityDays || 14,
      terms:previous?.terms || 'Subject to final artwork approval. Prices and schedule to be confirmed before production.',
      notes:previous?.notes || '',
      spec
    };
  }
  let model = initialModel(activeId);
  const field = (key, label, value, type = 'number', min = '0') => `<label class="qb-label">${label}<input class="qb-input" data-field="${key}" type="${type}" ${type === 'number' ? `step="any" min="${min}"` : ''} value="${safe(value)}"></label>`;
  function lines() {
    $('lineItems').innerHTML = itemRows.map((i, index) => `<div class="qb-line" data-row="${index}">
      <input class="qb-input" aria-label="Item description ${index+1}" data-line="${index}" data-prop="description" maxlength="160" value="${safe(i.description)}">
      <input class="qb-input" aria-label="Quantity ${index+1}" data-line="${index}" data-prop="quantity" type="number" min="0.01" step="any" value="${safe(i.quantity)}">
      <input class="qb-input" aria-label="Unit ${index+1}" data-line="${index}" data-prop="unit" maxlength="20" value="${safe(i.unit)}">
      <input class="qb-input" aria-label="Selling unit price ${index+1}" data-line="${index}" data-prop="unitPrice" type="number" min="0" step="any" value="${safe(i.unitPrice)}">
      <input class="qb-input" aria-label="Direct unit cost ${index+1}" data-line="${index}" data-prop="unitCost" type="number" min="0" step="any" value="${safe(i.unitCost)}">
      <button type="button" title="Remove line item" aria-label="Remove line item ${index+1}" class="qb-small-btn" data-remove="${index}" ${itemRows.length === 1 ? 'disabled' : ''}>×</button>
    </div>`).join('');
  }
  function build() {
    const rfqOptions = eligible.map(r => `<option value="${safe(r.id)}" ${r.id === activeId ? 'selected' : ''}>${safe(r.id)} · ${safe(r.title)}</option>`).join('');
    const nextVersion = 1 + Math.max(0, ...Core.read().quotes.filter(q => q.rfqId === activeId).map(q => Number(q.version || 0)));
    root.innerHTML = `<div id="builderAlert" role="status" aria-live="polite" class="qb-alert"></div>
    ${!eligible.length ? `<div class="qb-card"><h2>ไม่มี RFQ ที่สร้างใบเสนอราคาได้</h2><p>สร้าง RFQ จากหน้าเว็บไซต์จำลอง หรือเมนู RFQ ก่อน</p><a class="btn btn-primary" href="../../request-quote.html">Open Smart RFQ →</a> <a href="quotations.html" class="btn btn-outline">Open RFQs</a></div>` : `<div class="qb-layout">
    <div class="qb-form">
      <section class="qb-card"><div class="qb-title"><h2>01 / Select request</h2><span class="qb-section-tag">RFQ REFERENCE</span></div>
        <div class="qb-grid"><label class="qb-label full">Select RFQ<select id="selectedRfq" class="qb-input">${rfqOptions}</select></label></div>
        <div class="qb-rfq-info" id="rfqInfo"></div>
        <p class="qb-help">A new quotation is always saved as a fresh immutable revision, not an overwrite.</p>
      </section>
      <section class="qb-card"><div class="qb-title"><h2>02 / Quotation line items</h2><span class="qb-section-tag">EDITABLE</span></div>
        <div class="qb-line-wrap"><div class="qb-line-head"><span>DESCRIPTION</span><span>QTY</span><span>UNIT</span><span>SELL / UNIT</span><span>COST / UNIT</span><span></span></div><div id="lineItems"></div></div>
        <div class="qb-actions"><button class="btn btn-outline btn-sm" type="button" id="addLine">+ Add item</button><button class="btn btn-outline btn-sm" type="button" id="addSetup">+ Setup fee</button></div>
        <p class="qb-help">Enter selling and direct cost per unit. This is not automatic pricing; all values are estimates.</p>
      </section>
      <section class="qb-card"><div class="qb-title"><h2>03 / Additional direct costs</h2><span class="qb-section-tag">INTERNAL ONLY</span></div>
        <div class="qb-grid">${costs.map(key => field('cost-'+key,costNames[key]+' (THB)',model.costs[key])).join('')}</div>
        <p class="qb-help">These costs do not appear on the customer-facing quote. Avoid counting the same cost in both unit cost and this section.</p>
      </section>
      <section class="qb-card"><div class="qb-title"><h2>04 / Commercial terms</h2><span class="qb-section-tag">PRICING</span></div>
        <div class="qb-grid">
          <label class="qb-label">Discount type<select id="discountType" class="qb-input"><option value="amount" ${model.discountType==='amount'?'selected':''}>THB amount</option><option value="percent" ${model.discountType==='percent'?'selected':''}>Percentage %</option></select></label>
          ${field('discountValue','Discount value',model.discountValue)}
          ${field('shippingCharge','Shipping charge to customer (THB)',model.shippingCharge)}
          ${field('vatRate','VAT rate % (0 to 100)',model.vatRate)}
          <label class="qb-label">VAT calculation<select id="vatEnabled" class="qb-input"><option value="true" ${model.vatEnabled?'selected':''}>On</option><option value="false" ${!model.vatEnabled?'selected':''}>Off</option></select></label>
          ${field('validityDays','Quote validity (days)',model.validityDays,'number','1')}
          <label class="qb-label full">Terms & conditions<textarea id="terms" class="qb-input" rows="3" maxlength="800">${safe(model.terms)}</textarea></label>
          <label class="qb-label full">Internal notes<textarea id="notes" class="qb-input" rows="3" maxlength="800">${safe(model.notes)}</textarea></label>
        </div>
      </section>
    </div>
    <aside class="qb-aside">
      <section class="qb-card"><div class="qb-title"><h2>Live calculation</h2><span class="qb-section-tag">V${nextVersion} DRAFT</span></div><div id="liveNumbers"></div>
        <div class="qb-actions"><button type="button" class="btn btn-primary qb-button" id="saveQuote">Save draft v${nextVersion}</button><a href="quotations.html" class="btn btn-outline qb-button">Quote pipeline →</a></div>
        <p class="qb-note">VAT is calculated on the discounted selling amount plus any customer shipping charge. Revenue and estimated margin EXCLUDE VAT.</p>
        <div id="saveResult" class="qb-help"></div>
      </section>
      <div class="qb-warning"><strong>Important</strong><br>Demo data and pricing are stored only in this browser. No email delivery, backend, authentication, actual PDF service, billing or artwork storage. Quote printout has a DEMO watermark.</div>
    </aside></div>`}`;
    if (!eligible.length) return;
    itemRows = model.items.map(i=>({...i}));
    lines(); showRfq(); calculate();
  }
  function showRfq() {
    const r=Core.getRfq(activeId),c=Core.getCustomer(r.customerId),s=r.spec||{};
    $('rfqInfo').innerHTML = `<strong>${safe(r.id)} · ${safe(c?.name||'Demo customer')}</strong><div>${safe(r.title)} · ${safe(r.category)}</div><div>Qty: ${safe(r.quantity)} ${safe(r.unit)} · Deadline: ${safe(r.deadline || 'Not specified')}</div>${s.width?`<div>${safe(s.width)} × ${safe(s.height)} ${safe(s.dimensionUnit)} · ${safe(s.material||'')} · ${safe(s.finish||'')}</div>`:''}`;
  }
  function read() {
    model.items=itemRows.map(i=>({...i}));
    for (const key of costs) model.costs[key]=document.querySelector(`[data-field="cost-${key}"]`)?.value ?? 0;
    for (const key of ['discountValue','shippingCharge','vatRate','validityDays']) model[key]=document.querySelector(`[data-field="${key}"]`)?.value ?? 0;
    model.discountType=$('discountType').value;
    model.vatEnabled=$('vatEnabled').value === 'true';
    model.terms=$('terms').value; model.notes=$('notes').value;
    return model;
  }
  function alert(message,isError=false) {
    const el=$('builderAlert');if (!el) return;
    el.textContent=message;el.className='qb-alert show'+(isError?' error':'');
  }
  function calculate() {
    const el=$('liveNumbers');if (!el) return;
    try {
      const result=Engine.calculate(read());
      const detail=(label,amount)=>`<div class="qb-summary-row"><span>${label}</span><strong>${fmt(amount)}</strong></div>`;
      el.innerHTML=detail('Items subtotal',result.subtotal)+detail('Discount',-result.discount)+detail('Shipping charged',result.shippingCharge)+detail('Net sales (ex VAT)',result.netSales)+detail(`VAT (${result.vatEnabled ? result.vatRate : 0}%)`,result.vat)+`<div class="qb-summary-row grand"><span>Customer total</span><strong>${fmt(result.grandTotal)}</strong></div>`+
        `<div class="qb-margin ${result.grossProfit<0?'is-negative':''}"><div><span>Est. gross profit *</span><strong>${fmt(result.grossProfit)}</strong></div><div><span>Est. margin</span><strong>${result.grossMargin===null?'—':result.grossMargin+'%'}</strong></div></div>`+detail('Total direct costs *',result.directCost)+
        '<p class="qb-note">* Internal calculation only; excludes indirect overhead, tax on profit, revisions and actual supplier variation.</p>';
      $('saveQuote').disabled=result.netSales<=0;
    } catch (error) { el.innerHTML=`<p class="qb-warning">${safe(error.message)}</p>`;$('saveQuote').disabled=true; }
  }
  function save() {
    try {
      const before=Core.read().quotes.length;
      Core.addDetailedQuote({...read(),rfqId:activeId});
      const d=Core.read(),q=d.quotes.at(-1);
      if(d.quotes.length!==before+1)throw Error('Save not completed');
      lastSaved=q.id;
      $('saveResult').innerHTML=`<strong>Saved ${safe(q.id)} · v${safe(q.version)}</strong><br><a class="qb-link" href="quote-print.html?id=${encodeURIComponent(q.id)}" target="_blank" rel="noopener">Open print / Save PDF view ↗</a> · <a class="qb-link" href="quotations.html">Mark sent / track outcome ↗</a>`;
      alert('Demo draft saved as '+q.id+' (version '+q.version+'). Use the links below to print or manage the quote.');
      // Keep user's input, but next save creates a new revision.
      $('saveQuote').textContent='Save next revision';
    } catch (error) {alert(error.message,true);}
  }
  root.addEventListener('input',e=>{
    const line=e.target.closest('[data-line]');
    if(line){const n=Number(line.dataset.line),prop=line.dataset.prop;if(itemRows[n]&&['description','quantity','unit','unitPrice','unitCost'].includes(prop))itemRows[n][prop]=line.value;}
    if(line || e.target.matches('[data-field]') || e.target.matches('#terms,#notes'))calculate();
  });
  root.addEventListener('change',e=>{
    if(e.target.id==='selectedRfq'){
      activeId=e.target.value;model=initialModel(activeId);lastSaved='';build();try { history.replaceState({},'',`quote-builder.html?rfq=${encodeURIComponent(activeId)}`); } catch (e) { /* about:blank / restricted file preview: selector still works */ }
    }
    if(['discountType','vatEnabled'].includes(e.target.id))calculate();
  });
  root.addEventListener('click',e=>{
    const rm=e.target.closest('[data-remove]');
    if(rm && itemRows.length>1){itemRows.splice(Number(rm.dataset.remove),1);lines();calculate();return;}
    if(e.target.id==='addLine'){itemRows.push({description:'Additional service',quantity:1,unit:'unit',unitPrice:0,unitCost:0});lines();calculate();return;}
    if(e.target.id==='addSetup'){itemRows.push({description:'Artwork setup / prepress',quantity:1,unit:'job',unitPrice:0,unitCost:0});lines();calculate();return;}
    if(e.target.id==='saveQuote')save();
  });
  build();
})();
