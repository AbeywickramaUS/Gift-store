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

## Upcoming Phases

| Phase | Focus |
|-------|-------|
| **Phase 2** | Supabase SQL schema (products, packages, orders) + Storage bucket policies + mock Sri Lankan inventory data |
| **Phase 3** | Storefront UI, category filtering, product media gallery (images + video) |
| **Phase 4** | "Build Your Own Box" interactive customizer with live LKR total |
| **Phase 5** | Cart, No-COD checkout, Order ID generation, Instagram/Facebook DM workflow, Admin upload helper |
