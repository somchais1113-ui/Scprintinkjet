# SCWork Inkjet — V2.1.19 / Cinematic Main Banner

## Overview

พัฒนาต่อยอดจาก **V2.1.18** เฉพาะ Main Banner ของหน้าแรก โดยนำหลักการจากคลิปอ้างอิงของผู้ใช้มาปรับใช้: ภาพเต็มเฟรม, ข้อความแบบ Storytelling ช่วงล่างซ้าย และชุดควบคุมสไลด์ขนาดเล็กด้านล่าง ขณะที่ระบบอื่นและ Pricing Logic ยังคงเหมือนเดิม

## What changed

1. **Full-Bleed Cinematic Hero** — เปลี่ยนจากภาพขวา/ข้อความซ้าย เป็นภาพถ่ายเต็มความกว้าง ไม่เหลือกรอบขาวซ้ายหรือขอบของ Banner เดิม
2. **Four Visual Stories** — ใช้ภาพงาน Inkjet, ฉลากสินค้า, ไดคัท, และกราฟิกติดกระจกที่มีอยู่แล้วในชุด SCWork พร้อมข้อความไทย/อังกฤษแยกตามสไลด์
3. **Readability Overlay** — เพิ่ม Navy Gradient เฉพาะบริเวณที่ช่วยอ่านข้อความ โดยไม่ปิดทึบภาพทั้งเฟรม
4. **Minimal Navigation** — ปุ่ม Previous / Pause–Resume / Next, Dots, ตัวนับสไลด์ 01/04 และทางลัดเลื่อนดูบริการ
5. **Motion** — Crossfade ระหว่างภาพ 880 ms, Fade + small vertical movement ของข้อความ, Subtle Image Breathe, Auto Slide ทุก 7.4 วินาที
6. **Responsive** — กำหนด Crop แยกแต่ละสไลด์และลดขนาด Typography / Controls บน Mobile โดยไม่ทำให้หน้าเว็บล้นแนวนอน
7. **Accessible** — ใช้งานผ่านปุ่มคีย์บอร์ด, aria labels, หยุด Auto เมื่อหน้าต่างไม่แสดงหรือผู้ใช้โฟกัสอยู่ใน Hero, รองรับ prefers-reduced-motion

## Files changed

- `index.html` — โครงสร้าง Banner และข้อความสไลด์
- `src/scripts/main.js` — Cinema Carousel / Story / Controls
- `src/styles/34-cinematic-hero.css` — Layout, Crop, Overlay และ Motion (ไฟล์ใหม่)
- `qa/build-public-v2111.mjs` — เพิ่ม CSS และคู่มือเข้าชุด Public
- `qa/validate-v2119.mjs` — Regression Test ของ Hero
- `qa/validate-v2117.mjs` — อนุญาต version query ของ Main JS ที่เพิ่มฟังก์ชัน Hero แต่ยังตรวจ Services Carousel เดิม
- `package.json`, `CHANGELOG.md`

## Change a slide image

แต่ละภาพอยู่ใน `index.html` ภายใต้ `figure.hero__slide[data-hero-slide="0..3"]` ภาพที่ใช้มีดังนี้:

| Slide | Subject | Image path |
|---|---|---|
| 01 | งานพิมพ์ Inkjet | `assets/images/hero/inkjet-print-v218.webp` |
| 02 | ฉลากสินค้า | `assets/images/hero/product-labels-v218.webp` |
| 03 | สติกเกอร์ไดคัท | `assets/images/hero/die-cut-stickers-v218.webp` |
| 04 | งานติดกระจก | `assets/images/hero/retail-vinyl-v218.webp` |

โค้ดใช้ภาพเดิมที่ผ่านการอนุมัติจากรอบก่อน ไม่ได้สร้างผลงานลูกค้าสมมติขึ้นใหม่ ภาพที่แสดงเป็นภาพประกอบแนวทางบริการ ตามคำชี้แจงเดิมของเว็บไซต์

**ภาษา:** ภาษาไทย/อังกฤษมี Story Text แยกตามสไลด์ ส่วนภาษาอื่นที่เว็บรองรับจะใช้หัวข้อและคำอธิบาย Hero ที่แปลไว้แล้วเป็น fallback เพื่อไม่ให้ข้อความกลับเป็นอังกฤษกลางหน้า

**เปลี่ยนคำบนสไลด์:** สไลด์ 01 อ่านจาก `hero` ใน `data/site-data.js` (รวมคำแปลภาษาไทยใน i18n); สไลด์ 02–04 เปลี่ยนที่ `data-title-th`, `data-title-en`, `data-desc-th`, `data-desc-en` ภายใน `index.html` โดยตรง

**เปลี่ยนตำแหน่ง Crop:** แก้ `object-position` สำหรับแต่ละ `[data-hero-slide]` ที่ `src/styles/34-cinematic-hero.css`

**เปลี่ยนเวลา:** Auto Play = `duration=7400` ใน `src/scripts/main.js`, Crossfade = `880ms` ใน CSS

## Quick QA

- `npm run check:v2119` — ตรวจโครงสร้างและฟังก์ชันของ Cinema Hero
- `npm run check:v2118` — ตรวจหน้าเช็กราคา UX เวอร์ชันก่อน
- `npm run check:v2117` — ตรวจ Favicon และ Services Carousel Crossfade เดิม
- `npm run check:v2112` — ตรวจระบบ Hero Slides, Benefit Links และภาพ Quote
- `npm run check:pricing` — ตรวจ Pricing Engine เดิม

Manual QA: เปิดหน้าแรกที่ Desktop, Tablet และ Mobile; กด Next/Prev/Pause/Dots, สลับ TH/EN และทดสอบ CTA ไป `smart-quote.html`

### Important

หากใช้ตัวแก้ไขภาพใน Unified Image Manager, Hero ยังรองรับ `data-hero-legacy` และ Image Overrides เดิม สำหรับช่องทางภาพ 4 สไลด์

เว็บไซต์ยังเป็น Static Package และไม่ได้เปลี่ยน Backend, อัปโหลด Artwork, ระบบรับชำระเงิน หรือสูตรราคาในรุ่นนี้
