import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
for(const file of ['src/scripts/rfq-live.js','src/scripts/rfq-demo.js','src/scripts/general-inquiry.js','src/scripts/entry-cta.js','src/scripts/main.js','tools/business/live-inbox.js']){execFileSync('node',['--check',new URL('../'+file,import.meta.url).pathname]);checks++;}
const home=read('index.html'),rfq=read('request-quote.html'),general=read('src/scripts/general-inquiry.js'),net=read('src/scripts/rfq-live.js'),main=read('src/scripts/main.js'),config=read('config/public-config.js'),sql=read('supabase/migrations/202611100001_connected_rfq.sql');
ok(!main.includes('mailto:'),'No mailto from public contact submit');
ok(!home.includes('id="quoteForm"'),'Legacy double-submit form removed');
ok(home.includes('request-quote.html?type=general'),'General inquiry uses canonical entry');
ok(rfq.includes('rfqLiveFields')&&rfq.includes('generalInquiry'),'Print + general intake exist');
ok(rfq.includes('config/public-config.js')&&rfq.includes('rfq-live.js'),'RFQ config and transport in page');
ok(config.includes("mode: 'demo'"),'Safe unconfigured demo default');
ok(general.includes('network.submit(')&&!general.includes('mailto'),'General inquiry uses same API');
ok(sql.includes('enable row level security')&&sql.includes('is_rfq_staff'),'RLS enabled');
ok(sql.includes('unique (rfq_id,kind)')&&sql.includes('idempotency_key uuid not null unique'),'Unique RFQ and mail inserts');
ok(sql.includes('create_public_rfq')&&sql.includes('notification_outbox'),'Atomic outbox RPC');
ok(read('supabase/functions/submit-rfq/index.ts').includes('TURNSTILE_SECRET_KEY'),'Server-side bot verification');
ok(read('supabase/functions/submit-rfq/index.ts').includes('reserve_rfq_rate_limit'),'Rate limiter hook');
ok(read('supabase/functions/_shared/notify.ts').includes('Idempotency-Key'),'Email idempotency on provider');
ok(read('supabase/functions/dispatch-emails/index.ts').includes('EMAIL_WORKER_SECRET'),'Worker private secret');
ok(read('tools/business/live-inbox.js').includes('/auth/v1/token')&&read('tools/business/live-inbox.js').includes('/rest/v1/rfqs'),'Authenticated live inbox');
ok(!read('tools/business/live-inbox.js').includes('localStorage'),'No PII persisted by live inbox');
ok(fs.existsSync(new URL('../privacy.html',import.meta.url)),'Privacy notice page present');
// Simulated browser adapter: test a network failure, stable idempotency retry and success.
const session=new Map(), seen=[];
let fail=true;
const target={};
const ctx={
 window:target,document:{getElementById(){return{};},head:{appendChild(){}}},
 sessionStorage:{getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)},
 crypto:crypto.webcrypto,
 fetch:async(_url,req)=>{const payload=JSON.parse(req.body);seen.push(payload);if(fail){fail=false;throw Error('NETWORK_DOWN');}return {ok:true,status:201,json:async()=>({ok:true,reference:'RFQ-2026-TEST',id:'id-1',emailStatus:'queued'})};},
 Error,JSON,Object,RegExp,String,Math,FormData,URL,Promise,
};
target.PROCLEANING_PUBLIC_CONFIG={mode:'connected',supabaseUrl:'https://example123.supabase.co',turnstileSiteKey:'test-public-sitekey'};
target.turnstile={render:(_el,opts)=>{opts.callback('fake-test-token');return 1;},reset:()=>{}};
vm.runInNewContext(net,ctx);
ok(target.PCRFQNetwork.enabled,'Connected mode active when configured');
target.PCRFQNetwork.renderChallenge();
const first={name:'Test',email:'test@example.org',title:'Demo',quantity:1};
let failed=false;try{await target.PCRFQNetwork.submit(first);}catch{failed=true;}
ok(failed,'Transport does not fake success on network failure');
const result=await target.PCRFQNetwork.submit(first);
ok(result.reference==='RFQ-2026-TEST','Server reference used');
ok(seen.length===2&&seen[0].submission_id===seen[1].submission_id,'Same UUID reused after failure');
ok(!session.has('pc_pending_rfq_submission_v25'),'ID cleared only after confirmed success');
console.log(`PASS v2.5: ${checks} checks; inherited 2.0–2.4 checks run separately`);
