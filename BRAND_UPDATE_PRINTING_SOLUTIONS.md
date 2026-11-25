# SCWORK Printing Solutions — branding update

Base: V2.1.32, logo-only patch (business version retained).

- Replaced central public/internal header/footer logo and independent Admin Cloud logo with the exact supplied design, fitted on a transparent canvas.
- Replaced all favicon sizes and ICO, including standalone Admin Cloud; existing orange frame retained. Cache-busting parameter updated.
- Added logo to Smart Quote printable billing summary and Cloud Cost Bridge. Seller identity text is still populated by the existing billing logic.
- Original supplied logo is retained in `assets/brand/SCWORK-logo-source-original.png`. Existing client logos, sample product artwork and historical screenshots in `previews/` are not rebranded.
- Public/private boundary, pricing logic, Supabase and MFA configuration remain unchanged. `.nojekyll` added because existing public builder expects it.

## QA
Passed: `npm run check:v2132`, `npm run check:v2131`, `npm run check:pricing`, `npm run check:locales`, `npm run check`, `npm run build:public -- /path/to/new/output` and logo/favicon path validation. Legacy v2.1.17 test fails on a pre-existing main.js version assertion (original 2.1.32 archive already uses main.js?v=2.1.26); no regression in logo assets. Browser runtime check could not be completed due to local browser environment restriction. No live deploy or live Supabase verification performed.

## Deployment
Use `npm run build:public -- /path/to/new/output` for the public storefront. Deploy only `admin-cloud/` separately for the private admin, retaining production Supabase configuration. Do not deploy the full package as public.

Git metadata and macOS Finder metadata omitted from the ZIP; all original source files retained.
