# V2.0.0 release recheck

- Confirmed a tracking link retains the same token through status revisions and local backup/restore. Simulated HTTP success, 404, network failure, stale snapshot and on-hold presentation in the public UI controller.
- Verified staff approval gating, delivered-proof binding, same-scope repeat exports and local customer import with a fresh brief ID referencing the old proof. No old price, due date, or artwork URL is carried forward.
- Tested the real Public build with allowed tracking data, then rejected a tracking file with an extra customer field and a misplaced private repeat file. No live or sample status files ship with the release.
- Regression checks for V1.9, V1.8.2, V1.8.1, V1.8.0, V1.7.5 and general storefront passed. Browser launch was unavailable in this environment. No site was published and no live orders or LINE messages were tested.
