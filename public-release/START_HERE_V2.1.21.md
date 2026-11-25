# SCWORK Inkjet Sticker V2.1.21 — Service Information Editorial Update

Incremental continuation of approved V2.1.20. **Only the four service information pages and home benefit navigation are redesigned.** The approved cinematic homepage Hero and CTA treatment are preserved unchanged.

## Updated areas
- `standard-pricing.html`: typography-first pricing guidance, material / production photo, original estimate CTA and business caveat retained.
- `design-services.html`: Asian professional designer photo illustration, original brief-to-proof steps and destinations retained.
- `delivery.html`: photo of print finishing / handover (no identifiable face), original dispatch details and tracking link retained.
- `credit-terms.html`: photographed product labels as business-order context; payment eligibility remains review-based, no promise of guaranteed credit.
- Home `#scBenefits`: four compact typographic links instead of four pictograms, horizontally scrollable on narrow viewports.
- Sub-page navigation: four consistently named tabs; current page indicated by underline, accessible labels, TH/EN with persisted local links.
- Details: three steps/factors displayed as simple numbered rows, not cards; one quiet advisory note; removed duplicate related-topic cards.
- Editorial image assets are in `assets/images/benefits/*.webp`. The design page uses an AI-generated illustrative photograph of an Asian design professional, **not an actual SCWork employee or client**. Other three photographs reuse previously bundled assets.

## Release
- Master: `SCWORK_Inkjet_Sticker_V2.1.21_Full_Package.zip`
- Deploy-only: `SCWORK_Inkjet_Sticker_V2.1.21_Public_Website.zip`
- Tests: `npm run check:v2121` plus earlier checks (see note in QA). Build: `npm run build:public -- /path/to/new-output-folder`

## Notes
- This is static front-end UX work; business inputs and public-config demo mode are unchanged.
- Screen-reader links and navigation retain meaningful names; images are described in both Thai and English.
- CTA orange `#FF6900` with white text remains per owner's V2.1.20 approval, although not WCAG AA for standard text size.
