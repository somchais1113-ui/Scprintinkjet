# SCWORK V1.6 + V1.7 — Start here

## Goal and preserved scope
This is a **function-only** update on SCWORK V1.5.1. Homepage, all Hero image files, layout, original homepage CSS, navigation, animations, multilingual page support and CTA `#FF6900` are preserved. The new quote UI lives only at `/smart-quote.html`.

## Try customer quote UX (V1.6)
From the extracted project folder run `python3 -m http.server 8000`. Open `http://localhost:8000/smart-quote.html`. Select Quick or Help me choose, product, material, size preset, quantity preset; review price per piece, base, VAT and potential minimum surcharge, choose Artwork (none / LINE / link) and copy the prefilled specifications. No uploads and no login.

LINE OA must be set using `config/public-config.js` (`SCWORK_PUBLIC_CONTACT.lineId`, e.g. your **real** `@scwork` value), or the public contact configuration already connected to your site. The LINE button only opens a **draft**; customer must send it in LINE. Never treat opening LINE as a received order.

The application still includes the original calculator and legacy RFQ for reference. They are not the recommended public route.

## Work with costs and review rates (V1.7)
Open `http://localhost:8000/tools/pricing-workbench.html` **locally on a trusted machine**. For each of the six sticker materials, enter actual supplier cost, print cost, finishing cost, waste, fixed setup, outsourced work, inbound freight, overhead, desired gross margin and minimum order charge. Addon costs should also be entered. The workbench shows recommended volume-tier selling prices.

**Before approval**, reconcile actual supplier quotes, substrate/ink/lamination/cutting, shipping and waste. Tick the approval checkbox only after review and export `pricing-public-data.js`. Copy only that file to the public `data/` folder, replacing the provided null placeholder. Then deploy the site and clear caches. The Smart Quote will then display `Reviewed Rate Card` and remain an *estimate*, not a binding quotation. The **existing advanced calculator stays in DEMO mode**; public V1.7 card applies to the Smart Quote sticker page only.

### Security model and constraints
- This prototype uses `localStorage` for private draft cost calculations. **Do not enter confidential supplier prices on a public site origin or deploy these management pages as an unrestricted production tool.** On public deployed hosts, the UI automatically disables cost editing. For real use, build authenticated private backend/storage and access control.
- Exported `pricing-public-data.js` is **allowlisted**: contains retail prices, basic product metadata and VAT but never supplier costs, overhead or profit margins. Do not upload private draft JSON to GitHub, Vercel or webroot.
- Original `data/pricing-demo-data.js` continues to be publicly shipped, explicitly as DEMO. It contains unverified historical sample rates and is not approved for sales.
- All numbers shown in the original packaged quote are **DEMO**. No prices have been endorsed or configured for SCWORK.
- All customer data remains in browser only and is not sent or saved to SCWORK backend by this module.
- Workbench does not automatically publish anything or send any file / email.

## Detailed recheck
See `qa/V17-DETAILED-RECHECK.md` and run `npm run check:v17`, `npm run check:smart-quote`, `npm run check:pricing`, `npm run check:cta`.
