import { adminDb,dispatchPending } from '../_shared/notify.ts';
import {corsHeaders,json} from '../_shared/cors.ts';
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedCategories=['Sticker & Label','Large Format Inkjet','Display & Signage','Packaging Prototype','POSM & Retail','Artwork & Prepress','Office Cleaning','Spring Cleaning','House Cleaning','Other Service'];
const uuidRe=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function clean(x:unknown,max=255){return String(x??'').trim().slice(0,max);}
function validate(body:Record<string,unknown>){
 const specs=(body.specs&&typeof body.specs==='object'&&!Array.isArray(body.specs))?body.specs as Record<string,unknown>:{};
 const number=(v:unknown)=>Number(v);
 const normalized={name:clean(body.name,120),email:clean(body.email,254).toLowerCase(),phone:clean(body.phone,40),
  title:clean(body.title,180),category:clean(body.category,100),quantity:number(body.quantity),unit:clean(body.unit,20),
  language:body.language==='th'?'th':'en',
  specs:{width:number(specs.width),height:number(specs.height),dimensionUnit:clean(specs.dimensionUnit,5),material:clean(specs.material,100),finish:clean(specs.finish,100),printSides:clean(specs.printSides,30),artwork:clean(specs.artwork,30),deadline:clean(specs.deadline,10),notes:clean(specs.notes,1000)} };
 if(!normalized.name||!emailRe.test(normalized.email)||!normalized.title||!allowedCategories.includes(normalized.category)||!Number.isInteger(normalized.quantity)||normalized.quantity<1||normalized.quantity>1000000||!['pcs','sqm','sets','jobs'].includes(normalized.unit)) throw Error('INVALID_FIELDS');
 if(!Number.isFinite(normalized.specs.width)||!Number.isFinite(normalized.specs.height)||normalized.specs.width<=0||normalized.specs.height<=0||normalized.specs.width>100000||normalized.specs.height>100000) throw Error('INVALID_DIMENSIONS');
 if(!['mm','cm','m'].includes(normalized.specs.dimensionUnit))throw Error('INVALID_UNITS');
 if(normalized.specs.deadline&&!/^\d{4}-\d{2}-\d{2}$/.test(normalized.specs.deadline))throw Error('INVALID_DATE');
 return normalized;
}
async function sha256(x:string){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function turnstile(token:unknown,request:Request){
 const secret=Deno.env.get('TURNSTILE_SECRET_KEY');
 if(!secret)throw Error('ANTI_BOT_NOT_CONFIGURED');
 const form=new FormData();form.append('secret',secret);form.append('response',String(token||''));
 const ip=request.headers.get('cf-connecting-ip');if(ip)form.append('remoteip',ip);
 const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
 if(!r.ok)return false;
 const d=await r.json();
 const expectedHost=Deno.env.get('TURNSTILE_HOSTNAME');
 return d.success===true&&(!expectedHost||d.hostname===expectedHost);
}
Deno.serve(async request=>{
 const headers=corsHeaders(request);
 if(!headers)return json({error:'ORIGIN_NOT_ALLOWED'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405,headers);
 try{
   const raw=await request.text();if(raw.length>12000)return json({error:'PAYLOAD_TOO_LARGE'},413,headers);
   const body=JSON.parse(raw);
   const key=clean(body.submission_id,50);
   if(!uuidRe.test(key))return json({error:'INVALID_SUBMISSION_ID'},422,headers);
   const payload=validate(body);
   const hash=await sha256(JSON.stringify(payload));
   const db=adminDb();
   // Resolve a retry before validating a one-time Turnstile token.
   const existing=await db.from('rfqs').select('id,reference,payload_hash').eq('idempotency_key',key).maybeSingle();
   if(existing.error)throw Error('DB_UNAVAILABLE');
   if(existing.data){if(existing.data.payload_hash!==hash)return json({error:'SUBMISSION_ID_CONFLICT'},409,headers);
     try{await dispatchPending(existing.data.id,2);}catch{}
     return json({ok:true,reference:existing.data.reference,id:existing.data.id,duplicate:true,emailStatus:'queued_or_sent'},200,headers);
   }
   if(!await turnstile(body.turnstile_token,request))return json({error:'BOT_CHECK_FAILED'},422,headers);
   const salt=Deno.env.get('RFQ_RATE_SALT');if(!salt)throw Error('RATE_LIMIT_NOT_CONFIGURED');
   const emailRate=await db.rpc('reserve_rfq_rate_limit',{p_key:await sha256(salt+'|email|'+payload.email),p_limit:6,p_window_seconds:3600});
   if(emailRate.error)throw Error('RATE_LIMIT_DB_FAILURE');
   if(emailRate.data!==true)return json({error:'TOO_MANY_REQUESTS'},429,headers);
   const ip=request.headers.get('cf-connecting-ip')||'';
   if(ip){const ipRate=await db.rpc('reserve_rfq_rate_limit',{p_key:await sha256(salt+'|ip|'+ip),p_limit:30,p_window_seconds:3600});
     if(ipRate.error)throw Error('RATE_LIMIT_DB_FAILURE');if(ipRate.data!==true)return json({error:'TOO_MANY_REQUESTS'},429,headers);}

   const {data,error}=await db.rpc('create_public_rfq',{p_payload:payload,p_key:key,p_hash:hash,p_admin_email:Deno.env.get('ADMIN_NOTIFICATION_EMAIL')||null});
   if(error){if(error.message.includes('IDEMPOTENCY_CONFLICT'))return json({error:'SUBMISSION_ID_CONFLICT'},409,headers);throw Error('SAVE_FAILED');}
   let emailStatus='queued';
   try{const result=await dispatchPending(data.id,2);emailStatus=result.failed?'queued':result.sent?'submitted_to_provider':'queued';}catch{};
   return json({ok:true,reference:data.reference,id:data.id,duplicate:!!data.duplicate,emailStatus},201,headers);
 }catch(e){const m=String((e as Error).message);if(['INVALID_FIELDS','INVALID_DIMENSIONS','INVALID_UNITS','INVALID_DATE'].includes(m))return json({error:m},422,headers);
   console.error('RFQ submit error',m);return json({error:'UNABLE_TO_SAVE_RETRY'},503,headers);}
});
