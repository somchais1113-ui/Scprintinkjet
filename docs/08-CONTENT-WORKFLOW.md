# ProCleaning v2.1 — Unified Website Manager (คู่มือใช้งาน)

## 1. เริ่มต้น

1. แตกไฟล์ `ProCleaning_Unified_Website_Manager_v2.1.zip` ทั้งชุด
2. เปิด `tools/site-manager.html` ใน Chrome, Edge, Firefox หรือ Safari รุ่นใหม่ หรือเปิดผ่าน Local Server (`python3 -m http.server 8000`)
3. สลับหมวดด้านซ้าย ปรับข้อความ รายการสินค้า ราคา ภาพและ Design Tokens
4. ดูตัวอย่างใน Live Preview ด้านขวา (Desktop 1440px / Tablet 768px / Mobile 390px)
5. ไปหมวด `Import / Export` > `Export Changes ZIP` หรือใช้ปุ่มสีเขียวด้านบน
6. **แตกไฟล์ ZIP ที่ดาวน์โหลด ไปยังโฟลเดอร์ Root โปรเจกต์เดิม (ที่มี index.html)** และยืนยันให้เขียนทับไฟล์ซ้ำ
7. Refresh หน้า `index.html` และตรวจสอบก่อน Commit/Push ไป GitHub

**สำคัญ:** Browser ไม่เขียนทับไฟล์ในโฟลเดอร์โปรเจกต์เองได้โดยไม่มีสิทธิ์การเข้าถึงไฟล์; Preview ไม่ใช่การ Publish; ขั้นตอน Export + Extract เป็นสิ่งจำเป็น

## 2. โครงสร้างเนื้อหา

แก้ทั้งหมดใน `data/site-data.js` ด้วย Unified Manager ได้:

| Field Group | จุดที่เปลี่ยนบนเว็บ |
|---|---|
| `brand` | Pro / Cleaning, Tagline, HTML title, SEO description |
| `navigation` | เมนู Header และ CTA |
| `hero` | Heading, Eyebrow, Description, CTA สองปุ่ม |
| `headings` | หัวข้อทุก Section และข้อความประกอบ |
| `labels` | ปุ่ม, Pricing labels, แบบฟอร์ม, Error/Success message |
| `footer` | Footer headings, description, copyright, disclaimer |
| `contact` | อีเมล โทร ที่อยู่ หัวข้ออีเมล |
| `settings` | Currency และส่วนลดปีแบบ DEMO |
| `design` | สีหลัก/ข้อความ/พื้นหลัง footer, ฟอนต์, Scale, Spacing, Radius |
| `services` | ชื่อ รูป คำอธิบาย, เพิ่ม/ลบ/ย้าย |
| `pricing` | ชื่อ ราคา Features, highlight, เพิ่ม/ลบ/ย้าย |
| `team` | ชื่อ รูป คำอธิบาย, เพิ่ม/ลบ/ย้าย |
| `features` | จุดขายใน About section |
| `testimonials` | ชื่อ อาชีพ รีวิว รูป, เพิ่ม/ลบ/ย้าย |
| `blogs` | ชื่อบทความ วันที่ Excerpt รูป, เพิ่ม/ลบ/ย้าย |
| `photos` | รูป quote/about 4 ตำแหน่ง |

## 3. ระบบรูปภาพ

- หน้า **Image Assets** มี 18 รูปตาม manifest `assets/images/manifest.json`
- เลือกตำแหน่ง > Upload รูป > Zoom / Focus X / Focus Y > **ใช้ภาพนี้ใน Preview**
- การกด Apply จะเพิ่มไฟล์ `.webp` ใหม่เข้า Queue ของ `Export Changes ZIP` เท่านั้น (ยังไม่เขียนบนดิสก์)
- Export แล้ว ZIP จะมี `assets/images/...` ของรูปที่อัปโหลด/Apply พร้อมไฟล์ `data/site-data.js`
- ถ้าต้องการเปลี่ยนรูปแบบเดี่ยว ยังกด Download WebP ได้ และเครื่องมือเดิม `tools/image-manager.html` ยังอยู่
- **ข้อจำกัด:** ภาพที่อัปโหลดใน Session นี้ยังไม่ persist หลัง Refresh / ปิดหน้า Editor กรุณา Export Changes ZIP ก่อนออกจากหน้า
- รูปต้นฉบับจาก Figma ไม่ได้รวมอยู่; รูปใน V2.1 เป็นภาพตัวอย่าง AI-generated จาก V2.0

## 4. Export / Import

### Export Changes ZIP (แนะนำ)
ไฟล์ ZIP ภายในประกอบด้วย:
- `data/site-data.js` — Content และ Design Tokens ล่าสุด
- `assets/images/...` — เฉพาะไฟล์ภาพที่อัปโหลดใหม่แล้วกด Apply (อาจไม่มีหากไม่ได้แก้ภาพ)
- `site-content-backup.json` — Backup ข้อความ (ไม่รวม binary ภาพ)
- `HOW_TO_APPLY_PATCH.txt` — วิธีนำไฟล์ไปวางทับ

ZIP ที่ออกจาก Manager เป็น **Changes/Patch ZIP** ไม่ใช่ Full Website ZIP; คุณได้รับตัวเว็บฉบับเต็มอยู่แล้วจากแพ็กเกจหลัก นำ Patch ไปแตกทับตัวเว็บก่อน Deploy

### Export site-data.js
ดาวน์โหลดไฟล์เดียว แล้วนำไปวางทับ `data/site-data.js`

### Export / Import JSON
เก็บข้อมูล Content & Design JSON เป็น Backup สามารถ Import เพื่อ Restore ได้ แต่ JSON ไม่มี Binary ของรูปภาพที่อัปโหลด

## 5. บันทึก และความปลอดภัย

- Content / Design ถูก Autosave เป็นร่างใน `localStorage` ของ Browser นั้น (ถ้า Browser อนุญาต)
- ภาพที่อัปโหลดอยู่ในความจำ Session เท่านั้น; ไม่ได้ส่งขึ้น Server
- ไม่มี Login / Auth / CMS Backend / GitHub Auto Commit / Form Submission Backend
- **อย่าอัปโหลดข้อมูลลับลงเว็บไซต์ Static** — ไฟล์ `data/site-data.js` เป็น Public เมื่อ Deploy
- หากต้องการ Admin Online ที่บันทึก GitHub/DB โดยตรง ต้องเพิ่ม Authentication และ Backend/Provider API
- ตัวเลขราคา, ชื่อพนักงาน และรีวิวเป็นข้อมูลสำหรับ Demo ต้องยืนยันความถูกต้องก่อนเผยแพร่จริง

## 6. วิธี Deploy ด้วย GitHub Pages

```bash
# หลังแตก Patch ZIP ทับโปรเจกต์เดิม
# จาก project root
python3 -m http.server 8000
# Open: http://localhost:8000/tools/site-manager.html

# เมื่อแก้เสร็จ แทนไฟล์จาก Export ZIP แล้ว
 git add data/site-data.js assets/images
 git commit -m "Update website content and visuals"
 git push
```

GitHub Pages สามารถ Host เว็บไซต์ Static นี้ได้; ไม่จำเป็นต้อง `npm run build`.

## 7. ปรับ Font / Responsive

- Font ใช้ Google Fonts เป็นหลัก: Be Vietnam Pro / Montserrat; อินเทอร์เน็ตออฟไลน์อาจใช้ Fallback Font
- `Heading Size (%)` ใช้กับหัวข้อหลักของหน้า; ไม่ได้ Scale ทุก Font Size ของระบบ
- `Section Spacing` บาง Breakpoints อาจถูก CSS Responsive ปรับเฉพาะจุดอยู่ จึงควรตรวจ Mobile หลังเปลี่ยน
- Desktop Preview แสดง viewport 1440px โดย Scaling ให้พอดีแผง; Tablet และ Mobile ใช้ 768px และ 390px ตามลำดับ

## 8. ข้อจำกัดและสิ่งที่ต้องทำก่อน Live

- ภาพ Asset เป็นตัวอย่าง ไม่ใช่ Pixel-Perfect 1:1 จากต้นฉบับ Figma
- Form เป็น `mailto:` จำเป็นต้องมี Email Client ในเครื่องผู้เข้าชม หากต้องการส่งจากเว็บโดยตรงต้องทำ Backend/Form Provider
- สถานะ Live Preview ทำงานใน Browser แต่การเขียนทับโค้ดและ Deploy เป็นขั้นตอน Manual
- QA ผ่าน Node check และ Browser DOM tests แบบจำลอง เนื่องจาก Browser QA สภาพแวดล้อมนี้จำกัดการเปิด URL ภายในเครื่อง; ควรทดสอบบนเครื่องผู้ใช้ทั้ง Desktop/Mobile ก่อน Production
