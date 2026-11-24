## V2.1.28 — Portfolio cinematic banner, clearer copy & six aligned materials (2026-11-24)

- Updated portfolio hero to four *single-scene* photographic slides using Cinematic crossfade (880ms) and slow zoom-in (7.5% over 9s), pause/previous/next/dots and reduced-motion support; the 20-item gallery remains intact.
- Removed price-related Thai “เบื้องต้น” text from displayed quote CTAs and rate summaries; retained disclosures when a price is not confirmed. Unrelated uses of the Thai word were deliberately left intact.
- Removed long inline image-mockup notes from the requested homepage material/portfolio positions and the long portfolio gallery note. Retained a short site-level disclosure that illustrative images do not depict verified client work.
- Replaced the visible client-logo marquee pause phrase with an accessible icon-only pause control; animation controls remain functional.
- Improved the hierarchy of the 3 service comparison cards by increasing font size/contrast and tightening vertical padding; no artificial price claims.
- Added **six material shortcuts** near the 3 service categories; reconciled the public quote-material options with the original five gallery substrates plus non-adhesive banner vinyl. Direct material deep links preselect the correct item, never injects a price.
- Tightened footer row spacing and enlarged regular-weight link text without making everything bold.
- Does not modify approved print price formulas, Smart Quote billing math or customer information.

## V2.1.27 — Sixth material: Vinyl banner

# SCWork Inkjet Sticker V2.1.27 — Material Gallery (6 types)

Based on V2.1.26. This update changes only the homepage material gallery.

- Preserves the original five materials: white paper, kraft paper, white PP, clear PP and adhesive PVC.
- Adds **Vinyl banner (PVC flex)** as material six. This is normally **non-adhesive** signage media; it is distinct from PVC sticker film.
- Adds the sixth card and exactly three modal slides (raw material, illustrative printing process, finished banner mockup) with TH/EN details, benefits and application notes.
- Resizes the material gallery to a balanced 3x2 on desktop and 2x3 on mobile.
- Does **not** add any new purchasable grade, price or rate card to the quote engine. Actual availability and suitability require commercial confirmation.
- All visuals are illustrative and should not be presented as actual client production or certified substrate specs.

Main modified files: `index.html`, `src/scripts/material-gallery.js`, `src/styles/27-material-gallery.css`, new material assets under `assets/images/materials/` and `assets/images/material-preview/v216/`.

## V2.1.26 — Portfolio & Pricing Content Hierarchy
- Added 20-item categorized portfolio directory; homepage link and card navigation.
- Improved pricing comparison headings, concise decision-useful facts; removed oversized price banner.
- Updated credit-term benefit label. Preserved other systems.

## V2.1.25 — Homepage portfolio production imagery
- Kept all three approved homepage portfolio categories and layout unchanged.
- Replaced only homepage portfolio visuals with three scene-based examples that show Asian-looking illustrative workers and the matching production process/output: product-label inspection/printing/packaging, die-cut review/cutting/finished stickers, and large-format installation/printing/vinyl.
- Smart Quote's product-choice images remain untouched; pricing, hero, knowledge hub, footer, navigation and bilingual functionality are unchanged.
- Updated bilingual disclosures to clarify that AI-created workers and process scenes are illustrative and **not actual SCWork employees, factory documentation or verified customer work**.
- Files: `assets/images/portfolio/*.webp`, `index.html`, `src/scripts/main.js`.

## V2.1.24 — Navigation, quote feedback and spacing

- New localized Portfolio nav and clearly marked work-type examples.
- Selected-style orange hover and improved service navigation typography.
- Live quote state and billing calculation status; existing pricing/tax formulas unchanged.
- Compact client credits and eyebrow removal.

## V2.1.21 — Service information editorial redesign

- Four service pages rebuilt as typography-first layouts with contextual photographs, reduced icons, clearer content hierarchy and coherent navigation.
- Home benefit strip simplified to typographic links, with mobile horizontal scrolling.
- Original TH/EN content and button destinations preserved; accessible image alternatives added.
- V2.1.20 cinematic zoom-in and orange/white CTA styles preserved without modification.

## V2.1.20 — Hero Slow Zoom-in & White Text on Orange CTA (23 November 2026)

- Homepage cinematic hero: slow, linear **zoom-in** from `scale(1)` to `scale(1.075)` over 9 seconds on each active photo (approx. 6% zoom during the existing 7.4-second slide interval). Foreground copy, buttons, controls and overlay stay stationary.
- Preserve photo animation through the existing 880ms crossfade with a temporary `.is-exiting` state to avoid an outgoing frame snapping to its starting scale. Four photos, slide narratives, autoplay and controls are unchanged.
- Respect reduced-motion preference: no zoom movement and no automatic slide rotation, matching existing site behaviour.
- Owner-requested brand CTA styling: **#FF6900 background + white (#FFFFFF) labels** across homepage and other public website pages, plus shared tool buttons. Secondary/ghost/selection/disabled controls retain their intended colors.
- CSS query versions bumped so deployed browsers load the revised stylesheet; no changes to pricing logic, images or application data.
- Accessibility caveat: white on `#FF6900` yields approximately **2.89:1 contrast**, below WCAG AA normal text. Orange hue is preserved exactly per owner instruction.

## V2.1.19 — Cinematic Main Banner

- Replaced split-image homepage hero with a full-bleed four-story banner based on the supplied reference video.
- Retained existing SCWork Inkjet, label, die-cut and window-graphics imagery and preserved the main quotation CTA.
- Added contextual bilingual slide copy, image crossfade, subtle photo motion, compact previous/pause/next/dots controls and scroll cue.
- Added desktop/tablet/mobile crops, accessibility and reduced-motion behaviour.
- Pricing, quotation, navigation and other homepage sections remain unchanged.

## V2.1.18 — Quotation UX Refinement

- Redesigned quote entry choices as readable title-over-description cards with navy headings and orange selection state.
- Improved step 03 artwork options with accessible native radios and clear descriptions for send-later, LINE and link workflows.
- Added responsive layouts and explicit TH/EN translations without changing pricing calculations or existing selection values.
- Added focused QA and public build inclusion for `33-quotation-ux-refinement.css`.

## V2.1.17 — Services Crossfade & Approved Chrome Favicon

- Services section now crossfades the complete set of visible cards when its arrow is pressed, with a 670ms paired-layer opacity transition, image preloading and reduced-motion support.
- Installed the exact approved multi-size Favicon files provided by the user, and linked them across live HTML routes, including the quote pages.
- Updated public-package builder so Favicon assets and the services animation stylesheet are shipped together.
- No changes to service content, artwork, the hero carousel, pricing calculations, VAT or contact workflows.

## V2.1.16 — Material Stories & Two-Layer Crossfade

- Kept all five material-card thumbnail images unchanged.
- Rebuilt each material's modal sequence as Surface → Printed/Cut Material → Product Application (15 images, 10 new optimized WebP files).
- Added true two-image overlap crossfade with directional motion, preloading, disabled rapid-click controls and reduced-motion support.
- Updated per-slide captions in Thai/English and labeled the visual references as mockups rather than certified material specifications or verified customer projects.
- Refined responsive modal scrolling while retaining the liquid-glass blue-tinted control bar, existing pages, pricing and branding.

## V2.1.15

- Added smoother image transitions to the sticker material modal for arrow navigation, dots and autoplay.
- Improved the motion behaviour of the right-side content panel during slide changes.
- Added temporary disabled states for material modal navigation controls during transitions to prevent rapid-click jitter.
- Updated asset query versions to `2.1.15` for the refreshed material-gallery experience.

## V2.1.14

- Reworked the sticker material modal content and image references so each material now shows more relevant surface, application and real-use examples.
- Added a new `assets/images/material-preview/` image set for the richer modal experience.
- Restyled the bottom image info bar and controls with a liquid-glass blue-tint treatment.
- Refined modal typography, panel styling and visual hierarchy for a cleaner presentation.

## V2.1.13

- Removed the “SCWORK confirms pricing after reviewing your specs/artwork” helper copy from the home pricing area and smart quote summary.
- Strengthened heading weight in the sticker materials section and the preview modal.
- Upgraded the material preview modal into a richer in-page slider with arrows, dot navigation, auto-rotation, material benefits and real-surface usage examples in Thai/English.

## V2.1.12 — Hero width, remove updates, premium quote selection cards
- Standardize all four homepage hero slides in a 1170px centered frame with mobile crop.
- Remove service-update ticker; retain four linked feature badges.
- Replace 3 quote-type pictures with 3 high-resolution dedicated work-type images and responsive selectable cards.
- Keep quote calculation, approved price settings, billing, language switch and other sections unchanged.

# V2.1.11 — Benefit detail pages

Linked the four homepage benefit cards to dedicated Thai and English detail pages. The strip and its notice rotation retain their existing layout and behaviour. Existing quote and order tools are unchanged.

# V2.1.10 — Service strip polish

Refined the homepage benefit strip, added gentle automatic notice rotation with pause and manual controls, and kept all other page content and checkout/quote behaviour unchanged.

# V2.1.9 — Top benefits strip

Added four brand-styled benefit badges and a manually browsable service notice bar above the hero. Rating figures and custom delivery copy are optional SCWork configuration.

# V2.1.8 — Hero photography and footer icon strip

Added four hero photographs in a protected right-hand image panel, refreshed the three workflow photos, and added a footer icon strip with optional payment and DBD configuration. Homepage hero typography and pricing logic are unchanged.

# V2.1.7 — Matched swatch marks and new home photography

All five material images use a single shared vector mark in the same size, colour and placement. Three service photos and three production workflow photos were replaced with subject-specific images. The quote engine, contact bar and other pages are unchanged.

# V2.1.6 — Sticker material gallery

Replaced the homepage application carousel with five material swatches and accessible image previews. The help bar, quote rules and other pages are unchanged.

# V2.1.5 — Sticky support bar

Added a fixed, touch-friendly help bar with an original bear mascot on the six public storefront pages. It uses the existing configured contact channels, supports an optional verified LINE QR, and stacks cleanly below the Smart Quote mobile summary.

# V2.1.4 — Process backdrop, logo mockups and estimate links

Added the existing print-floor image at 15% behind the four-step process, standardized its orange to the Pantone 1505 C screen equivalent, added six clearly labeled logo mockups to the slower loop and increased estimate CTA typography.

# V2.1.3 — Client credits and print texture

Replaced the redundant About block with client credits and a single grayscale logo loop. Added a 15% print-photo overlay without changing the pricing cards. The section remains visible as a thank-you message if no client logos are configured.

# V2.1.2 — Home application cards

Moved the three popular print applications into the former pre-print spec section, removed the redundant quote promotion and enlarged the descriptions on the three cards. Kept quote routes, prices and image files unchanged.

# V2.1.1 — Clean interface symbols

Removed emoji flags, phone glyphs, decorative arrows and status marks from public and staff UI, including generated labels. The 14-language picker now uses short codes and native language names. Preserved all images, quotes, billing logic and page routes.

# V2.1.0 — Buyer types, settlement and print

Features a clear estimate/VAT/withholding breakdown, buyer selection, an isolated demo and printable estimate/specification. Retains the six uploaded images and leaves seller VAT and commercial rates unconfirmed.

# V2.0.0 — Project follow-up and reorder

Added a Thai/English tracking page that reads the latest staff-published status using a private link, plus a local reorder spec import. Full-only Order Desk exports allowlisted status snapshots and separate repeat specifications from the confirmed delivered scope. No live orders, deployed service, or staff data ship with the release.

# V1.9.0 — Enterprise project quotes

Added a separate bilingual multi-SKU project brief with a stable reference across brief revisions, requested date and procurement documents. Added a Full-only Project Desk for sharing reference blocks, checking the approved proof revision against the current quotation and recording manual handoff notes. Standard label pricing, homepage and proof examples are unchanged.

# V1.8.2 — Standard PP label estimates and LINE handoff

Compare three approved quantities for 5 × 5 cm standard-cut white PP labels, with total, average per label, VAT treatment and shipping exclusion. Route other specs to a manual quote. The landing CTA and quote share one price gate. LINE OA can open a prefilled draft when the real account is configured. Includes a local launch check. The packaged rate card and contacts remain unset.

# V1.8.1 — Label trust and review

Added a four-step customer process, a bilingual illustrative print proof and an opt-in gallery for three actual FORM 01 white PP print photos. Empty contact channels and the unconfigured photo gallery remain hidden. Preserved the concept renders, homepage, quote handoff and pricing.

# V1.8.0 — Product label landing page

Added a separate Thai/English campaign page featuring two coordinated bottle and print-sheet concept renders. Quote and material advice use the existing flow. Homepage, Smart Quote logic and Pricing Master are unchanged from V1.7.5.

# V1.7.5 — Pricing Master

- Shared electricity, fuel and inbound freight rates, allocated per material using actual usage.
- Draft comparison, selective approved-rate export, private JSON backup and revision history.
- Same-spec totals no longer fall at tier boundaries on new Master exports.
- Unapproved rates remain disabled. Homepage visuals and quote handoff are unchanged.

# V1.7.4 — Unified quote and LINE handoff

- Storefront and article quote links use one path. Legacy tools and forms are retained only in the full development package.
- Added optional advice request, LINE draft and copy/paste fallback, and localized Thai/English quote interface.
- Public estimates show only when an approved rate applies. Unconfigured contacts and unapproved logo slots are hidden.
- Preserved homepage hero artwork, brand logo, and #FF6900 primary action color.

## V1.7.3 — Client Logo Copy Refinement
- Simplified the Thai headline and description in the client-logo marquee.
- Added conditional TH/EN copy: placeholder wording before approved client logos, credibility wording after at least one approved local logo.
- Preserved Homepage artwork, layouts, colors, animations, CTA styling, Smart Quote, Pricing and Admin.
- Refreshed page copy defaults and cache busting for the updated script.

## V1.7.2 — UI Refinement Update
- Refined floating contact assistant to icon-only round buttons with consistent visual style.
- Enlarged contact method icons and typography for easier scanning on mobile.
- Updated Smart RFQ promo panel in the contact section to a dark navy treatment.
- Rewrote customer-logo credibility copy and switched placeholder logo labels to Thai.

## V1.7 — Smart Quote UX + Pricing & Cost Management (2026-11-13)
- V1.6: Quick material journeys, clickable size & quantity presets, live price per piece and minimum-order breakdown, mobile actions; no artwork uploads.
- V1.7: local-only Cost Workbench for supplier, material, print, finishing, waste, setup, freight, overhead and minimum charge; margin-based tier rate suggestions and public-only approved rate-card export.
- Public Smart Quote defaults to explicitly labeled DEMO rates until an approved rate file is deployed.
- Preserved original V1.5.1 homepage HTML, hero assets, CSS and animation scripts byte-for-byte.
- Private cost draft must not be deployed; production security and supplier rates remain unverified.

## V1.4.1 — CTA brand color standardization (13 Nov 2026)
- Set every primary CTA background to the exact HEX `#FF6900` across website, pricing, RFQ, blog, article and internal tools.
- Use dark navy `#061B3D` text for accessible contrast on orange; hover keeps the same orange and adds a soft shadow.
- Preserve secondary/outline actions and the approved navy/orange logo.
- Update Website Manager default primary swatch and migrate legacy SCWORK draft color defaults on load.
- Added a dedicated shared CTA stylesheet loaded **last** on every HTML page, plus a validation script.


## v1.4 — Brand Consistency, Contact Bar and Full UI Audit
- Refined public contact bar to LINE, office phone, and mobile phone slots, with safe editable data. No reference-site contact details copied.
- Removed translated tagline duplication beside SCWORK logo; reviewed desktop/mobile spacing.
- Extracted brand navy/orange from supplied logo; applied coordinated colors to all public/admin/pricing/RFQ/article/print layouts and kept contrast-conscious orange CTA.
- Added contact channel fields to Website Manager; isolated SCWORK v1.4 editor draft key from older Cleaning project drafts.
- Updated quotation demo print header to SCWORK (legacy ProCleaning branding removed).
- Added brand QA and full source-logo asset.


## v1.3 — SCWORK logo & brand color update
- Replaced website, calculator, RFQ and business-studio marks with the supplied SCWORK wordmark.
- Updated public site and admin surfaces from green to SCWORK blue/orange brand colors.
- Refreshed favicon and Site Manager color defaults to match the new identity.

## SCWork V1.2 — Multilingual storefront
- Language modal aligned to reference: two columns, flags, language names, dark overlay and clear selection.
- 14 languages supported in site navigation, hero, primary sections, service cards, blog teasers, buttons and order flow.
- Persistent locale across public pages; localized essential RFQ/estimator headings, with honest English technical fallback.
- EN/TH content manager preserved, CRM/quotation data model preserved, no pricing formula changed.
- Added docs/26-V1.2-MULTILINGUAL.md with translation scope and limitations.

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


## SCWork V1.1 — Commerce foundation & estimator (2026-11-12)
- New dark top contact/quick-actions bar; never displays third-party contact details by default.
- TH/EN dropdown instead of compact toggle; retained site-content locale, remembered preference and Instant switching.
- New 4-stage process band, adapted for quote-based sticker production and realistic demo limitations.
- Added bilingual estimator supporting A3+ sheet nesting, sqm, quantity tier, size preset, material add-ons, VAT 7%.
- Added transfer of NON-BINDING selected specs from the estimator to the existing Smart RFQ form.
- Pricing figures originate from a user-provided reference starter and are demonstrative, not verified SCWork rates.
- Preserved existing website manager, media manager, CRM prototype, Quotation Builder, dashboard, and backend foundation.


## V1.7.1 — credibility strip, richer footer, contact assistant
- Added soft grayscale logo marquee section for client/social-proof placement.
- Repositioned pricing CTA above the pricing cards to reduce scroll friction.
- Upgraded footer with richer contact structure and utility links.
- Added floating contact assistant for phone, LINE, Facebook and Messenger.


## V2.1.22 — Editorial Footer
- Rebuilt home footer to match approved reference: consultation CTA, divider, four aligned columns, copyright row.
- Removed redundant footer utility bar and duplicate consultation panels on the homepage.
- Preserved valid internal links, TH/EN footer labels and responsive behavior.
- LINE CTA only opens LINE when verified public contact configuration exists; otherwise falls back to the advice form.
- Added supplied LINE icon, displayed only for a configured LINE channel.
- No changes to hero, pricing logic, benefits pages or other approved website sections.

## V2.1.23 — SCWork Print Knowledge Hub
- Added searchable, category-filtered `knowledge.html` for 15 bilingual knowledge articles.
- Expanded from three brief articles to 15 structured long-form TH/EN guides; kept original article slugs.
- Added contextual article photography in `assets/images/knowledge/`, with a dedicated Image Studio slot for each cover.
- Replaced homepage incremental blog expansion with one "View all articles" link; made card titles and images clickable.
- Fixed article logo being overwritten by JavaScript; matched approved main site PNG logo.
- Article reader now supports headings, lists, reading contents navigation, caution note, related articles and localized meta information.
- Scoped changes to knowledge/blog; prior approved Hero, pricing functions, four service pages and footer remain unchanged.
