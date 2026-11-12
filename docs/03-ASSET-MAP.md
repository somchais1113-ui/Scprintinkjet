# Asset Map — มีไฟล์จริงใน ZIP แล้ว (v2.0)

**18/18 image slots เป็นไฟล์ `.webp` ที่เก็บใน project**, พร้อม master image, contact sheet, image manager. ภาพเหล่านี้เป็น AI-generated replacements ที่ครอปจาก master เดียว ไม่ใช่ภาพ original จาก Figma. Hero แยก Desktop และ Mobile.

| # | Section / Slot | Local file path | Output size |
|---:|---|---|---|
| 01 | Hero desktop | `assets/images/hero/hero-scene.webp` | 1536×1024 |
| 02 | Hero mobile | `assets/images/hero/hero-mobile.webp` | 760×965 |
| 03 | Services card 1 | `assets/images/services/office.webp` | 960×680 |
| 04 | Services card 2 | `assets/images/services/spring.webp` | 960×680 |
| 05 | Services card 3 | `assets/images/services/house.webp` | 960×680 |
| 06 | Quote main photo | `assets/images/quote/main.webp` | 790×850 |
| 07 | Quote detail photo | `assets/images/quote/detail.webp` | 580×690 |
| 08 | Team card 1 | `assets/images/team/person-01.webp` | 740×660 |
| 09 | Team card 2 | `assets/images/team/person-02.webp` | 740×660 |
| 10 | Team card 3 | `assets/images/team/person-03.webp` | 740×660 |
| 11 | About main photo | `assets/images/about/main.webp` | 790×800 |
| 12 | About detail photo | `assets/images/about/detail.webp` | 580×670 |
| 13 | Testimonials 1 | `assets/images/testimonials/customer-01.webp` | 420×580 |
| 14 | Testimonials 2 | `assets/images/testimonials/customer-02.webp` | 420×580 |
| 15 | Testimonials 3 | `assets/images/testimonials/customer-03.webp` | 420×580 |
| 16 | Blog card 1 | `assets/images/blog/article-01.webp` | 840×620 |
| 17 | Blog card 2 | `assets/images/blog/article-02.webp` | 840×620 |
| 18 | Blog card 3 | `assets/images/blog/article-03.webp` | 840×620 |

## Source, quality, and licensing

- AI-generated original master: `assets/images/source/ai-hero-master.png` (1536×1024, RGB)
- Sample images are *cropped variants of this master*: images may repeat subjects in different sections; use them as a fully local **development baseline**, not a final photo library.
- Master, 18 derivative WebP images and `asset-contact-sheet.jpg` are bundled; no remote `images.unsplash.com` / `squarespace` links remain.
- Original `.fig`, original Figma images, layered PSD/AI/vector source **are not included**.
- Please replace image slots with actual licensed photos before commercial launch, and check any Figma Community license/rights separately.

## Workflow

Open `tools/image-manager.html` for a drag-and-drop Crop/Export workflow that works with local files. For detailed guidance see `docs/07-IMAGE-EDITING-GUIDE.md`.

## Editing paths

- All sections except Hero: `src/scripts/content.js` and local replacement file path.
- Hero Desktop and Mobile: `src/styles/04-sections.css` and `src/styles/05-responsive.css` respectively. Replace images under `assets/images/hero/` using identical filenames to avoid editing CSS.
- Photo slot manifest: `assets/images/manifest.json`, synced offline JS mirror `assets/images/manifest.js`.
