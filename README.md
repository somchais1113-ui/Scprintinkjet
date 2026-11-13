# SCWork V1.7.5 · Pricing Master

เริ่มที่ [START_HERE_V1.7.5.md](START_HERE_V1.7.5.md) สำหรับการตั้งราคาและส่งออกชุดขาย คู่มือด้านล่างเป็นประวัติเวอร์ชันก่อนหน้า

# SCWORK V1.7.4

**Start here:** [START_HERE_V1.7.4.md](START_HERE_V1.7.4.md) for setup and which ZIP to publish. Older notes below are historical.

# SCWORK Inkjet Sticker — Full Package V1.4.1

**Update:** Standardized all primary CTA buttons to the owner-approved `#FF6900`, with readable deep-navy labels `#061B3D`. Website, Calculator, Smart RFQ, Article, Blog and Admin tools use the shared `src/styles/18-cta-standard.css`. See `docs/28-V1.4.1-CTA-COLOR-GUIDELINE.md`.

**Existing v1.4 systems are retained.** Live customer RFQ/email still requires production backend configuration.

# SCWORK Inkjet Sticker — V1.4 Brand Consistency / Contact Layout Audit

This version updates the SCWORK brand implementation across the public site and tools.

**Before going live:** edit `config/public-config.js` and enter the shop's real `officePhone`, `mobilePhone`, and `lineId`. Until then, the top contact bar deliberately shows non-clickable setup placeholders. **Never use the competitor's contact numbers.**

See `docs/27-V1.4-BRAND-CONSISTENCY-AUDIT.md` for the changes and QA notes.

**Current release: SCWork Inkjet Sticker V1.1** — read `START_HERE_V1.1.md` for contact bar, language menu, 4-step flow, reference price calculator and RFQ handoff.

# SCWork — Inkjet Sticker Printing Website (Full Package)

Converted from the ProCleaning V2.5.7 source (with the user content merge). Layout, updated SCWORK blue/orange palette, multilingual support, animations, Site Manager, Image Manager and the original dashboard/RFQ workflow remain.

**Start here:** [`START_HERE_STICKERS.md`](START_HERE_STICKERS.md)

- Main page: `index.html`
- Article pages: `article.html?post=sticker-material-guide&lang=th`
- Sticker RFQ: `request-quote.html?category=Sticker%20%26%20Label`
- Website Manager: `tools/site-manager.html`
- Image Manager: `tools/image-manager.html`
- Business Admin (DEMO): `tools/index.html`
- Image assets: `assets/images/`
- Old docs: `docs/LEGACY-README-V2.5.7.md`

**Important:** image assets are illustrative AI design-study crops; no claim of actual machines or client work. RFQ in Demo Mode is local only. Real intake requires setting up Supabase/Resend/Turnstile and privacy safeguards. Do not enter personal data into the local demo. Company contact details and actual commercial capabilities must be verified and filled before publication.


## V1.2 — 14-language website selector
Open any public page and choose a language from the flag-and-language modal. English and Thai are managed through the existing Site Manager. The 12 other language dictionaries are editable in `data/extra-locales.js`.

**Scope:** The storefront, service cards, pricing categories, navigation, key CTAs, four order steps and article summaries are translated to the selected locale. Critical estimator and Smart RFQ headings are localized, but many specialist fields, rate-table details, extended article bodies, admin pages and generated quotations retain English/Thai source wording. This is an intentionally transparent partial translation, not a claim of full 14-language checkout. Review translations with native speakers before release.

## V1.6 + V1.7 (Current)
- Smart Quote customer UX: `smart-quote.html`
- Internal local-only Price & Cost Workbench: `tools/pricing-workbench.html`
- Start guide: `START_HERE_V1.7.md`
- Detailed QA & limitations: `qa/V17-DETAILED-RECHECK.md`
- **Homepage V1.5.1 HTML, CSS, JS and all Hero assets preserved unchanged.**


### Latest storefront enhancement — V1.7.1
This package adds a soft client-logo marquee, a richer contact footer, a floating contact assistant, and pricing-section CTA repositioning while preserving the approved homepage look. Configure real contact links in `config/public-config.js` or the Website Manager data source before publishing.
