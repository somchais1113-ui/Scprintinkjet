-- ProCleaning v2.5: DB-backed RFQ, transactional notification outbox, admin-only reads.
-- Run on a NEW/empty Supabase project or review naming collisions before applying.
create extension if not exists pgcrypto;
create sequence if not exists public.rfq_ref_seq;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null unique check (char_length(email) between 5 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('RFQ-' || to_char(now() at time zone 'Asia/Bangkok','YYYY') || '-' || lpad(nextval('public.rfq_ref_seq')::text,6,'0')),
  idempotency_key uuid not null unique,
  payload_hash text not null check (char_length(payload_hash)=64),
  customer_id uuid not null references public.customers(id),
  project_title text not null check(char_length(project_title) between 1 and 180),
  category text not null,
  quantity numeric not null check(quantity > 0),
  unit text not null,
  specs jsonb not null default '{}'::jsonb,
  language text not null check(language in ('th','en')),
  status text not null default 'received' check(status in ('received','reviewing','quoted','won','lost','cancelled')),
  received_at timestamptz not null default now()
);
create index if not exists rfqs_received_idx on public.rfqs(received_at desc);
create index if not exists rfqs_customer_idx on public.rfqs(customer_id);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  kind text not null check(kind in ('customer_receipt','admin_alert')),
  recipient text not null,
  status text not null default 'pending' check(status in ('pending','sending','retry','sent','failed')),
  attempts int not null default 0,
  next_attempt_at timestamptz not null default now(),
  claimed_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (rfq_id,kind)
);
create index if not exists outbox_due_idx on public.notification_outbox(status,next_attempt_at);

-- Restrict all records (including PII) to explicitly approved staff accounts.
create or replace function public.is_rfq_staff() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_rfq_staff() from public;
grant execute on function public.is_rfq_staff() to authenticated;

alter table public.admin_users enable row level security;
alter table public.customers enable row level security;
alter table public.rfqs enable row level security;
alter table public.notification_outbox enable row level security;
create policy "staff read own membership" on public.admin_users for select to authenticated using(user_id=(select auth.uid()));
create policy "staff read customers" on public.customers for select to authenticated using ((select public.is_rfq_staff()));
create policy "staff read rfqs" on public.rfqs for select to authenticated using ((select public.is_rfq_staff()));
create policy "staff read notifications" on public.notification_outbox for select to authenticated using ((select public.is_rfq_staff()));
revoke all on public.admin_users, public.customers, public.rfqs, public.notification_outbox from anon;
grant select on public.admin_users, public.customers, public.rfqs, public.notification_outbox to authenticated;

-- RPC: one atomic transaction. Service role is the only allowed caller.
create or replace function public.create_public_rfq(p_payload jsonb, p_key uuid, p_hash text, p_admin_email text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_old public.rfqs%rowtype; v_customer_id uuid; v_new public.rfqs%rowtype;
begin
  select * into v_old from public.rfqs where idempotency_key=p_key;
  if found then
    if v_old.payload_hash<>p_hash then raise exception 'IDEMPOTENCY_CONFLICT' using errcode='P0001'; end if;
    return jsonb_build_object('id',v_old.id,'reference',v_old.reference,'duplicate',true);
  end if;
  insert into public.customers(name,email,phone)
  values(p_payload->>'name',lower(p_payload->>'email'),nullif(p_payload->>'phone',''))
  on conflict(email) do update set updated_at=now()
  returning id into v_customer_id;

  insert into public.rfqs(idempotency_key,payload_hash,customer_id,project_title,category,quantity,unit,specs,language)
  values(p_key,p_hash,v_customer_id,p_payload->>'title',p_payload->>'category',
         (p_payload->>'quantity')::numeric,p_payload->>'unit',p_payload->'specs',p_payload->>'language')
  on conflict(idempotency_key) do nothing returning * into v_new;
  if not found then
    select * into v_old from public.rfqs where idempotency_key=p_key;
    if v_old.payload_hash<>p_hash then raise exception 'IDEMPOTENCY_CONFLICT' using errcode='P0001'; end if;
    return jsonb_build_object('id',v_old.id,'reference',v_old.reference,'duplicate',true);
  end if;
  insert into public.notification_outbox(rfq_id,kind,recipient)
  values(v_new.id,'customer_receipt',lower(p_payload->>'email'));
  if p_admin_email is not null and length(trim(p_admin_email))>0 then
    insert into public.notification_outbox(rfq_id,kind,recipient)
    values(v_new.id,'admin_alert',p_admin_email);
  end if;
  return jsonb_build_object('id',v_new.id,'reference',v_new.reference,'duplicate',false);
end;
$$;
revoke all on function public.create_public_rfq(jsonb,uuid,text,text) from public,anon,authenticated;
grant execute on function public.create_public_rfq(jsonb,uuid,text,text) to service_role;

create or replace function public.claim_rfq_notifications(p_limit int default 10,p_rfq_id uuid default null)
returns setof public.notification_outbox language sql security definer set search_path = '' as $$
 with picked as (
   select id from public.notification_outbox
   where (status in ('pending','retry') and next_attempt_at<=now() OR status='sending' and claimed_at<now()-interval '5 minutes')
   and (p_rfq_id is null or rfq_id=p_rfq_id)
   order by created_at for update skip locked limit least(greatest(p_limit,1),30)
 )
 update public.notification_outbox n set status='sending',attempts=n.attempts+1,claimed_at=now()
 from picked where n.id=picked.id returning n.*;
$$;
revoke all on function public.claim_rfq_notifications(int,uuid) from public,anon,authenticated;
grant execute on function public.claim_rfq_notifications(int,uuid) to service_role;

-- Service-role operations are deliberately not exposed to anonymous clients.

-- Pseudonymous, short-lived rate counters; only service-role can execute the function.
create table if not exists public.rfq_rate_limits (
  rate_key text primary key,
  window_start timestamptz not null default now(),
  requests int not null default 0
);
alter table public.rfq_rate_limits enable row level security;
revoke all on public.rfq_rate_limits from anon,authenticated;
create or replace function public.reserve_rfq_rate_limit(p_key text,p_limit int,p_window_seconds int default 3600)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_count int;
begin
  insert into public.rfq_rate_limits(rate_key,requests) values(p_key,1)
  on conflict(rate_key) do update set
    requests = case when public.rfq_rate_limits.window_start < now()-make_interval(secs => p_window_seconds) then 1 else public.rfq_rate_limits.requests+1 end,
    window_start = case when public.rfq_rate_limits.window_start < now()-make_interval(secs => p_window_seconds) then now() else public.rfq_rate_limits.window_start end
  returning requests into v_count;
  return v_count<=p_limit;
end;
$$;
revoke all on function public.reserve_rfq_rate_limit(text,int,int) from public,anon,authenticated;
grant execute on function public.reserve_rfq_rate_limit(text,int,int) to service_role;
-- Optional maintenance (manual/cron): delete from public.rfq_rate_limits where window_start < now()-interval '48 hours';
