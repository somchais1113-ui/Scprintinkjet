# SCWork Inkjet Sticker — V2.1.17

ต่อยอดจาก V2.1.16 โดยแก้ **เพียงสองเรื่องตามบรีฟล่าสุด**: แอนิเมชันสไลด์การ์ดบริการหน้าแรก และ Favicon ของแท็บเบราว์เซอร์

## 1. Services Carousel: Whole-Card Crossfade

**ตำแหน่ง:** หน้าแรก > “บริการสติกเกอร์ Inkjet สำหรับทุกการใช้งาน” (`#services`)

- เมื่อกดลูกศรด้านขวา จะหมุนลำดับการ์ดไปชุดถัดไปเหมือนเดิม โดย **การ์ดทั้งหมดที่แสดงผลเปลี่ยนพร้อมกัน** (ภาพ หัวข้อ คำอธิบาย และ CTA)
- ใช้ Crossfade สองชั้น: ชุดเดิมจางลง ขณะที่ชุดใหม่ค่อย ๆ ปรากฏ มีการขยับตามทิศทางเล็กน้อย
- Transition 670ms; ล็อกปุ่มชั่วคราวระหว่างการเปลี่ยนภาพและคืนสถานะเมื่อเสร็จ
- Preload ภาพชุดถัดไปสูงสุด 1 วินาทีเพื่อลดภาพขาวระหว่างเปลี่ยนสไลด์ (ในเครือข่ายช้าอาจมีช่วงรอก่อนเริ่มเฟด)
- รองรับจอ Desktop / Mobile และ `prefers-reduced-motion` ซึ่งจะสลับชุดทันทีโดยไม่เล่น Animation
- คงรูปแบบ Layout, ข้อความ, สี และ URL ของแต่ละการ์ดเหมือน V2.1.16

**ไฟล์:** `src/scripts/main.js`, `src/styles/32-services-crossfade.css`, `index.html`

## 2. Chrome Tab Favicon

ใช้ไฟล์ **ตาม ZIP ที่ผู้ใช้อนุมัติ `SCWork_Approved_Favicon_Chrome_Package(1).zip`** โดยไม่ปรับเปลี่ยนโลโก้

- `favicon.ico` (multi-size)
- `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon-64x64.png`, `favicon-128x128.png`, `favicon-180x180.png`, `favicon-192x192.png`, `favicon-256x256.png`, `favicon-512x512.png`, `scwork-icon-512.png`
- ติดตั้งแท็ก `<link rel="icon">` และ `<link rel="apple-touch-icon">` ในหน้าเว็บและหน้าภายในที่เป็นไฟล์ HTML ปัจจุบัน
- ชื่อไฟล์อยู่ที่ **root ของเว็บไซต์** สำหรับให้ Chrome หา `favicon.ico` ได้โดยตรง
- เพิ่ม query version `?v=2.1.17` ใน HTML เพื่อช่วยหลีกเลี่ยง cache ของเบราว์เซอร์

> ไอคอนนี้เป็นการ export จากภาพ Approved Design ไม่ใช่ vector ที่แก้ไขได้ 100% และข้อความ SCWORK อาจมีขนาดเล็กมากในแท็บ 16×16 px ตาม README ของชุดต้นฉบับ

## ชุดไฟล์

- `SCWORK_Inkjet_Sticker_V2.1.17_Public_Website.zip` — สำหรับ Deploy หน้าเว็บ ไม่รวมเครื่องมือส่วนตัวและไฟล์ QA/Source ทั้งหมด
- `SCWORK_Inkjet_Sticker_V2.1.17_Full_Package.zip` — รวมไฟล์เว็บและชุดสำหรับพัฒนาต่อ

## การตรวจที่ทำแล้ว

- `node --check src/scripts/main.js`
- `npm run check:v2117`
- `npm run check:v2112`
- `npm run check:smart-quote`
- `node qa/validate-v2116.mjs`
- Chromium isolated DOM test: Desktop 1440px / Mobile 390px ตรวจการหมุนการ์ดครบวงจร, crossfade, TH/EN และ reduced motion **ผ่าน**

**ข้อจำกัดของ QA:** สภาพแวดล้อมทดสอบบล็อกการนำทาง Chrome ไปยัง HTTP/local file URL จึงทดสอบด้วยการฉีด HTML/CSS/JS ลงใน Chromium แทนการเปิดเว็บจริง ให้ตรวจบนเครื่องจริงอีกครั้งก่อน Deploy โดยเฉพาะ Chrome cache และตำแหน่งข้อความบนอุปกรณ์ต่าง ๆ

## การใช้หลัง Deploy

1. อัปโหลด/Deploy จากชุด Public โดยคงโครงสร้างไฟล์ไว้
2. เปิด `index.html` หรือหน้าเว็บจริง > Section บริการสติกเกอร์ แล้วกดลูกศรเพื่อดู Crossfade
3. เปิดแท็บใหม่หรือรีเฟรชแบบล้างแคช (เช่น Ctrl+Shift+R หรือ Cmd+Shift+R) เพื่อดู Favicon ใหม่ หากยังเห็นรูปเดิมให้ลองหน้าต่างไม่ระบุตัวตน
4. ตรวจหน้าเช็กราคาและหน้าอื่นว่าระบบยังทำงานเดิม
