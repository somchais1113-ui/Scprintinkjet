# SCWork V2.1.26 — Portfolio Directory & Service Comparison

Built on **V2.1.25 Full Package**, retaining the hero, quote calculator, knowledge hub, delivery, editorial footer and prior approval.

## What changed

- Homepage Portfolio: clear orange **ดูผลงานทั้งหมด / View all work** button, linking to `portfolio.html`. All three preview image cards also link to the matching filtered category.
- New `/portfolio.html`: 20 separate illustrative images across Product Labels, Die-Cut Stickers, Retail & Large Format, and Team & Process. Mixed-width editorial gallery, category filtering, image enlargement, practical use and production notes, TH/EN plus English fallback.
- Popular applications cards: removed prominent orange quote banners and long equal-weight bullet lists. Clear job title, quiet price note, three practical comparisons: Best for, Why choose it, and Check first. No changes to pricing computation or customer quotes.
- Service benefit label: removed redundant Thai “มีการ” to read **ชำระแบบเครดิตเทอม**.

## Critical truthfulness note

Images are illustrative/AI-generated scenes and existing demo photos. Depicted workers are **not verified SCWork employees**, and the scenes are **not documented completed customer projects**. Do not remove the disclosure until the photography has been replaced by rights-cleared, verified photos. Actual quality depends on confirmed specifications and inspection, not image appearance.

## Deploy

1. Use Public Website ZIP for deployment, Full Package for editing/QA.
2. Verify `/portfolio.html?lang=th` and `?category=labels` after publishing.
3. In index.html click **ดูผลงานทั้งหมด**; click each of the 3 homepage preview cards.
4. Test filter buttons, gallery image modal, Escape/close, TH/EN and responsive mobile.
5. Check that the quote calculator and VAT logic behave as previously.

Build Public Website using `node qa/build-public-v2126.mjs <new-output-directory>` from Full Package root.
