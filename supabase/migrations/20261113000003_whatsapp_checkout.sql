-- ============================================================
-- Gift Store — WhatsApp checkout
--
-- Flow: customer fills the checkout form → create_order() saves
-- the order (prices + delivery recomputed HERE, never trusted from
-- the browser) → site shows the order ID and opens WhatsApp with
-- the order details → customer sends the bank-transfer receipt on
-- WhatsApp → admin marks the order paid → stock is deducted.
-- ============================================================

-- ------------------------------------------------------------
-- Weights (for the delivery fee)
-- ------------------------------------------------------------
alter table public.products
  add column weight_grams integer not null default 100 check (weight_grams > 0);
alter table public.packages
  add column weight_grams integer not null default 500 check (weight_grams > 0);

-- ------------------------------------------------------------
-- Orders: contact fields + mixed-cart orders
-- ------------------------------------------------------------
alter table public.orders
  add column customer_email     text check (customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  add column customer_whatsapp  text check (customer_whatsapp ~ '^(\+94|0)7[0-9]{8}$'),
  add column total_weight_grams integer check (total_weight_grams >= 0);

-- 'cart' = any mix of products and gift sets:
--   items = [{type, id, slug, name, quantity, unit_price, line_total, weight_grams}, ...]
alter table public.orders drop constraint orders_order_type_check;
alter table public.orders add constraint orders_order_type_check
  check (order_type in ('curated', 'custom', 'cart'));

alter table public.orders drop constraint orders_items_shape;
alter table public.orders add constraint orders_items_shape check (
  (order_type = 'curated' and jsonb_typeof(items) = 'object' and items ? 'package_id')
  or
  (order_type in ('custom', 'cart') and jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0)
);

create index orders_phone_recent_idx on public.orders (customer_phone, created_at desc);

-- ------------------------------------------------------------
-- Delivery fee
-- PLACEHOLDER RULE: Rs. 500 up to 1 kg, then + Rs. 100 for each
-- extra kg (or part of one). Keep src/lib/delivery.ts in sync.
-- ------------------------------------------------------------
create or replace function public.delivery_fee(p_weight_grams integer)
returns numeric
language sql
immutable
set search_path = ''
as $$
  select (500 + 100 * greatest(0, ceil((p_weight_grams - 1000) / 1000.0)))::numeric(10, 2);
$$;

-- ------------------------------------------------------------
-- create_order(p_order jsonb) → jsonb
--
-- Callable with the public key. Runs as the table owner
-- (SECURITY DEFINER), so customers can create an order but still
-- can't read or change any order.
--
-- p_order = {
--   name, phone, whatsapp?, email?, address, city, district, gift_note?,
--   items: [{ type: 'product' | 'package', id: uuid, quantity: int }]
-- }
-- ------------------------------------------------------------
create or replace function public.create_order(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone     text := nullif(trim(p_order->>'phone'), '');
  v_whatsapp  text := coalesce(nullif(trim(p_order->>'whatsapp'), ''), nullif(trim(p_order->>'phone'), ''));
  v_email     text := nullif(lower(trim(p_order->>'email')), '');
  v_note      text := nullif(trim(p_order->>'gift_note'), '');
  v_items     jsonb := '[]'::jsonb;
  v_subtotal  numeric(10, 2) := 0;
  v_weight    integer := 0;
  v_fee       numeric(10, 2);
  v_recent    integer;
  v_line      record;
  v_name      text;
  v_slug      text;
  v_price     numeric(10, 2);
  v_grams     integer;
  v_stock     integer;
  v_order     record;
begin
  if jsonb_typeof(p_order->'items') is distinct from 'array'
     or jsonb_array_length(p_order->'items') = 0 then
    raise exception 'Your cart is empty.' using errcode = 'P0001';
  end if;
  if jsonb_array_length(p_order->'items') > 30 then
    raise exception 'Too many different items in one order.' using errcode = 'P0001';
  end if;
  if v_phone is null then
    raise exception 'Please enter your phone number.' using errcode = 'P0001';
  end if;

  -- Spam guard: at most 3 orders per phone number per hour
  select count(*) into v_recent
  from public.orders
  where customer_phone = v_phone and created_at > now() - interval '1 hour';
  if v_recent >= 3 then
    raise exception 'Too many orders from this phone number. Please wait a while or message us on WhatsApp.'
      using errcode = 'P0001';
  end if;

  -- Housekeeping: unpaid orders expire after 48 hours
  update public.orders
     set status = 'cancelled',
         admin_notes = coalesce(admin_notes || E'\n', '') || 'Auto-cancelled: unpaid after 48 hours'
   where status = 'pending'
     and payment_status = 'awaiting_payment'
     and created_at < now() - interval '48 hours';

  -- Merge duplicate lines, then price every line from the database
  for v_line in
    select x.type, x.id, sum(x.quantity)::integer as quantity
    from jsonb_to_recordset(p_order->'items') as x(type text, id uuid, quantity integer)
    group by x.type, x.id
  loop
    if v_line.id is null or v_line.quantity is null or v_line.quantity < 1 or v_line.quantity > 20 then
      raise exception 'Invalid quantity in cart.' using errcode = 'P0001';
    end if;

    if v_line.type = 'product' then
      select p.name, p.slug, p.price, p.weight_grams, p.stock_quantity
        into v_name, v_slug, v_price, v_grams, v_stock
        from public.products p where p.id = v_line.id and p.is_active;
    elsif v_line.type = 'package' then
      select p.name, p.slug, p.price, p.weight_grams, p.stock_quantity
        into v_name, v_slug, v_price, v_grams, v_stock
        from public.packages p where p.id = v_line.id and p.is_active;
    else
      raise exception 'Invalid item in cart.' using errcode = 'P0001';
    end if;

    if not found then
      raise exception 'An item in your cart is no longer available. Please refresh your cart.' using errcode = 'P0001';
    end if;
    if v_stock < v_line.quantity then
      raise exception '%', case when v_stock = 0
        then format('Sorry, "%s" just sold out.', v_name)
        else format('Sorry, only %s of "%s" left.', v_stock, v_name) end
        using errcode = 'P0001';
    end if;

    v_items := v_items || jsonb_build_object(
      'type', v_line.type, 'id', v_line.id, 'slug', v_slug, 'name', v_name,
      'quantity', v_line.quantity, 'unit_price', v_price,
      'line_total', v_price * v_line.quantity, 'weight_grams', v_grams);
    v_subtotal := v_subtotal + v_price * v_line.quantity;
    v_weight   := v_weight + v_grams * v_line.quantity;
  end loop;

  v_fee := public.delivery_fee(v_weight);

  -- Remaining field validation is done by the table's CHECK constraints
  insert into public.orders (
    order_type, customer_name, customer_phone, customer_whatsapp, customer_email,
    customer_address, customer_city, customer_district,
    items, gift_note, subtotal_lkr, delivery_fee_lkr, total_weight_grams
  ) values (
    'cart', trim(p_order->>'name'), v_phone, v_whatsapp, v_email,
    trim(p_order->>'address'), trim(p_order->>'city'), trim(p_order->>'district'),
    v_items, v_note, v_subtotal, v_fee, v_weight
  )
  returning order_ref, subtotal_lkr, delivery_fee_lkr, total_lkr, created_at into v_order;

  return jsonb_build_object(
    'order_ref', v_order.order_ref,
    'items', v_items,
    'subtotal', v_order.subtotal_lkr,
    'delivery_fee', v_order.delivery_fee_lkr,
    'total', v_order.total_lkr,
    'weight_grams', v_weight,
    'created_at', v_order.created_at
  );
end;
$$;

revoke all on function public.create_order(jsonb) from public;
grant execute on function public.create_order(jsonb) to anon, authenticated, service_role;
grant execute on function public.delivery_fee(integer) to anon, authenticated, service_role;

-- ------------------------------------------------------------
-- Stock moves only when money does:
--   awaiting_payment → paid      : deduct stock (fails if not enough)
--   paid → refunded              : put stock back
-- ------------------------------------------------------------
create or replace function public.apply_order_stock()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_item  jsonb;
  v_sign  integer;
  v_left  integer;
begin
  if new.order_type <> 'cart' then
    return new;
  end if;

  if new.payment_status = 'paid' and old.payment_status <> 'paid' then
    v_sign := -1;
  elsif old.payment_status = 'paid' and new.payment_status = 'refunded' then
    v_sign := 1;
  else
    return new;
  end if;

  for v_item in select * from jsonb_array_elements(new.items) loop
    if v_item->>'type' = 'product' then
      update public.products
         set stock_quantity = stock_quantity + v_sign * (v_item->>'quantity')::integer
       where id = (v_item->>'id')::uuid
      returning stock_quantity into v_left;
    else
      update public.packages
         set stock_quantity = stock_quantity + v_sign * (v_item->>'quantity')::integer
       where id = (v_item->>'id')::uuid
      returning stock_quantity into v_left;
    end if;
  end loop;

  return new;
exception
  when check_violation then
    raise exception 'Not enough stock to mark order % as paid (item: %).', new.order_ref, v_item->>'name'
      using errcode = 'P0001';
end;
$$;

create trigger orders_apply_stock
  after update of payment_status on public.orders
  for each row execute function public.apply_order_stock();
