-- ============================================================
-- Gift Store — Phase 2: core schema
-- Tables: products, packages, orders
--
-- Run with `supabase db push`, or paste into the Supabase
-- dashboard → SQL Editor and run once.
-- ============================================================

-- ------------------------------------------------------------
-- Shared: keep updated_at current on every UPDATE
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 120),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description     text not null default '',
  price           numeric(10, 2) not null check (price >= 0),          -- LKR
  category        text not null check (category in ('skincare', 'accessories')),
  sub_category    text not null,
  -- Array of MediaItem objects (see src/lib/types.ts)
  media           jsonb not null default '[]'::jsonb check (jsonb_typeof(media) = 'array'),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  -- Derived, so it can never disagree with the stock count
  in_stock        boolean generated always as (stock_quantity > 0) stored,
  featured        boolean not null default false,
  -- Hide a product from the shop without deleting it (keeps old orders intact)
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Sub-category must belong to its parent category
  constraint products_sub_category_matches check (
    (category = 'skincare' and sub_category in
      ('sheet-masks', 'eye-masks', 'lip-masks', 'sleeping-masks', 'foot-masks', 'facial-razors'))
    or
    (category = 'accessories' and sub_category in
      ('necklaces', 'earrings', 'hair-clips', 'everyday-essentials'))
  )
);

create index products_category_idx     on public.products (category, sub_category) where is_active;
create index products_featured_idx     on public.products (featured) where is_active and featured;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- packages (curated gift sets)
-- ------------------------------------------------------------
create table public.packages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 120),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description     text not null default '',
  price           numeric(10, 2) not null check (price >= 0),          -- LKR
  category        text not null check (category in
                    ('skincare-sets', 'birthday-gifts', 'anniversary-gifts', 'everyday-essentials')),
  -- Array of product UUIDs included in the set
  product_ids     jsonb not null default '[]'::jsonb check (jsonb_typeof(product_ids) = 'array'),
  media           jsonb not null default '[]'::jsonb check (jsonb_typeof(media) = 'array'),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  in_stock        boolean generated always as (stock_quantity > 0) stored,
  featured        boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index packages_category_idx on public.packages (category) where is_active;

create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
-- Human-readable order numbers: GIFT-1001, GIFT-1002, ...
create sequence public.order_ref_seq start with 1001;

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_ref         text not null unique default ('GIFT-' || nextval('public.order_ref_seq')),
  order_type        text not null check (order_type in ('curated', 'custom')),

  -- Customer & delivery details
  customer_name     text not null check (char_length(customer_name) between 1 and 100),
  -- Sri Lankan mobile: 07XXXXXXXX or +947XXXXXXXX
  customer_phone    text not null check (customer_phone ~ '^(\+94|0)7[0-9]{8}$'),
  customer_address  text not null check (char_length(customer_address) between 5 and 300),
  customer_city     text not null,
  customer_district text not null,

  -- curated: {"package_id": "...", "package_name": "..."}
  -- custom:  [{"product_id", "product_name", "quantity", "unit_price"}, ...]
  items             jsonb not null,
  box_style         text,
  gift_note         text check (char_length(gift_note) <= 300),

  -- Money (LKR). total is derived so it always equals subtotal + delivery.
  subtotal_lkr      numeric(10, 2) not null check (subtotal_lkr >= 0),
  delivery_fee_lkr  numeric(10, 2) not null default 0 check (delivery_fee_lkr >= 0),
  total_lkr         numeric(10, 2) generated always as (subtotal_lkr + delivery_fee_lkr) stored,

  -- No COD: every order starts unpaid and is only dispatched once paid
  payment_status    text not null default 'awaiting_payment'
                      check (payment_status in ('awaiting_payment', 'paid', 'refunded')),
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  admin_notes       text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- items must have the right shape for the order type
  constraint orders_items_shape check (
    (order_type = 'curated' and jsonb_typeof(items) = 'object' and items ? 'package_id')
    or
    (order_type = 'custom' and jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0)
  ),
  -- Can't ship an order that hasn't been paid for
  constraint orders_paid_before_dispatch check (
    status not in ('shipped', 'delivered') or payment_status = 'paid'
  )
);

create index orders_status_idx     on public.orders (status, created_at desc);
create index orders_created_at_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row-Level Security
--
-- The anon key is public (it ships to the browser), so RLS is
-- what actually protects the data.
--
--  * products / packages: anyone may READ active rows.
--    Nobody may write with the anon key; admin writes go through
--    the service-role key on the server (it bypasses RLS).
--  * orders: NO anon access at all — they hold customer names,
--    phone numbers and addresses. Checkout (Phase 5) will insert
--    orders from a server route using the service-role key, and
--    recompute prices from the DB instead of trusting the client.
-- ============================================================
alter table public.products enable row level security;
alter table public.packages enable row level security;
alter table public.orders   enable row level security;

create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (is_active);

create policy "Public can read active packages"
  on public.packages for select
  to anon, authenticated
  using (is_active);

-- (intentionally no policies on public.orders)

-- ------------------------------------------------------------
-- Table privileges for the Data API roles.
-- Explicit, so this works even when the project has
-- "Automatically expose new tables" turned off. RLS above still
-- filters which rows anon/authenticated can actually see.
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.products, public.packages to anon, authenticated;
revoke all on public.orders from anon, authenticated;
grant all on public.products, public.packages, public.orders to service_role;
grant usage, select on sequence public.order_ref_seq to service_role;
