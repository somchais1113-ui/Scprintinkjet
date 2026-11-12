# SCWork — Inkjet Sticker Storefront V1.1

## Open locally
```bash
python3 -m http.server 8000
```

- Home: http://localhost:8000/
- Price calculator: http://localhost:8000/pricing-calculator.html
- Smart RFQ: http://localhost:8000/request-quote.html
- Unified tools: http://localhost:8000/tools/

## Main changes
- Dark contact/info strip across the top; edit text in `data/site-data.js` under `commerce` / `i18n.th.commerce`.
- Add your **verified** business contact to `config/public-config.js` > `SCWORK_PUBLIC_CONTACT` (`phone`, `lineId`, optional secure `lineUrl`). Leave unverified channels blank; placeholders are not visible to customers.
- TH/EN menu in header: English and Thai are fully maintained for shared website content; no machine translation or unsupported additional locales.
- 4-step order-process strip reflecting a quotation-first sales workflow, not a claim of instant ordering.
- Estimator data: `data/pricing-demo-data.js`; math: `src/scripts/pricing-engine.js`; UI/translations: `src/scripts/pricing-calculator.js`; styles: `src/styles/16-pricing-calculator.css`.
- Calculator transfers specifications to RFQ within the **same browser tab only**, via `sessionStorage` with a 15-minute expiry. This does **not** send an order or email or save to a central database.

## Safety and cost integrity
The data from the supplied `pimtook-pricing-html.zip` is a reference/demo table. **It is not SCWork's approved sale price**. Validate all production assumptions, margins, sheet utilisation, die-cut method, artwork handling, real substrate, shipping costs, VAT treatment and supplier terms before publishing prices.
The estimator assumes an A3+ **usable** rectangle 31 × 45 cm with 0.3 cm pitch gap as in the reference starter, with no rotation optimisation, kerf/bleed geometry, spoilage, color, finishing or setup adjustments unless listed as example add-ons. Zero-fit pieces are rejected, not charged as 1 piece/sheet.
No Login is required for public demonstration estimation. If by “login” you meant restricted access, authentication is a separate feature and is **not** provided by this calculator. The existing Live Inbox requires Supabase/Auth setup before use.
Do not enter real customer information into the demo version. The backend is not automatically deployed.
