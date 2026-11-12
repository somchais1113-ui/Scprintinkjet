# How to edit and replace pictures (Thai)

## ทำไม ZIP รุ่นก่อนถึงไม่มีรูป?

รุ่น 1.0 ใช้ URL ภาพ Preview ภายนอกใน source และโฟลเดอร์ `assets/images` มีแต่ README: เมื่อเปิดโดยไม่มีอินเทอร์เน็ตหรือ URL ไม่ทำงานรูปจึงหาย. รุ่น 2.0 เปลี่ยนเป็น local WebP ครบ **18 ตำแหน่ง**, มี `manifest.json` และเครื่องมือช่วยเปลี่ยนรูป.

## วิธีที่ 1 — Image Asset Manager (ง่ายที่สุด)

1. เปิด `tools/image-manager.html` ใน Chrome, Edge, Firefox หรือ Safari รุ่นใหม่ (เปิดจากเครื่องโดยตรงก็ได้).
2. เลือกรูปที่ต้องการ เช่น `Services card 1`.
3. คลิกกล่องอัปโหลด หรือลากภาพ JPG/PNG/WebP ไปวาง.
4. เลื่อน Zoom / ตำแหน่ง X/Y ให้ได้องค์ประกอบที่ต้องการ แล้วกด **ดาวน์โหลดภาพ WebP ที่ครอปแล้ว**.
5. Browser จะดาวน์โหลดไฟล์ในชื่อที่ถูกต้อง เช่น `office.webp`.
6. นำไฟล์จาก Downloads ไปวางทับ `assets/images/services/office.webp`. **ห้ามเปลี่ยนชื่อ**; อย่าลืมกดยืนยัน Replace.
7. Refresh `index.html` (Ctrl/Cmd + Shift + R). ถ้าอัปเว็บ GitHub Pages ให้ Commit/Push ไฟล์ WebP ใหม่ด้วย.

**หมายเหตุ:** เครื่องมือแก้ไฟล์ใน Browser ไม่สามารถวางทับไฟล์ในเครื่องของคุณโดยตรง ต้องนำไฟล์ที่ดาวน์โหลดไปทับเอง (ข้อจำกัดด้าน Browser Security). ไม่มีการ Upload รูปไปยัง Cloud/Server.

## วิธีที่ 2 — Photoshop / Figma / Canva / Photopea

Export ให้ขนาดตามตาราง `docs/03-ASSET-MAP.md`; ตัดภาพแบบ `cover` เป็น WebP quality ประมาณ 80–88; แทนที่ไฟล์เดิม.

ถ้าต้องการเพิ่ม JPG แทน WebP:
- เปลี่ยน path ของรูปอื่น ๆ ใน `src/scripts/content.js`.
- Hero เดสก์ท็อป เปลี่ยน path ใน `src/styles/04-sections.css`.
- Hero มือถือ เปลี่ยน path ใน `src/styles/05-responsive.css`.
- Update manifest ทั้ง `assets/images/manifest.json` และ `assets/images/manifest.js` ให้สอดคล้องกันด้วย.

## วิธีที่ 3 — เปลี่ยนภาพอย่างเดียวด้วย Finder / Windows Explorer

วางรูปใหม่ที่มีชื่อเดิม เช่น `assets/images/blog/article-02.webp`. **ไฟล์ต้องเป็น WebP จริง** ไม่ใช่การเปลี่ยนชื่อจาก `.jpg` เป็น `.webp` เฉย ๆ.

## Recommended visual QA

- Hero: พื้นที่ด้านซ้ายต้องอ่าน Headline ชัด, ไม่ตัดใบหน้าทีมเมื่อเปิดมือถือ
- Services: Card เท่ากัน ไม่มีหัวหาย/หน้าคนโดน Crop
- Team: Portrait ratio สม่ำเสมอ, ไม่มีใบหน้าติดขอบ
- About/Quote: รูป 2 ชั้นไม่บดบังกันผิดจังหวะ
- Testimonials: ใบหน้าไม่เบี้ยว, การ Crop แนวตั้ง
- Blog: ภาพมีสไตล์ใกล้เคียง, ไม่แตกเมื่อดู Desktop Retina
- Lighthouse: ใช้ optimized WebP, file size ให้เหมาะสม; ทดสอบบนมือถือจริง

## Copyright and honesty

Packaged images are original AI-generated demonstration image crops from one raster master, **not exact images obtained from the Figma Community design**. Do not represent example cleaners as actual employees or demo testimonials as genuine client endorsements. Replace with properly licensed / consented material for production.
