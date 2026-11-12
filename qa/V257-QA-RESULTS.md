# V2.5.7 — QA Report

## Automated checks

- `npm run check`: PASS — V2.0 through V2.5.7 structural, business-demo data, HTML path and schema validations.
- Browser inline/offline asset simulation: PASS — Desktop 1440px TH/EN, Tablet 768px TH, Mobile 390px TH, Mobile 320px EN; zero JS page errors and zero horizontal overflow across those cases.
- Carousel: four dots retained, selecting slide #3 changes the active slide.
- TH/EN switch: content changes both directions.
- Services arrow: rotates to next item.
- Pricing Monthly/Yearly: toggles aria state and price mode.
- Anchor scrolling: Services heading lands at approximately 16px below top in simulation.
- Blog article links: three initial links point to distinct `article.html?post=` entries.
- Blog expansion: six-article seeded simulation displays 3 → 6 → 3 with no JS error.
- Website Manager's spacing token: increasing `--section-space` changes calculated Services padding.
- Article reader: tested seeded article body and TH↔EN switch in browser inline simulation; no JavaScript errors.
- Asset references: all local WebP slots and referenced static files present.

## Visual evidence

- `previews/v257-home-desktop-th.jpg`
- `previews/v257-home-mobile-th.jpg`
- `previews/v257-services-desktop-th.jpg`
- `previews/v257-blog-desktop-th.jpg`

## Limitations

- Direct localhost/file navigation is restricted by this testing environment. Chromium ran the same document/CSS/JS via inline loading with all local assets intercepted and served from the package.
- Screenshots represent this simulation, not a live deployment. Real macOS Safari, iOS Safari, Android Chrome and remote hosting behavior are not verified in this build.
- Backend/Resend/Turnstile connection testing was not part of the spacing change and is not verified as production-ready.

## Deployment QA

1. Upload **the complete** V2.5.7 directory so HTML, CSS, JS and assets remain from the same version.
2. Check browser network requests for `13-spacing-system.css?v=2.5.7` and `12-article.css?v=2.5.7`.
3. Hard refresh or purge hosting cache if earlier CSS appears.
4. Inspect Hero CTA/dots and the transition into Services at desktop and phone widths.
5. Check Services, Quote, Team, About, Pricing, Testimonials, Blog, Contact and Footer in both TH and EN.
6. Test Blog `Read More`, `View More`, `Show Less`, Anchor links, hover and Reduced Motion.
7. Avoid placing real customer information into Demo Mode.
