-- ============================================================
-- Gift Store — Admin catalogue editing + photo uploads
--
-- Admins (public.admins, see 20261113000004_admin.sql) can:
--   * see every product / gift set, including hidden ones
--   * add products and gift sets
--   * edit them (but not change a slug once created: links and
--     past WhatsApp messages point at it)
--   * upload / replace / delete files in the product-media bucket
-- Nobody can DELETE products or sets: hide them (is_active=false)
-- so old orders keep making sense.
-- ============================================================

-- ---------- products ----------
create policy "Admins can read all products"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can add products"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can edit products"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant insert (name, slug, description, price, category, sub_category, media, stock_quantity, weight_grams, featured, is_active)
  on public.products to authenticated;
grant update (name, description, price, category, sub_category, media, stock_quantity, weight_grams, featured, is_active)
  on public.products to authenticated;

-- ---------- packages (gift sets) ----------
create policy "Admins can read all packages"
  on public.packages for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can add packages"
  on public.packages for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can edit packages"
  on public.packages for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant insert (name, slug, description, price, category, product_ids, media, stock_quantity, weight_grams, featured, is_active)
  on public.packages to authenticated;
grant update (name, description, price, category, product_ids, media, stock_quantity, weight_grams, featured, is_active)
  on public.packages to authenticated;

-- ---------- product photos (Storage) ----------
-- The bucket is public for viewing; only admins may write.
create policy "Admins can list product media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-media' and (select public.is_admin()));

create policy "Admins can upload product media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-media' and (select public.is_admin()));

create policy "Admins can replace product media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-media' and (select public.is_admin()))
  with check (bucket_id = 'product-media' and (select public.is_admin()));

create policy "Admins can delete product media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-media' and (select public.is_admin()));
