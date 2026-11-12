> Latest layout fix: **V2.5.4**. Preview files are in `previews/hero-v254-*.png`. The Hero now uses a stable two-row grid; deploy all files together.

# Quick start — ProCleaning v2.5

### See the UI immediately

1. Extract ZIP and run `python3 -m http.server 8000` inside `ProCleaning_V2_5`.
2. Open `http://localhost:8000` for the existing TH/EN website.
3. Use the page's **Request Quote** button to open one unified General Inquiry page. In Demo Mode its Submit is disabled to avoid fake receipt claims.
4. Open `http://localhost:8000/request-quote.html` to try the *printing-specific* local synthetic RFQ demo.
5. Open `http://localhost:8000/tools/` for retained Website Manager, Image Manager and legacy synthetic dashboards.
6. Open `http://localhost:8000/tools/business/live-inbox.html` to see the new staff inbox shell. Live queries are disabled until you configure Supabase.

### Activate real receipt + email

Complete all steps in `docs/18-V2.5-DEPLOYMENT.md`, including database migration, Edge Function deployment, verified Resend sender, Turnstile, Auth staff membership, approved Privacy Notice and secure retry-worker scheduling. Set the four public client config values in `config/public-config.js` only after server-side configuration is ready.

**Do not** place real secrets, contact lists or customer artwork in a public GitHub repository. Connected Live Inbox is read-only. Legacy Quotations/Orders are still offline demo and intentionally not joined to the live customer data.
