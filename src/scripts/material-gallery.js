/* Rich sticker material gallery with more relevant visual references. */
(()=>{
  'use strict';
  const doc=document;
  const root=doc.getElementById('materials');
  if(!root) return;

  const $=id=>doc.getElementById(id);
  const modal=$('scMaterialsPreview');
  const closeBtn=$('scMaterialsClose');
  const prevBtn=$('scMaterialsPrev');
  const nextBtn=$('scMaterialsNext');
  const dotsWrap=$('scMaterialsDots');
  const previewImage=$('scMaterialsPreviewImage');
  const previewTitle=$('scMaterialsPreviewTitle');
  const previewDetail=$('scMaterialsPreviewDetail');
  const previewSlideLabel=$('scMaterialsSlideLabel');
  const previewSlideCounter=$('scMaterialsSlideCounter');
  const previewSlideNote=$('scMaterialsSlideNote');
  const benefitsTitle=$('scMaterialsBenefitsTitle');
  const benefitsList=$('scMaterialsBenefits');
  const exampleTitle=$('scMaterialsExampleTitle');
  const exampleText=$('scMaterialsExampleText');
  const slideInfoTitle=$('scMaterialsSlideInfoTitle');

  const cardNodes=[...root.querySelectorAll('[data-material]')];
  const cards=cardNodes.map(card=>({
    id:card.dataset.material,
    card,
    title:card.querySelector('.sc-material__name'),
    detail:card.querySelector('.sc-material__detail'),
    link:card.querySelector('.sc-material__zoom'),
    image:card.querySelector('img')
  }));

  const base='./assets/images/material-preview';
  const tbase='./assets/images/materials';
  const lang=()=>doc.documentElement.lang.toLowerCase().startsWith('th')?'th':'en';
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const data={
    'paper-white':{
      th:{
        title:'สติกเกอร์กระดาษ',
        detail:'กระดาษขาวผิวด้าน เหมาะกับฉลากสินค้า กล่อง ถุง และบรรจุภัณฑ์ที่ใช้งานในพื้นที่แห้ง',
        alt:'สติกเกอร์กระดาษสีขาวผิวด้าน พร้อมมุมลอกของแผ่นสติกเกอร์',
        benefits:[
          'ต้นทุนคุ้มค่า เหมาะกับฉลากใช้งานทั่วไปและงานที่ต้องการควบคุมงบประมาณ',
          'ผิวด้านให้ภาพลักษณ์สะอาด อ่านง่าย และเหมาะกับดีไซน์ที่ต้องการความเรียบมืออาชีพ',
          'ติดได้ดีกับกล่องกระดาษ ถุง ซอง และบรรจุภัณฑ์ที่ใช้งานในที่แห้ง'
        ],
        example:'เหมาะกับฉลากสินค้า ฉลากกล่อง ฉลากถุง และสติ๊กเกอร์ข้อมูลทั่วไปที่ไม่ต้องสัมผัสน้ำหรือความชื้นบ่อย',
        slides:[
          {src:`${tbase}/paper-white.webp?v=2.1.7`,label:'พื้นผิววัสดุ',note:'โชว์ผิวกระดาษขาวด้านและลักษณะมุมลอกของวัสดุ เหมาะสำหรับใช้เปรียบเทียบลุควัสดุจริงก่อนผลิต'},
          {src:`${base}/application-paper-premium.png?v=2.1.14`,label:'ตัวอย่างฉลากบนบรรจุภัณฑ์',note:'เมื่อใช้กับขวด กล่อง หรือกระปุก จะให้ภาพลักษณ์สะอาด น่าเชื่อถือ และเหมาะกับงานสินค้าทั่วไป'},
          {src:`${base}/application-paper-natural.png?v=2.1.14`,label:'ตัวอย่างงานบนพื้นผิวจริง',note:'เหมาะกับฉลากสินค้าที่ต้องการการอ่านง่ายและลุคเรียบร้อย เช่น กลุ่มสกินแคร์ อาหารแห้ง และสินค้าทั่วไป'}
        ]
      },
      en:{
        title:'Paper stickers',
        detail:'Matte white paper for product labels, cartons, bags and dry-use packaging.',
        alt:'White paper sticker with a peeled-corner detail.',
        benefits:[
          'Cost-effective for everyday label work and budget-conscious packaging.',
          'The matte surface feels clean, readable and professional.',
          'Works well on cartons, bags, pouches and other dry-use packaging.'
        ],
        example:'Best for product labels and general information stickers that will not be exposed to frequent moisture.',
        slides:[
          {src:`${tbase}/paper-white.webp?v=2.1.7`,label:'Material surface',note:'Shows the matte white paper texture and peeled-corner view for comparing the real material look.'},
          {src:`${base}/application-paper-premium.png?v=2.1.14`,label:'Applied on packaging',note:'Paper labels give bottles, cartons and jars a clean and trustworthy presentation.'},
          {src:`${base}/application-paper-natural.png?v=2.1.14`,label:'Real-use example',note:'Useful for dry goods, skincare, packaged foods and other products that need a neat readable label.'}
        ]
      }
    },
    'kraft-paper':{
      th:{
        title:'สติกเกอร์กระดาษคราฟต์',
        detail:'กระดาษสีน้ำตาลธรรมชาติ เห็นเส้นใยบาง ๆ เหมาะกับงานที่อยากได้โทนอบอุ่นและเป็นธรรมชาติ',
        alt:'สติกเกอร์กระดาษคราฟต์ พร้อมผิวสีน้ำตาลธรรมชาติและเส้นใยกระดาษ',
        benefits:[
          'ให้บุคลิกงานดูอบอุ่น เรียบง่าย และเหมาะกับสินค้าสไตล์คราฟต์หรือโฮมเมด',
          'เส้นใยกระดาษช่วยเพิ่มพื้นผิวและความรู้สึกเป็นธรรมชาติให้กับงานพิมพ์',
          'เหมาะกับบรรจุภัณฑ์กระดาษ กล่อง ถุง และสินค้าที่ต้องการภาพลักษณ์รักษ์โลก'
        ],
        example:'เหมาะกับคาเฟ่ เบเกอรี่ งานแฮนด์เมด ของขวัญ และสินค้าที่ต้องการโทนธรรมชาติหรือออร์แกนิก โดยควรใช้งานในพื้นที่แห้ง',
        slides:[
          {src:`${tbase}/kraft-paper.webp?v=2.1.7`,label:'พื้นผิววัสดุ',note:'เห็นสีของกระดาษคราฟต์และเส้นใยบนผิววัสดุชัดเจน เหมาะกับงานที่อยากให้วัสดุเป็นส่วนหนึ่งของภาพลักษณ์แบรนด์'},
          {src:`${base}/material-selection-overview.png?v=2.1.14`,label:'ตัวอย่างโทนวัสดุจริง',note:'กระดาษคราฟต์จะมีโทนสีน้ำตาลธรรมชาติ ต่างจากกระดาษขาวและฟิล์ม จึงเหมาะกับงานที่ต้องการความอบอุ่นเป็นพิเศษ'},
          {src:`${base}/application-kraft-natural.png?v=2.1.14`,label:'ตัวอย่างลุคงานบนบรรจุภัณฑ์',note:'เมื่อจับคู่กับสินค้าโทนธรรมชาติหรือแพ็กเกจจิ้งแนวมินิมอล จะช่วยให้งานดูนุ่ม อบอุ่น และมีความเป็นงานคราฟต์มากขึ้น'}
        ]
      },
      en:{
        title:'Kraft paper stickers',
        detail:'Natural brown paper with visible fibres for warm, craft-style packaging.',
        alt:'Brown kraft paper sticker with visible fibre texture.',
        benefits:[
          'Creates a warm, natural and handmade feel.',
          'Visible paper fibres add texture and character to simple graphics.',
          'Great for paper packaging, cartons, bags and eco-inspired branding.'
        ],
        example:'Well suited to cafes, bakeries, handmade products and brands that want an organic, earthy look in dry conditions.',
        slides:[
          {src:`${tbase}/kraft-paper.webp?v=2.1.7`,label:'Material surface',note:'Shows the natural brown kraft tone and fibre texture clearly.'},
          {src:`${base}/material-selection-overview.png?v=2.1.14`,label:'Material tone in context',note:'Kraft stands apart from white and film materials with its naturally warm brown surface.'},
          {src:`${base}/application-kraft-natural.png?v=2.1.14`,label:'Packaging mood example',note:'Pairs well with natural, handmade and minimal packaging styles for a softer craft-inspired presentation.'}
        ]
      }
    },
    'pp-white':{
      th:{
        title:'สติกเกอร์ PP ขาว',
        detail:'ฟิล์ม PP ขาวทึบ ผิวเรียบ เหมาะกับฉลากที่ต้องการพื้นขาวสม่ำเสมอและความทนทานมากกว่างานกระดาษ',
        alt:'สติกเกอร์ PP สีขาวผิวเรียบพร้อมมุมลอกของวัสดุ',
        benefits:[
          'พื้นขาวเรียบสม่ำเสมอ ช่วยให้สีพิมพ์สดและรายละเอียดคมชัด',
          'ทนความชื้นกว่าสติกเกอร์กระดาษ เหมาะกับงานที่ต้องการความทนทานมากขึ้น',
          'เหมาะกับขวด กระปุก และบรรจุภัณฑ์พลาสติกหรือแก้วที่ใช้งานจริงในชีวิตประจำวัน'
        ],
        example:'เหมาะกับฉลากผลิตภัณฑ์ความงาม อาหารเสริม เครื่องดื่ม และสินค้าอื่น ๆ ที่ต้องการทั้งความสะอาดของพื้นขาวและความทนทาน',
        slides:[
          {src:`${tbase}/pp-white.webp?v=2.1.7`,label:'พื้นผิววัสดุ',note:'ฟิล์ม PP ขาวมีผิวเรียบและพื้นขาวสม่ำเสมอ ช่วยให้ลายพิมพ์ดูเด่นและสีออกคมชัด'},
          {src:`${base}/application-paper-natural.png?v=2.1.14`,label:'ตัวอย่างฉลากบนขวดและกระปุก',note:'เหมาะกับงานสินค้าประเภทสกินแคร์ เครื่องสำอาง หรือผลิตภัณฑ์ที่ต้องการฉลากดูสะอาดและพรีเมียม'},
          {src:`${base}/application-paper-premium.png?v=2.1.14`,label:'ตัวอย่างบนบรรจุภัณฑ์จริง',note:'เมื่อใช้กับขวด กล่อง และกระปุก จะได้ลุคทันสมัย เรียบร้อย และดูเป็นงานมืออาชีพ'}
        ]
      },
      en:{
        title:'White PP stickers',
        detail:'Opaque white PP film with a smooth surface for durable labels and a consistent white base.',
        alt:'White PP film sticker with a peeled-corner detail.',
        benefits:[
          'A smooth bright base helps colours print cleanly and clearly.',
          'More moisture-resistant than standard paper labels.',
          'Suitable for bottles, jars and glass or plastic packaging.'
        ],
        example:'A solid choice for beauty, food, beverage and everyday packaged products that need a white durable label.',
        slides:[
          {src:`${tbase}/pp-white.webp?v=2.1.7`,label:'Material surface',note:'White PP offers a smooth consistent base that helps artwork look crisp and bright.'},
          {src:`${base}/application-paper-natural.png?v=2.1.14`,label:'Applied on bottles and jars',note:'A good fit for skincare, cosmetics and other clean premium product presentations.'},
          {src:`${base}/application-paper-premium.png?v=2.1.14`,label:'Packaging example',note:'Looks modern and professional across bottles, cartons and packaged products.'}
        ]
      }
    },
    'pp-clear':{
      th:{
        title:'สติกเกอร์ PP ใส',
        detail:'ฟิล์ม PP ใส มองเห็นสีและพื้นผิวเดิมของบรรจุภัณฑ์ผ่านบริเวณที่ไม่ได้พิมพ์ เหมาะกับงานที่ต้องการลุคใสสะอาด',
        alt:'สติกเกอร์ PP ใสพร้อมผิวโปร่งใสและมุมลอกของแผ่นวัสดุ',
        benefits:[
          'ช่วยโชว์พื้นผิวเดิมของภาชนะหรือบรรจุภัณฑ์ ทำให้งานดูสะอาดและพรีเมียม',
          'เหมาะกับงานมินิมอลที่ต้องการให้กราฟิกดูลอยอยู่บนพื้นผิวจริง',
          'ทนความชื้นและเหมาะกับขวดใส แก้ว หรือบรรจุภัณฑ์ที่ต้องการโชว์ตัววัสดุเดิม'
        ],
        example:'เหมาะกับขวดใส กล่องใส พลาสติกใส กระจก หรือพื้นผิวที่อยากโชว์สีและพื้นผิวเดิมของตัวสินค้าไปพร้อมกับฉลาก',
        slides:[
          {src:`${tbase}/pp-clear.webp?v=2.1.7`,label:'พื้นผิววัสดุ',note:'ตัวอย่างฟิล์มใสที่เผยให้เห็นพื้นผิวด้านล่าง เหมาะกับงานที่ต้องการความโปร่งสะอาดและไม่ทึบพื้นหลัง'},
          {src:`${base}/application-clear-metal.png?v=2.1.14`,label:'ตัวอย่างบนพื้นผิวจริง',note:'เมื่อใช้งานบนพื้นผิวโลหะหรือภาชนะ จะยังคงเห็นพื้นผิวเดิมผ่านส่วนที่ไม่ได้พิมพ์ ช่วยให้งานดูเบาและทันสมัย'},
          {src:`${base}/application-clear-glass.png?v=2.1.14`,label:'ตัวอย่างเมื่อติดบนกระจก',note:'เหมาะกับกระจก ขวด หรือวัสดุใสที่ต้องการให้กราฟิกเด่น แต่ยังคงโชว์ความเป็นพื้นผิวจริงของชิ้นงาน'}
        ]
      },
      en:{
        title:'Clear PP stickers',
        detail:'Transparent PP film that keeps the original packaging surface visible through unprinted areas.',
        alt:'Clear PP film sticker showing the surface below.',
        benefits:[
          'Keeps the original package surface visible for a clean premium look.',
          'Great for minimal graphics that appear to float on the surface.',
          'Suitable for clear bottles, glass and packaging where the base surface should remain visible.'
        ],
        example:'Best for clear bottles, glass, transparent packaging and other surfaces where you want to preserve the original look beneath the label.',
        slides:[
          {src:`${tbase}/pp-clear.webp?v=2.1.7`,label:'Material surface',note:'Shows how the clear film reveals the original surface through unprinted areas.'},
          {src:`${base}/application-clear-metal.png?v=2.1.14`,label:'Applied on a real surface',note:'The transparent film keeps the underlying finish visible for a lighter modern appearance.'},
          {src:`${base}/application-clear-glass.png?v=2.1.14`,label:'Applied on glass',note:'Works well on glass and other smooth surfaces when you want artwork plus surface visibility.'}
        ]
      }
    },
    'pvc-white':{
      th:{
        title:'สติกเกอร์ PVC',
        detail:'ไวนิลขาวทึบและยืดหยุ่น เหมาะกับงานตกแต่ง ป้าย และพื้นผิวที่เจอความชื้นหรือการใช้งานหนักมากขึ้น',
        alt:'สติกเกอร์ PVC สีขาวพร้อมผิววัสดุและหยดน้ำบนพื้นผิว',
        benefits:[
          'ยืดหยุ่นและทนทาน เหมาะกับงานติดกระจก งานตกแต่งร้าน และงานใช้งานจริงที่ต้องการความแข็งแรง',
          'รองรับงานขนาดใหญ่และพื้นผิวที่ต้องมีความคงทนมากกว่างานฉลากทั่วไป',
          'เหมาะกับพื้นที่ที่อาจมีความชื้น การเช็ดทำความสะอาด หรือการสัมผัสบ่อย'
        ],
        example:'เหมาะกับกระจกหน้าร้าน ป้าย วอลล์กราฟิก สื่อประชาสัมพันธ์ และงานตกแต่งที่ต้องการความทนทานและการมองเห็นชัดเจน',
        slides:[
          {src:`${tbase}/pvc-white.webp?v=2.1.7`,label:'พื้นผิววัสดุ',note:'ตัวอย่างผิวไวนิลขาวและลักษณะวัสดุที่ออกแบบมาให้เหมาะกับงานตกแต่งและสภาพใช้งานที่ต้องการความทนทานมากขึ้น'},
          {src:`${base}/application-vinyl-window-simple.png?v=2.1.14`,label:'ตัวอย่างบนกระจกหน้าร้าน',note:'เหมาะกับงานโลโก้ งานตกแต่งกระจก และงานกราฟิกที่ต้องการให้มองเห็นชัดจากภายนอก'},
          {src:`${base}/application-vinyl-window-large.png?v=2.1.14`,label:'ตัวอย่างงานตกแต่งขนาดใหญ่',note:'เหมาะกับงานสื่อร้านค้า โปรโมชัน หรือกราฟิกขนาดใหญ่ที่ต้องการความแข็งแรงและภาพลักษณ์มืออาชีพ'}
        ]
      },
      en:{
        title:'PVC vinyl stickers',
        detail:'Durable white vinyl for decorative graphics, signage and surfaces that need extra toughness.',
        alt:'White PVC vinyl material with moisture-resistant visual cues.',
        benefits:[
          'Flexible and durable for windows, decor and more demanding real-world use.',
          'Suitable for larger graphics and tougher surfaces than standard labels.',
          'A good option where moisture, cleaning or regular contact may occur.'
        ],
        example:'Ideal for storefront windows, signage, wall graphics and promotional displays that need better durability and visibility.',
        slides:[
          {src:`${tbase}/pvc-white.webp?v=2.1.7`,label:'Material surface',note:'Shows the white vinyl surface used for more durable decorative and display applications.'},
          {src:`${base}/application-vinyl-window-simple.png?v=2.1.14`,label:'Storefront window example',note:'Useful for logo graphics, simple window decals and clear storefront communication.'},
          {src:`${base}/application-vinyl-window-large.png?v=2.1.14`,label:'Large-format application',note:'A strong fit for promotional window graphics and larger retail decoration pieces.'}
        ]
      }
    }
  };

  let activeCard=null;
  let activeContent=null;
  let activeSlides=[];
  let activeIndex=0;
  let autoTimer=null;

  const text=(id,value)=>{ const node=$(id); if(node) node.textContent=value||''; };

  const getContent=id=>{
    const entry=data[id]||{};
    return entry[lang()]||entry.th||entry.en;
  };

  function stopAuto(){
    if(autoTimer){ window.clearInterval(autoTimer); autoTimer=null; }
  }

  function startAuto(){
    stopAuto();
    if(reduceMotion || !modal?.open || activeSlides.length<2) return;
    autoTimer=window.setInterval(()=>goTo(activeIndex+1), 4600);
  }

  function renderDots(){
    dotsWrap.innerHTML='';
    activeSlides.forEach((slide,index)=>{
      const dot=doc.createElement('button');
      dot.type='button';
      dot.className='sc-material__dot'+(index===activeIndex?' is-active':'');
      dot.setAttribute('aria-label', `${slide.label} ${index+1}`);
      dot.setAttribute('aria-pressed', String(index===activeIndex));
      dot.addEventListener('click',()=>{ goTo(index); startAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  function renderSlide(){
    const slide=activeSlides[activeIndex];
    if(!slide || !activeContent) return;
    previewImage.src=slide.src;
    previewImage.alt=slide.alt || activeContent.alt || activeContent.title;
    previewTitle.textContent=activeContent.title;
    previewDetail.textContent=activeContent.detail;
    previewSlideLabel.textContent=slide.label || '';
    previewSlideCounter.textContent=`${activeIndex+1} / ${activeSlides.length}`;
    previewSlideNote.textContent=slide.note || '';
    exampleText.textContent=activeContent.example || '';
    benefitsList.innerHTML='';
    (activeContent.benefits||[]).forEach(item=>{
      const li=doc.createElement('li');
      li.textContent=item;
      benefitsList.appendChild(li);
    });
    renderDots();
  }

  function goTo(index){
    if(!activeSlides.length) return;
    activeIndex=(index+activeSlides.length)%activeSlides.length;
    renderSlide();
  }

  function openPreview(card){
    activeCard=card;
    activeContent=getContent(card.id);
    activeSlides=activeContent.slides || [];
    activeIndex=0;
    renderSlide();
    if(typeof modal.showModal==='function' && !modal.open) modal.showModal();
    closeBtn.focus();
    startAuto();
  }

  function refreshStaticCopy(){
    const th=lang()==='th';
    text('scMaterialsEyebrow', th?'วัสดุสติกเกอร์':'Sticker materials');
    text('materials-title', th?'ประเภทวัสดุที่มีให้เลือก':'Available material types');
    text('scMaterialsLead', th?'เทียบผิววัสดุทั้ง 5 แบบ ตั้งแต่กระดาษสำหรับฉลากทั่วไป ไปจนถึงฟิล์ม PP และ PVC เลือกให้เหมาะกับบรรจุภัณฑ์ พื้นผิวที่ติด และสภาพการใช้งาน':'Compare five sticker surfaces from everyday paper labels to PP and PVC films. Match the material to your packaging, application surface and usage conditions.');
    text('scMaterialsNote', th?'ภาพประกอบใช้เพื่อช่วยให้เห็นพื้นผิว ลุควัสดุ และตัวอย่างการใช้งานจริง สีและผิวสัมผัสอาจต่างจากวัสดุจริงเล็กน้อย':'These illustrations are provided to help compare surface feel, material appearance and likely real-use applications. Final colour and finish may vary slightly from actual material.');
    text('scMaterialsBenefitsTitle', th?'ข้อดีของวัสดุ':'Key benefits');
    text('scMaterialsExampleTitle', th?'ตัวอย่างการใช้งาน':'Example application');
    text('scMaterialsSlideInfoTitle', th?'รายละเอียดภาพปัจจุบัน':'Current preview');
    closeBtn.setAttribute('aria-label', th?'ปิดหน้าต่างรายละเอียดวัสดุ':'Close material preview');
    prevBtn.setAttribute('aria-label', th?'ภาพก่อนหน้า':'Previous image');
    nextBtn.setAttribute('aria-label', th?'ภาพถัดไป':'Next image');

    cards.forEach(card=>{
      const content=getContent(card.id);
      card.title.textContent=content.title;
      card.detail.textContent=content.detail;
      card.image.alt=content.alt || content.title;
      card.link.setAttribute('aria-label', th?`เปิดรายละเอียด ${content.title}`:`Open details: ${content.title}`);
    });

    if(activeCard) {
      activeContent=getContent(activeCard.id);
      activeSlides=activeContent.slides || [];
      renderSlide();
    }
  }

  cards.forEach(card=>{
    card.link.addEventListener('click',event=>{
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if(typeof modal.showModal!=='function') return;
      event.preventDefault();
      openPreview(card);
    });
  });

  prevBtn.addEventListener('click',()=>{ goTo(activeIndex-1); startAuto(); });
  nextBtn.addEventListener('click',()=>{ goTo(activeIndex+1); startAuto(); });
  closeBtn.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{ if(event.target===modal) modal.close(); });
  modal.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){ event.preventDefault(); goTo(activeIndex-1); startAuto(); }
    if(event.key==='ArrowRight'){ event.preventDefault(); goTo(activeIndex+1); startAuto(); }
  });
  modal.addEventListener('close',()=>{
    stopAuto();
    if(activeCard?.link) activeCard.link.focus();
  });

  window.addEventListener('scwork-site-updated', refreshStaticCopy);
  refreshStaticCopy();
})();
