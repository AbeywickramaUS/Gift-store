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
];
