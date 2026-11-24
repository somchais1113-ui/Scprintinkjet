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
  const previewViewer=previewImage?.closest('.sc-material__viewer');
  const previewContent=modal?.querySelector('.sc-material__content');
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
          {src:`${base}/application-paper-premium.png?v=2.1.15`,label:'ตัวอย่างฉลากบนบรรจุภัณฑ์',note:'เมื่อใช้กับขวด กล่อง หรือกระปุก จะให้ภาพลักษณ์สะอาด น่าเชื่อถือ และเหมาะกับงานสินค้าทั่วไป'},
          {src:`${base}/application-paper-natural.png?v=2.1.15`,label:'ตัวอย่างงานบนพื้นผิวจริง',note:'เหมาะกับฉลากสินค้าที่ต้องการการอ่านง่ายและลุคเรียบร้อย เช่น กลุ่มสกินแคร์ อาหารแห้ง และสินค้าทั่วไป'}
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
          {src:`${base}/application-paper-premium.png?v=2.1.15`,label:'Applied on packaging',note:'Paper labels give bottles, cartons and jars a clean and trustworthy presentation.'},
          {src:`${base}/application-paper-natural.png?v=2.1.15`,label:'Real-use example',note:'Useful for dry goods, skincare, packaged foods and other products that need a neat readable label.'}
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
          {src:`${base}/material-selection-overview.png?v=2.1.15`,label:'ตัวอย่างโทนวัสดุจริง',note:'กระดาษคราฟต์จะมีโทนสีน้ำตาลธรรมชาติ ต่างจากกระดาษขาวและฟิล์ม จึงเหมาะกับงานที่ต้องการความอบอุ่นเป็นพิเศษ'},
          {src:`${base}/application-kraft-natural.png?v=2.1.15`,label:'ตัวอย่างลุคงานบนบรรจุภัณฑ์',note:'เมื่อจับคู่กับสินค้าโทนธรรมชาติหรือแพ็กเกจจิ้งแนวมินิมอล จะช่วยให้งานดูนุ่ม อบอุ่น และมีความเป็นงานคราฟต์มากขึ้น'}
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
          {src:`${base}/material-selection-overview.png?v=2.1.15`,label:'Material tone in context',note:'Kraft stands apart from white and film materials with its naturally warm brown surface.'},
          {src:`${base}/application-kraft-natural.png?v=2.1.15`,label:'Packaging mood example',note:'Pairs well with natural, handmade and minimal packaging styles for a softer craft-inspired presentation.'}
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
          {src:`${base}/application-paper-natural.png?v=2.1.15`,label:'ตัวอย่างฉลากบนขวดและกระปุก',note:'เหมาะกับงานสินค้าประเภทสกินแคร์ เครื่องสำอาง หรือผลิตภัณฑ์ที่ต้องการฉลากดูสะอาดและพรีเมียม'},
          {src:`${base}/application-paper-premium.png?v=2.1.15`,label:'ตัวอย่างบนบรรจุภัณฑ์จริง',note:'เมื่อใช้กับขวด กล่อง และกระปุก จะได้ลุคทันสมัย เรียบร้อย และดูเป็นงานมืออาชีพ'}
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
          {src:`${base}/application-paper-natural.png?v=2.1.15`,label:'Applied on bottles and jars',note:'A good fit for skincare, cosmetics and other clean premium product presentations.'},
          {src:`${base}/application-paper-premium.png?v=2.1.15`,label:'Packaging example',note:'Looks modern and professional across bottles, cartons and packaged products.'}
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
          {src:`${base}/application-clear-metal.png?v=2.1.15`,label:'ตัวอย่างบนพื้นผิวจริง',note:'เมื่อใช้งานบนพื้นผิวโลหะหรือภาชนะ จะยังคงเห็นพื้นผิวเดิมผ่านส่วนที่ไม่ได้พิมพ์ ช่วยให้งานดูเบาและทันสมัย'},
          {src:`${base}/application-clear-glass.png?v=2.1.15`,label:'ตัวอย่างเมื่อติดบนกระจก',note:'เหมาะกับกระจก ขวด หรือวัสดุใสที่ต้องการให้กราฟิกเด่น แต่ยังคงโชว์ความเป็นพื้นผิวจริงของชิ้นงาน'}
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
          {src:`${base}/application-clear-metal.png?v=2.1.15`,label:'Applied on a real surface',note:'The transparent film keeps the underlying finish visible for a lighter modern appearance.'},
          {src:`${base}/application-clear-glass.png?v=2.1.15`,label:'Applied on glass',note:'Works well on glass and other smooth surfaces when you want artwork plus surface visibility.'}
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
          {src:`${base}/application-vinyl-window-simple.png?v=2.1.15`,label:'ตัวอย่างบนกระจกหน้าร้าน',note:'เหมาะกับงานโลโก้ งานตกแต่งกระจก และงานกราฟิกที่ต้องการให้มองเห็นชัดจากภายนอก'},
          {src:`${base}/application-vinyl-window-large.png?v=2.1.15`,label:'ตัวอย่างงานตกแต่งขนาดใหญ่',note:'เหมาะกับงานสื่อร้านค้า โปรโมชัน หรือกราฟิกขนาดใหญ่ที่ต้องการความแข็งแรงและภาพลักษณ์มืออาชีพ'}
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
          {src:`${base}/application-vinyl-window-simple.png?v=2.1.15`,label:'Storefront window example',note:'Useful for logo graphics, simple window decals and clear storefront communication.'},
          {src:`${base}/application-vinyl-window-large.png?v=2.1.15`,label:'Large-format application',note:'A strong fit for promotional window graphics and larger retail decoration pieces.'}
        ]
      }
    },
    'vinyl-banner':{
      th:{
        title:'ไวนิล (งานป้าย / แบนเนอร์)',
        detail:'แผ่นไวนิลเคลือบ PVC สำหรับงานป้ายและสื่อพิมพ์ขนาดใหญ่ โดยทั่วไปเป็นวัสดุแบบไม่มีกาว ต่างจากสติกเกอร์ PVC',
        alt:'ม้วนแผ่นไวนิลแบนเนอร์สีขาวพร้อมพื้นผิวและชั้นเสริมแรงด้านหลัง',
        benefits:[
          'เหมาะกับป้ายโปรโมชัน แบนเนอร์ และงานสื่อสารที่ต้องการพื้นที่แสดงผลขนาดใหญ่',
          'สามารถเลือกวิธีเก็บขอบ เจาะตาไก่ หรือขึงเข้ากับโครงสร้างตามหน้างานได้',
          'คุณสมบัติด้านความแข็งแรง แสงแดด ลม และอายุการใช้งานขึ้นอยู่กับเกรดไวนิล หมึก และวิธีติดตั้ง'
        ],
        example:'เหมาะกับป้ายหน้าร้าน แบนเนอร์อีเวนต์ ป้ายโปรโมชั่น และงานสื่อขนาดใหญ่ ไม่ใช่ตัวเลือกสำหรับติดลงพื้นผิวโดยตรงเหมือนสติกเกอร์ PVC มีกาว',
        slides:[
          {src:`${tbase}/vinyl-banner.webp?v=2.1.27`,label:'ผิววัสดุไวนิลแบนเนอร์',note:'ภาพตัวอย่างแผ่นไวนิลแบบม้วน เห็นผิวด้านหน้าและชั้นเสริมแรงด้านหลัง ไม่ใช่สติกเกอร์มีกาว'},
          {src:'./assets/images/material-preview/v216/vinyl-banner-printed.webp?v=2.1.27',label:'การพิมพ์งานขนาดใหญ่',note:'ภาพสาธิตกระบวนการพิมพ์ดิจิทัลขนาดใหญ่ ไม่ใช้ยืนยันประเภทหรือเกรดของแผ่นไวนิลจริง'},
          {src:'./assets/images/material-preview/v216/vinyl-banner-product.webp?v=2.1.27',label:'ภาพจำลองแบนเนอร์ติดตั้ง',note:'Mockup แสดงป้ายแบบเก็บขอบและเจาะตาไก่ ควรตรวจโครงสร้าง แรงลม ตำแหน่งติดตั้ง และสเปกวัสดุก่อนผลิต'}
        ]
      },
      en:{
        title:'Vinyl banner (PVC flex)',
        detail:'PVC-coated flexible banner material for large-format signs and displays. Usually non-adhesive, unlike self-adhesive PVC stickers.',
        alt:'White roll of PVC-coated flexible banner stock showing its reinforced backing',
        benefits:[
          'Suitable for promotional banners, signs and large display graphics.',
          'Can be hemmed, fitted with eyelets or mounted to an appropriate frame depending on site requirements.',
          'Strength, weathering and expected service life depend on the actual grade, inks, finishing and installation.'
        ],
        example:'Useful for storefront banners, events and promotional signs. Unlike adhesive PVC sticker film, regular flex banner is not intended to stick directly onto a surface.',
        slides:[
          {src:`${tbase}/vinyl-banner.webp?v=2.1.27`,label:'Banner stock surface',note:'Illustrative roll of flexible banner media showing the surface and reinforced backing. Not a self-adhesive film.'},
          {src:'./assets/images/material-preview/v216/vinyl-banner-printed.webp?v=2.1.27',label:'Large-format printing process',note:'Illustrative wide-format printing scene; the photograph does not certify the exact substrate grade.'},
          {src:'./assets/images/material-preview/v216/vinyl-banner-product.webp?v=2.1.27',label:'Finished banner mockup',note:'Illustrative hemmed banner with eyelets. Confirm mounting, wind load and the real media specification before production.'}
        ]
      }
    }
  };

  // Version 2.1.16: image slots are intentionally explicit, one trio per material.
  // Each image used for a product application is a visual mockup/reference, not a customer claim.
  const refBase='./assets/images/material-preview/v216/';
  const trios={
    'paper-white':{
      process:'paper-white-printed.webp',product:'paper-white-product.webp',
      th:[
        'ผิววัสดุ: กระดาษขาวด้าน','งานพิมพ์และไดคัทบนกระดาษ','ตัวอย่างฉลากกระดาษบนสินค้า',
        'เห็นเนื้อกระดาษขาวด้านและขอบลอก ช่วยเปรียบเทียบลักษณะผิวก่อนเลือกวัสดุ',
        'ตัวอย่างฉลากที่พิมพ์บนสติกเกอร์กระดาษสีขาวและไดคัทเป็นชิ้น เห็นพื้นขาวด้านและขอบฉลาก',
        'ภาพจำลองการนำฉลากกระดาษสีขาวติดบนขวดและกระปุก ใช้กับงานบรรจุภัณฑ์ในพื้นที่แห้ง'
      ],
      en:[
        'Material: matte white paper','Printed and die-cut paper labels','Paper labels on products',
        'Examine the matte paper texture and peeled corner before choosing a stock.',
        'Printed white-paper labels after die cutting, with visible matte surface and label edges.',
        'Illustrative packaging mockup with white paper labels on bottles and jars for dry use.'
      ]
    },
    'kraft-paper':{
      process:'kraft-paper-printed.webp',product:'kraft-paper-product.webp',
      th:[
        'ผิววัสดุ: กระดาษคราฟต์','งานพิมพ์บนฉลากคราฟต์จริง','ตัวอย่างฉลากคราฟต์บนสินค้า',
        'สีน้ำตาลและเส้นใยธรรมชาติของกระดาษคราฟต์ ให้ลุคอบอุ่นที่แตกต่างจากฟิล์มใส',
        'ฉลากกระดาษคราฟต์สีน้ำตาลพิมพ์ลายสีเข้ม แสดงลักษณะงานพิมพ์ที่คงสีพื้นของวัสดุ',
        'ภาพจำลองถุงกาแฟและกล่องเบเกอรี่ที่ติดฉลากคราฟต์สีน้ำตาล เหมาะกับสินค้าสไตล์คราฟต์'
      ],
      en:[
        'Material: natural kraft paper','Printing on brown kraft labels','Kraft labels on retail goods',
        'Natural brown colour and visible fibres create a warmer finish than clear film.',
        'Brown kraft labels with dark artwork that retains the stock’s natural base colour.',
        'Illustrative kraft labels on a coffee bag and bakery carton.'
      ]
    },
    'pp-white':{
      process:'pp-white-printed.webp',product:'pp-white-product.webp',
      th:[
        'ผิววัสดุ: PP ขาวทึบ','รูปแบบงานพิมพ์บนฟิล์มขาว','ตัวอย่างฉลาก PP ขาวบนสินค้า',
        'ฟิล์ม PP ขาวทึบผิวเรียบ ให้พื้นสีขาวสม่ำเสมอและทนความชื้นกว่ากระดาษ',
        'ภาพตัวอย่างฉลากขาวผิวเรียบที่พิมพ์และไดคัท โดยภาพอย่างเดียวไม่สามารถยืนยันเกรดฟิล์มได้',
        'ภาพจำลองฉลากขาวทึบบนขวดแก้วและกล่องผลิตภัณฑ์ ใช้สื่อรูปแบบงาน PP ขาว'
      ],
      en:[
        'Material: opaque white PP','Printed white film label layout','Opaque white film on products',
        'Smooth opaque PP offers an even white base and better moisture tolerance than paper.',
        'Example of printed and die-cut smooth white labels; film grade cannot be verified from imagery alone.',
        'Illustrative opaque white labels on bottles and packaging, showing how white PP can look.'
      ]
    },
    'pp-clear':{
      process:'pp-clear-printed.webp',product:'pp-clear-product.webp',
      th:[
        'ผิววัสดุ: PP ใส','ลักษณะฟิล์มใสก่อนใช้งาน','ตัวอย่างฟิล์มใสบนกระจก',
        'บริเวณที่ไม่พิมพ์ยังมองเห็นพื้นผิวด้านล่าง เหมาะกับงานที่ต้องการโชว์เนื้อภาชนะ',
        'ภาพเปรียบเทียบชั้นฟิล์มใสกับแผ่นขาว แสดงความโปร่งใสของวัสดุและขอบฟิล์มที่ลอกออก',
        'ภาพสาธิตลุคงานพิมพ์สีขาวบนพื้นกระจกใสเพื่อแสดงส่วนโปร่งใส เป็นภาพประกอบ ไม่ได้ยืนยันชนิดฟิล์มหรือการรองรับหมึกขาวของเครื่อง'
      ],
      en:[
        'Material: clear PP','Transparent-film handling detail','Transparent look on glass',
        'Unprinted areas reveal the underlying surface, ideal for a subtle package label.',
        'A clear film compared alongside opaque stock, showing transparency and a peeled edge.',
        'Illustrative clear-surface appearance with opaque white artwork on glass. This reference does not verify film grade or white-ink capability.'
      ]
    },
    'pvc-white':{
      process:'pvc-white-printed.webp',product:'pvc-white-product.webp',
      th:[
        'ผิววัสดุ: PVC ขาว','งานพิมพ์ไวนิลขนาดใหญ่','ตัวอย่างงาน PVC ตกแต่งร้าน',
        'ไวนิลขาวทึบมีความยืดหยุ่น เหมาะกับงานตกแต่งและพื้นที่ที่ต้องรับความชื้นมากขึ้น',
        'ภาพขั้นตอนพิมพ์กราฟิกขนาดใหญ่บนแผ่นไวนิลสำหรับงานติดตั้งและตกแต่งพื้นที่',
        'ภาพจำลองงานกราฟิกหน้าร้านและสติกเกอร์กระจกขนาดใหญ่ แสดงรูปแบบการใช้งานของ PVC'
      ],
      en:[
        'Material: opaque PVC vinyl','Wide-format vinyl printing','PVC graphics on storefronts',
        'Flexible, opaque vinyl is well suited to signage and more demanding display applications.',
        'Large-format vinyl graphics in production for signage and applied graphics.',
        'Illustrative retail window branding and large applied graphics demonstrating typical PVC use.'
      ]
    }
  };
  // Override only the examples, not the pricing data, material properties or existing home cards.
  Object.entries(trios).forEach(([id,entry])=>{
    for(const language of ['th','en']){
      const content=data[id]?.[language];
      if(!content || content.slides?.length!==3) continue;
      const copy=entry[language];
      content.slides=[
        {...content.slides[0],label:copy[0],note:copy[3],kind:'surface'},
        {src:refBase+entry.process+'?v=2.1.16',label:copy[1],note:copy[4],kind:'printed'},
        {src:refBase+entry.product+'?v=2.1.16',label:copy[2],note:copy[5],kind:'product'}
      ];
    }
  });

  let activeCard=null;
  let activeData=null;
  let activeSlides=[];
  let activeIndex=0;
  let currentLayer=0;
  let transitionBusy=false;
  let transitionId=0;
  let autoTimer=null;
  let hoverPause=false;
  let focusPause=false;
  let userInteractedAt=0;
  const layers=[previewImage,$('scMaterialsIncomingImage')];
  const stage=$('scMaterialsImageStage');
  const imageReadyCache=new Map();
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const text=(id,value)=>{const node=$(id);if(node)node.textContent=value||'';};
  const getContent=id=>data[id]?.[lang()] || data[id]?.th;
  const sleep=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));
  const slideKey=slide=>slide?.src||'';

  // Preload BEFORE starting crossfade: never show a blank intermediate frame.
  function preload(src){
    if(!src)return Promise.resolve(false);
    if(!imageReadyCache.has(src)){
      const promise=new Promise(resolve=>{
        const img=new Image();
        let settled=false;
        const done=success=>{if(settled)return;settled=true;resolve(success);};
        img.onload=()=>done(true);
        img.onerror=()=>done(false);
        img.src=src;
        if(img.complete&&img.naturalWidth)done(true);
        window.setTimeout(()=>done(false),8000);
      });
      imageReadyCache.set(src,promise);
    }
    return imageReadyCache.get(src);
  }
  function preloadAdjacent(){
    if(!activeSlides.length)return;
    const a=activeSlides[(activeIndex+1)%activeSlides.length];
    const b=activeSlides[(activeIndex-1+activeSlides.length)%activeSlides.length];
    preload(slideKey(a));preload(slideKey(b));
  }
  function stopAuto(){if(autoTimer){window.clearTimeout(autoTimer);autoTimer=null;}}
  function scheduleAuto(delay=5400){
    stopAuto();
    if(!modal.open || reducedMotion?.matches || hoverPause || focusPause || doc.hidden || !activeCard)return;
    autoTimer=window.setTimeout(()=>{if(!transitionBusy)navigate(activeIndex+1,1,false);else scheduleAuto(800);},delay);
  }
  function setBusy(busy){
    transitionBusy=busy;
    prevBtn.disabled=busy;nextBtn.disabled=busy;
    dotsWrap.querySelectorAll('button').forEach(b=>b.disabled=busy);
  }
  function makeDots(){
    dotsWrap.replaceChildren();
    activeSlides.forEach((slide,i)=>{
      const btn=doc.createElement('button');
      btn.type='button';btn.className='sc-material__dot';
      btn.addEventListener('click',()=>navigate(i,(i>=activeIndex?1:-1),true));
      dotsWrap.append(btn);
    });
  }
  function updateDots(){
    [...dotsWrap.children].forEach((dot,i)=>{
      const selected=i===activeIndex;
      dot.classList.toggle('is-active',selected);
      dot.setAttribute('aria-pressed',String(selected));
      dot.setAttribute('aria-label',`${activeSlides[i]?.label || ''} ${i+1} / ${activeSlides.length}`);
    });
  }
  function updateCopy(){
    if(!activeData)return;
    const slide=activeSlides[activeIndex];
    previewTitle.textContent=activeData.title;
    previewDetail.textContent=activeData.detail;
    previewSlideLabel.textContent=slide?.label||'';
    previewSlideCounter.textContent=`${activeIndex+1} / ${activeSlides.length}`;
    previewSlideNote.textContent=slide?.note||'';
    exampleText.textContent=activeData.example||'';
    benefitsList.replaceChildren(...(activeData.benefits||[]).map(item=>{
      const li=doc.createElement('li');li.textContent=item;return li;
    }));
    updateDots();
  }
  function resetTransition(){
    ++transitionId;
    stage.classList.remove('is-crossfading');
    previewContent?.classList.remove('is-crossfading');
    stage.style.removeProperty('--sc-material-enter-x');
    stage.style.removeProperty('--sc-material-exit-x');
    for(const layer of layers){
      layer.classList.remove('is-incoming','is-outgoing');
      layer.classList.toggle('is-current',layer===layers[currentLayer]);
    }
    setBusy(false);
  }
  function setInitialSlide(){
    resetTransition();
    currentLayer=0;
    const slide=activeSlides[activeIndex];
    layers.forEach((layer,i)=>{
      layer.className='sc-material__image-layer'+(i===0?' is-current':'');
      if(i===0){layer.src=slide?.src||'';layer.alt=slide?.label||activeData?.title||'';layer.removeAttribute('aria-hidden');}
      else{layer.setAttribute('aria-hidden','true');layer.removeAttribute('src');layer.alt='';}
    });
    makeDots();updateCopy();preloadAdjacent();
  }
  async function navigate(index,direction=1,manual=true){
    if(!modal.open || transitionBusy || !activeCard || !activeSlides.length)return;
    const next=(index+activeSlides.length)%activeSlides.length;
    if(next===activeIndex){if(manual)scheduleAuto(7600);return;}
    stopAuto();
    if(manual)userInteractedAt=Date.now();
    const nextSlide=activeSlides[next];
    const token=++transitionId;
    setBusy(true);
    const loaded=await preload(slideKey(nextSlide));
    if(token!==transitionId||!modal.open)return;
    if(!loaded){setBusy(false);scheduleAuto(7600);return;}
    const incomingIndex=1-currentLayer;
    const outgoing=layers[currentLayer];
    const incoming=layers[incomingIndex];
    incoming.src=nextSlide.src;
    incoming.alt=nextSlide.label||activeData?.title||'';
    incoming.setAttribute('aria-hidden','true');
    incoming.className='sc-material__image-layer is-incoming';
    outgoing.className='sc-material__image-layer is-outgoing';
    stage.style.setProperty('--sc-material-enter-x',(direction>=0?28:-28)+'px');
    stage.style.setProperty('--sc-material-exit-x',(direction>=0?-18:18)+'px');
    if(reducedMotion?.matches){
      activeIndex=next;currentLayer=incomingIndex;
      resetTransition();updateCopy();preloadAdjacent();scheduleAuto();return;
    }
    // Ensure the incoming layer's opacity:0 state is painted before starting.
    void incoming.offsetWidth;
    await new Promise(resolve=>window.requestAnimationFrame(()=>window.requestAnimationFrame(resolve)));
    if(token!==transitionId||!modal.open)return;
    stage.classList.add('is-crossfading');
    previewContent?.classList.add('is-crossfading');
    await sleep(230);
    if(token!==transitionId||!modal.open)return;
    activeIndex=next;updateCopy();
    await sleep(520);
    if(token!==transitionId||!modal.open)return;
    currentLayer=incomingIndex;
    resetTransition();
    layers[currentLayer].removeAttribute('aria-hidden');
    layers[1-currentLayer].setAttribute('aria-hidden','true');
    preloadAdjacent();
    scheduleAuto(manual?7600:5400);
  }
  function openPreview(card){
    activeCard=card;
    activeData=getContent(card.id);
    activeSlides=activeData?.slides||[];
    activeIndex=0;currentLayer=0;
    if(!activeSlides.length)return;
    if(!modal.open)modal.showModal();
    setInitialSlide();
    closeBtn.focus({preventScroll:true});
    scheduleAuto();
  }
  function refreshStaticCopy(){
    const th=lang()==='th';
    text('scMaterialsEyebrow',th?'วัสดุสติกเกอร์และงานป้าย':'Sticker and banner materials');
    text('materials-title',th?'วัสดุงานพิมพ์ 6 ประเภท':'Six print material types');
    text('scMaterialsLead',th?'เปรียบเทียบผิววัสดุ งานพิมพ์ และตัวอย่างการใช้งานทั้ง 6 ประเภท รวมถึงไวนิลสำหรับงานป้าย เพื่อเลือกให้เหมาะกับงานจริง':'Compare material surfaces, printed examples and applications across six materials, including banner vinyl.');
    text('scMaterialsNote',th?'ภาพที่แสดงเป็นตัวอย่างและภาพจำลองสำหรับช่วยเลือกวัสดุ ไม่ใช่ผลงานลูกค้าจริง และไม่ใช้ยืนยันสเปกหรือคุณสมบัติของวัสดุโดยลำพัง':'Visual references and illustrative mockups, not actual customer projects. Images alone cannot certify a material specification.');
    text('scMaterialsBenefitsTitle',th?'ข้อดีของวัสดุ':'Material benefits');
    text('scMaterialsExampleTitle',th?'ตัวอย่างงานที่เหมาะสม':'Suitable applications');
    text('scMaterialsSlideInfoTitle',th?'รายละเอียดภาพ':'Image details');
    closeBtn.setAttribute('aria-label',th?'ปิดรายละเอียดวัสดุ':'Close material details');
    prevBtn.setAttribute('aria-label',th?'ภาพก่อนหน้า':'Previous image');
    nextBtn.setAttribute('aria-label',th?'ภาพถัดไป':'Next image');
    dotsWrap.setAttribute('aria-label',th?'เลือกภาพตัวอย่าง':'Select image');
    cards.forEach(card=>{
      const content=getContent(card.id);
      if(!content)return;
      card.title.textContent=content.title;
      card.detail.textContent=content.detail;
      card.image.alt=content.alt||content.title;
      card.link.setAttribute('aria-label',th?'ดูรายละเอียด '+content.title:'View details of '+content.title);
    });
    if(activeCard && modal.open){
      resetTransition();
      activeData=getContent(activeCard.id);
      activeSlides=activeData.slides||[];
      setInitialSlide();
      scheduleAuto();
    }
  }
  cards.forEach(card=>card.link.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof modal.showModal!=='function')return;
    event.preventDefault();openPreview(card);
  }));
  prevBtn.addEventListener('click',()=>navigate(activeIndex-1,-1,true));
  nextBtn.addEventListener('click',()=>navigate(activeIndex+1,1,true));
  closeBtn.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  modal.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();navigate(activeIndex-1,-1,true);}
    else if(event.key==='ArrowRight'){event.preventDefault();navigate(activeIndex+1,1,true);}
  });
  modal.addEventListener('pointerenter',()=>{hoverPause=true;stopAuto();});
  modal.addEventListener('pointerleave',()=>{hoverPause=false;scheduleAuto();});
  modal.addEventListener('focusin',event=>{
    if(event.target===closeBtn)return;
    // Keyboard focus pauses automatic transitions while controls are operated.
    if(event.target.matches('button:focus-visible')){focusPause=true;stopAuto();}
  });
  modal.addEventListener('focusout',()=>{
    focusPause=false;
    scheduleAuto();
  });
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stopAuto();else scheduleAuto();});
  reducedMotion?.addEventListener?.('change',()=>{if(reducedMotion.matches)stopAuto();else scheduleAuto();});
  modal.addEventListener('close',()=>{
    stopAuto();
    resetTransition();
    hoverPause=false;focusPause=false;
    const restore=activeCard?.link;
    activeCard=null;activeData=null;activeSlides=[];
    restore?.focus({preventScroll:true});
  });
  window.addEventListener('scwork-site-updated',refreshStaticCopy);
  refreshStaticCopy();
})();
