# SCWork V2.1.22 — Editorial Footer

This is a footer-only update from V2.1.21.

On the homepage, the layout follows the user-approved reference: top consultation strip, 4-column footer (brand / services / information / SCWork) and a small legal row.

The orange CTA opens LINE **only if** `window.SCWORK_PUBLIC_CONTACT.lineUrl` or a valid `lineId` is set in `config/public-config.js`; otherwise it opens the existing Smart Quote advice form. The supplied LINE icon is included in `assets/icons/line-official.png` and shown only for the verified LINE CTA.

Deploy the `Public_Website` package. Edit the `Full_Package` master for further changes.
