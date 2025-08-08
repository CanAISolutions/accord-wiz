-- Supabase DB rules: constraints, triggers, indexes for MVP
-- Safe to run multiple times (IF NOT EXISTS patterns where possible)

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Minimal leases table (create if not exists)
create table if not exists public.leases (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  tenant_name text not null,
  province char(2) not null check (char_length(province) = 2),
  currency char(3) not null default 'CAD' check (currency = 'CAD'),
  rent_amount numeric not null check (rent_amount > 0),
  security_deposit_amount numeric not null default 0,
  rent_deposit_amount numeric not null default 0,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Province-specific constraints
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'on_security_zero'
  ) then
    alter table public.leases add constraint on_security_zero check (
      case when province = 'ON' then security_deposit_amount = 0 else true end
    );
  end if;
end $$;

-- Optional: disallow rent_deposit for non-ON
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'non_on_rent_deposit_zero'
  ) then
    alter table public.leases add constraint non_on_rent_deposit_zero check (
      case when province <> 'ON' then rent_deposit_amount = 0 else true end
    );
  end if;
end $$;

-- Trigger to keep updated_at current
do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_set_updated_at_leases'
  ) then
    create trigger trg_set_updated_at_leases
    before update on public.leases
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- Indexes
create index if not exists idx_leases_landlord on public.leases(landlord_id);
create index if not exists idx_leases_province on public.leases(province);

-- Lease documents for signature hash storage
create table if not exists public.lease_documents (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid not null references public.leases(id) on delete cascade,
  path text not null,
  hash text not null check (length(hash) = 64),
  created_at timestamptz not null default now()
);

create index if not exists idx_lease_docs_lease on public.lease_documents(lease_id);

-- RLS examples (enable and simple ownership by landlord_id via join)
alter table public.leases enable row level security;
create policy if not exists "landlords own leases" on public.leases
  for all to authenticated
  using (landlord_id = auth.uid())
  with check (landlord_id = auth.uid());

alter table public.lease_documents enable row level security;
create policy if not exists "landlords own lease docs" on public.lease_documents
  for all to authenticated
  using (exists (select 1 from public.leases l where l.id = lease_id and l.landlord_id = auth.uid()))
  with check (exists (select 1 from public.leases l where l.id = lease_id and l.landlord_id = auth.uid()));



