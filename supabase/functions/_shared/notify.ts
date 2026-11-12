import { createClient } from 'npm:@supabase/supabase-js@2';
const env=(name:string) => {const s=Deno.env.get(name);if(!s)throw new Error('Missing server setting: '+name);return s;};
export const adminDb=()=>createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
const esc=(x:unknown)=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
export async function dispatchPending(rfqId:string|null=null,max=10){
  const db=adminDb();
  const {data:jobs,error}=await db.rpc('claim_rfq_notifications',{p_limit:max,p_rfq_id:rfqId});
  if(error)throw new Error('Could not claim notifications');
  let sent=0,failed=0;
  for(const job of jobs||[]){
    try {
      const {data:rfq,error:re}=await db.from('rfqs').select('reference,project_title,language,customers(name)').eq('id',job.rfq_id).single();
      if(re||!rfq)throw new Error('RFQ lookup failed');
      const customer=Array.isArray(rfq.customers)?rfq.customers[0]:rfq.customers;
      const isTh=rfq.language==='th';
      const subject=job.kind==='admin_alert'?`New RFQ ${rfq.reference}`:(isTh?`รับคำขอใบเสนอราคาแล้ว · ${rfq.reference}`:`We received your quote request · ${rfq.reference}`);
      const heading=job.kind==='admin_alert'?'New RFQ received':isTh?'เราได้รับคำขอราคาแล้ว':'We received your request';
      const desc=job.kind==='admin_alert'?'Please sign in to your secure RFQ Inbox.':isTh?'ทีมงานจะตรวจสอบรายละเอียดและติดต่อกลับทางอีเมล':'Our team will review your details and follow up by email.';
      const html=`<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#173a27"><h1>${esc(heading)}</h1><p>${esc(desc)}</p><p><strong>Reference:</strong> ${esc(rfq.reference)}</p><p><strong>Project:</strong> ${esc(rfq.project_title)}</p><p>${job.kind==='admin_alert'?'':'This is an acknowledgement, not a price quotation.'}</p></div>`;
      const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env('RESEND_API_KEY')}`,'Content-Type':'application/json','Idempotency-Key':String(job.id)},body:JSON.stringify({from:env('MAIL_FROM'),to:[job.recipient],subject,html,...(Deno.env.get('REPLY_TO')?{reply_to:Deno.env.get('REPLY_TO')}: {})})});
      if(!response.ok)throw new Error(`Email API status ${response.status}`);
      const receipt=await response.json();
      const {error:ue}=await db.from('notification_outbox').update({status:'sent',provider_message_id:String(receipt.id||''),sent_at:new Date().toISOString(),last_error:null}).eq('id',job.id);
      if(ue)throw new Error('Unable to mark notification sent');sent++;
    }catch(e){
      failed++;
      const retry=job.attempts<5;
      const delay=Math.min(3600,Math.pow(2,job.attempts)*60);
      await db.from('notification_outbox').update({status:retry?'retry':'failed',next_attempt_at:new Date(Date.now()+delay*1000).toISOString(),last_error:String((e as Error).message).slice(0,160)}).eq('id',job.id);
      // Do not leak recipient, content, or secrets in application logs.
      console.warn('Notification attempt failed',job.id);
    }
  }
  return {claimed:(jobs||[]).length,sent,failed};
}
