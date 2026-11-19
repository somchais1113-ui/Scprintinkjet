# V2.1.0 release recheck

- Compared against Scprintinkjet.zip. Preserved every uploaded image byte-for-byte, including the six revised images, and restored the missing .nojekyll build file.
- Verified the retained pricing engine with the customer-facing fee, VAT, withholding, buyer switch, service threshold, partial payment and rate/merchant configuration checks.
- Exercised browser-like DOM controllers for print with and without approved rates or LINE. Unconfirmed rates show a specification-only page; demo amounts do not populate the printed document.
- Re-ran V2.0, V1.9, V1.8.2, V1.8.1, V1.8.0 and the general storefront checks. Browser launch was blocked in the execution environment, so direct visual verification of the native print dialog on target devices remains outstanding. No site or account was connected or published.
