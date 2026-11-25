# SCWork V2.1.39 — Pantone 1505C About Page Refinement

Master: V2.1.37. This release preserves V2.1.38 layout and behavior, and standardizes orange accents across the About page to Pantone 1505C (#FF6900), including hover/selected states, emphasis text, navigation accents and editorial overlays.

- About page color standardization: all orange accents in this section now use Pantone 1505C (#FF6900) or transparent tints derived from that color.
- Who We Are and Our Philosophy layouts remain unchanged from V2.1.38.
- Responsive layout and reduced-motion handling retained.
- No changes to home content, pricing, admin, Supabase config, core assets, or non-About page sections.

## Verification
- node --check src/scripts/about-page.js: PASS
- Static CSS token/hex scan for About page accent color: PASS
- npm run check:pricing: PASS
- npm run check:locales: PASS (14 existing locales)
- npm run build:public: PASS
- HTML anchor and CSS parser checks: PASS
- Chromium runtime: not verified; navigation returned ERR_BLOCKED_BY_ADMINISTRATOR. Check actual desktop/tablet/mobile layout and interactions on a staging deployment. No production deployment performed.

## Deployment
Use the existing public build command and existing separate Admin Cloud project; do not deploy the full source archive as a public root.
