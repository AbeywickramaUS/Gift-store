import Link from 'next/link';
import { SITE_NAME, CURRENCY_SYMBOL } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <span className="mb-4 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-medium text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
              🇱🇰 Sri Lanka's Favourite Gift Shop
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
              Gifts that speak{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                from the heart
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              Discover curated skincare sets, fashion accessories, and personalised gift boxes —
              all priced in {CURRENCY_SYMBOL} and delivered across Sri Lanka.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/packages"
                className="rounded-full bg-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-105 hover:bg-pink-500 dark:bg-pink-500 dark:hover:bg-pink-400"
              >
                🎁 Shop Gift Sets
              </Link>
              <Link
                href="/custom-box"
                className="rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:scale-105 hover:border-pink-300 hover:text-pink-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:border-pink-700 dark:hover:text-pink-400"
              >
                ✨ Build Your Own Box
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 opacity-20 dark:opacity-10"
          aria-hidden
        >
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-pink-400 to-purple-400 blur-3xl" />
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section className="bg-white py-16 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-neutral-900 dark:text-white">
            Browse Categories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-pink-900 dark:hover:shadow-pink-950/20"
              >
                <div className="mb-3 text-4xl">{card.emoji}</div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {card.description}
                </p>
                <span className="mt-3 inline-flex items-center text-xs font-medium text-pink-600 dark:text-pink-400">
                  Shop now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── No-COD Notice Banner ── */}
      <section className="bg-amber-50 py-6 dark:bg-amber-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-center text-sm font-medium text-amber-800 dark:text-amber-300">
            <span className="text-lg">⚠️</span>
            <p>
              <strong>No Cash on Delivery.</strong> All orders require pre-payment via Bank
              Transfer or Online Payment. DM us on Instagram or Facebook to complete your order.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-16 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-neutral-900 dark:text-white">
            How to Order
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl dark:bg-pink-950/50">
                  {step.emoji}
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dev Blog CTA ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-10 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Curious how this site was built?{' '}
            <Link href="/dev-blog" className="font-medium text-pink-600 hover:underline dark:text-pink-400">
              Read the Development Blog →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

const CATEGORY_CARDS = [
  {
    emoji: '🧖‍♀️',
    title: 'Skincare & Beauty',
    description: 'Sheet masks, eye masks, lip masks, sleeping masks & more.',
    href: '/category/skincare',
  },
  {
    emoji: '💍',
    title: 'Fashion & Accessories',
    description: 'Necklaces, earrings, hair clips & everyday essentials.',
    href: '/category/accessories',
  },
  {
    emoji: '🎀',
    title: 'Curated Gift Sets',
    description: 'Birthday, anniversary, skincare & everyday gift packages.',
    href: '/packages',
  },
  {
    emoji: '📦',
    title: 'Build Your Own Box',
    description: 'Mix & match items, pick a box style, add a gift note.',
    href: '/custom-box',
  },
];

const HOW_IT_WORKS = [
  { emoji: '🛍️', title: 'Pick Your Gifts', desc: 'Browse categories or build a custom gift box.' },
  { emoji: '📋', title: 'Copy Order Summary', desc: 'Get a formatted summary with your unique Order ID.' },
  { emoji: '💬', title: 'DM Us to Order', desc: 'Send the summary to us on Instagram or Facebook.' },
  { emoji: '💳', title: 'Pay & Receive', desc: 'Pay via bank transfer. We dispatch after payment.' },
];
