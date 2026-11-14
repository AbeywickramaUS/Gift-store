-- ============================================================
-- Gift Store — Phase 2: mock inventory (Sri Lanka, prices in LKR)
--
-- Safe to re-run: rows are matched on slug and skipped if present.
-- `supabase db reset` runs this automatically; otherwise paste it
-- into the SQL Editor after the migrations.
--
-- media is left empty for now — real photos/videos get uploaded
-- to the `product-media` bucket in a later phase.
-- ============================================================

-- ------------------------------------------------------------
-- Products
-- ------------------------------------------------------------
insert into public.products
  (name, slug, description, price, category, sub_category, stock_quantity, featured)
values
  -- Skincare — sheet masks
  ('Aloe Vera Soothing Sheet Mask', 'aloe-vera-sheet-mask',
   'Cooling aloe sheet mask — perfect after a hot Colombo day. Single sheet, 25 ml essence.',
   350.00, 'skincare', 'sheet-masks', 120, true),
  ('Honey & Rice Brightening Sheet Mask', 'honey-rice-sheet-mask',
   'Brightening mask with rice extract and honey for a natural glow.',
   400.00, 'skincare', 'sheet-masks', 90, false),
  ('Green Tea Pore Care Sheet Mask', 'green-tea-sheet-mask',
   'Balances oily skin and refines pores. Great for humid weather.',
   380.00, 'skincare', 'sheet-masks', 75, false),

  -- Skincare — eye / lip / sleeping / foot masks
  ('Collagen Gold Eye Patches (5 pairs)', 'collagen-gold-eye-patches',
   'Hydrogel under-eye patches to depuff and refresh tired eyes.',
   650.00, 'skincare', 'eye-masks', 60, true),
  ('Strawberry Lip Sleeping Mask', 'strawberry-lip-mask',
   'Overnight lip mask for soft, smooth lips. 10 g pot.',
   750.00, 'skincare', 'lip-masks', 50, true),
  ('Cherry Blossom Hydrogel Lip Patch', 'cherry-lip-patch',
   'Single-use hydrogel lip patch for instant moisture.',
   250.00, 'skincare', 'lip-masks', 100, false),
  ('Overnight Hydrating Sleeping Mask', 'overnight-sleeping-mask',
   'Lightweight gel sleeping mask — wake up to plump, hydrated skin. 80 ml.',
   1450.00, 'skincare', 'sleeping-masks', 35, false),
  ('Peppermint Exfoliating Foot Mask', 'peppermint-foot-mask',
   'Peel-off foot mask socks for soft, smooth feet in 7 days.',
   690.00, 'skincare', 'foot-masks', 40, false),
  ('Eyebrow & Facial Razor (3 pack)', 'facial-razor-3-pack',
   'Gentle dermaplaning razors with safety guard for brows and peach fuzz.',
   550.00, 'skincare', 'facial-razors', 80, false),

  -- Accessories — necklaces
  ('Pearl Drop Pendant Necklace', 'pearl-drop-necklace',
   'Dainty faux-pearl pendant on a gold-tone chain. Gift box included.',
   1250.00, 'accessories', 'necklaces', 30, true),
  ('Initial Letter Necklace', 'initial-letter-necklace',
   'Personal initial pendant — tell us the letter in your order note.',
   1450.00, 'accessories', 'necklaces', 25, true),
  ('Butterfly Layered Necklace', 'butterfly-layered-necklace',
   'Two-layer chain with tiny butterfly charms.',
   1350.00, 'accessories', 'necklaces', 0, false),   -- sold out (tests out-of-stock UI)

  -- Accessories — earrings
  ('Mini Hoop Earrings (3 pairs)', 'mini-hoop-earrings-set',
   'Everyday huggie hoops in gold, silver and rose-gold tones.',
   950.00, 'accessories', 'earrings', 40, false),
  ('Heart Stud Earrings', 'heart-stud-earrings',
   'Cute heart studs with hypoallergenic posts.',
   650.00, 'accessories', 'earrings', 55, false),

  -- Accessories — hair clips
  ('Pastel Claw Clip Set (4 pcs)', 'pastel-claw-clips',
   'Matte claw clips in pastel shades — hold thick hair all day.',
   850.00, 'accessories', 'hair-clips', 45, true),
  ('Pearl Hair Pins (10 pcs)', 'pearl-hair-pins',
   'Elegant pearl bobby pins for parties and weddings.',
   450.00, 'accessories', 'hair-clips', 70, false),

  -- Accessories — everyday essentials
  ('Satin Scrunchies (5 pack)', 'satin-scrunchies',
   'Soft satin scrunchies that are gentle on hair.',
   600.00, 'accessories', 'everyday-essentials', 65, false),
  ('Compact Pocket Mirror', 'compact-pocket-mirror',
   'Double-sided compact mirror with 2x magnification.',
   480.00, 'accessories', 'everyday-essentials', 50, false)
on conflict (slug) do nothing;

-- Approximate packed weights (grams) — used for the delivery fee
update public.products p set weight_grams = w.grams
from (values
  ('aloe-vera-sheet-mask', 30), ('honey-rice-sheet-mask', 30), ('green-tea-sheet-mask', 30),
  ('collagen-gold-eye-patches', 80), ('strawberry-lip-mask', 30), ('cherry-lip-patch', 10),
  ('overnight-sleeping-mask', 120), ('peppermint-foot-mask', 60), ('facial-razor-3-pack', 30),
  ('pearl-drop-necklace', 40), ('initial-letter-necklace', 40), ('butterfly-layered-necklace', 40),
  ('mini-hoop-earrings-set', 30), ('heart-stud-earrings', 20),
  ('pastel-claw-clips', 120), ('pearl-hair-pins', 30),
  ('satin-scrunchies', 60), ('compact-pocket-mirror', 90)
) as w(slug, grams)
where p.slug = w.slug;

-- ------------------------------------------------------------
-- Curated packages (priced a little below the items' total)
-- product_ids are looked up by slug so the seed works on any DB.
-- ------------------------------------------------------------
insert into public.packages
  (name, slug, description, price, category, product_ids, stock_quantity, featured)
values
  ('Glow Up Skincare Set', 'glow-up-skincare-set',
   'Three sheet masks, gold eye patches and a lip sleeping mask — a full pamper night.',
   2350.00, 'skincare-sets',
   (select jsonb_agg(id order by slug) from public.products where slug in
     ('aloe-vera-sheet-mask', 'honey-rice-sheet-mask', 'green-tea-sheet-mask',
      'collagen-gold-eye-patches', 'strawberry-lip-mask')),
   20, true),

  ('Birthday Girl Box', 'birthday-girl-box',
   'Pearl pendant, heart studs, claw clips and a sheet mask, wrapped with a birthday card.',
   2850.00, 'birthday-gifts',
   (select jsonb_agg(id order by slug) from public.products where slug in
     ('pearl-drop-necklace', 'heart-stud-earrings', 'pastel-claw-clips', 'aloe-vera-sheet-mask')),
   15, true),

  ('Anniversary Sparkle Set', 'anniversary-sparkle-set',
   'Initial necklace, mini hoops and an overnight sleeping mask in a keepsake box.',
   3600.00, 'anniversary-gifts',
   (select jsonb_agg(id order by slug) from public.products where slug in
     ('initial-letter-necklace', 'mini-hoop-earrings-set', 'overnight-sleeping-mask')),
   10, false),

  ('Everyday Essentials Pouch', 'everyday-essentials-pouch',
   'Scrunchies, pearl pins, a pocket mirror and a facial razor pack — handbag must-haves.',
   1850.00, 'everyday-essentials',
   (select jsonb_agg(id order by slug) from public.products where slug in
     ('satin-scrunchies', 'pearl-hair-pins', 'compact-pocket-mirror', 'facial-razor-3-pack')),
   25, false)
on conflict (slug) do nothing;

-- Packed gift-set weights (items + box)
update public.packages p set weight_grams = w.grams
from (values
  ('glow-up-skincare-set', 400), ('birthday-girl-box', 450),
  ('anniversary-sparkle-set', 450), ('everyday-essentials-pouch', 400)
) as w(slug, grams)
where p.slug = w.slug;
