# 🎁 Gift Store — Development Blog

> **Sri Lanka's online gift & accessories store** built on Next.js 16 (App Router) + Supabase (Free Tier) + Vercel.
> This file is the canonical development log. The same entries are rendered live at [/dev-blog](/dev-blog).

---

## Step 1 — Phase 1: Project Foundation

**Date:** 2026-11-13

### Files Created / Modified

| File | Action |
|------|--------|
| `package.json` | Created — Next.js 16, React 19, Tailwind v4, Supabase |
| `next.config.ts` | Created — Turbopack + cacheComponents config |
| `vercel.json` | Created — Cron job for Supabase keep-alive |
| `.env.example` | Created — All required environment variables documented |
| `.gitignore` | Created — Node, Next.js, .env* excluded |
| `tsconfig.json` | Created — Strict TS, `@/*` path alias for `src/` |
| `src/app/layout.tsx` | Created — Root layout with ThemeProvider + Navbar + Footer |
| `src/app/globals.css` | Created — Tailwind v4 CSS-first setup + dark mode vars |
| `src/app/page.tsx` | Created — Hero, category cards, how-to-order, No-COD banner |
| `src/app/api/keep-alive/route.ts` | Created — Edge route for Supabase keep-alive cron |
| `src/app/dev-blog/page.tsx` | Created — Live development blog page |
| `src/lib/supabase.ts` | Created — Supabase singleton client + storage URL helper |
| `src/lib/types.ts` | Created — TypeScript interfaces: Product, Package, Order, MediaItem |
| `src/lib/constants.ts` | Created — LKR formatter, site constants, nav items, No-COD text |
| `src/lib/devlog-data.ts` | Created — Dev log entries (single source of truth) |
| `src/components/ThemeProvider.tsx` | Created — Client-side dark mode context & toggle |
| `src/components/Navbar.tsx` | Created — Sticky navbar with dark mode toggle + mobile menu |
| `src/components/Footer.tsx` | Created — Footer with No-COD notice + social DM links |
| `DEVLOG.md` | Created — This file |

### What Was Built

Bootstrapped the complete **Next.js 16 App Router** project with:

- **TypeScript** (strict mode), **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`), **ESLint**
- **`@supabase/supabase-js`** installed for the Supabase client
- **Folder structure** under `src/`: `app/` (pages), `components/` (UI), `lib/` (utilities)

**Key components built:**

1. **`lib/supabase.ts`** — Singleton Supabase client with startup validation. Throws at boot if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing, so misconfiguration fails loudly.

2. **`lib/types.ts`** — Full TypeScript type system: `Product`, `Package`, `Order`, `CustomBoxItem`, `MediaItem`. `MediaItem` supports both Supabase-hosted and external media (YouTube, Cloudinary, Instagram) — critical for the hybrid video bandwidth strategy.

3. **`lib/constants.ts`** — `formatLKR()` formatter using `en-LK` locale, navigation items, No-COD policy text, social media links from env vars.

4. **`ThemeProvider.tsx`** — React context-based dark mode with `localStorage` persistence. Applies/removes the `dark` class on `<html>` via `useEffect` to avoid SSR hydration mismatch.

5. **`Navbar.tsx`** — Sticky, blurred navbar with dark mode toggle button (sun/moon SVG icons) and a fully functional mobile hamburger menu.

6. **`Footer.tsx`** — Displays the No-COD policy prominently, quick links, how-to-order steps, and direct Instagram/Facebook Messenger DM buttons.

7. **`src/app/api/keep-alive/route.ts`** — **Edge Runtime** API route. Triggered by Vercel Cron every 5 days (`0 9 */5 * *` in `vercel.json`). Performs a `SELECT id FROM products LIMIT 1` ping to keep the Supabase free-tier DB active. Protected by `Authorization: Bearer <CRON_SECRET>` header.

8. **`src/app/dev-blog/page.tsx`** — Renders the full dev log timeline from `lib/devlog-data.ts`, viewable live on the deployed Vercel site.

9. **`src/app/page.tsx`** — Hero section with gradient + decorative blur, category cards (Skincare, Accessories, Gift Sets, Custom Box), No-COD banner, 4-step how-to-order section.

### Architectural Decisions

| Decision | Reasoning |
|----------|-----------|
| **Next.js App Router** | Server Components by default → reduced client JS bundle; better SEO for product pages |
| **Tailwind v4 CSS-first** | No config file needed; `@import "tailwindcss"` in `globals.css`; faster build |
| **Edge Runtime for keep-alive** | Zero cold-start for a cron endpoint that runs rarely; no Node.js runtime cost |
| **JSONB columns (Phase 2)** | Flexible schema for `media[]`, custom box `items[]`, gift notes — avoids JOIN complexity |
| **Hybrid media URLs** | `MediaItem.source` distinguishes Supabase vs external; short clips in Supabase, long videos on YouTube/Cloudinary — protects 5 GB egress limit |
| **Dark mode via class** | CSS `dark:` variants controlled by toggling `.dark` on `<html>` — no flash, no FOUC |

### State & Challenges

- **Dark mode flash (FOUC):** `ThemeProvider` renders children immediately on first render (before `mounted = true`) so the server HTML is never wrong. After hydration, `useEffect` reads `localStorage` and sets the correct class. `suppressHydrationWarning` on `<html>` suppresses the attr mismatch.
- **Supabase free-tier inactivity:** Free databases pause after 7 days with no activity. The 5-day cron ensures it stays awake. The `SELECT … LIMIT 1` is the cheapest possible query — no row data returned, minimal egress.
- **Package naming conflict:** `create-next-app` rejected "Gift-store" (capital letters violate npm naming). Scaffolded in `temp-gift-store/`, moved to root with `robocopy /MOVE`, then renamed in `package.json`.
- **Supabase env validation:** Throwing at module load time (rather than at query time) catches misconfiguration immediately on `npm run dev` or Vercel build.

---

## Step 2 — Phase 2: Database Schema, Storage & Mock Inventory

**Date:** 2026-11-13

### Files Created / Modified

| File | Action |
|------|--------|
| `supabase/migrations/20261113000001_initial_schema.sql` | Created — `products`, `packages`, `orders` tables, constraints, triggers, RLS |
| `supabase/migrations/20261113000002_storage.sql` | Created — public `product-media` bucket (20 MB, images + short video) |
| `supabase/seed.sql` | Created — 18 products + 4 curated packages, priced in LKR |
| `src/lib/types.ts` | Modified — types now match the schema (stock, delivery, payment status) |
| `src/lib/devlog-data.ts` / `DEVLOG.md` | Modified — this entry |

### What Was Built

- **`products` / `packages`** — slug-addressed catalogue rows with LKR `numeric(10,2)` prices, JSONB `media`, a `stock_quantity` count and a **generated** `in_stock` column (it can never disagree with the stock). `is_active` hides an item without deleting it, so old orders stay valid. A check constraint makes sure each sub-category belongs to its parent category.
- **`orders`** — `order_ref` is generated by the database from a sequence (`GIFT-1001`, `GIFT-1002`, …), so two customers can never get the same ID. Full delivery details (address, city, district), Sri Lankan mobile-number validation, `subtotal_lkr` + `delivery_fee_lkr` with a generated `total_lkr`, and a separate `payment_status` (`awaiting_payment` → `paid`). A constraint blocks marking an order `shipped`/`delivered` until it is paid, so the No-COD rule is enforced by the database.
- **Row-Level Security** — the public (anon) key can only *read active* products and packages. Orders have no anon access at all, because they hold names, phone numbers and addresses. Admin writes and checkout will use the service-role key on the server.
- **Storage** — public `product-media` bucket limited to 20 MB and to JPEG/PNG/WebP/AVIF/MP4/WebM. There are no upload policies, so only the server can add files.
- **Seed data** — 18 realistic Sri Lankan products (sheet masks Rs. 350–400, necklaces Rs. 1,250–1,450, …), one deliberately sold out to test the out-of-stock UI, plus 4 gift sets that look up their products by slug.

### Architectural Decisions

| Decision | Reasoning |
|----------|-----------|
| **Generated columns for `in_stock` and `total_lkr`** | Derived values can't drift from their source |
| **DB-generated order numbers** | No race between customers; no client-side ID guessing |
| **No anon policies on `orders`** | Customer PII stays private even though the anon key is public |
| **Constraints over app-only validation** | Bad data is rejected no matter which client writes it |
| **Idempotent seed (`on conflict do nothing`)** | Safe to re-run |

### State & Challenges

- Verified locally by running both migrations and the seed (twice each) in PGlite (Postgres in WASM), plus 22 checks covering constraints, triggers, generated columns and RLS as the `anon` role. All passed. Not yet applied to the real Supabase project.
- Checkout (Phase 5) must recompute prices from the database rather than trusting totals sent by the browser.
- Product `media` is empty until real photos are uploaded.

---

## Step 3 — Live Supabase Project + Phase 3: Storefront

**Date:** 2026-11-13

### Files Created / Modified

| File | Action |
|------|--------|
| `supabase/migrations/20261113000001_initial_schema.sql` | Modified — explicit table grants (project has "auto-expose new tables" off) |
| `supabase/seed.sql` | Modified — Birthday Girl Box re-priced below its items' total |
| `.env.example` | Modified — added the missing `CRON_SECRET` |
| `src/lib/queries.ts` | Created — cached catalogue reads (`'use cache'` + `cacheLife('minutes')` + `cacheTag('catalog')`) |
| `src/lib/constants.ts` | Modified — `SHOP_CATEGORIES`, placeholder emoji per sub-category |
| `src/components/shop/*` | Created — `ProductCard`, `ProductVisual`, `MediaGallery`, `OrderPanel` |
| `src/app/category/[category]/[[...sub]]/page.tsx` | Created — category listing with sub-category filter chips |
| `src/app/product/[slug]/page.tsx` | Created — product detail, gallery, related items |
| `src/app/packages/page.tsx`, `src/app/packages/[slug]/page.tsx` | Created — gift sets list + detail with "what's inside" and savings |
| `src/app/not-found.tsx` | Created — friendly 404 |
| `src/app/page.tsx` | Modified — "Popular right now" featured products |
| `src/components/Footer.tsx` | Modified — fixed a build-breaking `new Date()` |

### What Was Built

- **Live database** — free Supabase project `gift-store` in South Asia (Mumbai), the closest region to Sri Lanka. Migrations and seed applied; verified through the public API that products and gift sets are readable and orders and product edits are blocked.
- **Category pages** — `/category/skincare`, `/category/skincare/sheet-masks`, and so on. Filters are **path segments, not `?query`**, so all 12 combinations are prerendered at build time.
- **Product pages** — gallery supporting Supabase/Cloudinary images, short MP4/WebM clips, YouTube embeds (privacy-enhanced domain) and Instagram links, with an emoji placeholder until photos exist. Shows stock status, DM-to-order buttons, No-COD notice and related items.
- **Gift sets** — list plus a detail page that lists the included products and shows how much the customer saves.
- **Home** — featured products row.

### Architectural Decisions

| Decision | Reasoning |
|----------|-----------|
| **`'use cache'` on every catalogue read, `cacheLife('minutes')`** | Pages are served from cache, so the free-tier egress is barely touched; stock changes show within minutes |
| **`cacheTag('catalog')`** | The admin panel can call `revalidateTag('catalog')` to publish changes instantly |
| **`params` awaited inside `<Suspense>` + `generateStaticParams`** | Cache Components pattern: known pages are fully static; new products get an instant shell, then are cached |
| **Path-segment filters** | `searchParams` would make the page dynamic; segments keep it static |
| **Publishable key as anon key** | Supabase's new key format; safe in the browser because RLS + grants protect data |

### State & Challenges

- **Footer build failure (Phase 1 bug):** Next 16 Cache Components refuses `new Date()` during prerender. The year is now a tiny cached component.
- **Seed pricing bug:** the Birthday Girl Box cost more than its items bought separately; fixed in the seed and in the live DB.
- `npm run build` prerenders 46 pages. Checked in the browser: home, filters, product, sold-out item, gift set, 404, and the phone-width layout (no horizontal scroll).
- Remaining lint error is in `ThemeProvider.tsx` (Phase 1, `setState` inside an effect).
- Ordering is by DM for now; cart and checkout arrive in Phase 5.

---

## Step 4 — Cart & WhatsApp Checkout

**Date:** 2026-11-13

The shop takes **no payment on the website**. Orders work like this: cart → checkout form → **Order ID** → WhatsApp opens with the whole order typed → the customer bank-transfers and sends the receipt in that WhatsApp chat.

### Files Created / Modified

| File | Action |
|------|--------|
| `supabase/migrations/20261113000003_whatsapp_checkout.sql` | Created — weights, `create_order()`, `delivery_fee()`, stock-on-payment trigger, email/WhatsApp columns |
| `supabase/seed.sql` | Modified — packed weights for every product and gift set |
| `src/lib/cart.ts` | Created — localStorage cart (`useSyncExternalStore`) |
| `src/lib/delivery.ts` | Created — delivery fee preview (mirrors the DB function) |
| `src/lib/order-message.ts` | Created — WhatsApp message builder, bank details (env) |
| `src/lib/last-order.ts` | Created — keeps the confirmation after refresh / returning from WhatsApp |
| `src/app/checkout/actions.ts` | Created — `placeOrder` server action (validation, honeypot) |
| `src/app/cart/`, `src/app/checkout/`, `src/app/checkout/confirmed/` | Created — cart, checkout form, confirmation pages |
| `src/components/shop/AddToCart.tsx`, `CartButton.tsx`, `OrderPanel.tsx` | Created / rewritten |
| `src/lib/constants.ts` | Modified — WhatsApp link helper, 25 districts, phone rule |
| `src/components/Footer.tsx`, `src/app/page.tsx` | Modified — WhatsApp instead of Instagram/Messenger DMs |
| `src/components/ThemeProvider.tsx`, `src/app/globals.css`, `src/app/layout.tsx` | Fixed — dark mode followed the device, not the toggle |

### What Was Built

- **Cart** — add products and gift sets with a quantity picker capped at stock; a cart icon with a count; a cart page with a delivery-fee preview.
- **Checkout** — name, mobile, WhatsApp (tick "same as mobile"), optional email, address, city, district (all 25), gift note. Friendly field errors.
- **`create_order()` (database)** — the only way to create an order with the public key. It re-prices every line from the database, merges duplicate lines, checks stock, works out the weight and delivery fee, saves the order and returns the Order ID. The browser's prices are never trusted.
- **Confirmation page** — Order ID with a copy button, an "Open WhatsApp & send order" button (opens automatically after 5 seconds, once), bank details with a copy button, receipt instructions and the order summary.
- **WhatsApp message** — items, subtotal, delivery, total, address, contact details, gift note and payment reference.
- **Stock** — reduced only when the admin sets `payment_status = 'paid'`, and returned on `refunded`. Placing an order does not hold stock, so unpaid orders can't block items.
- **Spam guards** — hidden honeypot field, at most 3 orders per phone per hour, quantity ≤ 20 per item, ≤ 30 lines.
- **Unpaid orders** — auto-cancelled after 48 hours (checked whenever a new order comes in).

### Placeholders to replace

| Setting | Where | Placeholder |
|---------|-------|-------------|
| WhatsApp business number | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `94770000000` |
| Bank, branch, account name / number | `BANK_*` env vars | `YOUR BANK NAME`… |
| Delivery fee above 1 kg | `delivery_fee()` SQL **and** `src/lib/delivery.ts` | +Rs. 100 per extra kg |
| Product weights | `weight_grams` column | estimates |

### State & Challenges

- **Emoji broke in WhatsApp:** `wa.me` links redirect and re-encode the text, turning 🎁 into "�". The site now links to `api.whatsapp.com/send` directly; verified the emoji survive.
- **White-on-white text:** Tailwind v4's `dark:` follows the *device* setting by default, so with the site toggle on light and the device on dark, text vanished. Added `@custom-variant dark` and an inline script that sets the theme before first paint. This also cleared the last lint error.
- **Tested:** 26 database checks in PGlite (pricing, fees, merging, sold-out, rate limit, stock on paid/refund, 48 h expiry, anon can't read orders) and a full order on the live site. The test order was then deleted and the counter reset, so the first real order is `GIFT-1001`.

---

## Step 5 — Admin Orders Page

**Date:** 2026-11-13

### Files Created / Modified

| File | Action |
|------|--------|
| `supabase/migrations/20261113000004_admin.sql` | Created — `admins` table, `is_admin()`, admin read/update policies on orders |
| `src/app/admin/page.tsx`, `src/app/admin/layout.tsx` | Created — `/admin` (sign-in → dashboard), hidden from search engines |
| `src/components/admin/LoginForm.tsx`, `OrdersDashboard.tsx` | Created |
| `src/lib/supabase-browser.ts` | Created — browser client that keeps the admin session |
| `src/lib/constants.ts` | Modified — `whatsappLinkTo()` for messaging customers |

### What Was Built

- **Sign-in** with Supabase Auth (email + password). Only accounts listed in `public.admins` get in; other signed-in accounts see "No admin access".
- **Dashboard** — tabs for Awaiting payment, Paid to ship, Shipped, Delivered, Cancelled and All, each with a count; search by order ID, name or phone; summary tiles; refreshes every minute.
- **Order detail** — items (gift sets labelled), totals and weight, gift note highlighted for the card, address, tap-to-call, email.
- **Actions** — Mark paid (with a confirm step, deducts stock), Cancel, Mark shipped, Refund & cancel (returns stock), Mark delivered, Reopen; private notes.
- **Message the customer** — a WhatsApp button with a ready-made message for the order's stage (payment reminder, payment received, shipped, feedback).
- An order you just changed stays open in the current tab, so you can message the customer straight away.

### Security

- Permissions are enforced by the **database**, not the page: admins can read orders and change only `payment_status`, `status` and `admin_notes`. They can't edit totals or customer details, delete orders or edit products. Not-signed-in visitors and non-admin accounts can't read anything.
- The stock trigger now runs as the table owner, so stock updates still work when an admin marks an order paid.
- Verified with 19 permission checks in PGlite, plus live probes with the public key (orders, admins and updates all denied).

---

## Step 6 — Redesign: "Sachet Shelf"

**Date:** 2026-11-13

The first UI looked generic (pastel pink gradients, emoji, identical rounded cards). Using the **Impeccable** design skill (installed into `.claude/skills/impeccable`), the product facts were recorded in `PRODUCT.md`, three directions were derived from the customers' own world, and the owner picked **Sachet Shelf**: the shop as a Seoul beauty-store wall.

### What changed

- **Products are packets.** Each item is drawn as a colour-blocked sachet with a crimped top seal, the name in packaging print and "NET 30 g" along the bottom. With no product photos yet, the packet is the product image; real photos will show through a window on it. Gift sets are boxes with a ribbon band.
- **Shelves.** Packets stand on ink shelf bars, with price tags and a one-tap **Add** underneath. Phones get sideways-scrolling shelves.
- **Colour means category.** Each sub-category owns a packet colour, reused on filter chips, bag lines and admin order statuses.
- **Type.** Dela Gothic One (heavy packaging display, via `next/font`) and Pretendard (the Korean UI font K-beauty uses), self-hosted as seven Latin subsets (~208 KB total, loaded only when needed).
- **Every page rebuilt:** home (real products in the first viewport), categories, product, gift sets ("What's in the box" as a row of packets, plus the savings), bag, checkout, order confirmation, 404, dev blog and admin.
- **Removed:** emoji icons (now lucide plus authored WhatsApp/Instagram/Facebook marks), gradients, glass blur, kicker labels, and links to the unbuilt "Build Your Box" page.
- **Accessibility:** WhatsApp buttons use a darker green (white on the brand #25D366 is about 2:1), focus rings are themed, there's a reduced-motion fallback, tabular figures for prices, and labels on every field.

### Review

An independent reviewer (a fresh agent that hadn't seen the build) checked the screenshots against the direction contract and found 8 issues: a banned small caps label, missing shelf tabs, packets reading as cards (no tear notch, rounded bottom), no price sticker, struck-through sold-out prices (a false "sale" signal), a weak dark-mode shelf, an icon "trust row", and a gift ribbon that read like a window frame. All were fixed. The verdict pass scored 7 resolved and 1 partial (the dark shelf). That was then strengthened and checked visually, not re-reviewed.

### Files

`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/storefront.md`, `src/app/globals.css`, `src/app/pretendard.css`, `public/fonts/pretendard/*`, `src/lib/sachet.ts`, `src/components/shop/{Sachet,Shelf,QuickAdd,MiniPacket}.tsx`, `src/components/BrandIcons.tsx`, plus every page and the Navbar, Footer and admin components.

---

## Step 7 — Second redesign: "Sticker Shop"

**Date:** 2026-11-13

The owner liked Sachet Shelf but felt it was too minimal: with no product photos, plain coloured packets gave no urge to buy. Three new directions were offered (Sticker Shop, Gift-Wrap Counter, Colombo Handloom) plus a standard shop, and the owner chose **Sticker Shop**.

### What changed

- **Every product has its own drawing** (`src/components/art/ProductArt.tsx`): 18 hand-authored SVG illustrations (aloe/honey/green-tea sheet masks, gold eye patches, strawberry lip jar, cherry lips, moon sleeping tub, mint foot sock, razors, three necklaces, hoops, heart studs, claw clip, pearl pins, scrunchie, compact mirror) and a ribboned gift box per set colour. New products fall back to their category's drawing, and a real photo replaces the drawing as a rounded die-cut sticker.
- **Sticker sheets on grid paper:** product groups are white sheets taped down with pastel washi tape; products are die-cut stickers (white border, slight tilt) with round yellow price stickers and pink badge stickers that use real data only ("Only 3 left", "Popular").
- **A fuller first screen:** a collage of six product stickers next to the headline.
- **Fonts:** Bagel Fat One (bubbly, Korean-made) for headings and prices, Gaegu on tape labels, Pretendard for UI, all served from the site.
- Product and gift-set pages show one big sticker on a taped sheet; "What's in the box" is a sheet of the contents' stickers; the bag and checkout show mini stickers.
- `DESIGN.md`, `.impeccable/design.json` and the surface brief rewritten for the new world.

### State

- Production build passes, lint is clean, checked at 1440px, 375px and in dark mode.
- An independent design review was not re-run for this theme.

---

## Step 8 — Full admin: products, gift sets and photo uploads

**Date:** 2026-11-14

### What was built

- **Admin menu** (`AdminGate`): one sign-in gate and menu for **Orders · Products · Gift sets** at `/admin`, `/admin/products` and `/admin/sets`.
- **Products and gift sets** (`CatalogAdmin`):
  - **List:** search and filters (category, hidden, low stock), with stock warnings and a "no photo yet" note.
  - **Editor:** name, an automatic web address (fixed once saved), category and type (or occasion for sets), description, price, stock, packed weight, "Show on the shop" and "Popular".
  - **Gift sets:** pick the products inside; the live saving is shown, with a warning if the set costs more than its items.
- **Photo uploads** (`PhotoManager`):
  - Add photos from phone or computer. They're resized in the browser to a ≤1600px WebP (~150–400 KB), so the shop stays fast on mobile data and inside the free bandwidth.
  - Short MP4/WebM clips up to 20 MB are accepted.
  - Reorder photos, make one the cover, or remove them. Removed files are deleted from storage only when you save.
  - The first photo becomes the product's sticker on the shop, replacing the drawing.
- **Instant updates:** saving calls the `refreshCatalog` server action. It checks the caller is an admin, then uses `updateTag('catalog')`, so the shop shows the change straight away. Marking an order paid or refunded also refreshes the shop's stock.

### Security (database-enforced)

- Migration `20261114000005_admin_catalog.sql`: admins can see hidden items, add and edit products and sets, and upload or delete files in `product-media`.
- Nobody can delete products or sets (hide them instead), and web addresses can't be changed after creation.
- Visitors and non-admin accounts can't write anything, and admins can't write to other storage buckets.
- 18 permission checks pass locally. The migration is applied to the live project and verified (4 storage, 3 product and 3 gift-set policies).

### Not yet tested end-to-end

The signed-in screens need an admin account, which only the owner can create (it needs a password).

---

## Step 9 — GIFMIRA: the premium brand redesign

**Date:** 2026-11-14

The owner supplied the **GIFMIRA brand kit** (`GIFMIRA_Brand_Kit_Download/`) and asked for an elegant premium look across the whole site. The kit pins the palette (burgundy, rose, blush, cream, champagne, dark ink), the type (Playfair Display + Poppins), the bow-and-heart logo, the collections (Glow, Charms, Moments, Minis), the menu and the tagline *Little Gifts, Big Smiles.* The redesign follows it exactly, using the Impeccable skill's pinned-brand path.

### What changed

- **Brand foundation:** `SITE_NAME` is now GIFMIRA, with brand fonts via `next/font`, new colour tokens (dark mode included), the favicon (`app/icon.svg`) and the share image (`app/opengraph-image.png`) from the kit. Titles and meta descriptions come from the kit's SEO guide.
- **Signature pieces** (`components/brand/`):
  - the bow mark, using the kit's own vector paths
  - the logo lockup, set in real Playfair
  - a champagne ribbon divider and sparkles
  - a hero gift box with a satin ribbon, the GIFMIRA bow and foil wordmark
  - a shared page header
- **Products in arched boutique windows** (`components/shop/Boutique.tsx`): a blush wash, a champagne inner arch, and a cream price tag on a string that swings on hover. Badges are honest ("Only 3 left", "Our pick", "Back soon").
- **Illustrations re-toned** with CSS (`.art-luxe` in `globals.css`): every drawing now uses burgundy, rose, blush, champagne and cream. Real photos replace them automatically.
- **New pages:** **Our Story** (Gift + Admire), **Order Help** (ordering, delivery, payment, gift wrapping, FAQ; no invented policies) and **Minis** (in-stock treats up to Rs. 500).
- **Home rebuilt:**
  - the hero
  - the four collections
  - our favourites
  - the Moments gift-set band
  - Minis
  - how ordering works
  - the thank-you card story teaser
  - a WhatsApp close
- **Header and footer:** a burgundy service line in the header, and a burgundy footer with the reversed logo.
- **Checkout:** a live gift-note card preview. The confirmation page shows the Order ID on a GIFMIRA thank-you card. Gift-set pages show the wrapped-and-tagged promise.
- **SEO:** Product structured data on product pages, plus `sitemap.xml` and `robots.txt` (admin, bag and checkout excluded).
- **Admin:** restyled to the same tokens.

### State

- Production build passes (58 pages), lint is clean, and the pages were checked at 1440px, 375px and in dark mode.
- Fixed during review:
  - a mobile hero that buried the headline
  - an empty thumbnail caused by percentage padding
  - an over-dark honey mask
  - overclaiming copy ("Loved by our customers" became "Our pick")
  - identical gift-box colours
  - a hero that faded in from invisible

### Finish review fixes

A fresh design reviewer flagged eight issues. All were fixed:

- **Mobile hero:** the first screen now shows a compact gift box above the headline.
- **Hero box:** a richer box (rose lid, satin ribbon with tails, contact shadow, gift tag and a third product window).
- **WhatsApp buttons:** they are now burgundy primary pills with the WhatsApp glyph. Green stays only in admin.
- **Copy:** removed the blanket "every set costs less" claim.
- **Bag:** a little bow floats out of it on every add (`onCartAdd` in `lib/cart.ts`), and the count badge is now burgundy.
- **Layout variety:** collections are round medallions, and the Moments band is an asymmetric grid.
- **Satin ribbon:** now runs through the site (the collections band, the Moments band, the ordering timeline, and the bag and checkout summaries).
- **Logo and menu:** the logo wordmark is semibold, and Home is in the menu.

---

## Upcoming Phases

| Phase | Focus |
|-------|-------|
| **Phase 4** | "Build Your Own Box" interactive customizer with live LKR total |
| **Next** | Real details: WhatsApp number, bank details, product photos, social handles |
