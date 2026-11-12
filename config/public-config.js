/* Public values only. DO NOT place service_role, Resend, or worker secrets here.
 * Set mode="connected" after the SQL migration and Edge Functions are deployed.
 */
window.PROCLEANING_PUBLIC_CONFIG = Object.freeze({
  mode: 'demo',
  supabaseUrl: '',                 // e.g. https://YOUR-PROJECT.supabase.co
  publishableKey: '',             // sb_publishable_...; used only for staff sign-in/reads
  turnstileSiteKey: '',           // PUBLIC Cloudflare Turnstile site key
});
