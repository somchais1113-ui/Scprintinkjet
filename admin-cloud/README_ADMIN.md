# SCWork Admin Cloud — V2.1.32

## Purpose and security boundary
A **separate static Admin deployment** intended for a dedicated subdomain, e.g. `admin.example.com` (placeholder). The customer website stays on its current deployment. Both may use the *same business data service*, but only the admin is allowed to access private supplier data.

**Not live until configured.** No real credentials, domains, Supabase project, users, or supplier data are bundled. The Admin is not a password-protected static HTML gimmick: private read/write access is enforced by Supabase Auth, MFA (`aal2`) and Postgres RLS. Public website release is deliberately unchanged in this phase.

## Required setup (in this order)
1. Create a new Supabase **staging** project. Review and execute `supabase/001_scwork_admin.sql` as database admin.
2. In Supabase Auth, create an invite-only Admin user. Disable open signups where appropriate. Copy that user's UUID. Run the **commented** bootstrap SQL at the bottom of the migration to grant `owner` role. Do not allow public membership creation.
3. Copy the Supabase Project URL and **publishable/anon key** into `config.js`. These values are allowed in browser code; **never insert service_role/secret key or database credentials**.
4. Deploy only this `admin-cloud/` directory as a **separate Vercel project**. Use a test subdomain first. Production subdomain and DNS are configured by the owner; the package does not provision a real domain.
5. Sign in, scan the authenticator QR, and complete TOTP. After MFA, read/write permissions are granted according to the database member role. Test that a second unauthorized user sees ACCESS RESTRICTED.
6. Insert test supplier quotes, upload supporting evidence, review/approve as Owner, and confirm a non-owner cannot approve. **Do not use live supplier data until security checks pass.**
7. Export private approved costs from the Admin (Rate Card tab), and use the local **Private Cost Bridge** in Full Package at `tools/cloud-cost-bridge.html` to merge into a separately exported Pricing Master draft. Review before making a Public Rate Card via the existing Pricing Workbench.

## Permissions
| Capability | owner | editor | viewer | anon |
|---|---|---|---|---|
| Sign in and complete TOTP | yes | yes | yes | no |
| Read supplier prices / evidence after MFA | yes | yes | yes | no |
| Create own draft / evidence | yes | yes | no | no |
| Edit own draft (via data API) | yes | yes | no | no |
| Approve supplier cost via RPC | yes | no | no | no |
| Change member roles from browser | no | no | no | no |
| Publish customer price automatically | **disabled in this phase** | no | no | no |

## Business rules
- SCWork is not registered for VAT. VAT 7% **must not be charged to customers** in the current Public Rate Card. If a supplier excludes VAT and actually charges it, the app adds 7% to cost when that option is chosen; if the supplier price already includes VAT or no VAT applies, it does not add 7% again.
- Landed unit cost is `(supplier invoice amount incl. any nonrecoverable VAT + freight_in) / comparable units`.
- `a3_sheet` and `sqm` are distinct units. PVC Sticker and Vinyl Banner are separate materials; the latter is typically non-adhesive banner stock.
- A supplier **cost approval is not a selling-price approval**. The approved selling rate must pass Pricing Master margin and quantity checks. Existing customer quotes are not modified retroactively.
- Public rate publishing in Supabase is **intentionally locked** in this starter (`scwork_published_rates` has no authenticated write policy). This prevents half-connected live-price changes. A future release will add server-side validation, versioned releases, rollback, and a public read API.

## What is and isn't implemented
**Implemented:** real Supabase email/password sign-in, mandatory TOTP MFA for data, owner/editor/viewer roles in RLS, invite-only membership bootstrap, supplier quotation table with VAT and unit validation, private evidence storage, signed 60-second evidence download links, immutable audit log via trigger, owner-only cost approval RPC, approved cost export, responsive UI, independent Admin deployment config, private bridge back to local Pricing Master.

**Not implemented without external connection:** automatic supplier price scraping/feed, cross-platform master pricing reconciliation, production deployment, custom domain/DNS, automatic publish to customer website, automated rollback, user invitations via UI, end-to-end authenticated cloud testing. Test data is not included.

## Verification / threat checklist
- [ ] Anonymous SELECT on `scwork_supplier_quotes` fails.
- [ ] Logged in without MFA (`aal1`) SELECT fails; with MFA (`aal2`) works for active members.
- [ ] Viewer INSERT fails; Editor INSERT succeeds; Editor approve RPC fails.
- [ ] Owner approve fails for expired quote, missing source, or short review reason.
- [ ] Public Storage URL is inaccessible; signed download expires.
- [ ] Client attempts to UPDATE status to `approved` fails.
- [ ] No service_role key is present in browser, public site, or static bundles.
- [ ] Public Website ZIP has no `admin-cloud`, `tools`, supplier documents, private draft JSON.
- [ ] Quote prices never change customer site without separately approved Rate Card and deployment.

## Source-control and release layout
- `Full_Package`: original storefront + internal tools + `admin-cloud`.
- `Admin_Deploy`: **only** files under `admin-cloud/`, with no supplier records or costs.
- `Public_Website`: unchanged static storefront from V2.1.31, no admin code.

References: https://supabase.com/docs/guides/database/postgres/row-level-security , https://supabase.com/docs/guides/auth/auth-mfa , https://vercel.com/docs/environment-variables
