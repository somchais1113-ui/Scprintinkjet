/* ProCleaning Business Demo v2.4 — zero backend. Personal/customer data must NOT be entered here. */
(function(global){
  'use strict';
  const KEY='procleaning-business-demo-v23';
  const SEED=global.PROCLEANING_DEMO_SEED;
  const Engine=global.PCQuoteEngine;
  if(!SEED)throw Error('Missing local demo seed; ensure seed-data.js loads first');
  const copy=value=>JSON.parse(JSON.stringify(value));
  function isData(value){return !!(value&&value.schemaVersion===1&&Array.isArray(value.customers)&&Array.isArray(value.rfqs)&&Array.isArray(value.quotes)&&Array.isArray(value.orders)&&Array.isArray(value.events));}
  let state=copy(SEED);
  let storageReady=true;
  try{const saved=global.localStorage.getItem(KEY);if(saved){const parsed=JSON.parse(saved);if(isData(parsed))state=parsed;}}
  catch(e){storageReady=false;console.warn('localStorage unavailable; demo changes last only until refresh',e);}
  const snapshot=()=>copy(state);
  const read=()=>state;
  const subscriptions=new Set();
  const notify=()=>{for(const fn of subscriptions){try{fn(state)}catch(e){console.error(e)}}};
  function save(){try{global.localStorage.setItem(KEY,JSON.stringify(state));storageReady=true;}catch(e){storageReady=false;console.warn('Unable to save demo to localStorage',e);}notify();}
  function reset(){state=copy(SEED);save();}
  function update(mutator){const next=copy(state);mutator(next);if(!isData(next))throw Error('Invalid demo data');state=next;save();return snapshot();}
  const getNextId=(records,prefix)=>{let largest=0;for(const r of records){const m=String(r.id||'').match(new RegExp('^'+prefix+'-(\\d+)$'));if(m)largest=Math.max(largest,Number(m[1]));}return prefix+'-'+String(largest+1).padStart(4,'0');};
  const today=()=>new Date().toISOString().slice(0,10);
  const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
  const daysBetween=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000);
  const inPeriod=(date,period,reference=today())=>period==='all'||(!period?true:(validDate(date)&&daysBetween(date,reference)>=0&&daysBetween(date,reference)<Number(period)));
  const latestQuotes=(data=state)=>{
    const map=new Map();
    for(const q of data.quotes){const p=map.get(q.rfqId);if(!p||Number(q.version)>Number(p.version)||(Number(q.version)===Number(p.version)&&String(q.createdAt)>String(p.createdAt)))map.set(q.rfqId,q);}
    return [...map.values()];
  };
  const getCustomer=(id,data=state)=>data.customers.find(c=>c.id===id);
  const getRfq=(id,data=state)=>data.rfqs.find(r=>r.id===id);
  const getQuote=(id,data=state)=>data.quotes.find(q=>q.id===id);
  const getOrder=(id,data=state)=>data.orders.find(o=>o.id===id);
  function metrics(data=state,{period='all',source='all'}={}){
    // Cohort method: qualify RFQs by received date/source. Quote decisions and orders are traced to those RFQ ids.
    const rfqs=data.rfqs.filter(r=>inPeriod(r.receivedAt,period)&& (source==='all'||r.source===source));
    const ids=new Set(rfqs.map(r=>r.id));
    const latest=latestQuotes(data).filter(q=>ids.has(q.rfqId));
    const outcomes=latest.filter(q=>['accepted','rejected','expired'].includes(q.status));
    const accepted=outcomes.filter(q=>q.status==='accepted').length;
    const attributedOrders=data.orders.filter(o=>ids.has(o.rfqId));
    const uniqueOrderedRfqs=new Set(attributedOrders.map(o=>o.rfqId));
    const customerIds=new Set(rfqs.map(r=>r.customerId));
    const newCustomers=data.customers.filter(c=>inPeriod(c.createdAt,period)&& (source==='all'||c.source===source)).length;
    const allOrderCustomers=data.orders.reduce((acc,o)=>(acc[o.customerId]=(acc[o.customerId]||0)+1,acc),{});
    const orderedCustomerIds=new Set(attributedOrders.map(o=>o.customerId));
    const repeat=[...orderedCustomerIds].filter(id=>allOrderCustomers[id]>1).length;
    const revenue=attributedOrders.reduce((sum,o)=>sum+Number(o.netRevenue??o.amount??0),0);
    const directCost=attributedOrders.reduce((sum,o)=>sum+Number(o.estimatedCost||0),0);
    return {rfqs:rfqs.length,quoted:new Set(latest.filter(q=>q.status!=='draft').map(q=>q.rfqId)).size,newCustomers,quotes:latest.length,decided:outcomes.length,accepted,won:uniqueOrderedRfqs.size,lost:outcomes.filter(q=>q.status!=='accepted').length,orderCount:attributedOrders.length,winRate:outcomes.length?100*accepted/outcomes.length:null,conversion:rfqs.length?100*uniqueOrderedRfqs.size/rfqs.length:null,revenue,directCost,grossProfit:revenue-directCost,grossMargin:revenue?100*(revenue-directCost)/revenue:null,aov:attributedOrders.length?revenue/attributedOrders.length:null,repeatRate:orderedCustomerIds.size?100*repeat/orderedCustomerIds.size:null,rfqIds:ids,customers:customerIds};
  }
  function addCustomer(payload){return update(data=>{
    const name=String(payload.name||'').trim();if(!name)throw Error('กรุณาระบุชื่อลูกค้า');
    const id=getNextId(data.customers,'C');
    data.customers.push({id,name,contact:String(payload.contact||'Demo contact').trim(),email:String(payload.email||'').trim(),source:String(payload.source||'Website'),segment:String(payload.segment||'SME'),createdAt:today(),notes:String(payload.notes||'').trim()});log(data,'customer','New demo customer',id);
  });}
  function addRfq(payload){return update(data=>{
    if(!getCustomer(payload.customerId,data))throw Error('กรุณาเลือกลูกค้าที่มีอยู่');
    const title=String(payload.title||'').trim();if(!title)throw Error('กรุณาระบุรายละเอียดงาน');
    const id=getNextId(data.rfqs,'RFQ');
    data.rfqs.push({id,customerId:String(payload.customerId),title,category:String(payload.category||'Sticker & Label'),quantity:Math.max(1,Number(payload.quantity)||1),unit:String(payload.unit||'pcs'),source:String(payload.source||'Website'),receivedAt:today(),status:'new',deadline:String(payload.deadline||''),notes:String(payload.notes||'')});log(data,'rfq','New demo RFQ',id);
  });}
  // Demo-only atomic website intake; deliberately discards actual names, emails and artwork bytes.
  function addWebsiteDemoRfq(payload){
    return update(data=>{
      const category=String(payload.category||'').trim();
      const title=String(payload.title||'').trim();
      const quantity=Number(payload.quantity);
      const width=Number(payload.width),height=Number(payload.height);
      if(!category||!title||title.length>180)throw Error('Choose a category and project title');
      if(!Number.isFinite(quantity)||quantity<1||quantity>1000000)throw Error('Quantity must be 1–1,000,000');
      if(!Number.isFinite(width)||width<=0||width>100000||!Number.isFinite(height)||height<=0||height>100000)throw Error('Invalid dimensions');
      const customerId=getNextId(data.customers,'C');
      const rfqId=getNextId(data.rfqs,'RFQ');
      data.customers.push({id:customerId,name:'Website Demo Lead '+customerId,contact:'Not collected in demo',email:'',source:'Website',segment:'Demo',createdAt:today(),notes:'Synthetic demo identity, no real contacts'});
      const spec={width,height,dimensionUnit:String(payload.dimensionUnit||'mm').slice(0,5),material:String(payload.material||'').slice(0,100),finish:String(payload.finish||'').slice(0,100),printSides:String(payload.printSides||'1').slice(0,30),artwork:String(payload.artwork||'not_ready').slice(0,30),fileSelected:Boolean(payload.fileSelected),notes:String(payload.notes||'').slice(0,500)};
      data.rfqs.push({id:rfqId,customerId,title,category,quantity,unit:String(payload.unit||'pcs').slice(0,20),source:'Website',receivedAt:today(),status:'new',deadline:String(payload.deadline||''),notes:spec.notes,spec});
      log(data,'rfq','Website intake — synthetic demo only',rfqId);
    });
  }
  function addDetailedQuote(payload){return update(data=>{
    if(!Engine)throw Error('Quotation engine unavailable');
    const rfq=getRfq(payload.rfqId,data);if(!rfq)throw Error('RFQ not found');
    if(data.orders.some(o=>o.rfqId===rfq.id))throw Error('Order already exists for this RFQ');
    const c=Engine.calculate(payload);
    if(c.netSales<=0)throw Error('Net quotation value must be greater than 0');
    const version=1+Math.max(0,...data.quotes.filter(q=>q.rfqId===rfq.id).map(q=>Number(q.version)||0));
    const id=getNextId(data.quotes,'QT');
    data.quotes.push({id,rfqId:rfq.id,customerId:rfq.customerId,version,amount:c.grandTotal,netRevenue:c.netSales,taxAmount:c.vat,estimatedCost:c.directCost,createdAt:today(),sentAt:null,status:'draft',lostReason:'',decisionAt:null,notes:c.notes,quotation:{items:c.items,costs:c.costs,discountType:c.discountType,discountValue:c.discountValue,shippingCharge:c.shippingCharge,vatEnabled:c.vatEnabled,vatRate:c.vatRate,validityDays:c.validityDays,terms:c.terms}});
    rfq.status='contacted';log(data,'quote','Detailed quotation draft v'+version,id);
  });}
  function addQuote(payload){return update(data=>{
    const rfq=getRfq(payload.rfqId,data);if(!rfq)throw Error('ไม่พบ RFQ');
    if(data.orders.some(o=>o.rfqId===rfq.id))throw Error('RFQ นี้มีคำสั่งซื้อแล้ว');
    const amount=Number(payload.amount),cost=Number(payload.estimatedCost);
    if(!Number.isFinite(amount)||amount<=0)throw Error('ระบุมูลค่าใบเสนอราคาที่มากกว่า 0');
    if(!Number.isFinite(cost)||cost<0)throw Error('ระบุต้นทุนประมาณการที่ไม่ติดลบ');
    const version=1+Math.max(0,...data.quotes.filter(q=>q.rfqId===rfq.id).map(q=>Number(q.version)||0));
    const id=getNextId(data.quotes,'QT');
    data.quotes.push({id,rfqId:rfq.id,customerId:rfq.customerId,version,amount,estimatedCost:cost,createdAt:today(),sentAt:null,status:'draft',lostReason:'',decisionAt:null,notes:String(payload.notes||'')});rfq.status='contacted';log(data,'quote',`Quote draft v${version}`,id);
  });}
  function updateQuoteStatus(id,status,reason=''){return update(data=>{
    const quote=getQuote(id,data);if(!quote)throw Error('ไม่พบใบเสนอราคา');
    if(!['sent','rejected','expired'].includes(status))throw Error('Invalid quote status');
    if(status==='rejected'&&!String(reason).trim())throw Error('กรุณาระบุเหตุผลที่ไม่ปิดการขาย');
    if(data.orders.some(o=>o.rfqId===quote.rfqId))throw Error('ใบเสนอราคานี้ถูกยืนยันเป็นคำสั่งซื้อแล้ว');
    const newest=latestQuotes(data).find(q=>q.rfqId===quote.rfqId);
    if(newest?.id!==quote.id)throw Error('จัดการเฉพาะใบเสนอราคาเวอร์ชันล่าสุด');
    quote.status=status;quote.sentAt=quote.sentAt||today();quote.decisionAt=['rejected','expired'].includes(status)?today():null;quote.lostReason=['rejected','expired'].includes(status)?String(reason).trim():'';
    const rfq=getRfq(quote.rfqId,data);if(rfq)rfq.status=status==='sent'?'quoted':'lost';
    log(data,'quote',`Quote ${status}`,id);
  });}
  function confirmOrder(quoteId){return update(data=>{
    const quote=getQuote(quoteId,data);if(!quote)throw Error('ไม่พบใบเสนอราคา');
    if(data.orders.some(o=>o.rfqId===quote.rfqId))throw Error('RFQ นี้มี Order อยู่แล้ว');
    if(quote.status==='rejected'||quote.status==='expired'||quote.status==='draft')throw Error('ต้องส่งใบเสนอราคาและยังไม่ถูกปฏิเสธก่อนยืนยัน');
    const newest=latestQuotes(data).find(q=>q.rfqId===quote.rfqId);
    if(newest?.id!==quote.id)throw Error('โปรดยืนยันใบเสนอราคาเวอร์ชันล่าสุด');
    const id=getNextId(data.orders,'ORD'),now=today(),due=new Date();due.setDate(due.getDate()+14);
    data.orders.push({id,quoteId:quote.id,customerId:quote.customerId,rfqId:quote.rfqId,amount:Number(quote.amount),netRevenue:Number(quote.netRevenue??quote.amount),taxAmount:Number(quote.taxAmount||0),estimatedCost:Number(quote.estimatedCost),createdAt:now,status:'confirmed',dueDate:due.toISOString().slice(0,10),deliveredAt:null,notes:'New demo order (not real production)'});
    quote.status='accepted';quote.sentAt=quote.sentAt||now;quote.decisionAt=now;
    const rfq=getRfq(quote.rfqId,data);if(rfq)rfq.status='won';
    log(data,'order','Confirmed demo order',id);
  });}
  function updateOrderStatus(orderId,status){return update(data=>{
    const order=getOrder(orderId,data);if(!order)throw Error('Order not found');
    if(!['confirmed','in_production','quality_check','shipped','delivered','cancelled'].includes(status))throw Error('Invalid order status');
    order.status=status;order.deliveredAt=status==='delivered'?(order.deliveredAt||today()):null;
    log(data,'order','Order status: '+status,order.id);
  });}
  function log(data,type,message,ref){data.events.unshift({id:'EV-'+String(Date.now())+'-'+data.events.length,type,message,ref,at:new Date().toISOString()});data.events=data.events.slice(0,150);}
  function importData(input){if(!isData(input))throw Error('รูปแบบข้อมูลไม่ถูกต้อง หรือ schemaVersion ไม่ตรง');
    const parsed=copy(input);
    // Validate cross-table references: prevent corrupting the operational demo.
    const customers=new Set(parsed.customers.map(c=>c.id));const rfqs=new Set(parsed.rfqs.map(r=>r.id));const quotes=new Set(parsed.quotes.map(q=>q.id));
    if(parsed.rfqs.some(r=>!customers.has(r.customerId))||parsed.quotes.some(q=>!rfqs.has(q.rfqId)||!customers.has(q.customerId))||parsed.orders.some(o=>!rfqs.has(o.rfqId)||!quotes.has(o.quoteId)||!customers.has(o.customerId)))throw Error('ข้อมูลอ้างอิงลูกค้า / RFQ / Quote ไม่ตรงกัน');
    state=parsed;save();
  }
  function quoteStatuses(){return {draft:'Draft',sent:'Sent',accepted:'Won',rejected:'Lost',expired:'Expired'};}
  global.PCAdminCore={KEY,read,snapshot,update,reset,subscribe:fn=>(subscriptions.add(fn),()=>subscriptions.delete(fn)),addCustomer,addRfq,addQuote,addWebsiteDemoRfq,addDetailedQuote,updateQuoteStatus,confirmOrder,updateOrderStatus,latestQuotes,metrics,getCustomer,getRfq,getQuote,getOrder,importData,storageAvailable:()=>storageReady,inPeriod,today,quoteStatuses};
})(window);
