-- Run this after schema.sql and 002_add_features.sql.
-- Adds Stripe Connect tracking to shops, and an orders table for completed payments.

alter table shops add column if not exists stripe_account_id text;
alter table shops add column if not exists stripe_onboarded boolean not null default false;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  stripe_session_id text unique,
  customer_email text,
  amount_total integer,
  currency text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table orders enable row level security;

-- Only the shop's owner can see their own orders.
create policy "Shop owners can view their own orders"
  on orders for select
  using (
    exists (select 1 from shops where shops.id = orders.shop_id and shops.owner_id = auth.uid())
  );

-- No insert/update policy is defined here on purpose: orders are only ever
-- written by the stripe-webhook Edge Function, which uses the service-role
-- key and therefore bypasses RLS entirely.
