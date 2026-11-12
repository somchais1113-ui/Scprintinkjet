# SCWork Inkjet Sticker Website v1.2 — Multilingual Upgrade

This is the **complete source package**, built on SCWork Inkjet Sticker v1.1 (including pricing calculator, Smart RFQ, Dashboard, Website/Image Managers). No backend credentials are included or configured.

## Start

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`, then click the language control in the header. Choose from **14 languages** in the two-column picker. On mobile the list becomes a scrollable single column. Preferences are stored in the same browser when localStorage is available.

## Where to edit

| Purpose | File |
|---|---|
| English + Thai copy | `data/site-data.js` (or `tools/site-manager.html` for TH/EN) |
| Other 12 languages | `data/extra-locales.js` |
| 14-language popup | `src/scripts/language-modal.js` |
| Popup styles / narrow layout | `src/styles/17-language-modal.css` |
| Translation merging, persistence | `src/scripts/i18n.js` |
| Price calculator UI strings | `src/scripts/pricing-calculator.js` plus `data/extra-locales.js` |
| Smart RFQ UI strings | `src/scripts/rfq-demo.js` plus `data/extra-locales.js` |

## Language list

Arabic, Burmese, Simplified Chinese, Dutch, English, French, German, Italian, Japanese, Korean, Russian, Spanish, Thai and Vietnamese.

## Scope / caveats

The **main storefront** and essential RFQ / estimator messages are translated. The **full article body**, some technical form labels, option names, backend email templates, Admin Dashboard, quotation documents and Site Manager remain in the available **English/Thai source language**. The modal explicitly states this limitation; no translation claims are made for those areas. Existing user-provided text inside the content editor is not automatically machine translated.

The price calculator is still demo-only. Supabase / Resend must be configured separately for real RFQ submissions. Please verify translations with native speakers before commercial publication, particularly legal and customer instructions. Current runtime language switching is client-side; multilingual SEO routes and `hreflang` are not yet implemented.

See `docs/26-V1.2-MULTILINGUAL.md` and `qa/V12-QA-REPORT.md`.
