-- ============================================================
-- Gift Store — Admin access to orders
--
-- Admins sign in with Supabase Auth (email + password) and use the
-- public key. Row-Level Security decides what they can do:
--   * only users listed in public.admins can read orders
--   * they can change ONLY payment_status, status and admin_notes
-- Customers (anon) still can't read or change any order.
--
-- Make someone an admin (after creating them in Authentication → Users):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'owner@example.com';
-- ============================================================

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may see their own admin row (lets the UI check access)
create policy "Users can see their own admin row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.admins to authenticated;

-- ------------------------------------------------------------
-- is_admin(): true if the signed-in user is in public.admins
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- Orders: admins can read, and update three columns only
-- ------------------------------------------------------------
create policy "Admins can read orders"
  on public.orders for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.orders to authenticated;
grant update (payment_status, status, admin_notes) on public.orders to authenticated;

-- The stock trigger must be able to change products/packages even
-- though the admin's own role can't edit the catalogue directly.
alter function public.apply_order_stock() security definer;
