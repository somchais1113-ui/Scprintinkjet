import {dispatchPending} from '../_shared/notify.ts';
import {json} from '../_shared/cors.ts';
Deno.serve(async req=>{
 if(req.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
 const expected=Deno.env.get('EMAIL_WORKER_SECRET');
 if(!expected || req.headers.get('x-worker-secret')!==expected)return json({error:'UNAUTHORIZED'},401);
 try{return json({ok:true,...await dispatchPending(null,20)});}catch(e){console.error('email-worker error',(e as Error).message);return json({error:'WORKER_FAILED'},503);}
});
