# SCWork Inkjet Sticker V2.1.32 — Two Interfaces / One Business System

## What changed
- Existing Public Website stays unchanged and does not expose supplier costs or the Admin.
- New separate Admin source in `admin-cloud/`, intended to deploy as a distinct Vercel project / subdomain.
- Real Supabase Auth email/password + mandatory TOTP MFA / Database RLS after configuration.
- Cloud Supplier quotations, document evidence, audit trail, owner approval, and private export.
- New local tool: `tools/cloud-cost-bridge.html` to import APPROVED private Cloud costs into a Pricing Master JSON draft, manually review, then separately approve the customer-facing selling Rate Card.

## Deploy and security order
1. Read `admin-cloud/README_ADMIN.md` and SQL migration `admin-cloud/supabase/001_scwork_admin.sql`.
2. Create test Supabase project, set up Auth user and owner role, verify MFA & policies.
3. Enter Supabase Project URL and PUBLIC publishable key into `admin-cloud/config.js` (never secret key).
4. Deploy only `admin-cloud/` as the Admin site under its own Vercel project and subdomain.
5. Keep Public Website as an independent deployment and use the existing production Public Release.
6. Do not enable automated price publication until Cost Master validation, seller approval and role tests all pass.

## Honest limitations
- Credentials and cloud services are NOT connected; no production Login exists until configured.
- We cannot prove MFA/RLS end-to-end until running the migration in a real Supabase project and completing authorization tests.
- Automatic public rate publishing is disabled on purpose; Approval of a Supplier cost is not Approval of selling rate.
- Public frontend pricing remains based on existing approved static Rate Card (currently no approved public data).

## QA
Run `npm run check:v2132`, `npm run check:v2131`, `npm run check:pricing`, `npm run check:locales` from the Full Package root.

## Deliverables
- Full Package V2.1.32 — main storefront, private tools, Admin Cloud source, data & QA.
- Public Website V2.1.32 — deploy-only customer-facing files, no internal tools.
- Admin Deploy V2.1.32 — separate admin web directory, with config placeholders and SQL setup reference.
