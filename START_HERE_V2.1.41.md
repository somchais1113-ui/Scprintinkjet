# SCWork V2.1.41 — Homepage Brand Design Package Refinement

Master: user-provided V2.1.40 full ZIP (CRC verified). Scope: homepage package section only; no pricing, quote engine, admin or Supabase changes.

- Reuses three existing portfolio illustrations for the three tiers: identity/colour applications, packaging identity, premium brand presentation. These are illustrative, not verified client work or before/after proof.
- Cleaner image ratio, compact add-on cards, consistent card heights and CTA alignment, responsive stacked cards, quieter borders and typography.
- Retains all three package scopes, nine add-on services, eleven comparison rows and original quotation destinations. Adds a bilingual anchor to the comparison table.
- Replaces internal release-history wording with customer-facing copy. Updates package version and homepage CSS cache key to 2.1.41.

## QA
- Original ZIP CRC: PASS; all 682 original entries retained.
- Package markup, bilingual labels, local image/CTA paths, anchor and CSS parse: PASS.
- npm run check:pricing / check:locales / build:public: PASS.
- Static isolated Chromium render (real section HTML, project CSS, embedded original images; no site JavaScript or remote fonts): PASS at 1440, 768, 390 px; three images decoded, no document horizontal overflow. Comparison table scrolls within its wrapper on narrow screens.
- Full browser navigation blocked by environment (ERR_BLOCKED_BY_ADMINISTRATOR). Full-page runtime, language switching, quote handoff, external resources and production deployment not verified. Existing CTA goes to the label/SKU project brief; this is intentionally unchanged in this visual-only revision, but a future dedicated brand inquiry route may be preferable.

## Deployment
Use `npm run build:public -- <new-output-folder>` and deploy the resulting public folder only. Keep admin-cloud separate. Do not publish the full source archive as public web root. To apply the optional patch, overwrite the same relative paths inside the existing Scprintinkjet directory, then rebuild public output.
