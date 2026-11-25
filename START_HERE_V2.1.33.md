# SCWork V2.1.33 — About SCWork
- Based on V2.1.32 Printing Solutions Fully Package.
- Homepage navigation and footer link to `about.html`; existing Clients section retained.
- Thai/English About page, responsive CSS, illustrative imagery, three-stage process graphic and quote CTA. Other languages use English fallback for About only.
- Run `npm run check:v2133` and `npm run check:v2132`.
- Build public-only storefront: `npm run build:public -- /path/to/new/public-release`. Deploy only that output to public Vercel. Keep admin-cloud separate and existing Supabase settings unchanged.
- No changes to pricing, quotation logic, admin or Supabase configuration. Images are illustrative, not proof of facilities or staff.
