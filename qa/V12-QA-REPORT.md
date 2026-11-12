# SCWork v1.2 — Multilingual QA report

## Tested

- Static validation of `data/extra-locales.js`, `src/scripts/i18n.js`, modal scripts and price/RFQ code (`node --check`).
- `npm run check` public SCWork content and retained modules.
- `npm run check:pricing` reference formulas, VAT, tier pricing, add-ons, unsupported-size handling, and RFQ handoff.
- `npm run check:locales` verifies the 14 locale identifiers, translated core text, dynamic services, quote steps, and in-browser preference handling.
- Chromium **inline page test** (source scripts injected into a browser DOM without live web serving). All 14 languages switched in **320 / 390 / 768 / 1440 px** layouts, with no JavaScript errors or horizontal page overflow in these tests. Form and estimator language switches tested separately in inline Chromium.
- Popup selector behavior: 14 entries, selected state, backdrop, close button and mobile one-column design.

## Not tested / not guaranteed

- The environment blocks local/localhost URL navigation by browser policy; therefore no full hosted-site end-to-end regression was possible.
- Real cloud database and transactional emails are not connected.
- Native-language translation proofreading, all devices and localized SEO have not been completed.
- Dynamic content beyond the public starter inventory can fall back to English unless translated in the locale pack.
