/* V2.1 Quote arithmetic. Amounts rounded at line level, no order or tax-document issuance. */
(function(root){
  'use strict';
  const amount=(n,max=1e9)=>Number.isFinite(n)&&n>=0&&n<=max;
  const cents=n=>Math.round((n+Number.EPSILON)*100+1e-8);
  const baht=n=>n/100;
  const classes=['review','goods','service'];
  const WHT_RATE=0.03,WHT_MIN=1000,DEMO_VAT=0.07;
  function quote(base,fee,vatRate,classification,buyer,contract){
    if(!amount(base)||!amount(fee)||!amount(vatRate,.2)||!classes.includes(classification))return null;
    const b=cents(base),f=cents(fee),subtotal=b+f,v=Math.round(subtotal*vatRate+1e-8),gross=subtotal+v;
    let reason,withheld=null;
    if(buyer==='individual'){reason='individual';withheld=0;}
    else if(buyer!=='company')reason='other';
    else if(classification==='goods'){reason='goods';withheld=0;}
    else if(classification!=='service')reason='review';
    else if(contract==='unknown')reason='contract';
    else if(contract==='qualifying'||contract==='this-order'&&subtotal>=WHT_MIN*100){
      reason='service';withheld=Math.round(subtotal*WHT_RATE+1e-8);
    } else if(contract==='this-order'){reason='minimum';withheld=0;}
    else reason='contract';
    return {base:baht(b),fee:baht(f),subtotal:baht(subtotal),vatRate,vat:baht(v),gross:baht(gross),
      reason,wht:withheld===null?null:baht(withheld),net:withheld===null?null:baht(gross-withheld)};
  }
  function rated(basePlan,cfg) {
    if(!basePlan||!cfg||!['registered','not-registered'].includes(cfg.vatStatus)||
      !amount(basePlan.vatRate,.2)||cfg.vatStatus==='registered'&&basePlan.vatRate===0||
      cfg.vatStatus==='not-registered'&&basePlan.vatRate!==0)return null;
    const {type,value}=cfg.managementFee||{};
    if(!['none','fixed','percent'].includes(type)||!amount(value,type==='percent'?100:1e9)||(type==='none'&&value!==0))return null;
    const kind=classes.includes(cfg.standardOrder)?cfg.standardOrder:'review';
    const options=basePlan.options.map(o=>{
      if(!amount(o.subtotal))return null;
      const fee=type==='percent'?o.subtotal*value/100:value;
      const n=quote(o.subtotal,fee,basePlan.vatRate,kind,'individual','this-order');
      return n?{...o,preFee:n.base,managementFee:n.fee,subtotal:n.subtotal,vat:n.vat,total:n.gross,
        perPiece:n.gross/o.quantity,billingType:kind,billingConfigured:true}:null;
    });
    if(options.some(o=>!o))return null;
    return {...basePlan,options};
  }
  const api=Object.freeze({quote,rated,WHT_RATE,WHT_MIN,DEMO_VAT});
  root.SCWORK_QUOTE_BILLING=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
