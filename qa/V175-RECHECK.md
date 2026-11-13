# SCWork V1.7.5 QA

- Shared cost rates reprice only linked materials. Fixtures use synthetic costs, not approved SCWork prices.
- Partial export supports PP White alone. An unpriced add-on stays in manual quote mode. A public export includes no cost, margin, operational assumptions, notes or history.
- Same-spec total is nondecreasing at volume boundaries in new Master exports; legacy rate cards retain the legacy formula. A3+ layout, MOQ and selling price calculation continue to use the existing calculator.
- DOM contract covers edits, preview, invalidating approval after edits, export, private backup and history restore/re-import. A real browser and deployment have not been tested in this release.
- Homepage, CSS and images used by the public storefront are unchanged from V1.7.4. The public calculator supports the new pricing mode. LINE and rates remain unconfigured.
