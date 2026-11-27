# SCWork V2.1.72 — Release stabilization

- `npm run check:release` validates checked-in public-release.
- `npm run build:public` creates a new `dist-public` folder; never overwrites an existing folder. To use a different new folder: `npm run build:public -- /path/to/new-folder`.
- `npm run check:release -- dist-public` verifies freshly generated output.
- When adding a public file, review and update `qa/public-manifest-v2172.json`; do not add internal or private files.
- Real browser tests: install Playwright locally with `npm install --no-save --package-lock=false playwright`, then `npx playwright install chromium webkit`, start `npm run dev` in another terminal, and run `npm run check:browser`. WebKit is an engine test, not a physical iPhone Safari test.

Design unchanged. Browser and full filesystem build are not claimed as executed by the connector.
