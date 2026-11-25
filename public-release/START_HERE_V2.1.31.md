# SCWORK Inkjet Sticker V2.1.31 — Private Pricing Control Center

## What's new

This version adds a **local-first** supplier quotation / cost monitoring MVP, linked to the existing private Pricing Master. It does **not** provide cloud sync, automated supplier price feeds, secure multi-user approval, or automatic publication.

**Open** `tools/pricing-control-center.html` from a localhost web server. The Admin tools must **never** be deployed to a public static site.

### How to run (local)

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000/tools/pricing-control-center.html`. Open Pricing Master at `http://localhost:8000/tools/pricing-workbench.html` **after** you apply an approved supplier cost change.

### Workflow

1. Enter the supplier name, exact material, quote reference number, quote date, amount, units and supplier VAT treatment. The price is normalized to a single cost unit (A3+ sheet or sqm). Never compare mixed units.
2. Add either the supplier's trusted URL or a supporting PDF/image/spreadsheet (max 12 MB). Files are saved only inside this browser's IndexedDB; SHA-256 checksums allow local evidence verification.
3. Review the supplier quote vs the existing Cost Master. If production cost data are incomplete, the tool shows **no invented B2C/B2B selling prices**.
4. Enter a reviewer and review reason, confirm verification, and approve the **cost**. This is a local manual review record; it is not an authenticated approval signature.
5. Separately use **Send cost to Pricing Master draft**. This updates the existing local private master material cost, **does not** edit Public Rate Card or customer prices, and invalidates the draft price version so a new version must be approved.
6. Open `tools/pricing-workbench.html` (or refresh it, if already open). Review all direct/indirect costs, add-ons, supplier taxes, B2C/B2B margins and terms. Approve a new Rate Card version, export `pricing-public-data.js`, and deploy the **approved selling rates only**.

### Notes on VAT and unit cost

SCWork is **not VAT-registered**. Do not charge customer VAT. If a VAT-registered supplier quotes a net price plus VAT, the local cost is multiplied by 1.07. If their price already includes VAT, enter the amount as quoted. If the supplier does not charge VAT, select "no VAT". VAT treatment depends on the actual source document.

### Privacy and release boundaries

- Local Storage: private quote metadata, change log, and Pricing Master. IndexedDB: binary source evidence. No backend calls.
- JSON backup includes records and evidence metadata/hash, **not binary files**. Download evidence separately before migrating computers or clearing browser storage.
- Browser storage, manually entered reviewer names, and local confirmation are **not secure authentication / multi-user authorisation**. A production cloud dashboard requires server authentication, roles, restricted database/storage policies, server-side validation, audit logging, and controlled publishing.
- Current approved customer quote prices already issued must not be retroactively changed. Keep historical Rate Card versions and validity dates under separate controls.
- Do not put supplier source files, supplier costs, private Master JSON, or internal control code into the public website. The public builder has a static allow-list that excludes `tools/`.

### Existing modules preserved

The public Smart Quote flow, Portfolio, Knowledge Hub, Footer and 6 material types are unchanged. A supplier record never directly modifies `data/pricing-public-data.js`.
