# SCWork Inkjet Sticker Printing — Complete Conversion Package

## What changed
- Public website content (TH/EN), branding, images, services, process cards, product types, article content, and direct Smart RFQ entry points.
- Colors, layout structure, animations, sticky sections, pagination dots, site-manager, image-manager, demo Admin, Quotation Builder, Orders and Live Inbox remain present.
- Monthly/Yearly pricing no longer shown. Prices are NOT invented; product cards lead to a specification-based request.
- Testimonials replaced by illustrative applications. No fabricated customer endorsements.

## Quick start
```bash
python3 -m http.server 8000
```
Open http://localhost:8000/ then `tools/` for Admin and `tools/site-manager.html` for text editing.

## Edit texts / images
- Text: `tools/site-manager.html`, edit TH and EN separately, export and apply changed files.
- Central data: `data/site-data.js`.
- Hero photos: `assets/images/hero/hero-scene.webp`, `slide-02-labels.webp`, `slide-03-cut.webp`, `slide-04-branding.webp`.
- Other photos: `assets/images/services`, `quote`, `team`, `about`, `testimonials`, `blog`.
- Assets map: `assets/images/manifest.json`.

## Critical limitations
All photos in this conversion are *illustrative images derived from AI design studies*. They are NOT verified photographs of SCWork machines, workshops, customer projects or commercial results; replace with owned/released real images before live publication.
`config/public-config.js` defaults to Demo Mode. RFQ in Demo Mode uses browser-local data; it does NOT send customer details to a central database or emails. A real launch needs verified Supabase, Turnstile, email integration, permissions, and end-to-end verification.
Contact details remain unset intentionally. Do not publish without real official company contact details, legal/PDPA/privacy review and confirmation of capabilities & materials offered.
Existing Admin demo data relates to the *original sample environment* and must not be mistaken for real SCWork customers.

## Design identity
SCWork · Inkjet Sticker Printing. Primary #36B864, deep ink #111D15, white base; original 2.5.7 spacing, carousel and motion system retained.
