/*
 * Real logos: put files in assets/images/client-logos/actual/ and register them here.
 * Example: { name: 'Client name', src: './assets/images/client-logos/actual/client.webp', approved: true }
 * Approved real entries replace the mockup strip automatically.
 */
window.SCWORK_CLIENT_LOGOS = [];

window.SCWORK_CLIENT_LOGO_MOCKUPS = Array.from({length:6},(_,i)=>{
  const id=String(i+1).padStart(2,'0');
  return { name:'Logo mockup '+id, src:'./assets/images/client-logos/mockups/logo-mockup-'+id+'.svg' };
});
