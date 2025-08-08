-- Storage setup for PDFs with Row Level Security
-- Bucket: agreements
-- Path: agreements/{user_id}/{agreement_id}.pdf

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Ensure bucket exists (run once)
-- select storage.create_bucket('agreements', true, 'private');

-- Policy: users can read/write their own files
create policy "Users can read own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'agreements' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can write own files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'agreements' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'agreements' and (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins (service role) can access all
create policy "Service role full access"
on storage.objects for all
to service_role
using (true)
with check (true);

-- Example application tables (DDL is indicative; adjust to your schema)
-- Ensure RLS enabled and constraints per checklist

-- Leases table
-- create table if not exists public.leases (
--   id uuid primary key default gen_random_uuid(),
--   landlord_id uuid not null references auth.users(id),
--   tenant_name text not null,
--   province char(2) not null check (char_length(province) = 2),
--   currency char(3) not null default 'CAD' check (currency = 'CAD'),
--   security_deposit_amount numeric not null default 0,
--   rent_deposit_amount numeric not null default 0,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now()
-- );

-- Updated_at trigger
-- create or replace function public.set_updated_at()
-- returns trigger language plpgsql as $$
-- begin new.updated_at = now(); return new; end;
-- $$;
-- create trigger set_updated_at before update on public.leases
-- for each row execute function public.set_updated_at();

-- Ontario-specific constraint: security deposit must be 0 when province = 'ON'
-- alter table public.leases add constraint on_security_zero check (
--   case when province = 'ON' then security_deposit_amount = 0 else true end
-- );

-- Optional inverse constraint: when province <> 'ON', rent_deposit_amount = 0 (if enforcing split)
-- alter table public.leases add constraint non_on_rent_deposit_zero check (
--   case when province <> 'ON' then rent_deposit_amount = 0 else true end
-- );

-- Lease documents hash table
-- create table if not exists public.lease_documents (
--   id uuid primary key default gen_random_uuid(),
--   lease_id uuid not null references public.leases(id) on delete cascade,
--   path text not null,
--   hash text not null check (length(hash) = 64), -- sha256 hex
--   created_at timestamptz not null default now()
-- );

-- Indexes
-- create index if not exists idx_leases_landlord on public.leases(landlord_id);
-- create index if not exists idx_leases_province on public.leases(province);
-- create index if not exists idx_lease_docs_lease on public.lease_documents(lease_id);

-- RLS
-- alter table public.leases enable row level security;
-- create policy "landlords own leases" on public.leases for all to authenticated
-- using (landlord_id = auth.uid()) with check (landlord_id = auth.uid());
-- alter table public.lease_documents enable row level security;
-- create policy "landlords own lease docs" on public.lease_documents for all to authenticated
-- using (exists (select 1 from public.leases l where l.id = lease_id and l.landlord_id = auth.uid()))
-- with check (exists (select 1 from public.leases l where l.id = lease_id and l.landlord_id = auth.uid()));

