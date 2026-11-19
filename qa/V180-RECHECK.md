# V1.8.0 verification

- Added a separate campaign page `product-labels.html` with local image paths, responsive image variants, and a Thai/English switch.
- Automated DOM checks exercised the existing Smart Quote routes, approved-rate CTA and fallback for missing/invalid rates. Synthetic data was used only in tests.
- Existing pricing, quote path, locale, CTA and Workbench tests from V1.7.5 passed. Homepage, Smart Quote, public rate card, pricing engine and Pricing Master are unchanged.
- The public archive excludes the Pricing Master, demo rate, private workbench files and original PNGs. Full Package includes both original renders.
- Chromium launch was blocked in the test environment. Rendering on individual browsers, mobile devices and real LINE sending were not verified. No deployment was performed.
