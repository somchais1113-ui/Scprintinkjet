# SCWORK V1.7.1 — Rechecked package

This package uses the V1.6/V1.7 base. The original hero/banner assets and existing Pricing Engine are retained.

## Quick start
Run from this folder: `python3 -m http.server 8000` and open `http://localhost:8000`.

## New storefront areas
- The price section CTA is above the cards; the cards and pricing logic remain unchanged.
- The muted logo marquee below the hero uses placeholders **not verified client references**. Edit `data/client-logos.js` and `assets/images/client-logos/` only after receiving permission.
- Footer has richer navigation and contact details.
- Floating Contact Assistant offers phone, LINE, Facebook and Messenger. Unconfigured channels lead to the contact section; they DO NOT represent a successful message.

## Configure public contacts
Edit `config/public-config.js` and set SCWORK_PUBLIC_CONTACT.officePhone, mobilePhone, lineId, lineUrl, facebookUrl, messengerUrl. Only use real SCWORK details. Where supported, Website Manager fields can be used instead. Never put server secrets in this file.

## Production checklist
1. Confirm business phone, official LINE and social URLs.
2. Verify customer-logo display permissions; remove unused placeholders when real logos are ready.
3. Approve real pricing rates in `tools/pricing-workbench.html`; demo rates are NOT published sale prices.
4. Test actual devices, LINE app handoff, hosting deployment, and legal contact details.
5. Check TH/EN. Other locales are legacy partial translations and require professional review.

## QA
See `qa/V171-PACKAGE-RECHECK.md`. Static/functional tests are not equivalent to a complete production End-to-End test.


### UI refinement notes (V1.7.2)
- Floating contact assistant now uses icon-only buttons for faster recognition and cleaner mobile display.
- Contact information cards are enlarged for easier reading.
- Customer-logo section wording has been adjusted to suit the SCWORK website tone.
