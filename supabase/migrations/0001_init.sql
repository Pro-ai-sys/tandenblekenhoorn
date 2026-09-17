-- Golden Smile / tandenblekenhoorn.nl — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists btree_gist; -- exclusion constraint on time ranges

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  email_normalized text not null,
  phone_normalized text not null,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists customers_email_normalized_idx on customers (email_normalized);
create index if not exists customers_phone_normalized_idx on customers (phone_normalized);

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers (id) on delete set null,
  treatment_type text not null check (treatment_type in ('single', 'double', 'triple')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'nieuw'
    check (status in ('nieuw', 'wacht_op_betaling', 'bevestigd', 'verlopen', 'geannuleerd')),
  source text not null default 'online' check (source in ('online', 'handmatig')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_range_valid check (ends_at > starts_at),
  -- Voorkomt dubbele boekingen op overlappende tijden zolang een slot nog
  -- "bezet" is (nieuw / wacht_op_betaling / bevestigd). Er is bewust geen
  -- automatische vervaltijd (besluit hoofdstuk 4) — Paula geeft een slot
  -- handmatig weer vrij door de status te wijzigen naar 'geannuleerd'.
  exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('nieuw', 'wacht_op_betaling', 'bevestigd'))
);

create index if not exists bookings_starts_at_idx on bookings (starts_at);
create index if not exists bookings_status_idx on bookings (status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- admins — allowlist of Supabase Auth users allowed into /admin
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- After creating Paula's login in Supabase Auth (Authentication -> Users),
-- run:
--   insert into admins (user_id, email) values ('<her-auth-user-id>', 'paula@tandenblekenhoorn.nl');

-- ---------------------------------------------------------------------------
-- Row Level Security — default deny. All application access goes through
-- the Next.js server using the service-role key (see src/lib/supabase/admin.ts),
-- which bypasses RLS entirely, so no anon/authenticated policies are needed.
-- ---------------------------------------------------------------------------
alter table customers enable row level security;
alter table bookings enable row level security;
alter table admins enable row level security;
