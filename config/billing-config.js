/* Public selling settings only. Activate after SCWork verifies its VAT and order classification.
   Fees here are customer-facing additions not already in the approved price. */
window.SCWORK_BILLING_CONFIG = Object.freeze({
  sellerName: '',                // optional verified name shown on estimates
  vatStatus: 'not-registered',      // Confirmed: seller is NOT VAT registered; never charge VAT
  standardOrder: 'review',       // 'goods', 'service', or 'review' when classification is not confirmed
  managementFee: Object.freeze({type:'none',value:0}) // 'none', 'fixed' THB, or 'percent' (percentage points)
});
