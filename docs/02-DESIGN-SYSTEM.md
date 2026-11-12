# Design System & Visual Rules

## Color tokens

| Token | HEX | Role |
|---|---|---|
| `--color-primary` | `#36B864` | Main accent / buttons / badges |
| `--color-primary-hover` | `#2DA458` | CTA hover |
| `--color-ink` | `#111D15` | Headline / body emphasis |
| `--color-body` | `#666666` | Paragraph text |
| `--color-light` | `#F4F5F8` | Light surfaces |
| `--color-footer` | `#0E2015` | Footer, dark green |
| `--color-rating` | `#FF9300` | Star reviews |

Source Figma context supplied `#36B864`, `#111D15`, `#666`, `#F4F5F8`. Others are reconstruction decisions, not verified source tokens.

## Typography

- Primary: `Be Vietnam Pro` Google Fonts with Arial fallback
- Secondary: `Montserrat` Google Fonts with Arial fallback
- Desktop H1: ~54px; H2 ~44px; body 16px
- Design context also used `Gilroy-Medium` in limited places. **Gilroy font is not bundled** for licensing reasons; primary fallback is used. If a licensed Gilroy font is available, add it separately in your own environment.

## Layout

- Reference frame: 1440 × 7109 px
- Content max-width: `1170px` → 135px side margins at 1440px viewport
- Service cards: 3 columns × 370px with 30px gaps
- Grid style: 2-column info/product, 3-column card listing
- Images: corner radius 20–30px; overlapping photos framed in primary green
- Major CTA: green rounded rectangle; secondary CTA: border outline

## Responsive design

- Desktop: >= 1101px
- Compact desktop / tablet landscape: 781–1100px
- Tablet: 521–780px
- Mobile: <= 520px

The breakpoints are pragmatic developer decisions. Check on real hardware and adjust as needed.

## Edit rules / constraints

1. หลีกเลี่ยง Inline CSS ต่อ card: ให้แก้ CSS layer หรือ token เป็นหลัก
2. ไม่ใช้ absolute positioning กับทั้ง Section — แก้ content แล้วพังง่าย
3. รักษา visual density: หัวข้อชัด, body อ่านง่าย, spacing สมเหตุสมผล
4. ภาพต้องกำหนด `alt`, ratio และ object-fit เพื่อไม่ให้กระโดดหน้าโหลด
5. อย่าสร้าง CTA ที่ไม่มี action จริง. ฟอร์ม frontend นี้ใช้ mailto อย่างเปิดเผย
6. หากนำไปต่อธุรกิจ Printing ให้เปลี่ยน information architecture โดยไม่บังคับยึด copywriting ธุรกิจ Cleaning
