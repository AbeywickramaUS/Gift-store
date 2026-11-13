# 🎁 Gift Store — Sri Lanka's Online Gift & Accessories Shop

A modern, mobile-first e-commerce web application built with **Next.js 16 (App Router)**, **Supabase**, and deployed on **Vercel**.

## 🛍️ What We Sell

- **Skincare & Beauty** — Sheet masks, eye masks, lip masks, sleeping masks, foot masks, facial razors
- **Fashion & Accessories** — Fancy necklaces, earrings, hair clips, everyday essentials for girls
- **Curated Gift Sets** — Birthday, anniversary, skincare sets & everyday essentials
- **Build Your Own Box** — Mix & match items with personalised gift notes

All prices in **LKR (Rs.)** | No Cash on Delivery | Pre-payment only

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase PostgreSQL (Free Tier) |
| Storage | Supabase Storage (images + short videos) |
| Hosting | Vercel (Serverless + Edge) |
| Language | TypeScript |

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/AbeywickramaUS/Gift-store.git
cd Gift-store

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📋 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-cron-secret
NEXT_PUBLIC_INSTAGRAM_USERNAME=your_handle
NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_page_id
```

## 📖 Development Blog

Track the full build progress at [/dev-blog](/dev-blog) or in [`DEVLOG.md`](./DEVLOG.md).

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/keep-alive/     # Vercel cron — Supabase keep-alive
│   ├── dev-blog/           # Live development blog page
│   ├── layout.tsx          # Root layout (Navbar + Footer + ThemeProvider)
│   └── page.tsx            # Home page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ThemeProvider.tsx
└── lib/
    ├── supabase.ts         # Supabase client singleton
    ├── types.ts            # TypeScript interfaces
    ├── constants.ts        # LKR formatter, nav, No-COD text
    └── devlog-data.ts      # Dev blog entries
```

## 🔄 Vercel Cron Jobs

| Route | Schedule | Purpose |
|-------|----------|---------|
| `/api/keep-alive` | Every 5 days | Prevents Supabase free-tier DB from pausing |

## ⚠️ Payment Policy

**Cash on Delivery (COD) is NOT available.** All orders require pre-payment via Bank Transfer or Online Payment before dispatch.
