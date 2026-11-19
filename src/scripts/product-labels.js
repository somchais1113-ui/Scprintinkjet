/* The campaign page reads the same approved rate card as Smart Quote. */
(()=>{
  'use strict';
  const C={
    th:{
      title:'พิมพ์ฉลากสินค้า | SCWork',description:'พิมพ์ฉลากสินค้าสำหรับขวด กระปุก กล่อง และถุง เลือกสเปกหรือขอคำแนะนำจาก SCWork',
      skip:'ข้ามไปยังเนื้อหา',home:'หน้าแรก',eyebrow:'SCWork / บริการพิมพ์ฉลากสินค้า',
      headline:'พิมพ์ฉลากสินค้า|ให้เข้ากับบรรจุภัณฑ์ของคุณ',
      lead:'สำหรับขวด กระปุก กล่อง และถุง มีสเปกแล้วส่งมาขอราคาได้เลย ถ้ายังไม่แน่ใจเรื่องวัสดุ เราช่วยเลือกให้ครับ',
      rateLead:'ดูราคาเบื้องต้นสำหรับฉลาก PP ขาว 5 × 5 ซม. แบบตัดมาตรฐาน ถ้าเป็นขนาดหรือวัสดุอื่น ส่งสเปกให้เราช่วยประเมินได้ครับ',
      quote:'ส่งสเปกเพื่อขอราคา',estimate:'เช็กราคาเบื้องต้น',help:'ช่วยเลือกวัสดุให้หน่อย',
      micro:'เริ่มได้โดยไม่ต้องสมัครสมาชิกหรืออัปโหลดไฟล์บนเว็บ',
      heroCaption:'01 / ฉลากบนบรรจุภัณฑ์',detailCaption:'02 / ผิวฉลากและขอบตัด',renderTag:'ภาพจำลอง',
      heroAlt:'ภาพจำลองขวดแก้วติดฉลาก FORM 01 คู่กับแผ่นฉลากลายเดียวกันที่ลอกขึ้นหนึ่งมุม',
      detailAlt:'ภาพจำลองระยะใกล้ของฉลาก FORM 01 เห็นมุมโค้ง ขอบตัด และฉลากที่ลอกขึ้นจากแผ่นรอง',
      detailKicker:'เลือกจากการใช้งานจริง',detailTitle:'เริ่มจากของที่คุณจะติดฉลาก',
      detailLead:'ยังไม่ต้องจำชื่อวัสดุ บอกเราว่าจะติดกับอะไร มีขนาดเท่าไร และต้องเจอความชื้นหรือการแช่เย็นไหม จะได้เลือกสเปกให้ตรงกับงาน',
      bottle:'ขวดและกระปุก',bottleDetail:'ดูพื้นผิว ความโค้ง และสภาพการใช้งานก่อนเลือกวัสดุ',
      box:'กล่องและถุง',boxDetail:'ระบุตำแหน่งที่จะติดและลักษณะผิวบรรจุภัณฑ์',
      talk:'คุยกับทีมเรื่องวัสดุ',ready:'พร้อมเริ่มทำฉลากหรือยัง?',
      tracking:'ติดตามงานและสั่งซ้ำ',projectKicker:'งานโครงการ / ฝ่ายจัดซื้อ',projectTitle:'ทำฉลากหลาย SKU ในงานเดียว?',
      projectLead:'รวมสเปกแต่ละแบบ วันที่ต้องใช้ และเอกสารที่ต้องการ แล้วส่งให้ทีมประเมินด้วยเลขอ้างอิงเดียว',projectCta:'ขอราคาโครงการ',
      readyDetail:'เตรียมวัสดุ ขนาด และจำนวนเท่าที่ทราบ ส่วนไฟล์งานส่งเป็นลิงก์หรือคุยกับทีมภายหลังได้'
    },
    en:{
      title:'Custom Product Label Printing | SCWork',description:'Custom printed labels for bottles, jars, boxes and pouches. Share your specs or get material advice from SCWork.',
      skip:'Skip to content',home:'Home',eyebrow:'SCWork / Custom label printing',
      headline:'Custom labels|for your packaging',
      lead:'Labels for bottles, jars, boxes and pouches. Share your specs for a quote, or ask us to help choose your material.',
      rateLead:'Compare estimates for standard-cut white PP labels, 5 × 5 cm. Share your specs for a quote on other sizes or materials.',
      quote:'Share specs for a quote',estimate:'Check estimated price',help:'Help me choose a material',
      micro:'No account or website file upload required',
      heroCaption:'01 / Labels on packaging',detailCaption:'02 / Label finish and cut edge',renderTag:'Concept render',
      heroAlt:'Concept render of an amber bottle with a FORM 01 label beside its matching sticker sheet with one corner lifted',
      detailAlt:'Close-up concept render of a FORM 01 label showing a rounded cut edge and a corner peeled from the backing',
      detailKicker:'Choose for your application',detailTitle:'Start with what you’re labelling',
      detailLead:'No need to know the material name. Tell us the surface, approximate size and whether it will encounter moisture or refrigeration.',
      bottle:'Bottles and jars',bottleDetail:'Check the surface, curve and storage conditions before choosing a material.',
      box:'Boxes and pouches',boxDetail:'Tell us where the label will go and what the package surface is like.',
      talk:'Ask us about materials',ready:'Ready to start your labels?',
      tracking:'Track a project or reorder',projectKicker:'Project orders / Purchasing',projectTitle:'Ordering labels for multiple SKUs?',
      projectLead:'Combine each specification, your target date and purchasing documents in one brief with a single reference.',projectCta:'Request a project quote',
      readyDetail:'Share the material, dimensions and quantity you know. You can send a link to your artwork or discuss it with our team later.'
    }
  };
  const query=new URLSearchParams(location.search);
  const requested=query.get('lang');
  const lang=requested==='en'?'en':'th';
  const copy=C[lang];
  const basePlan=window.SCWORK_LABEL_QUOTE_PLAN?.prepare(window.SCWORK_PRICING_PUBLIC,window.SCWORK_PRICING_ENGINE);
  const billing=window.SCWORK_QUOTE_BILLING;
  const priceReady=!!(billing?billing.rated(basePlan,window.SCWORK_BILLING_CONFIG):basePlan);
  document.documentElement.lang=lang;
  document.title=copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content',copy.description);
  document.querySelectorAll('[data-copy]').forEach(node=>{
    const key=node.dataset.copy;
    if(key==='headline'){
      const [first,next]=copy.headline.split('|');
      node.replaceChildren(first,document.createElement('br'),next);
    }else if(key==='quote')node.textContent=priceReady?copy.estimate:copy.quote;
    else if(key==='lead')node.textContent=priceReady?copy.rateLead:copy.lead;
    else if(Object.hasOwn(copy,key))node.textContent=copy[key];
  });
  document.querySelectorAll('[data-alt]').forEach(img=>{img.alt=copy[img.dataset.alt];});
  const routes={
    home:'./index.html?lang='+lang,
    quote:'./smart-quote.html?category=label&lang='+lang,
    help:'./smart-quote.html?category=label&mode=help&lang='+lang,
    project:'./project-quote.html?lang='+lang,
    tracking:'./order-tracking.html?lang='+lang
  };
  document.querySelectorAll('[data-route]').forEach(a=>{a.href=routes[a.dataset.route];});
  document.querySelectorAll('.locale [hreflang]').forEach(a=>{
    if(a.getAttribute('hreflang')===lang)a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
})();
