# Figma node → code map (Desktop 1440 × 7109)

ที่มาของตัวเลข: Figma file / page `Design` (`0:1`) / Root frame `0:3`.

| ลำดับ | Figma node | Section | Top (px) | Height (px) | Implementation |
|---:|---|---|---:|---:|---|
| 01 | `0:431` | Navigation bar | 0 | 98.276 | `index.html` `.site-header` |
| 02 | `0:418` | Hero section | 98.276 | 585 | `index.html` `.hero` |
| 03 | `0:196` | Services Section | 684 | 904 | `#services` + `#servicesGrid` |
| 04 | `0:241` | Quote section | 1588 | 571 | `.quote-section` |
| 05 | `0:253` | Team section | 2159 | 881 | `#team` + `#teamGrid` |
| 06 | `0:363` | About Section | 3040 | 618 | `#about` |
| 07 | `0:6` | Pricing section | 3658 | 1041 | `#pricing` + `#pricingGrid` |
| 08 | `0:48` | Testimonials Section | 4699 | 434 | `.testimonials` |
| 09 | `0:85` | Blog Section | 5133 | 911 | `#blog` + `#blogGrid` |
| 10 | `0:123` | Contact Info section | 6044 | 656 | `#contact` |
| 11 | `0:164` | Footer section | 6700 | 409 | `.footer` |

**หมายเหตุ:** Top ของบาง section ปัดเป็นจำนวนเต็มจาก Figma metadata. CSS section height เป็น layout-based, **ไม่ใช่ absolute fixed heights** ทั้งหมด เพื่อให้เนื้อหาปรับแต่งและตอบสนองต่อ viewport ได้ นี่คือการ mapping ตามโครงสร้าง ไม่ใช่หลักฐานยืนยัน pixel-perfect.

## Components ที่มีปฏิสัมพันธ์

- `menuToggle` → เปิด/ปิด navigation บนมือถือ
- `serviceNext` → วนลำดับ service cards 3 รายการ
- `[data-billing]` → monthly/yearly demo billing
- `testimonialPrev` / `testimonialNext` → หมุนตัวอย่างรีวิว
- `quoteForm` → ตรวจฟอร์มและเปิด mailto; **ไม่ได้ส่งข้อมูลเข้าสู่ database**

## Figma sections กับชื่อ CSS

- Shared section introduction: `.section-intro`, `.section-intro__aside`
- Cards: `.service-card`, `.team-card`, `.price-card`, `.blog-card`
- Overlapping framed images: `.overlap-photos`, `.framed-green`
- Typography/CTA: `.eyebrow`, `.button`, `.button-group`

## ต้นแบบและ responsive

ตรวจพบต้นแบบหลักเป็น Desktop ที่ 1440px. Responsive 1100px / 780px / 520px เป็น **การออกแบบต่อจาก pattern** ไม่ใช่ screenshots ที่ยืนยันจาก Figma mobile frames.
