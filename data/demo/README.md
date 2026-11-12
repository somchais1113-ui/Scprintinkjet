# Synthetic demonstration data only

All company names and details are illustrative and fake. Email addresses use `example.com`.

- `seed-data.js` is the source loaded by the browser admin prototype.
- `customers.json`, `rfqs.json`, `quotes.json`, and `orders.json` are readable reference snapshots.
- These files **must never** be used to store real customer, quotation, order, artwork, or personal data in GitHub Pages or a public repo.
- Browser changes are persisted in localStorage for demonstration, not synchronized to a backend.
- This prototype does not automatically receive requests from the public website.
- Reset button restores this seed. For production, use authenticated role-based API and protected database.

## V2.4 sample RFQ intake

The `/request-quote.html` demo creates synthetic customer IDs and job specifications in the same browser's localStorage. It never uploads selected files; the only file-related value stored is `spec.fileSelected` (boolean). New quote versions include `quotation` and `netRevenue`; old records remain readable. The original `seed-data.js` remains unchanged.
