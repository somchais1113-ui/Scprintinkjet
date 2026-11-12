# V2.5.6 QA Results

## Passing tests

- `npm run check`: structural/regression coverage for baseline through 2.5.6, JavaScript syntax, i18n schema and article fields.
- Inlined Chromium test, 1440px and 390px, EN/TH (4 combinations): all three service CTAs were green; blog title-to-excerpt gap measured 11px in the simulated render; links pointed to the article route; no JavaScript runtime exceptions.
- Inlined Chromium, 6-post test via Editor preview data event: 3 posts initially, click View More → 6, Show Fewer → 3; localized TH labels; no JavaScript errors.
- Inlined Chromium dedicated article view: English and Thai copy rendered, 3 paragraphs each, no JavaScript errors.
- Local source assets checked by inherited QA: 18 WebP images found; original v2.5.5 modules and paths retained.

## Not verified in this environment

- Full end-to-end visual rendering with images over localhost / file URLs, because Chromium blocks local navigation in the hosted test environment. Inlined image URLs also did not decode; image assets were not changed by this upgrade.
- Real hosting, mobile physical devices and production APIs. Backend integration status is unchanged from V2.5.5.
- Draft preview navigation across pages under the live editor is implemented but not exhaustively end-to-end tested in the hosted sandbox. Exported files load article bodies normally.

## Suggested manual checks

1. Run `python3 -m http.server 8000` from the package folder. Open `http://localhost:8000/`.
2. Toggle TH/EN and verify all 3 Service CTA buttons are green and readable.
3. Inspect Blog title/excerpt spacing on desktop and mobile.
4. Click Read More → verify `article.html` shows body/cover in TH and EN and Back to articles works.
5. Open `tools/site-manager.html` → Blog. Add at least 3 entries, fill TH/EN bodies, export ZIP, replace `data/site-data.js`, reload and verify View More then Show Fewer.
6. Verify new changes are fully deployed (CSS/JS with `?v=2.5.6`) and clear stale caches if applicable.
