# SCWork V2.1.23 — Knowledge Hub + 15 printing guides

## What's new
- `knowledge.html`: public index of 15 sticker-printing articles, searchable and filterable by Materials, Durability, Production, and Applications. TH/EN interface; other existing locale selections fall back to English article content.
- Homepage: only three featured insights; an **Explore all articles (15)** link opens Knowledge Hub. Every article photo, title and Read More link opens the same article.
- `article.html?post=SLUG`: article detail with genuine SCWork header logo, clear subheadings, bullets, table of contents, relevant stories and price-estimate link.
- `data/site-data.js`: **single source of truth** for 15 articles, each fully drafted in Thai and English. Article records include `category`, `title`, `text`, `body`, `image`, and `translations.th`. Stable IDs preserved for the original first three articles.
- `tools/site-manager.html`: edit copy and categorized articles. The body field supports **Markdown-lite**: `## Heading` or `### Subheading` on separate blocks; hyphen-prefixed lines for bullet lists; `> ` for callouts. Keep blank lines between blocks. Use the Cover Image selector / Image Studio to replace the 15 knowledge cover photos; export changes ZIP and apply to the master.

## Source and image policy
- The articles are general educational guidance, NOT product specifications, legal compliance advice or durability guarantees. Before publishing claims for a specific material, inspect the exact film/ink/adhesive/laminate data sheet and test the real application. Avoid unverified year or lifetime guarantees.
- Some demonstration photographs, including images featuring an Asian print professional, are **illustrative AI-produced media**, not photographs of real SCWork employees, facilities, client projects or production capabilities. Image Studio has all 15 cover image slots.
- Technical review references: Avery Dennison label material selection (https://www.avery.com/blog/do-you-need-durable-labels-for-your-products/), Roland DG cut terminology (https://www.rolanddg.com.au/en-gb/blog/a-quick-guide-to-print-lingo), Adobe bleed and prepress (https://helpx.adobe.com/illustrator/desktop/save-and-export/export-files-to-different-formats/pdf-marks-bleeds-and-color-output-options.html), 3M surface preparation guidance (https://www.3m.com/) and each purchased material's technical bulletin. These are research references, not SCWork product certifications.

## Updating articles
1. Open `tools/site-manager.html` from Full Package and choose **Knowledge Articles**.
2. Edit English and Thai copy separately. Pick the category (materials, durability, production, applications) in the dropdown.
3. To add an article, use Add; the editor gives a stable ID. Set title, excerpt, body and cover.
4. In Image Studio, select one of the 15 **Knowledge** slots, upload a photo, apply crop and export the changes ZIP.
5. Extract the patch into your master and re-build Public Website with `node qa/build-public-v2123.mjs /target/new/folder`.
6. Run `node qa/validate-v2123.mjs` and browser tests after edits.

## Keep unchanged
This release deliberately preserves the approved Cinematic Hero motion, all quote/pricing logic, V2.1.21 service pages and V2.1.22 editorial footer. There is no invented LINE contact information or confirmed pricing/durability guarantee.
