# V2.0 → V2.1 Migration & Architecture

## Core Decision

**Single source of truth:** `data/site-data.js` defines `window.PROCLEANING_SITE`.

- `src/scripts/config.js` is now a compatibility adapter reading `PROCLEANING_SITE`
- `src/scripts/content.js` is now a compatibility alias for `PROCLEANING_SITE`
- `src/scripts/site-runtime.js` maps text values to their existing design positions and sets CSS custom properties
- `src/scripts/main.js` renders dynamic card grids and sends preview updates in Editor Mode
- `tools/site-manager.js` is a browser editor; it never writes directly to deployed files
- `tools/zip-store.js` is a dependency-free ZIP writer for patch output; the ZIP uses STORE (uncompressed) method

## Image workflow

Image slots preserve the same paths from V2.0 (`assets/images/manifest.json`). Cropped files exported at those paths overwrite old static `.webp` assets. This separates the layout, image filename and actual image pixels.

## Maintaining features

All new text keys should be added to `data/site-data.js`, then bound in `src/scripts/site-runtime.js` or dynamic `ui.js`, and surfaced in `tools/site-manager.js` fieldGroups. Avoid hardcoded new strings in `index.html` that lack a runtime binding.

## Data format

`schemaVersion = 1`; JSON imports are validated at the top level. v2.1 makes no claim of a database migration or production CMS.

## UI compromise

This is a **style/structure reference website** derived from a Figma Community layout; original images from Figma are not included, and styling/responsiveness have been adapted for running static code. There is no claim of full 1:1 pixel parity.
