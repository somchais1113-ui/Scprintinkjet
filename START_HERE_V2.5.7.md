# ProCleaning V2.5.7 — Getting started

1. Unzip this package. Keep the complete `ProCleaning_V2_5/` directory together.
2. Open Terminal in `ProCleaning_V2_5` and run `python3 -m http.server 8000`.
3. Open `http://localhost:8000` and check TH/EN, Hero slides, Services, Pricing, Blog and Contact.
4. Edit text and global Section Spacing in `tools/site-manager.html`; photos in `tools/image-manager.html`.
5. For targeted padding/vertical rhythm, edit `src/styles/13-spacing-system.css` (the last-loaded stylesheet on the landing page).
6. Run `npm run check` from this directory for source and regression checks; Node.js is needed, but npm install is not.
7. When deploying, replace the entire directory, not only `index.html`, because assets use `?v=2.5.7` versioning.

See `docs/23-V2.5.7-SPACING-AUDIT.md` and `qa/V257-QA-RESULTS.md` for the changes and QA limitations.

**Security boundary:** Backend database/email/auth are connection-ready foundations only. The public demo and legacy Admin business module are not live production systems. Never place real customer data into the demo/ZIP or expose privileged credentials in static files.
