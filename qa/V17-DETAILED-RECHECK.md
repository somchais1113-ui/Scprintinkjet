# SCWORK — V1.6 + V1.7 Detailed Recheck

**Date:** 13 November 2026  
**Baseline:** `SCWORK_Inkjet_Sticker_v1.5.1_Homepage_Preserved_Full_Package.zip`  
**Scope:** Smart Quote UX and private cost/pricing workbench only; no Homepage redesign

## Status summary

| Area | Outcome | Test / evidence |
|---|---|---|
| Homepage fidelity | **PASS** | `index.html`, 4 Hero photos, theme/animations and related CSS/JS compared against baseline: **29 identical files**, no modification |
| Homepage CTA color | **PASS** | Computed header CTA `rgb(255, 105, 0)` = `#FF6900` |
| Quick/Guided quote journey | **PASS** | `data-mode` switches, Help me choose shows appropriate questions and switches outdoor material to PVC m² |
| Size & quantity shortcuts | **PASS** | 500→1,000 changes DEMO example ฿625.95→฿1,203.75; 5×5→8×10 changes to ฿3,145.80; values are **DEMO ONLY** |
| Live calculation | **PASS** | A3+ min sheets, m² pricing, tier bands, addons, VAT and minimum-order surcharge tested |
| Artwork | **PASS** | None / LINE / URL, valid URL checks; no file inputs or upload endpoints in public Smart Quote |
| LINE | **PASS, conditional** | ID validation, safe message draft, encoded URL and no auto-send; user must set real LINE OA before live use |
| Supplier costing | **PASS, prototype** | Material, print, finishing, waste, setup, outsource, inbound freight, overhead, margin and minimum charge calculated locally |
| Required costs before publish | **PASS** | All 6 materials + addon costs required, explicit approval checkbox required |
| Private → Public export | **PASS** | Export tested end-to-end; `pricing-public-data.js` contained only customer-facing prices and product details, not supplier/overhead/margin inputs |
| Public price card consumption | **PASS** | Approved exported sample loaded by Smart Quote; badge changes to Reviewed Rate Card + correct version; still says estimate |
| Responsive / JavaScript | **PASS (inlined Chromium)** | 1,440 / 390 / 320 px Smart Quote, 1,440 / 390 px Workbench. No horizontal overflow or uncaught JS errors in tested pages |
| CSS & layout | **PASS** | Mobile Workbench overflow issue found and fixed before packaging |
| 14 languages | **BASELINE RETAINED** | Existing public locale test passes; new Smart Quote is Thai / English with English fallback for other languages, not 14-language-complete |
| Live deployment | **NOT TESTED** | No live hosting, domain, real LINE message or real supplier price validation |

## Automated regression tests

Passing: `npm run check:smart-quote`, `npm run check:cta`, `npm run check:locales`, `npm run check:v17`.

**Known outdated baseline tests (not introduced by this version):**
- `npm run check:pricing` assumes `index.html` must link to legacy `pricing-calculator.html`, although V1.5.1 intentionally routes price CTAs to `smart-quote.html`. The same check fails on the untouched V1.5.1 baseline.
- `npm run check:legacy` expects `assets/images/source/ai-hero-master.png` and exactly 18 image slots, but the V1.5.1 baseline already contains 21 slots and lacks that legacy source file. The same check fails on V1.5.1.
- `npm run check:brand` checks an obsolete v1.4.1 package marker and also fails on the V1.5.1 baseline.

These test assertions must be updated or retired in a future housekeeping sprint. Their failure is not evidence of failure in the new functionality. They are not marked PASS.

## Commercial and security constraints

- **NO APPROVED PRICE** shipped in the ZIP. `data/pricing-public-data.js` remains a deliberate **null placeholder**. The demo rate card remains unverified.
- Rate calculations are estimates and do not verify substrate/printing constraints, detailed artwork, proofing, packaging, shipping to customer or payment fees.
- The Cost Workbench is restricted to local browser origins (`localhost`, `127.0.0.1`, file mode). Editing is disabled on public-hosted origins, but this remains a prototype rather than a secure multi-user financial tool. Do not save real supplier costs in a public website origin; use authenticated backend for production.
- `tools/pricing-workbench.html` exists inside package for local testing; do not treat an unrestricted `/tools/` URL as a secure admin login.
- `data/pricing-demo-data.js` is still publicly shipped and contains demo rates. Only explicitly approved public sticker rate exports are used by `smart-quote.html`; legacy `pricing-calculator.html` remains demo.
- LINE prefill is a draft. Launching LINE does **not** confirm message delivery or create a lead in CRM; no automated email or backend/order sync has been added.
- Only customer-provided Artwork URLs are included in LINE drafts. No uploaded images or artwork stored by SCWORK.

## Human acceptance before first live customer

1. Compare actual V1.5.1 homepage/Banner on deployed preview against the screenshot, at 1,440/390/320 px.
2. Verify genuine LINE OA ID in `config/public-config.js`, test on iPhone/Android/Desktop, and confirm drafted message appears before manual Send.
3. Enter actual costs per material and addon, check waste, supplier quote currency and quantity breaks, VAT and target margin.
4. Export and inspect public rate card before deployment; verify no cost fields or sensitive data are included.
5. Test public deployment, browser cache, 14-language homepage, invoice/CRM workflows and mobile keyboard handling.
6. Have a real print-production expert validate A3+ nesting, material compatibility and special contour-cut prices; the estimator uses simplistic rectangular nesting.

## Files and screenshots

- `previews/v1.7/smart-quote-desktop.png`, `smart-quote-mobile.png`, `smart-quote-narrow.png`
- `previews/v1.7/pricing-workbench-desktop.png`, `pricing-workbench-mobile.png`
- `qa/v17-browser-results.json`
- `qa/v17-homepage-preservation.json`

**Testing note:** Direct local URL navigation was blocked by the Chromium test environment. Screenshots and interactions used the HTML/CSS/JS loaded inline with original local images embedded. Full deployed-URL E2E remains unverified.
