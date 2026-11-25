# SCWork V2.1.37 — About us editorial refinement

Based on V2.1.36. Changes are restricted to About us and release documentation.

- Open `about.html` for the updated Who We Are and Our Philosophy sections.
- Run `npm run check:v2137`, `npm run check:pricing`, `npm run check:locales`.
- Build public-only storefront with `npm run build:public -- /path/to/new-public-release` (destination must not exist). Do not publish the entire full package; keep internal/admin tools private.
- Browser and live Supabase verification remain outstanding. See `qa/V2137-LAYOUT-QA.md`.
