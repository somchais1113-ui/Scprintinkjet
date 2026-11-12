## V2.5.7 — Balanced Vertical Rhythm & Full-Page Spacing QA (2026-11-11)
- Audited the complete public landing page, including Desktop/Tablet/Mobile and TH/EN.
- Introduced a new late-loaded spacing system (src/styles/13-spacing-system.css), using the Website Manager's existing design.sectionSpacing token.
- Reduced excessive section top/bottom padding, intro gaps and card whitespace, while retaining a clear hierarchy and readable text.
- Tightened pricing card heights / feature rhythm and long-form article line spacing without hiding or removing content.
- Preserved the approved full-bleed Hero grid, CTA alignment, four carousel dots, motion, bilingual editor, blog expansion, RFQ and all Admin modules.
- Added responsive visual QA, interaction QA, local asset checks and documented before/after measurements.
- See docs/23-V2.5.7-SPACING-AUDIT.md and qa/V257-QA-RESULTS.md.

## V2.5.6 — Service CTA + Blog Articles
- Changed all three service cards to the same brand-green quotation CTA with consistent hover.
- Removed fixed minimum heights on blog title and excerpt; tightened vertical rhythm and kept read-more links aligned.
- Added "View more articles" / "ดูบทความเพิ่มเติม" dynamic progressive listing (3 per click, can collapse).
- Read-more now opens a functioning dedicated `article.html` page, not the Contact section.
- Added bilingual full-article content support in Unified Website Manager, including stable IDs for new posts and a full-article reader.
- Added responsive article design, safe text-only rendering, and QA documentation.

## V2.5.5 — Motion Design Enhancement (2026-11-11)
- Added a dedicated animation layer without changing the verified V2.5.4 Hero grid or dot alignment.
- Enhanced carousel with a cinematic image zoom and crossfade; slides rotate every 6 s.
- Added a staggered headline/CTA entrance, scroll-activated reveal of sections and cards.
- Added subtle card-image zoom, floating detail photos, button micro-interactions and a thin scroll progress indicator.
- Pauses carousel when the tab is hidden; prefers-reduced-motion disables autoplay and CSS animation.
- Preserved bilingual content, all local assets and the existing Admin / RFQ functions.

## V2.4.0 — Smart RFQ / Quotation Builder (2026-11-09)

- Added bilingual printing RFQ wizard with category-aware quantity units, materials, finishes, artwork readiness and review screen.
- Added new Admin Quotation Builder with multiple editable rows, direct costs, discounts, customer shipping, optional VAT, gross-profit estimates and immutable revisions.
- Added printable A4 document with DEMO watermark (browser Print → Save PDF), without collecting customer credentials or payment details.
- Linked new tools in unified Admin hub / business sidebar; retained previous dashboard, CRM, orders and content/image/language tools.
- Extended demo data store without changing its localStorage key or version-1 schema; new quote-derived orders carry net-of-VAT revenue for more accurate gross margin.
- Added automated tests for calculations, backwards compatibility, RFQ→Quotation→Order and duplicate guards; browser visual QA could not be completed because navigation is blocked in this environment.
- Business/public demo remains static and not suitable for storing real customer information, private artwork or live RFQs.

---

## V2.3 — Unified Business Dashboard Prototype (2026-11-09)

- Added `tools/index.html` unified tools home and linked it from Website/Image Managers.
- Added `tools/business/` modules: Dashboard, Customers, RFQs/Quotations, Orders.
- Added synthetic demo datasets in `data/demo/` and localStorage-backed workflows with JSON backup/import and CSV export.
- Added cohort-based Quote Win Rate and RFQ-to-Order Conversion; quote versions are de-duplicated.
- Added quote lost reasons, demo order creation, production status updates, filters and interactive charts.
- Security boundary: no real customer records, public website RFQ integration, backend, authentication, payment, inventory or cloud synchronization.
- Retained V2.2 TH/EN public website and content/image managers; existing functionality not intentionally altered.

---

# V2.2.0 — TH/EN bilingual website (2026-11-09)

- Added accessible TH / EN toggle in responsive header, preserving the original Figma-inspired English layout.
- Added Thai copy for every major section, card, navigation item, form label, feedback message and footer; English master copy remains unchanged.
- Added `src/scripts/i18n.js` with locale resolution, fallback to English, safe localStorage preference and URL `?lang=` support.
- Added Thai typography with Noto Sans Thai font and responsive adjustments in `src/styles/07-language.css`.
- Added `i18n.defaultLanguage` selector and bilingual editing mode to Unified Website Manager; previews follow the chosen editing language.
- Exported changes ZIP contains both EN and TH texts and any user-applied images, with `schemaVersion: 2`.
- Kept all 18 image assets and V2.1 functionality.
- UI was tested in a sandboxed browser DOM harness; full hosted QA remains recommended.

---

# V2.1.0 — Unified Website Manager

- New `tools/site-manager.html` with all page text fields and collection editors
- New `data/site-data.js` single source of truth for copy, cards, contact, pricing, and design tokens
- Browser-based image crop/queue for 18 local asset slots
- Desktop (virtual 1440px), tablet (768px), and mobile (390px) preview controls
- Draft autosave to browser localStorage for content/design (not binary images)
- Export ZIP patch with updated data and applied WebP images; Import/Export JSON backup
- No CMS backend or GitHub auto-publish; patch must be extracted over the site root
- Original AI-generated photos remain; Figma originals are still unavailable

# Changelog

## 2.0.0 — Local images + image editor (2026-11-07)

- Replaced all externally hosted preview photos with **18 local WebP assets**.
- Added full-resolution AI-generated hero master PNG and contact sheet.
- New desktop/mobile Hero image sources; CSS now refers to bundled local assets.
- Added offline Image Asset Manager (drag-and-drop, zoom/focus, crop-to-cover, WebP export).
- Added manifest.json and manifest.js for all image slots and suggested dimensions.
- Rewritten README and asset/photo replacement guide; stricter validation.
- Clear documentation that this is a Figma-inspired rebuild, not a verified 1:1 export.

## 1.0.0 — Initial website package

- 11 sections, responsive styles, content config, cards, pricing toggle, testimonials and mailto form.
- Existing external sample images were not bundled. Fixed in v2.0.0.

## V2.5 — Connected RFQ & Email Foundation (2026-11-10)
- Removed legacy contact-form mailto submission and replaced with unified general inquiry route.
- Added connected-mode Smart RFQ form, staff contact fields, stable idempotency tokens, optional Cloudflare Turnstile; explicit demo mode remains default.
- Added Supabase migrations (RLS, staff, customers, RFQs, notification outbox, rate limiting), Edge Functions for intake and Resend email/worker.
- Added staff-authenticated read-only Live RFQ Inbox, separate from localStorage demo Business modules.
- Added deployment checklist and draft privacy notice; no production credentials or live backend included.


## V2.5.1 — Hero Carousel & Scroll Alignment Fix
- Replaced the single hero image with a 4-photo rotating carousel on the homepage.
- Added manual previous/next controls and dot navigation for the hero carousel.
- Improved anchor scrolling so section links land closer to the visible section heading.
- Removed the global scroll padding that caused hash links to stop too early.
- Adjusted responsive hero behavior for mobile layouts.


## V2.5.2 — Hero Dots Layout Update
- Removed left/right arrow controls from the hero carousel.
- Moved the 4 carousel dots to the right side of the hero area.
- Kept auto-rotation and dot navigation.


## V2.5.3 — Full-Bleed Carousel and Compact Navigation
- Fixed native `<figure>` margin that caused white borders around the Hero image.
- Aligned the four compact pagination dots to the right at CTA-button height.
- Kept 4-photo rotation and clickable dots; no arrow controls.
- Preserved bilingual site, Website Manager, RFQ, and Business Admin.


## V2.5.4 — Hero Layout Regression Fix
- Corrected desktop Hero CTA overlap: title and description occupy the first grid row; action buttons and right-side four-dot carousel occupy the second.
- Compact 6px indicator visuals with 20–22px click targets; no arrows.
- Fixed full-bleed image geometry by resetting figure/image margins and using object-fit cover.
- Added cache-busting ?v=2.5.4 to homepage stylesheet and JavaScript URLs so browsers fetch the updated layout.
- Preserved TH/EN, Manager, RFQ and Admin modules; restored Image Manager override support for carousel imagery.

## V2.5.7 + Content Sync (2026-11-12)
- Applied 17 English copy updates from user's V2.2 export into the V2.5.7 website baseline.
- Kept all HTML/CSS/JS features and TH/EN tooling unchanged.
- Saved backup and audit under `patches/2026-11-12-content-sync/`.
- Follow-up required: TH language, service cards, imagery, brand naming, pricing and blog content still reference cleaning services.

## SCWork Sticker Conversion 1.0 (from v2.5.7)
- Repositioned public website to Inkjet Sticker Printing in both TH and EN.
- Replaced all public-facing images with local illustrative print/sticker graphics.
- Replaced false subscription pricing with job-based quote cards; preserved original card layout.
- Repositioned team cards as workflow capabilities and testimonials as illustrative applications (not real customer testimonials).
- Updated 3 full articles, service card links, and hero 4-photo sequence.
- Preserved all underlying Admin, quote builder, orders, image manager, motion and RFQ logic.
