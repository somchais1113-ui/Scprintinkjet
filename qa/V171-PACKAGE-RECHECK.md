# V1.7.1 Package Recheck

## Scope
ZIP archive, JS syntax, valid local file references, pricing engine and Smart Quote regression, 14-language legacy pack, homepage Hero assets, footer/contact fallback, customer logo placeholder disclosure, CSS CTA color.

## Legacy tests
`npm run check:pricing` and `npm run check:brand` test conditions from earlier versions and may fail on V1.7 even though the V1.7-specific checks pass. These results are retained and disclosed; not silently considered passing.

## Still pending production validation
Actual phone/LINE/Facebook connections, permissioned client logos, supplier cost and retail rate approval, browser & devices after deployment. No live customer lead is sent by static site without configuration.

## Checks performed on this rechecked archive (2026-11-13)
- ZIP integrity: passed on source V1.7.1; final archive revalidated after packaging.
- Every local `src` and `href` reference on root HTML and tool HTML pages: no missing file references (0 missing).
- JavaScript syntax for public, config, data and tools: pass.
- `npm run check`: pass.
- `npm run check:locales`: pass (locale pack completeness, not native proofreading).
- `npm run check:cta`: pass (#FF6900).
- `npm run check:smart-quote`: pass.
- `npm run check:v17`: pass (material costs, margin, VAT, export allowlist).
- Inline Chromium QA at widths 1440, 768, 390, 320: pass; no horizontal overflow, no runtime JS errors, 3 pricing cards and 4 footer columns in DOM, assistant opens.
- Note: Inline Chromium uses embedded CSS/JS and intentionally blocks remote assets; it does not verify production image loading or live LINE handoff.

### Legacy checks that still fail
- `npm run check:pricing`: an earlier version-specific expectation (`pricing-calculator.html missing`) rather than absence of the actual file (file confirmed present).
- `npm run check:brand`: version 1.4.1-specific package expectation. This does not validate the new V1.7.1 package.

### Contact behavior
- No unverified real business phone/LINE/Facebook values are shipped.
- When unconfigured, Floating Contact Assistant and footer contact controls fall back to the Contact section on the homepage. An attempt to open a social app is not recorded as a successfully submitted RFQ.
- More restrictive URL validation now applies to the Facebook/Messenger public config.
