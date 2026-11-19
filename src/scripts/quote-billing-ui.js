/* Local buyer selection, settlement preview and an A4 print sheet. */
(() => {
  'use strict';
  const api=window.SCWORK_QUOTE_BILLING;
  const $=id=>document.getElementById(id);
  if(!api||!$('printEstimate'))return;
  const cfg=window.SCWORK_BILLING_CONFIG||{};
  const EN={
    billing:'Buyer details and tax',billingLead:'Review the breakdown and print without using LINE',buyer:'Buyer type',individual:'Individual',
    company:'Thai private-sector legal entity',other:'Other / Needs review',contract:'Withholding contract basis',fullContract:'This is the full contract amount',
    partialContract:'Partial payment under a service contract of at least THB 1,000 before VAT',unknownContract:'Full contract amount not known',
    recipient:'Name on document (optional)',localOnly:'Used only in your printout. Not sent or saved by this page.',
    example:'Try a calculation with your own amount',exampleNote:'Illustration only. This is not an SCWork selling price and does not appear on the printed estimate.',
    sampleBase:'Amount before VAT (THB)',sampleFee:'Management fee (THB)',sampleType:'Example transaction',service:'Service / Hire of work',goods:'Sale of goods',
    sampleVAT:'Example VAT treatment',vatYes:'7% VAT',vatNo:'No VAT',fee:'Management fee',subtotal:'Subtotal before VAT',
    net:'Estimated bank transfer amount',docSpecs:'Job specifications',
    printNote:'For review before purchase. Not an invoice, receipt, or tax invoice.'
  };
  const th=new WeakMap();
  let data=null;
  const pick=(a,b)=>data?.lang==='th'?a:b;
  const buyer=()=>$('billBuyer').value;
  const contract=()=>$('billContract').value;
  const money=n=>n===null?pick('รอยืนยัน','To be confirmed'):new Intl.NumberFormat(pick('th-TH','en-GB'),{style:'currency',currency:'THB',maximumFractionDigits:2,minimumFractionDigits:2}).format(n);
  const buyerLabel=()=>({
    individual:pick('บุคคลธรรมดา','Individual'),
    company:pick('นิติบุคคลไทย (ภาคเอกชน)','Thai private-sector legal entity'),
    other:pick('อื่น ๆ / ให้ตรวจสอบ','Other / Needs review')
  })[buyer()];
  const reasons=()=>{
    return {
      individual:pick('ประมาณการสำหรับการซื้อในนามบุคคลธรรมดาทั่วไป ไม่หัก ณ ที่จ่าย','This estimate assumes a standard individual purchase without withholding.'),
      goods:pick('คิดแบบซื้อขายสินค้า ไม่ได้หักภาษี ณ ที่จ่ายในกรณีนี้','This is treated as an ordinary sale of goods. No withholding is applied in this scenario.'),
      service:pick('หัก 3% จากค่าบริการก่อน VAT ผู้ซื้อเป็นผู้นำส่งภาษีส่วนนี้ ยอดเต็มของงานไม่เปลี่ยน','3% is withheld from the service amount before VAT. The buyer remits this amount. The gross charge does not change.'),
      minimum:pick('ยอดบริการทั้งสัญญาก่อน VAT ต่ำกว่า 1,000 บาท จึงไม่หักในกรณีนี้','The full service contract is below THB 1,000 before VAT. No withholding applies in this scenario.'),
      review:pick('ให้ทีมยืนยันว่าเป็นการขายสินค้าหรือค่าบริการก่อนคำนวณภาษีหัก ณ ที่จ่าย','SCWork needs to confirm whether this is a sale of goods or a service before estimating withholding.'),
      contract:pick('ยังไม่ทราบยอดทั้งสัญญา จึงยังไม่สรุปยอดโอนหลังหัก','The contract basis is unknown. The transfer amount cannot be estimated yet.'),
      other:pick('ภาครัฐ ต่างประเทศ หรืองานที่แยกฐานภาษี ให้ทีมตรวจสอบก่อน','Government, cross-border or mixed tax treatments require review.')
    };
  };
  const cur=()=>{
    const q=data?.result;
    return q?.billingConfigured?api.quote(q.preFee,q.managementFee,q.vatRate,q.billingType,buyer(),contract()):null;
  };
  const percent=n=>new Intl.NumberFormat(pick('th-TH','en-GB'),{maximumFractionDigits:4}).format(n*100);
  const whtLabel=n=>pick('หัก ณ ที่จ่าย','Withholding tax')+(n.reason==='service'?' 3%':'');
  const text=(id,value)=>{$(id).textContent=value;};
  const netLabel=()=>pick('ยอดโอนสุทธิ (ประมาณการ)','Estimated bank transfer amount');
  const vatLabel=n=>n.vatRate>0?'VAT '+percent(n.vatRate)+'%':pick('ไม่คิด VAT','No VAT applied');
  const grossLabel=()=>pick('ยอดรวมก่อนหัก ณ ที่จ่าย','Gross amount before withholding');
  const pairs=(n,includeBase)=>[
    ...(includeBase?[[pick('ราคางานก่อนค่าบริหาร','Job amount before fee'),n.base],[pick('ค่าบริหารงาน','Management fee'),n.fee]]:[]),
    [pick('ยอดก่อน VAT','Subtotal before VAT'),n.subtotal],[vatLabel(n),n.vat],[grossLabel(),n.gross],[whtLabel(n),n.wht],[netLabel(),n.net]
  ];
  function breakdown(id,rows){
    const box=$(id);
    box.replaceChildren(...rows.map(([label,n])=>{
      const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=label;dd.textContent=money(n);div.append(dt,dd);return div;
    }));
  }
  function update(){
    if(!data)return;
    const focusType=data.result?.billingType;
    $('billContractPanel').hidden=buyer()!=='company'||!(focusType==='service'||$('billingExample').open&&$('exampleType').value==='service');
    const result=cur();
    for(const id of ['billingFeeRow','billingSubtotalRow','billingPay'])$(id).hidden=!result;
    if(result){
      text('billingFeeValue',money(result.fee));text('billingSubtotalValue',money(result.subtotal));
      text('sumTotalLabel',grossLabel());text('sumVatLabel',vatLabel(result));
      text('billingWhtLabel',whtLabel(result));text('billingWhtValue',money(result.wht));
      text('billingNetValue',money(result.net));text('billingPayNote',reasons()[result.reason]);
    }
    const example=api.quote($('exampleBase').valueAsNumber,$('exampleFee').valueAsNumber,$('exampleVAT').value==='yes'?api.DEMO_VAT:0,
      $('exampleType').value,buyer(),contract());
    breakdown('billingExampleRows',example?pairs(example,false):[]);
    text('billingExampleNote',example?reasons()[example.reason]:pick('กรอกยอดและค่าบริหารเป็นตัวเลขตั้งแต่ 0 ขึ้นไป','Enter nonnegative amounts in both fields.'));
    $('printEstimate').disabled=!data.ready;
    text('printEstimate',result?pick('พิมพ์ใบประมาณราคา / บันทึก PDF','Print estimate / Save PDF'):
      pick('พิมพ์สรุปสเปก / บันทึก PDF','Print specifications / Save PDF'));
  }
  function render(next){
    const changed=!data||next.lang!==data.lang;
    data=next;
    if(changed)document.querySelectorAll('[data-b]').forEach(e=>{
      if(!th.has(e))th.set(e,e.textContent);
      e.textContent=pick(th.get(e),EN[e.dataset.b]||th.get(e));
    });
    update();
  }
  const clearPrint=()=>{
    document.body.classList.remove('qb-print-active');$('billPrintSheet').hidden=true;
  };
  window.addEventListener('afterprint',clearPrint);
  $('printEstimate').addEventListener('click',()=>{
    if(!data?.ready)return;
    const n=cur();
    const seller=typeof cfg.sellerName==='string'?cfg.sellerName.trim().slice(0,120):'';
    const recipient=$('billRecipient').value.trim().slice(0,120);
    text('docSeller',seller||'SCWork');
    text('docTitle',n?pick('ใบประมาณราคา','Price estimate'):pick('ใบสรุปสเปกขอราคา','Specifications for quotation'));
    text('docDate',new Intl.DateTimeFormat(pick('th-TH','en-GB'),{dateStyle:'long',timeZone:'Asia/Bangkok'}).format(new Date()));
    text('docRecipient',recipient?pick('ชื่อผู้ขอราคา','Requested by')+' · '+recipient:'');$('docRecipient').hidden=!recipient;
    text('docBuyer',pick('ประเภทผู้ซื้อ','Buyer type')+' · '+buyerLabel());
    text('docRate',n&&data.version?pick('เรทราคา','Rate card')+' · '+data.version:'');$('docRate').hidden=!n||!data.version;
    text('docMaterial',data.material);text('docSpecs',data.specs);text('docExtra',data.extra||'');
    $('docAmounts').hidden=!n;breakdown('docAmounts',n?pairs(n,true):[]);
    text('docStatus',n?reasons()[n.reason]:pick('ยังไม่ยืนยันราคา เอกสารนี้แสดงเฉพาะสเปกงาน','No confirmed estimate. This document contains job specifications only.'));
    text('docTerms',n?pick('ไม่รวมค่าจัดส่ง ราคาต้องยืนยันหลังตรวจสเปกและไฟล์งาน','Shipping excluded. Pricing is subject to final review of specifications and artwork.'):'');
    document.body.classList.add('qb-print-active');$('billPrintSheet').hidden=false;
    try{window.print();}catch{clearPrint();}
  });
  for(const id of ['billBuyer','billContract','exampleType','exampleVAT'])$(id).addEventListener('change',update);
  for(const id of ['exampleBase','exampleFee'])$(id).addEventListener('input',update);
  $('billingExample').addEventListener('toggle',update);
  window.SCWORK_QUOTE_BILLING_UI={render};
})();
