# SCWork V2.1.40 — Design Package Section on Homepage

Master: V2.1.37. This release keeps the existing sticker-application pricing cards on the homepage, replaces the former six-material selector with a new design-package area, and adds additional design services, three brand-development packages, and a comparison table inspired by the latest reference direction.

- Homepage pricing section: keeps the three sticker-application cards and CTA.
- Replaces the former six-material chooser block with:
  • Additional Services editorial card grid
  • Brand Development package banner
  • Three design-package cards (Starter / Development / Transformation)
  • Comparison table of package scope
- Adds styling and bilingual text support for the new section.
- No changes to admin, Supabase config, or the About page refinements from V2.1.39.

## Verification
- node --check src/scripts/about-page.js: PASS
- Homepage package section replacement: static markup / CSS patch created
- npm run check:pricing: PASS
- npm run check:locales: PASS (14 existing locales)
- npm run build:public: PASS
- HTML anchor and CSS parser checks: PASS
- Chromium runtime: not verified; navigation returned ERR_BLOCKED_BY_ADMINISTRATOR. Check actual desktop/tablet/mobile layout and interactions on a staging deployment. No production deployment performed.

## Deployment
Use the existing public build command and existing separate Admin Cloud project; do not deploy the full source archive as a public root.
