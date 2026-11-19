# V1.9.0 release recheck

- Verified real script controllers with a DOM fixture: adding SKUs, TH/EN preserving data, date and requested documents, changing a prepared brief without leaving stale actions active, copying and LINE draft fallback, JSON download and staff import.
- Verified shared reference and stable brief numbering, read-only validation of incoming JSON, and project approval binding to the brief, official quotation number and revision, and the exact proof revision/file. Quote and proof changes exclude an older confirmation from the production handoff block.
- Re-ran V1.8.2, V1.8.1, V1.8.0, V1.7.5, V1.7.4 and general storefront regression tests. Baseline rate card and pricing engine remain unchanged.
- Browser launch in this execution environment was blocked. No live site or LINE account was used, and no messages, approvals, quotations, or files were sent.
