/* Home sticker material cards with richer in-page material preview. */
(()=>{
  'use strict';
  const doc=document,root=doc.getElementById('materials');
  if(!root)return;
  const get=id=>doc.getElementById(id);
  const modal=get('scMaterialsPreview'),close=get('scMaterialsClose');
  const previewImage=get('scMaterialsPreviewImage');
  const previewTitle=get('scMaterialsPreviewTitle'),previewDetail=get('scMaterialsPreviewDetail');
  const previewSlideLabel=get('scMaterialsSlideLabel'),previewSlideCounter=get('scMaterialsSlideCounter');
  const previewSlideNote=get('scMaterialsSlideNote');
  const benefitsTitle=get('scMaterialsBenefitsTitle'),benefitsList=get('scMaterialsBenefits');
  const exampleTitle=get('scMaterialsExampleTitle'),exampleText=get('scMaterialsExampleText');
  const slideInfoTitle=get('scMaterialsSlideInfoTitle');
  const prevBtn=get('scMaterialsPrev'),nextBtn=get('scMaterialsNext'),dotsWrap=get('scMaterialsDots');

  const cards=[...root.querySelectorAll('[data-material]')].map(card=>{
    const title=card.querySelector('.sc-material__name');
    const detail=card.querySelector('.sc-material__detail');
    const link=card.querySelector('.sc-material__zoom');
    return {id:card.dataset.material,title,detail,link,img:link.querySelector('img'),en:[title.textContent,detail.textContent]};
  });

  const materialContent={
    'paper-white':{
      th:{
        title:'สติกเกอร์กระดาษ',
        detail:'กระดาษขาวผิวด้าน เหมาะกับฉลากบนกล่อง ถุง และบรรจุภัณฑ์ที่ใช้งานในที่แห้ง',
        alt:'สติกเกอร์กระดาษสีขาวผิวด้าน พร้อมมุมลอกขึ้นของแผ่นสติกเกอร์',
        benefits:[
          'คุ้มค่า เหมาะกับงานฉลากทั่วไปและงานที่ต้องการต้นทุนประหยัด',
          'ผิวด้านอ่านง่าย สีพิมพ์ดูนุ่มสบายตา และเหมาะกับงานดีไซน์เรียบสะอาด',
          'ติดได้ดีกับกล่องกระดาษ ซอง ถุง และบรรจุภัณฑ์ที่ใช้งานในพื้นที่แห้ง'
        ],
        example:'นิยมใช้เป็นฉลากสินค้า ฉลากกล่อง และสติ๊กเกอร์ข้อมูลสินค้าทั่วไป โดยเฉพาะงานบรรจุภัณฑ์ที่ไม่โดนน้ำหรือความชื้นบ่อย',
        slides:[
          {src:'./assets/images/materials/paper-white.webp?v=2.1.7',label:'พื้นผิววัสดุ',note:'โชว์ผิวกระดาษขาวด้านและลักษณะมุมลอกของสติกเกอร์ ช่วยให้เห็นเนื้อวัสดุจริงใกล้เคียงก่อนตัดสินใจ'},
          {src:'./assets/images/hero/product-labels-v218.webp?v=2.1.8',label:'ตัวอย่างฉลากสินค้า',note:'เมื่อติดบนขวด กล่อง หรือซองสินค้า จะให้ลุคสะอาด อ่านง่าย และสื่อข้อมูลได้ชัดเจน'},
          {src:'./assets/images/services/product-labels-v217.webp?v=2.1.7',label:'ตัวอย่างบนพื้นผิวจริง',note:'เหมาะกับแบรนด์ที่ต้องการฉลากเรียบง่าย ดูน่าเชื่อถือ และควบคุมงบประมาณการผลิตได้ง่าย'}
        ]
      },
      en:{
        title:'Paper stickers',
        detail:'White paper with a soft matte finish for dry packaging, boxes and bags.',
        alt:'White paper sticker surface with a peeled corner detail.',
        benefits:[
          'Cost-effective for everyday product labels and general-purpose applications.',
          'Matte surface is easy to read and gives artwork a clean, soft presentation.',
          'Works well on cartons, pouches and dry-packaging surfaces.'
        ],
        example:'Typically used for product labels, carton labels and information stickers on packaging kept in dry conditions.',
        slides:[
          {src:'./assets/images/materials/paper-white.webp?v=2.1.7',label:'Material surface',note:'Shows the matte white paper texture and peeled-corner detail so customers can compare the real material feel.'},
          {src:'./assets/images/hero/product-labels-v218.webp?v=2.1.8',label:'Product label example',note:'A clean option for bottles, cartons and packaged goods where readability matters.'},
          {src:'./assets/images/services/product-labels-v217.webp?v=2.1.7',label:'Applied on real packaging',note:'Suitable for brands that want a tidy, trustworthy look while keeping production costs efficient.'}
        ]
      }
    },
    'kraft-paper':{
      th:{
        title:'สติกเกอร์กระดาษคราฟต์',
        detail:'กระดาษสีน้ำตาลธรรมชาติ เห็นเส้นใยบาง ๆ เหมาะกับงานที่อยากได้โทนอบอุ่น',
        alt:'สติกเกอร์กระดาษคราฟต์สีน้ำตาลธรรมชาติพร้อมมุมลอกของแผ่นสติกเกอร์',
        benefits:[
          'ให้บุคลิกงานดูอบอุ่น เป็นธรรมชาติ และเหมาะกับสินค้าสไตล์โฮมเมดหรือคราฟต์',
          'เส้นใยกระดาษช่วยเพิ่มพื้นผิวและมิติให้ดีไซน์ แม้ใช้กราฟิกเรียบง่าย',
          'เหมาะกับกล่อง ถุงกระดาษ และบรรจุภัณฑ์ที่ต้องการลุครักษ์โลกหรือแฮนด์เมด'
        ],
        example:'เหมาะกับสินค้าเบเกอรี่ คาเฟ่ งานของขวัญ งานคราฟต์ และฉลากบรรจุภัณฑ์ที่ต้องการโทนธรรมชาติ โดยควรใช้งานในพื้นที่แห้ง',
        slides:[
          {src:'./assets/images/materials/kraft-paper.webp?v=2.1.7',label:'พื้นผิววัสดุ',note:'เห็นเนื้อกระดาษสีน้ำตาลธรรมชาติและเส้นใยเล็ก ๆ ชัดเจน ทำให้โทนงานดูเป็นมิตรและอบอุ่น'},
          {src:'./assets/images/quote-choices/quote-product-labels.webp?v=2.1.12',label:'ตัวอย่างฉลากสินค้า',note:'เมื่อนำไปใช้กับฉลากสินค้า ช่วยเสริมภาพลักษณ์งานคราฟต์ งานโฮมเมด และแบรนด์ที่ต้องการความเป็นธรรมชาติ'},
          {src:'./assets/images/services/product-labels-v217.webp?v=2.1.7',label:'ตัวอย่างบนพื้นผิวจริง',note:'เหมาะกับถุงกระดาษ กล่องสินค้า และแพ็กเกจจิ้งที่ต้องการลุควัสดุธรรมชาติแบบสบายตา'}
        ]
      },
      en:{
        title:'Kraft paper stickers',
        detail:'Natural brown paper with visible fibres. A warm finish for dry goods and kraft packaging.',
        alt:'Natural brown kraft paper sticker with a peeled-corner detail.',
        benefits:[
          'Warm, natural character that suits handmade and craft-style products.',
          'Visible fibres add texture and depth even with simple graphic layouts.',
          'A strong fit for paper bags, cartons and eco-inspired packaging.'
        ],
        example:'Well suited for bakery products, cafes, gift packaging and handcrafted brands used in dry conditions.',
        slides:[
          {src:'./assets/images/materials/kraft-paper.webp?v=2.1.7',label:'Material surface',note:'Shows the brown kraft texture and fibre detail for a more natural presentation.'},
          {src:'./assets/images/quote-choices/quote-product-labels.webp?v=2.1.12',label:'Product label example',note:'Works well for artisanal and homemade packaging concepts.'},
          {src:'./assets/images/services/product-labels-v217.webp?v=2.1.7',label:'Applied on real packaging',note:'A good choice for cartons and pouches that need a warm, natural look.'}
        ]
      }
    },
    'pp-white':{
      th:{
        title:'สติกเกอร์ PP ขาว',
        detail:'ฟิล์มพีพีขาวทึบ ผิวเรียบ เหมาะกับฉลากที่ต้องการพื้นขาวให้ลายพิมพ์เด่น',
        alt:'สติกเกอร์ PP ขาวผิวเรียบ พร้อมมุมลอกที่สะท้อนความเงาเล็กน้อย',
        benefits:[
          'ผิวเรียบและพื้นขาวสม่ำเสมอ ช่วยให้สีพิมพ์สด คม และดูมืออาชีพ',
          'ทนความชื้นกว่ากระดาษ เหมาะกับบรรจุภัณฑ์ที่ต้องการความทนทานมากขึ้น',
          'เหมาะกับฉลากขวดเครื่องดื่ม ผลิตภัณฑ์ความงาม และบรรจุภัณฑ์พลาสติกหรือแก้ว'
        ],
        example:'เหมาะกับฉลากขวด กระปุก และแพ็กเกจจิ้งที่ต้องการพื้นขาวสะอาด พร้อมภาพพิมพ์ชัดเจน และใช้งานได้ดีกับสินค้าในสภาพใช้งานทั่วไปถึงค่อนข้างชื้น',
        slides:[
          {src:'./assets/images/materials/pp-white.webp?v=2.1.7',label:'พื้นผิววัสดุ',note:'ผิวฟิล์มเรียบและพื้นขาวทึบ เหมาะกับงานที่ต้องการให้สีพิมพ์ขึ้นสดและรายละเอียดคมชัด'},
          {src:'./assets/images/hero/product-labels-v218.webp?v=2.1.8',label:'ตัวอย่างฉลากสินค้า',note:'ใช้กับฉลากผลิตภัณฑ์เพื่อให้ภาพลักษณ์ดูสะอาด มืออาชีพ และอ่านข้อมูลได้ชัดเจน'},
          {src:'./assets/images/labels/form-01-hero.webp?v=2.1.7',label:'ตัวอย่างบนพื้นผิวจริง',note:'นิยมใช้บนขวด แพ็กเกจจิ้งพลาสติก และงานฉลากที่ต้องการความทนทานมากกว่างานกระดาษ'}
        ]
      },
      en:{
        title:'White PP stickers',
        detail:'Smooth, opaque polypropylene film for labels that need a clean white base.',
        alt:'White PP sticker film with a smooth peeled corner.',
        benefits:[
          'Smooth white base helps printed colours appear bright, crisp and professional.',
          'More moisture-resistant than paper for tougher packaging conditions.',
          'Well suited for bottles, cosmetic containers and plastic or glass packaging.'
        ],
        example:'Best for bottles, jars and packaging that need a clean white base and a more durable finish than standard paper labels.',
        slides:[
          {src:'./assets/images/materials/pp-white.webp?v=2.1.7',label:'Material surface',note:'The opaque white film gives artwork a bright, even base for sharper print results.'},
          {src:'./assets/images/hero/product-labels-v218.webp?v=2.1.8',label:'Product label example',note:'A professional option for packaged products where clarity and polish are important.'},
          {src:'./assets/images/labels/form-01-hero.webp?v=2.1.7',label:'Applied on real packaging',note:'Often used on bottles and durable packaging labels that need extra resilience.'}
        ]
      }
    },
    'pp-clear':{
      th:{
        title:'สติกเกอร์ PP ใส',
        detail:'ฟิล์มพีพีโปร่งใส มองเห็นสีและพื้นผิวของบรรจุภัณฑ์ผ่านบริเวณที่ไม่ได้พิมพ์',
        alt:'สติกเกอร์ PP ใสพร้อมพื้นผิวโปร่งใสและมุมลอกที่เผยให้เห็นด้านล่าง',
        benefits:[
          'ช่วยให้เห็นพื้นผิวเดิมของบรรจุภัณฑ์หรือกระจก ทำให้งานดูสะอาดและทันสมัย',
          'เหมาะกับงานที่ต้องการลุคมินิมอล หรือให้กราฟิกดูเหมือนลอยอยู่บนพื้นผิวจริง',
          'ทนความชื้นและเหมาะกับงานฉลากใส งานตกแต่งกระจก หรือบรรจุภัณฑ์โปร่งใส'
        ],
        example:'ใช้ได้ดีกับขวดใส แก้ว พลาสติกใส หรือกระจกหน้าร้าน โดยเฉพาะงานที่ต้องการโชว์สีหรือเนื้อวัสดุของพื้นผิวเดิม',
        slides:[
          {src:'./assets/images/materials/pp-clear.webp?v=2.1.7',label:'พื้นผิววัสดุ',note:'ตัวฟิล์มใสเผยให้เห็นพื้นผิวด้านล่างได้ชัด เหมาะกับงานที่ต้องการลุคโปร่งสะอาด'},
          {src:'./assets/images/hero/retail-vinyl-v218.webp?v=2.1.8',label:'ตัวอย่างเมื่อติดบนกระจก',note:'ช่วยให้กราฟิกเด่นขึ้นโดยไม่บังภาพรวมของพื้นผิวกระจก เหมาะกับงานโปรโมชันและงานตกแต่งหน้าร้าน'},
          {src:'./assets/images/services/window-graphics-v217.webp?v=2.1.7',label:'ตัวอย่างบนพื้นผิวจริง',note:'เหมาะกับงานฉลากใส งานกระจก และงานตกแต่งที่ต้องการความเรียบหรูแบบมินิมอล'}
        ]
      },
      en:{
        title:'Clear PP stickers',
        detail:'Transparent polypropylene film that lets the packaging colour and texture show through.',
        alt:'Clear PP sticker film showing the surface beneath through the transparent area.',
        benefits:[
          'Lets the original packaging or glass surface remain visible for a clean modern look.',
          'Ideal for minimal label designs where the graphics appear to float on the surface.',
          'Moisture-resistant and suitable for clear labels, glass graphics and transparent packaging.'
        ],
        example:'A strong fit for clear bottles, plastic containers and storefront glass where you want to preserve the original surface appearance.',
        slides:[
          {src:'./assets/images/materials/pp-clear.webp?v=2.1.7',label:'Material surface',note:'The transparent film keeps the underlying material visible for a clean, minimal effect.'},
          {src:'./assets/images/hero/retail-vinyl-v218.webp?v=2.1.8',label:'Applied on glass',note:'The graphics remain visible while the glass surface still reads clearly overall.'},
          {src:'./assets/images/services/window-graphics-v217.webp?v=2.1.7',label:'Applied on real surfaces',note:'Suitable for clear labels, glass graphics and premium minimalist decoration.'}
        ]
      }
    },
    'pvc-white':{
      th:{
        title:'สติกเกอร์ PVC',
        detail:'ไวนิลขาวทึบและยืดหยุ่น เหมาะกับงานตกแต่งและพื้นผิวที่สัมผัสความชื้น',
        alt:'สติกเกอร์ PVC สีขาว พร้อมหยดน้ำบนผิวและมุมลอกของแผ่นสติกเกอร์',
        benefits:[
          'ยืดหยุ่นและทนทาน เหมาะกับงานใช้งานจริงที่ต้องเจอการเช็ดถูหรือความชื้น',
          'เหมาะกับงานตกแต่งร้าน งานติดกระจก ป้าย หรือพื้นผิวที่ต้องการความแข็งแรงมากขึ้น',
          'ช่วยให้งานกราฟิกดูโดดเด่นบนพื้นผิวขนาดใหญ่ และรองรับการใช้งานระยะยาวได้ดี'
        ],
        example:'เหมาะกับกระจกหน้าร้าน ป้าย งานตกแต่งผนัง หรือพื้นผิวที่มีโอกาสโดนน้ำและสัมผัสบ่อย เพราะตัววัสดุยืดหยุ่นและดูแลง่าย',
        slides:[
          {src:'./assets/images/materials/pvc-white.webp?v=2.1.7',label:'พื้นผิววัสดุ',note:'ฟิล์มไวนิลขาวทึบให้ผิวที่ดูแข็งแรง พร้อมภาพประกอบหยดน้ำสื่อถึงการใช้งานที่ทนความชื้นมากขึ้น'},
          {src:'./assets/images/hero/retail-vinyl-v218.webp?v=2.1.8',label:'ตัวอย่างตกแต่งร้าน',note:'เมื่อติดบนกระจกหรือพื้นที่ตกแต่งร้าน จะช่วยให้กราฟิกเด่น มองเห็นง่าย และสร้างภาพลักษณ์แบรนด์ได้ชัด'},
          {src:'./assets/images/services/window-graphics-v217.webp?v=2.1.7',label:'ตัวอย่างบนพื้นผิวจริง',note:'เหมาะกับงานป้าย งานกระจก และงานตกแต่งที่ต้องการความทนทานและภาพลักษณ์มืออาชีพ'}
        ]
      },
      en:{
        title:'PVC vinyl stickers',
        detail:'Opaque, flexible vinyl often used for decals and surfaces exposed to moisture.',
        alt:'White PVC vinyl sticker with water droplets and a peeled-corner detail.',
        benefits:[
          'Flexible and durable for everyday surfaces that may be wiped or exposed to moisture.',
          'Ideal for windows, decals, signs and decorative graphics that need extra toughness.',
          'Helps graphics stand out on larger surfaces and supports longer-term use.'
        ],
        example:'Best for storefront glass, signs, wall decoration and other surfaces that may face moisture or regular handling.',
        slides:[
          {src:'./assets/images/materials/pvc-white.webp?v=2.1.7',label:'Material surface',note:'The opaque white vinyl conveys a stronger, more durable surface with better moisture tolerance.'},
          {src:'./assets/images/hero/retail-vinyl-v218.webp?v=2.1.8',label:'Retail decoration example',note:'Works well for storefront graphics and decorative applications where visibility matters.'},
          {src:'./assets/images/services/window-graphics-v217.webp?v=2.1.7',label:'Applied on real surfaces',note:'A professional choice for decals, signs and display graphics that need more durability.'}
        ]
      }
    }
  };

  let activeCard=null,activeData=null,currentSlide=0,autoTimer=null;
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isThai=()=>doc.documentElement.lang.toLowerCase().split('-')[0]==='th';

  function getContent(id){
    const entry=materialContent[id]||{};
    return isThai()?entry.th||entry.en:entry.en||entry.th;
  }

  function stopAuto(){
    if(autoTimer){window.clearInterval(autoTimer);autoTimer=null;}
  }
  function startAuto(){
    stopAuto();
    if(reduceMotion||!activeData||!activeData.slides||activeData.slides.length<2)return;
    autoTimer=window.setInterval(()=>goToSlide(currentSlide+1),4200);
  }
  function resetAuto(){ if(activeCard) startAuto(); }

  function renderDots(){
    if(!dotsWrap||!activeData)return;
    dotsWrap.innerHTML='';
    activeData.slides.forEach((slide,index)=>{
      const dot=doc.createElement('button');
      dot.type='button';
      dot.className='sc-material__dot'+(index===currentSlide?' is-active':'');
      dot.setAttribute('aria-label',`${slide.label} ${index+1}`);
      dot.setAttribute('aria-pressed',String(index===currentSlide));
      dot.addEventListener('click',()=>{goToSlide(index);resetAuto();});
      dotsWrap.appendChild(dot);
    });
  }

  function renderSlide(){
    if(!activeCard||!activeData)return;
    const slides=activeData.slides||[];
    const total=slides.length||1;
    const slide=slides[currentSlide]||slides[0];
    if(!slide)return;
    previewImage.src=slide.src;
    previewImage.alt=slide.alt||activeData.alt||activeCard.img.alt;
    previewTitle.textContent=activeData.title||activeCard.title.textContent;
    previewDetail.textContent=activeData.detail||activeCard.detail.textContent;
    previewSlideLabel.textContent=slide.label||'';
    previewSlideCounter.textContent=`${currentSlide+1} / ${total}`;
    previewSlideNote.textContent=slide.note||'';
    benefitsList.innerHTML='';
    (activeData.benefits||[]).forEach(item=>{
      const li=doc.createElement('li');
      li.textContent=item;
      benefitsList.appendChild(li);
    });
    exampleText.textContent=activeData.example||'';
    renderDots();
  }

  function goToSlide(index){
    if(!activeData||!activeData.slides||!activeData.slides.length)return;
    const total=activeData.slides.length;
    currentSlide=(index+total)%total;
    renderSlide();
  }

  function drawPreview(card){
    activeCard=card;
    activeData=getContent(card.id);
    currentSlide=0;
    renderSlide();
    startAuto();
  }

  function setStaticLabels(){
    const th=isThai();
    get('scMaterialsEyebrow').textContent=th?'วัสดุสติกเกอร์':'Sticker materials';
    get('materials-title').textContent=th?'ประเภทวัสดุที่มีให้เลือก':'Explore sticker materials';
    get('scMaterialsLead').textContent=th?'เทียบผิววัสดุทั้ง 5 แบบ ตั้งแต่กระดาษสำหรับฉลากทั่วไป ไปจนถึงฟิล์ม PP และ PVC เลือกให้เหมาะกับบรรจุภัณฑ์ พื้นผิวที่ติด และสภาพการใช้งาน':'Compare five surfaces side by side, from everyday paper labels to PP and PVC films. Choose a finish that suits your packaging, surface and conditions of use.';
    get('scMaterialsNote').textContent=th?'ภาพจำลองเพื่อเปรียบเทียบพื้นผิว สีและความเงาอาจต่างจากวัสดุจริง':'Images illustrate surface and finish. The supplied material may vary in colour and sheen.';
    close.setAttribute('aria-label',th?'ปิดหน้าต่างแสดงรายละเอียดวัสดุ':'Close material preview');
    prevBtn.setAttribute('aria-label',th?'ภาพก่อนหน้า':'Previous image');
    nextBtn.setAttribute('aria-label',th?'ภาพถัดไป':'Next image');
    if(dotsWrap)dotsWrap.setAttribute('aria-label',th?'สไลด์ภาพตัวอย่างวัสดุ':'Material preview slider');
    slideInfoTitle.textContent=th?'รายละเอียดภาพปัจจุบัน':'Current preview';
    benefitsTitle.textContent=th?'ข้อดีของวัสดุ':'Key benefits';
    exampleTitle.textContent=th?'ตัวอย่างการใช้งาน':'Example application';
    for(const card of cards){
      const content=getContent(card.id);
      card.title.textContent=content.title;
      card.detail.textContent=content.detail;
      card.img.alt=content.alt||`${content.title}`;
      card.link.setAttribute('aria-label',th?`เปิดรายละเอียด ${content.title}`:`Open details: ${content.title}`);
    }
    if(activeCard)drawPreview(activeCard);
  }

  for(const card of cards){
    card.link.addEventListener('click',event=>{
      if(typeof modal.showModal!=='function'||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      drawPreview(card);
      if(!modal.open)modal.showModal();
      close.focus();
    });
  }

  prevBtn.addEventListener('click',()=>{goToSlide(currentSlide-1);resetAuto();});
  nextBtn.addEventListener('click',()=>{goToSlide(currentSlide+1);resetAuto();});
  close.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  modal.addEventListener('keydown',event=>{
    if(!activeCard)return;
    if(event.key==='ArrowLeft'){event.preventDefault();goToSlide(currentSlide-1);resetAuto();}
    if(event.key==='ArrowRight'){event.preventDefault();goToSlide(currentSlide+1);resetAuto();}
  });
  modal.addEventListener('close',()=>{
    stopAuto();
    activeCard?.link.focus();
    activeCard=null;
    activeData=null;
    currentSlide=0;
  });
  window.addEventListener('scwork-site-updated',setStaticLabels);
  setStaticLabels();
})();
