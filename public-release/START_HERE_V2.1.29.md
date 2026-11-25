# SCWork Inkjet Sticker — V2.1.29

## Pricing Engine · Seller NOT registered for VAT

This is the continuation of Full Package V2.1.28; previously approved sections are unchanged.

### 1. Customer Smart Quote
- Select **Individual (B2C)** or **Company (B2B)** at the beginning; this synchronizes with buyer details in Step 04.
- The chosen buyer changes the approved sell rate only if a distinct COMPANY rate has been explicitly approved and exported from the private Pricing Master. Until then, the same approved price applies to both buyers.
- There is no approved public rate card in this delivered package. Customer quantity, specification and buyer update live, but the site shows **request quote** instead of inventing a price.
- The settlement example is independent of the sticker selling price. It is labelled as an illustration and default VAT is disabled.
- Non-VAT seller: output VAT collected = 0. No tax invoice is generated.
- Withholding tax is NOT determined from buyer type alone. Transaction classification and contract/payment terms require verification; unconfirmed cases do not show a definitive net transfer.

### 2. Private Pricing Master (tools/pricing-workbench.html)
- Run on localhost or file:// on a trusted local computer; do not deploy tools/ to your public domain.
- Enter **actual costs INCLUDING non-creditable input VAT**, whenever the invoicing supplier charges it. Do not enter the supplier ex-VAT price if VAT cannot be credited.
- Include material, inks, finishing, waste, setup, outsourced production, freight-in, overhead; explicitly add QA, packing, transaction/payment costs in suitable cost inputs. Do NOT double count amounts already included in subcontractor quotes.
- The private Pricing Master now aligns to the six public material IDs, replacing the legacy PP silver draft category with non-adhesive vinyl banner. Previously stored PP silver draft costs are not migrated into vinyl; vinyl needs actual cost and manual approval.
- B2C margin is the existing Margin % field. B2B margin is OPTIONAL and must be entered intentionally.
- B2B has separate administrative handling cost per order, payment terms in days, and an annual working-capital financing estimate. The engine includes these in B2B costs before calculating sale rates. A corporate order need not be cheaper than retail.
- Use price/margin audit rows to assess examples. VAT is fixed to 0% for this seller state. Existing imported drafts showing VAT 7% are blocked from publishing until corrected to 0.
- The final approval checkbox is required before exporting a new `pricing-public-data.js`. Export includes **approved customer selling prices only**, not supplier costs, margin rates, or finance inputs.
- Update the public file deliberately and redeploy to activate prices. Do not promote demonstration rates.
- **Privacy/commercial warning:** a company sell-rate exported to a public JavaScript file is NOT confidential. Anyone can inspect the source or select B2B. Use only company rates that may be public; negotiated contract prices must stay in private workflow until quotation approval.

### 3. Price formula

`effective cost = unit variable cost × actual billable units + order setup/overhead/transport costs + quantity waste + buyer-specific operations/financing costs`

`net selling price (no VAT) = max(minimum charge, effective cost / (1 - target gross margin))`, rounded upward by the approved unit/tier policy.

The engine uses quantity tier floors to prevent price discontinuities. It requires material dimensions and quantities to fall into an approved rate-card scenario; any unapproved scope remains manual quotation. Profit and margin measures are internal and are not a forecast of net profit after corporate income tax.

### 4. Tax/document review
- Buyer class alone does not determine WHT. The distinction between an ordinary sale of stickers and hire-of-work/service can change withholding treatment. Confirm with the accountant for the actual legal seller and contract.
- A withholding amount (if applicable) reduces the cash transfer at settlement, not the pre-withholding selling price. The customer should provide withholding evidence.
- Monitor taxable annual turnover for potential VAT registration at the regulatory threshold (currently 1.8 million THB for applicable activity). Re-evaluate seller status, public quote and documents upon registration.
- Online documents are pre-sale specification/estimate summaries only, not tax invoices, receipted payments or tax filings.

### 5. QA & limitations
- Run `node qa/validate-v2129.mjs` and standard quote, pricing, language, and v2.1.28 regressions.
- Browser screenshot QA is based on inline local HTML/CSS/JS in Chromium because this runtime blocks local and HTTP navigation. Deploy a staging environment and verify end-to-end routing, persistent drafts, and payments before production.
- No B2C/B2B selling prices are approved in this package: you must enter actual supplier costs and approve the pricing master.

### Public documentation links
- VAT registration obligation: https://www.rd.go.th/7061.html
- VAT-registered seller obligations: https://www.rd.go.th/7051.html
- WHT on hire of work: https://www.rd.go.th/3535.html
