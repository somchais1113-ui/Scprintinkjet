**Current release: SCWork Inkjet Sticker V1.1** — read `START_HERE_V1.1.md` for contact bar, language menu, 4-step flow, reference price calculator and RFQ handoff.

# SCWork — Inkjet Sticker Printing Website (Full Package)

Converted from the ProCleaning V2.5.7 source (with the user content merge). Layout, green palette, TH/EN, animations, Site Manager, Image Manager and the original dashboard/RFQ workflow remain.

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
