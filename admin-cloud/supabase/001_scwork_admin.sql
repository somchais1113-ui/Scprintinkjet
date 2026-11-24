-- SCWORK Admin Cloud / V2.1.32: run in a NEW Supabase project SQL editor.
-- Review first, use separate staging and production projects. Never run on unknown tables.
create extension if not exists pgcrypto;

create table if not exists public.scwork_admin_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check(role in ('owner','editor','viewer')),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.scwork_admin_members enable row level security;
revoke all on public.scwork_admin_members from public, anon, authenticated;
grant select on public.scwork_admin_members to authenticated;
create policy "member reads own role after MFA" on public.scwork_admin_members
 for select to authenticated using (user_id=(select auth.uid()) and (select auth.jwt()->>'aal')='aal2');
-- Role membership is bootstrapped/managed by database administrator, not writable from a browser.

create table if not exists public.scwork_supplier_quotes (
 id uuid primary key default gen_random_uuid(),
 material_id text not null check(material_id in ('paper-sticker','kraft-sticker','pp-white','pp-clear','pvc-sqm','vinyl-banner')),
 supplier text not null check(length(trim(supplier)) between 2 and 100),
 document_no text not null check(length(trim(document_no)) between 2 and 90),
 quote_date date not null,
 valid_until date,
 unit text not null check(unit in ('a3_sheet','sqm')),
 pack_price numeric(14,2) not null check(pack_price>0),
 pack_units numeric(14,4) not null check(pack_units>0),
 tax_treatment text not null check(tax_treatment in ('no-vat','vat-included','vat-excluded')),
 freight_cost numeric(14,2) not null default 0 check(freight_cost>=0),
 landed_unit_cost numeric(14,2) generated always as
  (round(((case when tax_treatment='vat-excluded' then pack_price*1.07 else pack_price end)+freight_cost)/pack_units,2)) stored,
 source_url text,
 evidence_path text,
 evidence_sha256 text,
 notes text,
 status text not null default 'draft' check(status in ('draft','approved','rejected')),
 created_by uuid not null default auth.uid() references auth.users(id),
 reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz,
 review_reason text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint quote_dates check(valid_until is null or valid_until>=quote_date),
 constraint unit_material check ((material_id in ('pvc-sqm','vinyl-banner') and unit='sqm') or
  (material_id not in ('pvc-sqm','vinyl-banner') and unit='a3_sheet')),
 constraint valid_source check(source_url is null or source_url ~* '^https://[^ ]{3,2048}$'),
 constraint evidence_sha check(evidence_sha256 is null or evidence_sha256 ~ '^[0-9a-f]{64}$')
);
create index if not exists scwork_quotes_material_date on public.scwork_supplier_quotes(material_id,quote_date desc);
alter table public.scwork_supplier_quotes enable row level security;
revoke all on public.scwork_supplier_quotes from public, anon, authenticated;
grant select,insert,update on public.scwork_supplier_quotes to authenticated;

create policy "member reads quotes only after MFA" on public.scwork_supplier_quotes
 for select to authenticated using (
 (select auth.jwt()->>'aal')='aal2' and exists
 (select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active)
);
create policy "editor creates draft as self" on public.scwork_supplier_quotes
 for insert to authenticated with check (
 (select auth.jwt()->>'aal')='aal2' and created_by=(select auth.uid()) and status='draft'
 and reviewed_by is null and reviewed_at is null and review_reason is null
 and exists(select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active and m.role in ('owner','editor'))
);
create policy "editor edits own draft only" on public.scwork_supplier_quotes
 for update to authenticated using (
 status='draft' and created_by=(select auth.uid()) and (select auth.jwt()->>'aal')='aal2'
 and exists(select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active and m.role in ('owner','editor'))
) with check (status='draft' and created_by=(select auth.uid()) and reviewed_by is null
 and (select auth.jwt()->>'aal')='aal2');
-- Defense in depth: clients must not forge review fields or alter identity/timestamps.
create or replace function public.scwork_quote_guard() returns trigger
language plpgsql set search_path='' as $$ begin
 if tg_op='UPDATE' and current_setting('scwork.approval',true) is distinct from 'yes' then
  if old.status<>'draft' or new.status<>'draft' or new.created_by<>old.created_by
    or new.created_at<>old.created_at or new.id<>old.id or new.reviewed_by is not null
    or new.reviewed_at is not null or new.review_reason is not null then
    raise exception 'Unapproved update not allowed'; end if;
 end if;
 new.updated_at=now(); return new;
end $$;
create trigger scwork_guard_quote before update on public.scwork_supplier_quotes
 for each row execute function public.scwork_quote_guard();
revoke all on function public.scwork_quote_guard() from public, anon, authenticated;

create table if not exists public.scwork_price_events (
 id bigint generated always as identity primary key,
 quote_id uuid references public.scwork_supplier_quotes(id),
 event_type text not null,
 actor uuid,
 event_time timestamptz not null default now(),
 detail jsonb not null default '{}'::jsonb
);
alter table public.scwork_price_events enable row level security;
revoke all on public.scwork_price_events from public, anon, authenticated;
grant select on public.scwork_price_events to authenticated;
create policy "member reads audit after MFA" on public.scwork_price_events
 for select to authenticated using ((select auth.jwt()->>'aal')='aal2' and exists(
 select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active));
create or replace function public.scwork_audit_quote() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.scwork_price_events(quote_id,event_type,actor,detail)
 values (new.id,case when tg_op='INSERT' then 'created' when new.status<>old.status then 'status_changed' else 'edited' end,
         (select auth.uid()),jsonb_build_object('status',new.status,'material',new.material_id,'document',new.document_no,'landed_unit_cost',new.landed_unit_cost));
 return new;
end $$;
create trigger scwork_audit_quote_changes after insert or update on public.scwork_supplier_quotes
 for each row execute function public.scwork_audit_quote();
revoke all on function public.scwork_audit_quote() from public, anon, authenticated;

create or replace function public.scwork_approve_supplier_quote(p_id uuid,p_reason text)
returns public.scwork_supplier_quotes language plpgsql security definer set search_path='' as $$
declare r public.scwork_supplier_quotes; actor uuid;
begin
 actor:=(select auth.uid());
 if actor is null or (select auth.jwt()->>'aal') is distinct from 'aal2'
 or not exists(select 1 from public.scwork_admin_members m where m.user_id=actor and m.active and m.role='owner') then
  raise exception 'Approval requires owner with MFA'; end if;
 if length(trim(coalesce(p_reason,'')))<8 then raise exception 'Review reason required (8+ chars)'; end if;
 select * into r from public.scwork_supplier_quotes where id=p_id for update;
 if not found or r.status<>'draft' then raise exception 'Quote is not a pending draft'; end if;
 if r.valid_until is not null and r.valid_until<current_date then raise exception 'Expired source quotation'; end if;
 if nullif(trim(coalesce(r.source_url,'')),'') is null and nullif(trim(coalesce(r.evidence_path,'')),'') is null then
  raise exception 'Supplier evidence required'; end if;
 if r.evidence_path is not null and not exists (select 1 from storage.objects o where o.bucket_id='scwork-supplier-evidence' and o.name=r.evidence_path) then
  raise exception 'Supporting evidence file is missing'; end if;
 perform set_config('scwork.approval','yes',true);
 update public.scwork_supplier_quotes set status='approved',reviewed_by=actor,reviewed_at=now(),review_reason=left(p_reason,500)
 where id=p_id returning * into r;
 perform set_config('scwork.approval','',true);
 return r;
end $$;
revoke all on function public.scwork_approve_supplier_quote(uuid,text) from public,anon;
grant execute on function public.scwork_approve_supplier_quote(uuid,text) to authenticated;

-- Dedicated PUBLIC rate table holds sanitized selling rates ONLY. No supplier fields or private rules.
create table if not exists public.scwork_published_rates (
 version text primary key check(version ~ '^[a-zA-Z0-9._-]{1,45}$'),
 payload jsonb not null,
 is_current boolean not null default false,
 published_at timestamptz not null default now(),
 published_by uuid references auth.users(id)
);
create unique index if not exists scwork_one_current_rate on public.scwork_published_rates(is_current) where is_current;
alter table public.scwork_published_rates enable row level security;
revoke all on public.scwork_published_rates from public,anon,authenticated;
grant select on public.scwork_published_rates to anon,authenticated;
create policy "only current public selling rate is visible" on public.scwork_published_rates
 for select to anon,authenticated using(is_current=true);
-- Publishing RPC is intentionally not deployed in this starter: first validate exported rate
-- schema against real SCWork costs and run staging authorization tests. No browser write to this table.

-- Private evidence bucket (no public links). Strict document size and supported MIME types.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('scwork-supplier-evidence','scwork-supplier-evidence',false,12582912,
 array['application/pdf','image/jpeg','image/png','image/webp','text/csv',
 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,
 allowed_mime_types=excluded.allowed_mime_types;
create policy "admins read private evidence after MFA" on storage.objects
 for select to authenticated using(bucket_id='scwork-supplier-evidence' and (select auth.jwt()->>'aal')='aal2'
 and exists(select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active));
create policy "editors upload own evidence after MFA" on storage.objects
 for insert to authenticated with check(bucket_id='scwork-supplier-evidence' and (select auth.jwt()->>'aal')='aal2'
 and split_part(name,'/',1)=(select auth.uid())::text
 and exists(select 1 from public.scwork_admin_members m where m.user_id=(select auth.uid()) and m.active and m.role in('owner','editor')));
-- No storage update/delete browser policy: source evidence cannot silently be replaced.

-- BOOTSTRAP: first create an Auth user in Supabase dashboard, then insert the exact user UUID:
-- insert into public.scwork_admin_members(user_id,role) values ('<AUTH_USER_UUID>','owner');
-- The owner must enroll TOTP MFA at first login before any private queries are accessible.
