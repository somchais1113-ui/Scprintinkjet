# 13 — Customer & Order Dashboard Prototype (V2.3)

Updated: 2026-11-09 · Status: **functional local prototype using synthetic data**, not production CRM.

## 1. Direction

Create a unified workspace in `tools/`, preserving the original public TH/EN website and Site Manager.

The modules represent **one product with four subdomains**:

- Dashboard: RFQ / quote / order sales funnel, quote win rate, RFQ-to-order conversion, lead acquisition channel, order value and estimated gross margin.
- Customers: lead directory and referral / segment details. Manual creation of synthetic customers and RFQs.
- RFQ & Quotations: multiple quote versions for a single RFQ, transitions Draft → Sent → Won / Lost, and a mandatory lost reason when marked rejected.
- Orders: generated only from a sent quote, status Confirmed → In production → Quality check → Shipped → Delivered, with flexibility to change status in demo.

The existing Site Manager and Image Manager remain separate, linked modules, not merged into a giant file.

## 2. How to navigate

From the project root:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000/tools/` → Dashboard / Customers / RFQ & Quotations / Orders.

The `tools/index.html` hub also links directly to `site-manager.html` and `image-manager.html`.

### Typical test scenario

1. Customers → **เพิ่มลูกค้าทดลอง**.
2. Customers → click **+ RFQ** beside the customer to preselect it.
3. Quotations → click **+ Quotation** on that RFQ, enter selling value and estimated direct cost.
4. Quotations tab → **ส่งราคา** (Draft → Sent).
5. Quotations tab → **ปิดการขาย** (Sent → Accepted + new Order). Alternatively use **Lost** to record reason.
6. Orders → change status. Dashboard will read the changed local dataset after navigation.
7. Use **Backup Demo JSON** to save a snapshot. **Reset Demo** restores the seeded synthetic examples.

## 3. Source of truth and persistence

`data/demo/seed-data.js` is the browser bootstrap source, containing 30 fictional customers, 42 fictional RFQs, 35 quote records (including one deliberate revised quote), and 11 example orders. The four JSON snapshots are for reading and inspection, not fetched in the browser.

The browser code uses localStorage key `procleaning-business-demo-v23`. Changes persist between pages **on the same browser/profile only**. JSON backup/import is a manual and unencrypted export. There is no real database, API, audit log, login, multiuser synchronization, or server-side access controls.

All demo records are fictional, even if a company name looks plausible. Email addresses are `example.com` samples, not customer contacts.

## 4. KPI definitions (important)

### Date and attribution

Dashboard uses an **RFQ-created cohort** filtered by received date (7 / 30 / 90 days / all) and source (Website / LINE / Facebook / Referral / Direct / Instagram). All funnel counts and order value are attributed to those RFQs, even if the order is confirmed later. This prevents comparing unrelated numerator / denominator periods.

### Key KPIs

- **RFQ Volume**: count of unique RFQ IDs received in cohort.
- **Quoted RFQs**: count of unique RFQs in cohort with a latest quote whose status is not Draft.
- **Confirmed Orders**: count of order records linked to cohort RFQs. One RFQ currently creates max one order in demo.
- **RFQ-to-Order Conversion**: number of distinct RFQ IDs with a confirmed order / number of RFQs in cohort. If no RFQs, display `—` instead of 0%.
- **Quote Win Rate**: latest quote for each RFQ (highest version, tie-break latest created date). For decided outcomes only, `Accepted / (Accepted + Rejected + Expired)`. Draft and Sent are excluded. If no decided quotes, display `—`.
- **Quote Versioning**: a revised quote does NOT count as another RFQ or another quoted opportunity. The quotation list displays latest version per RFQ; history remains in data.
- **Order Value**: total Order amounts associated with RFQs in cohort. This is not cash collected.
- **Estimated Gross Profit**: Order value minus estimated direct production cost. Does NOT include overhead, tax, transaction charges, staff/admin labor, rework, freight or actual invoiced cost unless explicitly entered as direct cost.
- **New Customers**: customer records added within timeframe (filtered by their own recorded source); **not** necessarily the unique customers generating cohort RFQs.
- **Funnel chart**: RFQs received → latest quote sent/decided → distinct RFQs with order.
- **6-month chart**: RFQ and eventual order counts grouped by RFQ receipt month; it intentionally ignores the 7/30/90-day filter and follows only the source filter. This is explicitly labeled in the UI.

### Cautions

- Lost reason is mandatory for the Rejected action; Expired and imported seed values may differ.
- Demo status edits are permissive, not a production-grade transition engine.
- Cancellation/rework accounting and partial shipments are out of scope.
- Conversion rates from small synthetic cohorts are illustrative, not benchmarks.
- Quote and RFQ volumes are opportunity counts, not all website visits or marketing leads.

## 5. Data schema

```
Customer { id, name, contact, email, segment, source, createdAt, notes }
RFQ { id, customerId, title, category, quantity, unit, source, receivedAt, status, deadline, notes }
Quote { id, rfqId, customerId, version, amount, estimatedCost, status, createdAt, sentAt, decisionAt, lostReason, notes }
Order { id, quoteId, rfqId, customerId, amount, estimatedCost, createdAt, dueDate, deliveredAt, status, notes }
Event { id, type, message, ref, at }
```

No third-party APIs are called by the business prototype; the website may still use online Google Fonts per V2.2.

## 6. Production architecture proposal

**DO NOT use GitHub Pages for a real business dashboard or customer records.** URLs, client-side JavaScript, `data/demo/`, `noindex`, or hiding navigation links do not protect data.

Before onboarding real customers:

1. Choose a **protected Admin Application** (e.g. `/admin/` under authenticated host, or separate admin domain). Require login, MFA when available, role-based authorization, server-side validation and least-privilege permissions.
2. Move customer/RFQ/quote/order records to a **private database** such as Supabase PostgreSQL, with strict Row-Level Security and no public select for internal customer or quote data. Never put private service keys in browser code.
3. Build authenticated API/Edge Function endpoints for RFQ submission, quote generation, order transitions and audit history. Public website RFQ must be validated, rate limited, protected against abuse and linked to customer data with consent / privacy notice.
4. Private artwork/attachments should live in **private object storage** with upload constraints, scanning and expiring signed URLs; never commit to public GitHub.
5. Add approval/quote revision policy, tax/discounts, supplier costing, cost allocation, fulfillment milestones, notification workflows, export logs, audit records and backup/recovery.
6. Separate permissions for Sales / Production / Admin / Accountant. For example, production operators should not automatically see customer profitability or private CRM details.
7. Address relevant privacy and retention duties (e.g., Thailand PDPA) with legal review, data minimization, access controls, deletion and breach procedures.

## 7. QA checklist

- [x] Render four module pages and common Navigation.
- [x] Demo data contains a deliberate quote revision for anti-double-counting tests.
- [x] Add customer → RFQ → Quote → Sent → Order flow tested with Node VM tests.
- [x] RFQ-to-order and quote win-rate methodology unit-tested.
- [x] Export/import JSON structure and CSV escaping supported.
- [x] Static file references validated, retained V2.2 TH/EN files.
- [ ] Production authentication, private database, secure RFQ API (NOT implemented).
- [ ] Full visual review in user's target browsers/devices before production.

**Decision:** Prototype first to evaluate workflow. Build the secure backend after flows and required data fields are validated, rather than presenting artificial KPI charts as live business intelligence.
