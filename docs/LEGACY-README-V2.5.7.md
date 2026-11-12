# ProCleaning V2.5.7 — Balanced Spacing Update

**Start here:** Run `python3 -m http.server 8000` from the `ProCleaning_V2_5` folder, then open `http://localhost:8000` and `http://localhost:8000/tools/`. The complete previous V2.5.6 website and demo business tools are retained.

**What's changed:** Reduced oversized empty space between sections, section introductions, pricing cards, and article paragraphs without moving Hero CTA/dots. The new override lives in `src/styles/13-spacing-system.css` and is loaded **last** by `index.html`. Existing `design.sectionSpacing` remains editable through `tools/site-manager.html`; finer per-section ratios are documented in [`docs/23-V2.5.7-SPACING-AUDIT.md`](docs/23-V2.5.7-SPACING-AUDIT.md).

**Verification:** `npm run check` passes all inherited checks plus V2.5.7. Chromium inline/offline testing checked 1440px TH/EN, 768px TH, 390px TH and 320px EN and clicked language, carousel dots, pricing toggle, services arrow, anchor scroll and 3→6→3 blog expansion. These do **not** replace hosted end-to-end or real-device tests. Connected RFQ still needs backend credentials/deployment to operate live; do not submit real customer data in Demo Mode.

**Previews:** `previews/v257-home-desktop-th.jpg`, `previews/v257-home-mobile-th.jpg`, `previews/v257-services-desktop-th.jpg`, `previews/v257-blog-desktop-th.jpg`.

---

### V2.5.5 Motion Design update

Animated Hero entrance, cinematic four-image Carousel, subtle section reveals, button/card micro-interactions, and reduced-motion support. See `docs/21-V2.5.5-MOTION.md`. This is a visual-layer update; backend deployment requirements remain unchanged.


## V2.5.4 — Hero Layout Correction (historical)

- **Verified actual rendered layout** (Chromium, inline/offline assets): 1714 / 1440 / 768 / 390 / 320 px, TH & EN. CTA buttons are below description; four compact carousel dots are aligned to the far right of the CTA row.
- Hero figures fully cover the section without browser-default margins; arrows remain removed.
- All homepage CSS / JS URLs carry `?v=2.5.4`, preventing stale CSS from a previous deployment. Deploy **all files together**, not `index.html` alone.
- See `previews/hero-v254-1440-en.png`, `previews/hero-v254-1440-th.png`, `previews/hero-v254-390-en.png`, and `previews/hero-v254-390-th.png`.
- See `docs/20-V2.5.4-HERO-QA.md` for root-cause discussion and rollout checklist.


## V2.5.3 — Hero visual refinement
- 4 photo ads now fill the entire Hero frame without the native `<figure>` padding/margin gap.
- Four compact (~7 px) pagination dots sit on the far right, vertically aligned with the CTA buttons at desktop/tablet/standard mobile widths. The previous/next arrows remain removed.
- The complete setup and all V2.5 business/RFQ capabilities are retained.
- See `docs/20-V2.5.3-HERO-UX.md` and `previews/hero-v253-desktop.png`.

# PRO CLEANING V2.5 — START HERE

**Connected RFQ & Email Foundation (not activated yet).** The package defaults to Demo Mode. To receive actual RFQs and send acknowledgment emails automatically, configure Supabase, Resend and Cloudflare Turnstile following [`docs/18-V2.5-DEPLOYMENT.md`](docs/18-V2.5-DEPLOYMENT.md). No credentials are included.

- Demo website: `index.html`
- General Inquiry: `request-quote.html?type=general` (replaces mailto Contact form)
- Print Smart RFQ: `request-quote.html`
- Read-only staff Live Inbox: `tools/business/live-inbox.html` (requires backend + approved staff login)
- Existing demo Business Dashboard/CRM/Quote Builder/Orders: `tools/` (uses synthetic localStorage data, **not live**)

Run `python3 -m http.server 8000`, then open `http://localhost:8000` to preview. Run `npm run check` for automated static and business logic checks.

---

# ProCleaning v2.4 — Smart Print RFQ + Detailed Quotation Builder (Demo)

**Starting point:** `tools/index.html` (unified tools), `request-quote.html` (TH/EN printing RFQ wizard), or `index.html` (existing TH/EN cleaning reference site).

**New in V2.4:** three-step print RFQ with product-specific presets and sample artwork readiness; demo RFQ intake into the SAME browser's localStorage; dedicated quotation builder with editable line items, sales/cost, discount, shipping, optional VAT and live margin; append-only quote revisions; A4 print preview with **DEMO** watermark, and preservation of the V2.3 RFQ→Quote→Order pipeline.

## Quick start

1. Extract this ZIP to a new directory. Open a terminal in the extracted **`ProCleaning_V2_4`** folder. Run `python3 -m http.server 8000` (or `npm run dev` if Node and Python are present).
2. Open `http://localhost:8000/request-quote.html`. Switch TH/EN; complete a fictional RFQ for PVC stickers. Do **not** use customer contacts or confidential artwork.
3. Save the demo RFQ. Click **Open Quotation Builder** from the confirmation screen, or open `http://localhost:8000/tools/business/quote-builder.html`.
4. Enter demo selling prices and costs, then Save Draft. Use **Print / Save as PDF** in the browser's Print dialog, then **RFQ & Quotations** to mark Sent, confirm demo Order, and review dashboard KPIs.
5. Open `http://localhost:8000/tools/` for the module hub. All old modules remain: Dashboard, Customers, Quotations, Orders, Website Manager and Image Manager. Existing site editing exports/patches remain independent.
6. Run `npm run check` to execute the complete static/core test suite (Node required for tests, no npm install needed).

**Privacy and deployment boundary:** This is not a real CRM backend. The website RFQ is a sandbox **local to one browser and origin**. Sending it from a visitor's browser on GitHub Pages does **not** deliver it to your admin on another device. The file picker does not upload artwork. No auth, email sending, payment, supplier quote automation, or real PDF generation service. Public `tools/` routes are not private. **Do not enter or publish real customer details, internal prices or confidential work.**

**QA note:** Automated data checks pass. Simulated Chromium inline-document UI exercises and 390px responsive checks pass. A real hosted browser test remains necessary because direct local navigation is blocked in the build environment. Preview screenshots are included in `previews/`.

**VAT/profit note:** New sales amounts shown to customer include optional VAT; **estimated gross profit uses sales excluding output VAT**. See `docs/16-V2.4-SMART-RFQ-QUOTATION.md` for formulas, revision logic, data compatibility and future backend migration. `docs/17-V2.4-QA-RISKS.md` records QA limits, manual tests and risk register.

### V2.4 new files

```text
request-quote.html                         TH/EN three-step print specification demo
src/scripts/rfq-demo.js                   Wizard, presets, review, local demo save
src/styles/08-rfq.css                     Responsive wizard styles
src/styles/09-rfq-banner.css              Optional banner on original website
tools/business/quotation-engine.js        Price, discount, costs, VAT and margin calculations
tools/business/quote-builder.html          Quotation Builder
tools/business/quote-builder.js            Builder interactions and versioning
tools/business/quote-builder.css           Admin extension styles
tools/business/quote-print.html            Print sample document
tools/business/quote-print.js              A4 document rendering
tools/business/quote-print.css             Print styles
docs/16-V2.4-SMART-RFQ-QUOTATION.md        Technical and usage guide
docs/17-V2.4-QA-RISKS.md                   QA / anti-pattern register
qa/validate-v24.mjs                        Deterministic regression checks
```

---

# ProCleaning v2.3 — Unified Admin Dashboard (Demo)

**NEW ENTRYPOINT: `tools/index.html`** · Click **Customer & Order Dashboard** to open `tools/business/dashboard.html`.

This update extends v2.2 with a modular business prototype: Dashboard, Customers, RFQ / Quotations, Orders, Unified Website Manager and Image Manager. All business data is **synthetic**; the original public website remains TH/EN bilingual, static, and unchanged except for version packaging.

## Quick start

1. Unzip the project and run `python3 -m http.server 8000` from the project root, then open `http://localhost:8000/tools/`. You may also open `tools/index.html` directly in a modern browser, but HTTP preview is recommended.
2. Visit **Business Dashboard**: try the date/source filters. Visit **Customers → Add customer**, then **RFQ & Quotations → Add RFQ → New quotation → Send → Confirm Order**, and use **Orders** to change its production status.
3. **Backup Demo JSON** exports all changed synthetic records; **Import Demo JSON** restores a compatible backup. **Reset Demo** reloads the seed.
4. For website content, open `tools/site-manager.html`. For photography, open `tools/image-manager.html`.
5. Run `npm run check` (Node.js required for tests; the website itself has no build dependency).

### Critical: privacy and production boundary

This is **not a secure admin panel**. The `tools/` paths and `data/demo/` will be publicly reachable if hosted on GitHub Pages, regardless of any `robots noindex`. Browser localStorage is not secure storage and is not cloud synchronized. **Never enter real customer names, contact details, orders, prices, internal costs, or artwork** in this prototype or in a public repository. Public RFQ submissions remain a **mailto** workflow and do not enter the Dashboard automatically. There is **no login, backend, server database, permissions, audit trail or payment processing**. See `docs/13-BUSINESS-DASHBOARD-V2.3.md` for migration architecture.

### Folder map

```text
index.html                        # Existing TH/EN public website
assets/                           # Existing local website assets
data/site-data.js                 # Existing public website content
data/demo/seed-data.js            # Browser synthetic dataset (source of demo records)
data/demo/{customers,rfqs,quotations,orders}.json  # See actual filenames below
tools/index.html                  # New unified admin tools hub
tools/business/dashboard.html     # Dashboard (cohort KPIs, source chart, pipeline)
tools/business/customers.html     # Customer list + create demo contact/RFQ
tools/business/quotations.html    # RFQ and quotation pipeline, lost reasons
tools/business/orders.html        # Production statuses and estimated gross margin
tools/business/admin-data.js      # Demo data store & KPI logic
tools/business/admin.js           # UI renderer & interactions
tools/business/admin.css          # Visual design system for business module
tools/site-manager.html           # Existing bilingual content manager
tools/image-manager.html          # Existing image manager
docs/13-BUSINESS-DASHBOARD-V2.3.md
qa/validate-v23.mjs
```

> Dataset JSON snapshot filenames: `customers.json`, `rfqs.json`, `quotes.json`, `orders.json`. `seed-data.js` is loaded in the browser; the JSON files are for inspection only.

---

## Previous v2.2 documentation

# ProCleaning — Bilingual Website & Unified Manager v2.2

**New in V2.2: a working Thai / English website toggle and independent bilingual editing in the existing Site Manager.** Based on the full V2.1 package. All 11 sections, 18 local images, Image Manager, and export workflow are retained.

## Start in 3 steps

1. Extract the ZIP. Open **`index.html`** for the website; the **TH / EN** control is in the top header on desktop and mobile. The selected language is remembered in the browser (when storage is allowed).
2. Open **`tools/site-manager.html`** to edit. The new **TH / EN** control in the Editor header selects which language you are editing, and the preview follows it.
3. Choose **Export Changes ZIP** and extract that patch over the same project root (the directory containing `index.html`), then commit/push to GitHub Pages. The website does not publish changes automatically.

### Translating any text in the Editor

The Editor's **TH / EN** control changes the editing language (not merely the label of the interface). Choose TH to edit Thai copy in Page Text & CTA, Navigation, Services, Pricing, Team & Features, Testimonials, and Blog. Choose EN to edit the original English copy. Text in one language does not overwrite the other. Images, pricing amounts, colors, layout, email and phone remain shared across both languages.

**Default visitor language:** Open **Brand & Navigation → Language Settings → Default Website Language**. `en` is the initial default to preserve the Figma reference. You can change it to `th`. A visitor's previous choice takes priority. An explicit `?lang=th` or `?lang=en` in the URL also works for sharing a locale-specific link (the URL override applies to that visit).

**Thai fonts:** Thai copy uses **Noto Sans Thai** (Google Fonts); English uses the original Be Vietnam Pro / Montserrat options. When offline, system fallback fonts are used. The site remains a pure HTML/CSS/JS project, with no framework and no build required.

### Where texts now live

- `data/site-data.js`: The single source for English strings and Thai strings. `schemaVersion: 2`.
- `site.i18n.th.hero`, `site.i18n.th.headings`, `site.i18n.th.labels`, `site.i18n.th.navigation`, etc.: translated shared sections.
- `services[].translations.th`, `pricing[].translations.th`, `blogs[].translations.th`, and equivalent `team`/`testimonials`: translations travel with each card when reordering.
- `src/scripts/i18n.js`: Locale selection, fallback-to-English and deep copy to avoid modifying your originals.
- `src/styles/07-language.css`: Language switcher and Thai typography responsive adjustments.
- `tools/site-manager.html` / `.js`: Editor with TH / EN fields and synchronized preview.

### Data, backups & safety

- Editing in Browser is a **local draft**; use **Export Changes ZIP** for a deployable patch. This ZIP includes the entire updated bilingual `data/site-data.js` and any applied WebP image edits.
- **Backup Content JSON** contains BOTH languages but does not include binary images. Export the patch ZIP to keep changed images.
- If importing legacy V2.1 content, unchanged original copy inherits available Thai defaults. Custom text in a legacy file may need a manual Thai translation; if missing, the site shows English as fallback rather than fabricating a translation.
- Person names and brand names can be kept in Latin characters. All testimonial and prices are demo placeholders until you verify them for commercial use.

### Language coverage

Header and mobile navigation, hero, all section headings, services, pricing and billing labels, team, about/features, testimonials, blog, contact form, feedback messages, footer, document title/meta description, accessibility labels, and image descriptions.

**SEO note:** The toggle updates `<html lang>`, browser title and description client-side. For *independent search-indexed Thai and English pages*, future versions should provide separate `/th/` and `/en/` routes with `hreflang`, translated metadata served to crawlers, and localized URLs. A JS-only toggle is suitable for visitors but not a complete multilingual SEO strategy.

### QA & limitations

`npm run check` runs structure + schema tests. The bilingual interaction and manager/export were also exercised in a sandboxed Chromium DOM test, but a full end-to-end test on a hosted domain is still recommended. Image previews in the sandbox cannot load external URLs; bundled local WebP files remain present. The Figma original image assets remain unavailable; image files are local AI-generated placeholders, as in V2.1.

---

## V2.1 original documentation (retained)

# ProCleaning — Unified Website Manager v2.1

**ใหม่ใน V2.1:** แก้ข้อความ ภาพ บริการ ราคา รีวิว บทความ และสี/ฟอนต์ ผ่านหน้าเดียว โดยไม่ต้องแก้ HTML หลายไฟล์

## Quick Start

1. เปิด `tools/site-manager.html` (หรือเปิดด้วย `python3 -m http.server 8000` แล้วเข้าที่ `http://localhost:8000/tools/site-manager.html`)
2. เลือกหมวด แก้เนื้อหา ดู Live Preview ด้านขวา
3. Upload ภาพในแท็บ Image Assets แล้วกด **ใช้ภาพนี้ใน Preview**
4. กด **Export Changes ZIP** (มุมขวาบน หรือแท็บ Import / Export)
5. แตก Patch ZIP ทับ **Root ของโปรเจกต์นี้** (ที่มี `index.html`) แล้ว Refresh หน้าเว็บ

> การแก้บน Browser ยังไม่เขียนทับไฟล์บนคอมพิวเตอร์หรือ GitHub โดยตรง ต้อง Export/Extract ก่อนเผยแพร่

- แก้ Content ต้นฉบับโดยตรง: `data/site-data.js`
- ปรับ Layout / Styling: `src/styles/`
- Image Crop Manager เดิม: `tools/image-manager.html`
- คู่มือแบบละเอียด: [docs/08-CONTENT-WORKFLOW.md](docs/08-CONTENT-WORKFLOW.md)
- Figma asset limitation: ใช้ภาพ AI ทดแทน ไม่ใช่ภาพต้นฉบับจาก Figma

---

## Original V2.0 documentation (kept for reference)

# ProCleaning — Development Package v2.0 (Local Image Edition)

> **เว็บไซต์สำหรับพัฒนาต่อ / Figma-inspired reconstruction** — HTML/CSS/Vanilla JavaScript พร้อมภาพที่เก็บในโปรเจกต์ทั้งหมด โครงสร้างเดิม 11 Sections และ Image Manager สำหรับปรับรูปโดยไม่ต้องแก้โค้ด

**Figma reference:** https://www.figma.com/design/ylJjGQPBdSlTnMNO635p6c/Cleaning-services-website-landing-page--Community-?node-id=0-3

## เริ่มต้นเร็วที่สุด

1. แตก ZIP, เปิด `index.html` เพื่อทดลองหน้าเว็บได้ทันที (แนะนำใช้ local server)
2. เปิด `tools/image-manager.html` เพื่อเลือกตำแหน่งภาพและอัปโหลดภาพใหม่
3. กด **ดาวน์โหลดภาพ WebP ที่ครอปแล้ว** → นำไฟล์ไปวางทับในโฟลเดอร์ `assets/images/...` ตามชื่อไฟล์ที่หน้าจอระบุ
4. กลับเว็บและกด Ctrl/Cmd + Shift + R → ภาพใหม่จะขึ้น โดยไม่ต้องแก้ HTML/JS

**ดูภาพทั้งหมดพร้อมชื่อไฟล์:** `assets/images/asset-contact-sheet.jpg`

## โครงสร้างไฟล์

```text
ProCleaning_Figma_Development_Package/
├── index.html                         Landing Page 11 Sections
├── README.md                          เริ่มต้นที่นี่
├── CHANGELOG.md                       ประวัติการแก้ไข
├── .nojekyll                           GitHub Pages
├── .gitignore
├── package.json                       npm run dev / npm run check
├── assets/
│   ├── icons/                          โลโก้ SVG / favicon
│   │   ├── logo-mark.svg
│   │   └── favicon.svg
│   └── images/
│       ├── manifest.json               Source-of-truth รายการภาพ 18 ช่อง
│       ├── manifest.js                 รายการเดียวกันสำหรับ Image Manager แบบออฟไลน์
│       ├── asset-contact-sheet.jpg     แผงภาพรวมทุกไฟล์
│       ├── placeholder.svg             รูปสำรองเมื่อหาไฟล์ไม่พบ
│       ├── source/
│       │   ├── ai-hero-master.png       Master Image สำหรับแต่งภาพเพิ่มเติม
│       │   └── README.md               รายละเอียดที่มาภาพ
│       ├── hero/                        Desktop + Mobile 2 ภาพ
│       ├── services/                    3 ภาพ
│       ├── quote/                       2 ภาพ
│       ├── team/                        3 ภาพ
│       ├── about/                       2 ภาพ
│       ├── testimonials/                3 ภาพ
│       └── blog/                        3 ภาพ
├── src/
│   ├── styles/
│   │   ├── 00-tokens.css               Colors / Fonts / Design Tokens
│   │   ├── 01-reset.css
│   │   ├── 02-layout.css
│   │   ├── 03-components.css
│   │   ├── 04-sections.css             Desktop / image background
│   │   └── 05-responsive.css           Tablet / Mobile
│   └── scripts/
│       ├── config.js                   Brand / Contact
│       ├── content.js                  บริการ รูป ทีม ราคา รีวิว บทความ
│       ├── ui.js                       HTML rendering
│       └── main.js                     Interactions
├── tools/
│   ├── image-manager.html              เครื่องมือเปลี่ยนรูป/ครอป/ดาวน์โหลด
│   └── image-manager.js                Logic บน Browser (ไม่ต้องใช้ Backend)
├── docs/
│   ├── 01-SECTION-MAP.md
│   ├── 02-DESIGN-SYSTEM.md
│   ├── 03-ASSET-MAP.md
│   ├── 04-DEVELOPMENT-DEPLOYMENT.md
│   ├── 05-DECISION-LOG.md
│   ├── 06-LIMITATIONS-NEXT-STEPS.md
│   └── 07-IMAGE-EDITING-GUIDE.md
└── qa/
    ├── validate.mjs
    └── MANUAL-QA.md
```

## วิธีเปลี่ยนรูป (เลือก 1 วิธี)

**A. ไม่แก้โค้ด / แนะนำ:** เปิด `tools/image-manager.html`, เลือก Slot, อัปโหลด JPG/PNG/WebP, ปรับ Zoom และตำแหน่ง Crop, ดาวน์โหลด WebP, นำไปวางทับไฟล์เดิม (รักษาชื่อและนามสกุล).

**B. ใช้ Photoshop/Figma/Canva:** Export WebP ตามขนาดใน `assets/images/manifest.json` แล้วใช้ชื่อและ path เดิม. ถ้าต้องการใช้ JPG/PNG แทน WebP ต้องเปลี่ยนชื่อ path ใน `src/scripts/content.js` หรือ CSS ของ Hero และใน `manifest.json`/`manifest.js` ให้ตรงกัน.

**C. แก้เนื้อหา:** `src/scripts/content.js` เป็นจุดเดียวสำหรับภาพส่วน Services/Team/Quote/About/Testimonials/Blog ส่วนภาพ Hero กำหนดใน `src/styles/04-sections.css` และ `src/styles/05-responsive.css`.

## Dev & QA

```bash
cd ProCleaning_Figma_Development_Package
python3 -m http.server 8000
# visit http://localhost:8000/ and http://localhost:8000/tools/image-manager.html

node qa/validate.mjs
# หรือ npm run check (ถ้ามี Node)
```

ไม่มี runtime framework ไม่ต้อง npm install และไม่ต้อง Build — GitHub Pages ใช้ไฟล์ static ได้ทันที. ตรวจสอบ Browser มือถือจริงก่อนเผยแพร่.

## ขอบเขตและข้อจำกัด

- รูปทั้ง 18 ช่องใน ZIP เป็นภาพ **AI-generated sample crops จาก Master เดียว** ที่จัดเก็บเป็นไฟล์จริงภายในโปรเจกต์ (รวม Master PNG); **ไม่ใช่ภาพต้นฉบับ Figma 1:1**. ภาพบางตำแหน่งจึงมีคน/สถานที่ซ้ำกัน ควรแทนด้วยภาพสินค้า/บริการที่มีสิทธิ์ก่อนเผยแพร่แบรนด์จริง
- การเปิด Figma ถูกจำกัดสิทธิ์และจำนวน request จึงไม่ได้ดาวน์โหลด Figma original images / `.fig` / layered design source / font files มารวมใน ZIP
- Fonts ในเว็บยังโหลด Google Fonts ออนไลน์ (Be Vietnam Pro, Montserrat). เวลาที่ไม่มีอินเทอร์เน็ต Browser จะใช้ fallback system fonts; ไฟล์ฟอนต์ไม่ได้รวมในแพ็กเกจ
- หน้า Desktop เป็นการจัดใหม่ตาม Reference ไม่ใช่ผล Pixel-perfect ที่ตรวจแล้ว. Mobile/Tablet เป็น responsive interpretation
- ฟอร์ม Contact เป็น mailto ไม่ใช่ Backend/API และข้อมูลราคารีวิวชื่อคนเป็นข้อมูลตัวอย่าง
- Source ภาพ Master เป็น raster PNG ไม่ใช่ PSD/AI/Figma editable layers; ผู้ใช้สามารถแก้สี/รีทัช/ครอปในโปรแกรมภาพได้ แต่ไม่มี editable vector layers
- Copyright / Figma Community assets: โปรดตรวจสิทธิ์ไฟล์/รูปภาพของเจ้าของ Figma ก่อนนำต้นฉบับไปใช้เชิงพาณิชย์

## GitHub Pages

Push ทุกไฟล์ให้ `index.html` อยู่ Repo Root → Settings → Pages → Deploy from branch `main` / `(root)`. ไม่ต้อง build. หลังเปลี่ยนรูป Commit/Push แล้ว Force refresh หน้าเว็บ.

---

# V2.5 — Connected RFQ + Email Foundation

**Read `docs/18-V2.5-DEPLOYMENT.md` first.** This package includes code and migrations but is not connected to any live Supabase/Resend account. `config/public-config.js` defaults to `mode: 'demo'`.

- `index.html`: public website; old contact submit no longer launches Mail. Entry CTA routes to `request-quote.html?type=general`.
- `request-quote.html`: printing-specific Smart RFQ (default route), connected to API **only when configured**; legacy synthetic demo available for preview.
- `tools/business/live-inbox.html`: read-only live records, requires real Supabase staff Auth + RLS.
- `tools/`: retains V2.4 Website Manager, Image Manager, synthetic Dashboard, Customers, Quotes and Orders as a standalone demo; they are NOT automatically connected to live RFQs.
- `supabase/migrations/`: SQL schema and RLS.
- `supabase/functions/`: intake and email retry Edge Functions.
- `config/public-config.js`: PUBLIC URLs + publishable key + Turnstile site key only; no server credentials.
- `privacy.html`: draft placeholder **must be replaced before real launch**.

For a local static preview: `python3 -m http.server 8000`, open `http://localhost:8000`. Do not enter personal data in demo mode.


## V2.5.6 — Blog expansion / บทความเพิ่มเติม

- On Home, 3 articles appear initially. After more articles are added, **View more articles / ดูบทความเพิ่มเติม** automatically appears under the grid; each click reveals 3 more.
- Each card's **Read More / อ่านเพิ่มเติม** links to `article.html?post=<stable-id>&lang=en|th`. The page presents the long-form body independently for both languages.
- Add articles in `tools/site-manager.html` → **Blog**, click **＋ เพิ่มรายการ blogs**, fill Title / Meta / Excerpt / Full Article Body / Image for both TH and EN, and Export Changes ZIP. Do not forget to replace `data/site-data.js` in your deployed project.
- You can add more than 5 articles; the Blog grid has no fixed content limit. If you add 6 posts, Home shows 3 and the CTA reveals the remaining 3.
- The full article content fields store plain text with empty lines separating paragraphs. HTML tags are treated as text to reduce XSS risk.
- The website still requires manual Export/Deploy from the editor. The article URLs are static-query links; dedicated slug routes and SEO `hreflang` can be added when the backend is integrated.
