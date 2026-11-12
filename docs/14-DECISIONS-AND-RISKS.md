# Decision Log + Risk Register — Unified Business Studio V2.3

## Decisions

| ID | Decision | Rationale | Next review |
|---|---|---|---|
| D-01 | Keep business UI under `tools/business/` and expose a hub at `tools/index.html`. | Preserves existing V2.2 site and managers while keeping modules independent. | Before secure admin deployment |
| D-02 | Prototype with synthetic customer/RFQ/quote/order data and browser localStorage. | Enables rapid workflow testing without pretending backend/data security exists. | Prior to real RFQ intake |
| D-03 | Attribute Dashboard conversion to RFQ intake cohorts. | Denominator and numerator represent the same opportunities. | Add source/period drilldowns |
| D-04 | Count only latest quote version per RFQ for Quote Win Rate. | Avoids revision-driven double-counting. | Add quote version history detail |
| D-05 | Require a Lost Reason on explicit rejection. | Captures actionable commercial feedback, not just funnel totals. | Add flexible reason taxonomy / notes |
| D-06 | Preserve public website TH/EN, image assets, and Site Manager unchanged. | Limits regressions while developing internal tooling. | V2.4 API integration |

## Risks and anti-patterns

| Risk | Severity | Mitigation in V2.3 / next |
|---|---|---|
| Publishing actual customer records on a static site | Critical | Never put real data into `data/demo` or localStorage. Introduce protected backend with RLS and RBAC. |
| Treating `noindex` / hidden links as authentication | Critical | UI explicitly states no authentication; use real server-side auth before production. |
| Treating static Dashboard as live business telemetry | High | DEMO banner visible on all pages; no public website RFQ connection claimed. |
| Counting quote revisions multiple times | High | Cohort KPI selects latest version per RFQ. |
| Mixing leads, quotations, and orders into one ambiguous count | High | Separate RFQ→Order rate and Quote Win Rate with documented formulas. |
| Confusing order value with paid revenue | High | Labelled order value, not cash collection. |
| Using estimated gross profit as operating profit | High | Explicit direct-cost-only caveat. |
| Inconsistent pipeline transitions | Medium | Prototype enforces quote-sent before order; production needs formal state machine and audit log. |
| Browser cache/localStorage loss | Medium | Manual JSON backup/import and reset; migrate to database. |
| Export CSV formula injection | Medium | Exporter prefixes leading formula/control characters with apostrophe. |
| Team members editing data concurrently | High | Unsupported; must add multi-user protected database and audit trails. |

## Next phase candidates

- Protected account roles (Admin, Sales, Production), private API and database.
- RFQ capture from public TH/EN website including product spec fields and file uploads.
- Quote PDF, tax handling, actual supplier costs, revisions and approval.
- Notifications, SLA/response time, supplier routing and service profitability.

**Do not start these as live features inside public GitHub Pages.** Confirm privacy/security architecture first.
