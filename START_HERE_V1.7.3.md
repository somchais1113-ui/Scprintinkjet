# SCWORK V1.7.3 — Client Logo Copy Refinement

## What changed
Only the text in the **client-logo marquee** was refined. No images, colors, layouts, fonts, price rules or other features were modified.

### Before an approved client logo is present
- TH: ลูกค้าและแบรนด์ / พื้นที่สำหรับโลโก้ลูกค้า / แสดงเฉพาะโลโก้ที่ได้รับอนุญาตให้เผยแพร่
- EN: CLIENTS & BRANDS / Customer logo showcase / Only client-approved logos will appear here.

### After at least one approved logo is configured
- TH: ความไว้วางใจจากลูกค้า / แบรนด์ที่ร่วมงานกับ SCWORK / ขอบคุณทุกแบรนด์ที่เลือกใช้บริการผลิตสติกเกอร์กับเรา
- EN: CLIENTS & PARTNERS / Brands working with SCWORK / Thank you to the brands choosing SCWORK for sticker printing.

Add approved logos in `data/client-logos.js` with `approved: true` and a valid local file path under `assets/images/client-logos/`.

**Important:** Placeholders are not verified clients. Obtain authorization before displaying external brand logos. Uploading logos to the folder is not sufficient; mark records approved only after permission is confirmed.

## Local testing
From the extracted package directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`.

The project is a frontend prototype until real contact information, approved sales rates, and backend integrations are configured.
