# SCWork v1.1 — QA and deployment boundaries

## Automated checks completed
- JavaScript syntax on new and modified logic files passed (`node --check`).
- `qa/validate-pricing-v11.mjs`: A3+ yield 5×5cm ×500=13 sheets, quantity tiers, sqm rates, size presets, add-ons, 7% VAT, and too-large-size rejection passed.
- `qa/validate-scwork.mjs`: TH/EN source data, sticker imagery, inherited services and blog content passed.
- Existing V2.3 and V2.4 regression tests passed on their covered modules.
- In restricted inline Chromium layout smoke checks, home and calculator DOM rendered at 1440 and 390 widths without horizontal overflow. The isolated home preview raised an invalid-base-URL error because it ran under `about:blank` rather than a hosted URL; this is not evidence of a deployed-site failure or success.
- Complete localhost/hosted End-to-End verification is NOT confirmed because Chromium policy blocked localhost access in the test environment.

## Tests to perform before publishing
1. Run `python3 -m http.server 8000` and test normal HTTP-origin rendering on phone and desktop.
2. Verify TH/EN navigation, header dropdown, top strip, and process steps after Editor changes.
3. Test calculator inputs, accurate formula and real approved rates, addon fees and VAT.
4. Confirm reference price handoff to RFQ in the same tab without private data.
5. Configure verified SCWork contact details; no sample competitor phone or LINE is shipped.
6. Configure and security-test Supabase Auth, Database, mail and anti-bot before accepting real RFQs.
7. Check public text and artwork claims, licensing and production capacity.

## Security and truth-in-pricing
Calculator does not have Login; pricing ZIP reference README states none. Calculated totals are examples and cannot be final sales quotations. No real customer submission, payment, file upload or email delivery is activated by this update.
