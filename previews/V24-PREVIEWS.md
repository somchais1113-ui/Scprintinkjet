# V2.4 visual QA previews (inline Chromium simulation)

- `v24-rfq-th-desktop.png`: Thai RFQ review step, 1440px viewport.
- `v24-rfq-th-mobile.png`: Thai RFQ landing step, 390px viewport, no horizontal overflow in test.
- `v24-quote-builder-desktop.png`: pricing rows and live calculation, 1440px viewport.
- `v24-quote-print.png`: printable quote HTML sample, with DEMO watermark.
- `v24-business-dashboard.png`: legacy business dashboard still renders in same test harness.

The browser harness manually injects the same local HTML/CSS/JS source into `about:blank` because direct localhost/file navigation is restricted in this execution environment. These are inspection artifacts, not proof of production deployment.
