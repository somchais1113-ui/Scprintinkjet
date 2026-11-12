# Development / GitHub / Maintenance

## Run locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Node tooling ไม่จำเป็นสำหรับการรันเว็บ. `npm run check` ต้องมี Node.js แต่ไม่ต้อง `npm install`.

## Environment / dependencies

- Plain HTML / CSS / JavaScript, no React/Vue/Next
- JS scripts loaded with `defer` in order: config, content, ui, main
- Google Fonts (online) + 18 bundled local WebP photos (work offline)
- No server-side code, no database, no build step

## Folder editing principles

**Edit images (no code):** เปิด `tools/image-manager.html` → เลือก Slot → Upload → Crop → Download → วางทับไฟล์ชื่อเดิมใน `assets/images/`. ดู `docs/07-IMAGE-EDITING-GUIDE.md` สำหรับรายละเอียด.

**Text/content first:** `src/scripts/content.js` จัด section data เป็น object เดียว; `src/scripts/ui.js` เป็น renderer สำหรับ cards; `src/scripts/main.js` เป็น interactions แยก. ลดโอกาสแก้ layout แล้วกลายเป็นเปลี่ยน business logic.

**Styling first:** เปลี่ยนสี/Font จาก `00-tokens.css` ก่อน ถ้าปรับ component ใช้ `03-components.css`; ถ้าเฉพาะ section ใช้ `04-sections.css`; ถ้า responsive ใช้ `05-responsive.css`.

## Deploy GitHub Pages

- GitHub repo (public/private ตาม plan ที่รองรับ Pages)
- Upload `index.html`, `assets/`, `src/`, `docs/` etc. all at repo root
- Settings → Pages → branch `main` / root; no Jekyll build required
- หากเปลี่ยนชื่อ repo ไม่ต้องเปลี่ยน asset paths เพราะเป็น relative

## Before production

- [ ] เปลี่ยน placeholder contact settings ให้เป็นข้อมูลจริง
- [ ] เปลี่ยนรูป sample ที่สร้างด้วย AI เป็นภาพของธุรกิจจริง / รูปที่ได้รับสิทธิ์
- [ ] ตรวจภาษี ราคา และข้อเท็จจริง (ตัวเลขราคาเป็น Figma demo)
- [ ] ใส่รูปและชื่อทีมจริง หรือเอา block ทีมออก
- [ ] เปลี่ยนรีวิว demo เป็นรีวิวจริงพร้อมความยินยอม
- [ ] เปลี่ยนบทความ demo เป็นบทความที่มี URL ปลายทางจริง
- [ ] เปลี่ยน `mailto` เป็น endpoint เช่น Formspree / Supabase Edge Functions (ต้องตั้งค่าและ permission ก่อน)
- [ ] เพิ่ม Privacy Policy/Terms/Cookie controls ถ้ากฎหมายและการเก็บข้อมูลของธุรกิจเข้าข่าย
- [ ] ตรวจ Lighthouse, accessibility, image optimization, mobile screenshot

## API extension proposal (not implemented)

Later add `src/services/contact-api.js` + backend service; do NOT put API keys directly into static HTML/JS; use server-managed secrets. For leads CRM, map: inquiry id, contact, service, source channel, timestamp, consent, status. Add rate limiting, spam protection, validation on server.
