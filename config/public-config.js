/* Public values only. DO NOT place service_role, Resend, or worker secrets here.
 * Set mode="connected" after the SQL migration and Edge Functions are deployed.
 */
window.PROCLEANING_PUBLIC_CONFIG = Object.freeze({
  mode: 'demo',
  supabaseUrl: '',                 // e.g. https://YOUR-PROJECT.supabase.co
  publishableKey: '',             // sb_publishable_...; used only for staff sign-in/reads
  turnstileSiteKey: '',           // PUBLIC Cloudflare Turnstile site key
});

/* Optional business contact channels. Leave blank until verified. Never copy competitor contact details. */
window.SCWORK_PUBLIC_CONTACT = Object.freeze({
  officePhone: '',  // เบอร์สำนักงานจริง เช่น 02... (เว้นว่างหากยังไม่เปิดใช้)
  mobilePhone: '',  // เบอร์มือถือสำหรับลูกค้าจริง เช่น 08... 
  lineId: '',       // LINE Official Account: @yourname
  lineUrl: '',      // optional: https://line.me/...
  facebookUrl: '',  // optional: https://facebook.com/...
  messengerUrl: ''  // optional: https://m.me/... or https://facebook.com/messages/...
});
