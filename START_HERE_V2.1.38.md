# SCWork V2.1.38 — Design & Production Showcase

Master: V2.1.37. This release changes only the About page editorial layout, scoped styles and independent philosophy carousel controls.

- Who We Are: full-bleed portrait composition with diagonal/curved overlays; orange statement accent; four bilingual icon-based section links with hover and selected states.
- Our Philosophy: diagonal image treatment, orange emphasis, understated liquid-glass controls and separate previous/next buttons. Four images, existing 880 ms fade / 7.4 s interval / 9 s zoom retained. Pause remains available for accessibility.
- Responsive layout and reduced-motion handling retained. Portrait and workshop photos are illustrative, not verified staff or facilities; existing footer disclosure retained.
- No changes to home content, pricing, admin, Supabase config, or underlying assets.

## Verification
- node --check src/scripts/about-page.js: PASS
- npm run check:v2138: PASS (static layout, navigation, assets and motion checks)
- npm run check:pricing: PASS
- npm run check:locales: PASS (14 existing locales)
- npm run build:public: PASS
- HTML anchor and CSS parser checks: PASS
- Chromium runtime: not verified; navigation returned ERR_BLOCKED_BY_ADMINISTRATOR. Check actual desktop/tablet/mobile layout and interactions on a staging deployment. No production deployment performed.

## Deployment
Use the existing public build command and existing separate Admin Cloud project; do not deploy the full source archive as a public root.
