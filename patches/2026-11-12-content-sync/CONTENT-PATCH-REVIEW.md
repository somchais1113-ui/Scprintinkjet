# Content Patch Audit — 2026-11-12

Source: `ProCleaning_V2.2_Changes_PATCH.zip` received from user.
Target: ProCleaning v2.5.7 baseline.

## Applied
The exported `data/site-data.js` was applied without rewriting the user's wording. A semantic comparison found 17 changed English content values, with **no added or removed JSON properties**.

Changed fields:
- brand.prefix, brand.name, brand.tagline, brand.pageTitle, brand.metaDescription
- hero.eyebrow, hero.title, hero.description
- headings.servicesTitle, headings.servicesEyebrow, headings.servicesDescription
- headings.quoteEyebrow, headings.quoteTitle, headings.quoteDescription
- headings.teamTitle, headings.teamEyebrow, headings.teamDescription

## Items requiring review before launch
1. Brand mismatch: visible name joins `SC` + `Design` = `SCDesign`; page title uses `SCWork`. Confirm intended visible name.
2. Thai locale (`i18n.th`) is unchanged and still references the cleaning company in several sections. TH/EN copy requires harmonization.
3. Public service cards, pricing, portfolio/personnel imagery and article content remain cleaning-specific. This patch changes copy only and is **not** a full site rebrand.
4. Generated patch includes no image files (only data/site-data.js, backup JSON, instructions).
5. The source patch filename says v2.2 but its schema 2 fields fit the v2.5.7 content model. Core application files were not replaced.

## Applying to existing repo
Prefer this merged complete ZIP, or replace only `data/site-data.js` within your existing v2.5.7 project. Do not overwrite the whole project with the v2.2 patch as a standalone installation.

## QA performed
- Semantic key comparison: no missing/added keys; 17 string edits.
- JavaScript syntax validation with Node.
- Data load and TH/EN locale resolution in sandbox.
- ZIP integrity.
No live Supabase / deployed website QA was performed.
