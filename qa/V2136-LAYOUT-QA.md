# V2.1.36 — Layout refinement QA

- `node qa/validate-v2136.mjs`: PASS (content, four hero/gallery slides, local assets, navigation, timing, CSS, package version, build boundary).
- `npm run check:pricing`: PASS (pricing calculations, B2B/B2C, unregistered VAT guard).
- `npm run check:locales`: PASS (14 locales).
- `npm run build:public -- /mnt/data/scwork36_public_test`: PASS.
- Chromium runtime smoke test: BLOCKED (`net::ERR_BLOCKED_BY_ADMINISTRATOR`), so visual fidelity, responsive rendering and actual interactions have not been verified in-browser.
- No live deployment or Supabase testing.
- Portrait-specific caption removed; existing general imagery disclosure remains in page footer, and alt text identifies the portrait as illustrative. Use a genuine authorized staff photograph when presenting a real executive.
- Existing 880 ms crossfade, 7.4 s rotation, 9 s zoom and reduced-motion behavior retained. Glass surface uses CSS backdrop-filter, with a solid translucent fallback; no blur applied to main image content.
