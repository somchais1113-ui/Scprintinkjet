# SCWork V2.1.52 — Homepage reload scroll reset

- On a real reload of the homepage only, suppress automatic scroll restoration and remove any old fragment while retaining query parameters (including language).
- Reset to top without animation during page initialization, then release the reset after pageshow or on user input.
- Preserve direct deep links, ordinary anchor navigation, back/forward navigation and editor preview.
- Correct the Clients anchor target to the existing socialProofTitle.
- Refresh cache keys for the relevant scripts and the previous badge/pause CSS.
- No visual layout, imagery, pricing, admin or database changes.
