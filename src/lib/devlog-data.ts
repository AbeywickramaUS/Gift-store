import type { DevLogEntry } from './types';

/**
 * Dev Blog entries — single source of truth.
 * Rendered by /dev-blog page AND kept in sync with DEVLOG.md.
 */
export const DEV_LOG_ENTRIES: DevLogEntry[] = [
  {
    step: 1,
    title: 'Phase 1 — Project Foundation: Next.js 16 + Supabase + Vercel Setup',
    date: '2026-11-13',
    filesChanged: [
      'package.json',
      'next.config.ts',
      'vercel.json',
      '.env.example',
      '.gitignore',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/globals.css',
      'src/app/page.tsx',
      'src/app/api/keep-alive/route.ts',
      'src/app/dev-blog/page.tsx',
      'src/lib/supabase.ts',
      'src/lib/types.ts',
      'src/lib/constants.ts',
      'src/lib/devlog-data.ts',
      'src/components/ThemeProvider.tsx',
      'src/components/Navbar.tsx',
      'src/components/Footer.tsx',
      'DEVLOG.md',
    ],
    description:
      'Bootstrapped the full Next.js 16 App Router project using create-next-app with TypeScript, Tailwind CSS v4, and ESLint. Installed @supabase/supabase-js for the Supabase client. Established the foundational folder structure under src/ following Next.js App Router conventions: app/ for pages/routes, components/ for reusable UI, and lib/ for utilities and types. The root layout (layout.tsx) wraps all pages with ThemeProvider, Navbar, and Footer. The home page (page.tsx) includes a hero section, category cards, how-to-order steps, and a No-COD notice banner. Created the Supabase singleton client (lib/supabase.ts) with environment variable validation and a getStorageUrl() helper for Supabase Storage public URLs. Defined all TypeScript interfaces (Product, Package, Order, MediaItem, DevLogEntry) in lib/types.ts. Set up a Vercel Cron Job route at /api/keep-alive using the Edge Runtime — it pings Supabase every 5 days (cron: "0 9 */5 * *" in vercel.json) to prevent the free-tier database from pausing. The /dev-blog page renders this exact log live from lib/devlog-data.ts. Dark mode is implemented via a client-side ThemeProvider that reads/writes localStorage and toggles the "dark" class on <html> — avoiding any SSR flash. Tailwind v4 is used in CSS-first mode (@import "tailwindcss") instead of a config file.',
    stateAndChallenges:
      'Dark mode flash prevention: ThemeProvider returns children immediately on first render (before mounting) to avoid hydration mismatch, then applies the correct class after useEffect. Supabase free-tier inactivity: Vercel Cron on a 5-day schedule pings the DB with a lightweight SELECT on the products table (no data returned, minimal egress). The keep-alive route is Edge Runtime to minimise cold-start latency and avoid serverless function timeouts. Environment validation throws at startup if Supabase keys are missing rather than failing silently at query time. The CRON_SECRET header check ensures only Vercel can trigger the keep-alive endpoint. Package naming: create-next-app rejected "Gift-store" (capital letters) so the project was scaffolded in a temp directory and moved with robocopy.',
  },
  {
    step: 2,
    title: 'Phase 2 — Database Schema, Storage Bucket & Mock Inventory',
    date: '2026-11-13',
    filesChanged: [
      'supabase/migrations/20261113000001_initial_schema.sql',
      'supabase/migrations/20261113000002_storage.sql',
      'supabase/seed.sql',
      'src/lib/types.ts',
      'src/lib/devlog-data.ts',
      'DEVLOG.md',
    ],
    description:
      'Created the products, packages and orders tables. Prices are LKR numeric(10,2); media is JSONB; stock_quantity drives a generated in_stock column so it can never be wrong; is_active hides items without deleting them. A check constraint ties each sub-category to its parent category. Orders get a database-generated reference (GIFT-1001, GIFT-1002, ...), full delivery details (address, city, district), Sri Lankan mobile validation, subtotal + delivery fee with a generated total, and a payment_status separate from the delivery status. A constraint stops an order being marked shipped or delivered before it is paid, so the No-COD rule is enforced by the database itself. Row-Level Security lets the public anon key read only active products and packages; orders have no anon access because they contain customer details. A public product-media storage bucket (20 MB, images and short MP4/WebM clips) accepts uploads only via the server-side service-role key. The seed adds 18 realistic Sri Lankan products and 4 curated gift sets.',
    stateAndChallenges:
      'Verified by running the migrations and seed twice each in PGlite (Postgres compiled to WASM) and 22 checks covering constraints, triggers, generated columns and RLS as the anon role; all passed. Not yet applied to the live Supabase project. Checkout (Phase 5) must recompute prices from the database rather than trust totals sent from the browser. Product media arrays are empty until real photos are uploaded.',
  },
  {
    step: 3,
    title: 'Live Supabase Project + Phase 3 — Storefront',
    date: '2026-11-13',
    filesChanged: [
      'supabase/migrations/20261113000001_initial_schema.sql',
      'supabase/seed.sql',
      '.env.example',
      'src/lib/queries.ts',
      'src/lib/constants.ts',
      'src/components/shop/ProductCard.tsx',
      'src/components/shop/ProductVisual.tsx',
      'src/components/shop/MediaGallery.tsx',
      'src/components/shop/OrderPanel.tsx',
      'src/app/category/[category]/[[...sub]]/page.tsx',
      'src/app/product/[slug]/page.tsx',
      'src/app/packages/page.tsx',
      'src/app/packages/[slug]/page.tsx',
      'src/app/not-found.tsx',
      'src/app/page.tsx',
      'src/components/Footer.tsx',
      'DEVLOG.md',
    ],
    description:
      'Created the free Supabase project (South Asia / Mumbai region, closest to Sri Lanka) and applied the schema and seed; table access is granted explicitly because automatic exposure of new tables is turned off. Built the storefront: category pages with sub-category filter chips (as path segments so all 12 combinations are prerendered), product pages with a media gallery for images, short clips, YouTube and Instagram videos plus an emoji placeholder until photos exist, curated gift-set pages showing what is inside and how much the customer saves, a featured-products row on the home page, and a friendly 404 page. Every catalogue read is cached with "use cache", cacheLife("minutes") and the "catalog" tag, so pages come from cache and the free-tier egress stays tiny.',
    stateAndChallenges:
      'The Phase 1 footer used new Date() which Next.js 16 Cache Components rejects during prerendering, so the site could not build; the year is now a small cached component. A seed bug priced the Birthday Girl Box above its items bought separately; fixed in the seed and the live database. The production build prerenders 46 pages, and home, filters, product, sold-out item, gift set, 404 and phone-width layout were checked in a browser. One lint error remains in ThemeProvider.tsx from Phase 1. Ordering is by Instagram/Messenger DM until cart and checkout arrive in Phase 5.',
  },
  {
    step: 4,
    title: 'Cart & WhatsApp Checkout',
    date: '2026-11-13',
    filesChanged: [
      'supabase/migrations/20261113000003_whatsapp_checkout.sql',
      'supabase/seed.sql',
      'src/lib/cart.ts',
      'src/lib/delivery.ts',
      'src/lib/order-message.ts',
      'src/lib/last-order.ts',
      'src/app/checkout/actions.ts',
      'src/app/cart/page.tsx',
      'src/app/checkout/page.tsx',
      'src/app/checkout/confirmed/page.tsx',
      'src/components/shop/AddToCart.tsx',
      'src/components/shop/CartButton.tsx',
      'src/components/shop/OrderPanel.tsx',
      'src/components/ThemeProvider.tsx',
      'src/app/globals.css',
      'DEVLOG.md',
    ],
    description:
      'No payment happens on the website. Customers add products and gift sets to a cart, fill in their details (mobile, WhatsApp, optional email, address, city, district, gift note) and confirm. A database function, create_order(), re-prices every item from the database, checks stock, works out the delivery fee from the parcel weight (Rs. 500 up to 1 kg) and saves the order with an Order ID like GIFT-1001. The confirmation page shows the Order ID and bank details and opens WhatsApp with the whole order already typed; the customer sends it, transfers the money and sends the receipt in the same chat. Stock is only deducted when the order is marked paid, and returned on refund. Spam protection: hidden honeypot field, at most 3 orders per phone per hour, quantity limits. Unpaid orders are cancelled after 48 hours.',
    stateAndChallenges:
      'wa.me links redirect and re-encode the message, which turned emoji into "�"; the site now links to api.whatsapp.com/send directly. A Phase 1 bug made Tailwind dark styles follow the device instead of the site toggle, causing white-on-white text; fixed with a custom dark variant and a theme script that runs before first paint (this also cleared the last lint error). 26 database checks pass, and a full order was placed on the live site, then the test order was deleted and the counter reset. WhatsApp number, bank details and the over-1 kg delivery rule are still placeholders.',
  },
  {
    step: 5,
    title: 'Admin Orders Page',
    date: '2026-11-13',
    filesChanged: [
      'supabase/migrations/20261113000004_admin.sql',
      'src/app/admin/page.tsx',
      'src/app/admin/layout.tsx',
      'src/components/admin/LoginForm.tsx',
      'src/components/admin/OrdersDashboard.tsx',
      'src/lib/supabase-browser.ts',
      'src/lib/constants.ts',
      'DEVLOG.md',
    ],
    description:
      'Added /admin: the shop owner signs in with email and password (Supabase Auth) and sees all orders in tabs (awaiting payment, paid to ship, shipped, delivered, cancelled) with search by order ID, name or phone. Each order shows items, totals, gift note, address and contact details, with buttons to mark paid, cancel, mark shipped, refund or mark delivered, plus private notes. A WhatsApp button opens a ready-made message to the customer for the current stage, such as a payment reminder, payment received or shipped.',
    stateAndChallenges:
      'Security lives in the database: only accounts listed in the admins table can read orders, and they can change only the payment status, order status and notes, not totals, customer details or products. The stock trigger was switched to run as the table owner so marking an order paid still deducts stock. 19 permission checks pass locally, and live checks with the public key confirm visitors are denied.',
  },
];
