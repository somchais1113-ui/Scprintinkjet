# V1.7.4 Verification

- PASS: Main storefront, legacy pricing arithmetic, 14-locale data, V1.7 workbench and pricing export checks, V1.7.3 client-logo copy with V1.7.4 display rules, V1.7.4 flow checks, and exact #FF6900 CTA contract.
- PASS: JavaScript quote DOM contract for Thai/English, non-TH/EN fallback, material guidance, blank advice, missing/configured LINE and phone, unapproved and approved rates, invalid links, and clipboard permission fallback. This runs the actual quote script with test DOM objects and synthetic data, not a real device.
- PASS: Original hero images and brand icon/logo assets match V1.7.3 byte-for-byte.
- PASS: Public ZIP references resolve, and public build excludes admin tools, unapproved demo rates, forms and backend configuration files other than the public browser settings.
- Browser and device QA pending: the local runtime could not start Chromium and the separate browser could not open the local preview. The optional Playwright test is provided for rerun on a supported development machine. Actual iPhone/Android layout, connection to the real LINE OA, and receipt of a real manually sent message are not claimed.
- No public deployment or real message send was performed. Contact information and rate-card approval are intentionally left unset.

LINE URL scheme reference: https://developers.line.biz/en/docs/messaging-api/using-line-url-scheme/#opening-a-chat-screen-with-a-line-official-account
