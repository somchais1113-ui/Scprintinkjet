# SCWORK Pricing Control — Cloud expansion specification (not implemented in V2.1.31)

## Why V2.1.31 is local-first
This MVP uses a private, in-browser cost history and evidence store, with controlled handoff to the existing Pricing Workbench. It **does not** provide reliable multi-device sync, authenticated multi-user approval, or live supplier API monitoring. Browser storage can be deleted. Deploying `tools/` publicly is unsafe.

## Suggested future architecture
- Private admin app on a protected host (separate from Public Website).
- Supabase Auth (or equivalent managed identity) with verified staff roles. Never rely on client-side role checks alone.
- PostgreSQL tables:
  - `suppliers(id, name, status, contact_reference, created_at)`
  - `materials(id, canonical_unit, specification, active)`
  - `supplier_quotes(id, supplier_id, material_id, document_no, source_type, tax_treatment, source_price, pack_units, canonical_cost, quote_date, expires_at, status, version, created_by, created_at)`
  - `quote_evidence(id, quote_id, private_storage_key, sha256, mime_type, bytes, uploaded_by)`
  - `pricing_proposals(id, base_rate_version, scenario_snapshot, margin_floor, status, requested_by, approved_by, effective_at)`
  - `approved_rate_cards(id, immutable_snapshot, approved_by, approved_at, effective_at, supersedes_id)`
  - `quote_snapshots(id, customer_quote_id, rate_version, customer_price, expires_at)`
  - `audit_events(id, entity_type, entity_id, actor_id, action, before, after, at)` (append-only)
- Private storage buckets and short-lived signed URLs for evidence; customer cannot read supplier files or costs.
- Server-only service role / publishing credentials; no secrets in frontend JavaScript.
- API endpoints must authenticate roles, validate source documents and price units server-side, enforce optimistic locking (`version`), and reject updates to previously approved snapshots.
- Public price API returns **selling prices and effective dates only**; no supplier, expense, margin, or full cost master fields.
- Publishing flow: Draft -> Verify Supplier Evidence -> Review Margin -> Approve -> Publish Rate Card. Customer quotes already issued retain their own agreed version and terms.
- Supplier feeds: manual PDF/Excel upload first; API feeds or authorized emails only with documented permission, normalization and exception handling. Never assume generic websites expose current contractual B2B prices.
- Monitoring alerts: material cost change %, margin below floor, quote nearing expiry, material cost stale, published rate missing. A monitor event creates a review task; it never automatically publishes prices.
- VAT/WHT: seller VAT registration status maintained by authorized accounting personnel; supplier input VAT that cannot be recovered is part of cost. WHT depends on transaction nature and payer status, not just corporate buyer selection.

## Prerequisites for Phase 2
1. Authorized hosting domain and authentication provider configuration.
2. Supplier master records and permission to ingest price feeds.
3. Accounting-approved price policies, margin floors and supplier tax treatments.
4. Storage/security retention policy, role matrix, backups and restore test.
5. Integration test against live customer quote snapshots, plus rollback to prior approved version.

## Migration from MVP
Export private JSON and original evidence files separately. After server authentication and import validation, re-verify source documents and manually re-approve records; do not trust locally imported "approved" states as signatures. Map each material to canonical units and deduplicate supplier quote IDs before migration.
