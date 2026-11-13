# SCWORK V1.5.1 — Homepage Preserved / Price UX Only

**Source:** SCWORK V1.4.1 CTA #FF6900 package. The public homepage, all hero banner assets, imagery, layout, animation, color palette and card/section CSS are preserved unchanged. Only selected pricing/quote CTA destinations have been revised. All original homepage visible copy, banners, CSS and motion are unchanged.

## What changed
- `smart-quote.html` — a separate single-page estimate experience based on V1.5
- `src/scripts/smart-quote.js`, `src/scripts/quote-to-line.js`, `src/styles/19-smart-quote.css` — new module files; **not loaded on homepage**
- Home quote and pricing CTA destinations now point to `smart-quote.html`, including dynamically rendered Services/Pricing cards and language-switched footer links.
- The existing contact/Smart RFQ section remains unchanged and retains its existing demo flow, available as an alternative. The new streamlined pricing flow is linked from pricing and quote CTAs.
- Home links to Services, Blog, About, navigation, banners, testimonials and sections are unchanged.
- Calculator and legacy RFQ pages remain in the package for internal testing or advanced workflows.

## How to test
From the project folder run `python3 -m http.server 8000`. Visit `http://localhost:8000/` — homepage should look like V1.4.1. Click a quote/pricing CTA to go to `http://localhost:8000/smart-quote.html`. Test Quick Quote / Help me choose, artwork status, copying the specifications, and opening the LINE draft once configured.

**Configure LINE:** `config/public-config.js` → `SCWORK_PUBLIC_CONTACT.lineId` (example syntax `@yourbrand`; use your actual ID), or configure the site manager contact fields.

**Important:** Demo rates in `data/pricing-demo-data.js` are NOT SCWORK's approved selling prices. The quote page does not store files or customer data and cannot confirm a LINE message was sent. The 14-language homepage stays unchanged; the quote module's detailed interface is TH/EN with English fallback for other languages.

## What we deliberately did not change
- No new homepage sections or banner images
- No changes to CSS / theme / CTA color `#FF6900` on the homepage
- No changes to any hero carousel or motion scripts
- No upload or storage infrastructure
