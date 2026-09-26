-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  slug text unique not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table shops enable row level security;

-- Each owner can read/update/delete only their own shop row.
create policy "Owners manage their own shop"
  on shops for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Anyone (including logged-out visitors) can read shops by slug,
-- because the storefront page itself is public.
create policy "Anyone can view a shop's public page"
  on shops for select
  using (true);

-- Keep updated_at current on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger shops_set_updated_at
  before update on shops
  for each row execute procedure set_updated_at();
