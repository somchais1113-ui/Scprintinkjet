# Pricing logic migration / SCWork V1.1

Source: user-supplied `pimtook-pricing-html.zip` (README / data / reference logic). Reimplemented inside SCWork: `src/scripts/pricing-engine.js` and `pricing-calculator.html` with both Thai and English UI.

## Modes
- `a3_sheet`: floor(usableWidth / (labelWidth + gap)) × floor(usableHeight / (labelHeight + gap)); ceil(pieces / fit), minSheets, tiered price; invalid for labels that cannot fit.
- `area_sqm`: max(minAreaSqm, widthCM × heightCM × quantity / 10000) × ratePerSqm.
- `quantity_tier`: max(minQty, quantity) × applicable tier unit rate.
- `size_preset`: max(minQty, quantity) × preset unit rate.
- Add-ons: per_unit × billable units, flat once. Total + rounded 7% VAT.

## What is NOT computed
Real production costs, profit, printer format/pitch/bleed for every media, taxes for different product types, delivery costs, artwork review, payment or login. Original dataset contains products besides inkjet stickers; included as **reference example categories** only, with Sticker tab as default. All labels explain non-binding prices.

## Integration
`pricing-calculator.html` → `sessionStorage('scwork-pricing-handoff')` → `request-quote.html?fromEstimator=1` in SAME tab. Name/email/artwork are never transferred. No external posting occurs from the estimator. Confirm RFQ information manually before using any backend.

## Testing checklist
- Switch TH / EN on homepage and calculator, reload and confirm remembered language.
- Test paper sticker 5×5cm / 500 pcs; PVC 100×100cm / 2 pcs; business card 100; size preset 50.
- Reject a label too large to fit in the configured A3+ sheet.
- Calculate addon with per-unit and flat fee.
- Send chosen specs into RFQ; confirm no automatic order or email.
- Check top bar at 1440 / 768 / 390 / 320 CSS widths.
