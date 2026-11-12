(() => {
 'use strict';
 const A=window.PCAdminCore,E=window.PCQuoteEngine;
 const id=new URLSearchParams(location.search).get('id');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>'฿'+new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
 const quote=A.getQuote(id);
 const target=document.getElementById('printDocument');
 const button=document.getElementById('printBtn');
 if(!quote){target.innerHTML='<div class="empty"><h1>Quotation not found</h1><p>This record is available only in the same browser storage where you saved it.</p><a href="quotations.html">Open quotations</a></div>';button.disabled=true;return;}
 const rfq=A.getRfq(quote.rfqId),cust=A.getCustomer(quote.customerId);
 const detail=quote.quotation?E.calculate(quote.quotation):null;
 const rows=detail?.rows?.length?detail.rows:[{description:rfq?.title||'Legacy quotation total',quantity:1,unit:'job',unitPrice:Number(quote.amount),lineTotal:Number(quote.amount)}];
 const validDate=new Date(`${quote.createdAt}T12:00:00`);const expiry=new Date(validDate);expiry.setDate(expiry.getDate()+(detail?.validityDays||14));
 const summary=(a,b)=>`<div class="sumrow"><span>${esc(a)}</span><strong>${money(b)}</strong></div>`;
 target.innerHTML=`<article class="sheet"><div class="head"><div><span class="mark">P</span><h1>ProCleaning / Production Studio</h1><p>Sample quotation template · company details not configured</p></div><div class="document-head"><span class="demo-tag">DEMO / ${esc(quote.status)}</span><h1>QUOTATION</h1><strong>${esc(quote.id)} <small>REV. ${esc(quote.version)}</small></strong><small>Issued: ${esc(quote.createdAt)}<br>Valid until: ${esc(expiry.toISOString().slice(0,10))}</small></div></div>
 <div class="pair"><div><h2>ISSUED TO (DEMO)</h2><p>${esc(cust?.name||'Synthetic client')}</p><div>${esc(rfq?.title||'Printing service')}</div><div>RFQ ${esc(quote.rfqId)}</div></div><div><h2>PROJECT SPECIFICATION</h2><div>Category: ${esc(rfq?.category||'—')}</div><div>Quantity: ${esc(rfq?.quantity??'—')} ${esc(rfq?.unit||'')}</div>${rfq?.spec?.width?`<div>Size: ${esc(rfq.spec.width)} × ${esc(rfq.spec.height)} ${esc(rfq.spec.dimensionUnit)}</div>`:''}<div>Expected delivery: ${esc(rfq?.deadline||'To be confirmed')}</div></div></div>
 <div class="table-wrap"><table><thead><tr><th>DESCRIPTION</th><th>QTY</th><th>UNIT</th><th>UNIT PRICE</th><th>AMOUNT</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.description)}</td><td>${esc(r.quantity)}</td><td>${esc(r.unit)}</td><td>${money(r.unitPrice)}</td><td>${money(r.lineTotal)}</td></tr>`).join('')}</tbody></table></div>
 <div class="summary">${detail?summary('Subtotal',detail.subtotal)+summary('Discount',-detail.discount)+summary('Shipping charge',detail.shippingCharge)+summary('Amount before VAT',detail.netSales)+summary('VAT ('+(detail.vatEnabled?detail.vatRate:0)+'%)',detail.vat):summary('Legacy amount (VAT unspecified)',quote.amount)}<div class="sumrow total"><span>TOTAL (THB)</span><strong>${money(quote.amount)}</strong></div></div>
 <div class="foot"><strong>TERMS & CONDITIONS</strong><p>${esc(detail?.terms||'Quotation subject to confirmation. No payment instructions are included in this demonstration.').replace(/\n/g,'<br>')}</p><div class="note">SAMPLE ONLY — Not a legal quotation, tax invoice, official sales offer, or payment request. No real customer details or business credentials.</div></div></article>`;
 button.addEventListener('click',()=>window.print());
})();
