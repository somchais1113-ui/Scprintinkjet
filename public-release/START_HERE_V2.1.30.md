# SCWork V2.1.30 — Realtime Quote Connection

## Problem corrected
The previous Smart Quote Step 04 contained an independent tax demonstration prefilled with THB 1,000. It did **not** read the sticker quantity or material selected above, so changing quantity left its figure unchanged.

## New behavior
1. Select individual/company, sticker type, material, size and quantity.
2. The Step 04 `scLinkedQuote` block shows the selected specifications and buyer type in real time.
3. When `data/pricing-public-data.js` contains a verified APPROVED public selling-rate card with VAT 0%, the engine calculates the selected quantity and displays job price and settlement conditions immediately. This includes quantities outside the three previously hard-coded 100/500/1,000 presets.
4. When a rate has not been approved, or requires custom cutting / unpriced addons, the block reads **รอประเมินราคา**. It never invents or retains a stale amount.
5. Non-VAT seller: no 7% VAT is charged. Withholding for a company remains subject to the actual transaction classification and is not an automatic 3% discount.
6. No private cost or margin information is added to the public files.

## Test commands (from Master root)
- `node qa/validate-v2130.mjs`
- `node qa/validate-v2129.mjs`
- `python /mnt/data/test_v2130_browser.py` (if that local test script is available)

## Critical commercial note
`data/pricing-public-data.js` is still deliberately `null`. The website therefore cannot display an actual SCWork selling price until approved rates are exported. The numeric results in synthetic automated tests are not valid SCWork prices. Confirm real supplier costs and business rate policies before publishing a new rate card.

## Release
Use `node qa/build-public-v2130.mjs /path/to/empty/new/public-directory` to produce a deploy-only website; never publish `tools/` or supplier costing data.
