# V1.8.2 release recheck

- Verified all three estimates against the current pricing engine and a QA-only rate card produced by the real Pricing Master. Checked minimum sheets and charges, VAT, price/label, tier gaps and overlaps, and the all-or-nothing approval gate.
- Verified the quote UI's Thai and English state, quantity selection, custom-spec handoff, matching copy and decoded LINE drafts, bad or missing contact, URL-only and long-message fallbacks.
- Regression checks from V1.8.1, V1.8.0, V1.7.5 and V1.7.4 passed. No commercial prices, contacts, or customer artwork were used for QA.
- Local preflight checks configuration only. No site was deployed or LINE message opened or sent. Chromium launch was blocked by the execution environment, so these checks do not substitute for viewing both languages and opening the actual OA on a phone.
