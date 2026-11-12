/* Shared public RFQ transport. Only a confirmed DB response means "submitted". */
(() => {
  'use strict';
  const cfg=window.PROCLEANING_PUBLIC_CONFIG||{};
  const enabled=cfg.mode==='connected'&&/^https:\/\/[^/]+\.supabase\.co\/?$/.test(cfg.supabaseUrl||'')&&!!cfg.turnstileSiteKey;
  let widget=null,resolveToken='';
  const idKey='pc_pending_rfq_submission_v25';
  function id(){
    try {const existing=sessionStorage.getItem(idKey);if(existing)return existing;const fresh=crypto.randomUUID();sessionStorage.setItem(idKey,fresh);return fresh;}
    catch {return crypto.randomUUID();}
  }
  function resetId(){try{sessionStorage.removeItem(idKey);}catch{}}
  function renderChallenge(elementId="rfqTurnstile"){
    if(!enabled)return;
    const el=document.getElementById(elementId);if(!el)return;
    const begin=()=>{
      if(widget!==null||!window.turnstile)return;
      widget=window.turnstile.render(el,{sitekey:cfg.turnstileSiteKey,'callback':t=>{resolveToken=t;},'expired-callback':()=>{resolveToken='';},'error-callback':()=>{resolveToken='';}});
    };
    if(window.turnstile)begin();else{
      const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.defer=true;s.onload=begin;document.head.appendChild(s);
    }
  }
  function resetChallenge(){resolveToken='';if(window.turnstile&&widget!==null)window.turnstile.reset(widget);}
  async function submit(payload){
    if(!enabled)throw Error('NOT_CONNECTED');
    if(!resolveToken)throw Error('COMPLETE_SECURITY_CHECK');
    const response=await fetch(cfg.supabaseUrl.replace(/\/$/,'')+'/functions/v1/submit-rfq',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...payload,submission_id:id(),turnstile_token:resolveToken}),
      cache:'no-store',mode:'cors'
    });
    let data;try{data=await response.json();}catch{throw Error('INVALID_SERVER_RESPONSE');}
    if(!response.ok){
      if(response.status===409){resetId();resetChallenge();}
      if(response.status===422)resetChallenge();
      throw Error(data?.error||('HTTP_'+response.status));
    }
    if(!data?.ok||!data?.reference)throw Error('SERVER_DID_NOT_CONFIRM');
    resetId();resetChallenge();return data;
  }
  window.PCRFQNetwork={enabled,submit,renderChallenge,resetChallenge};
})();
