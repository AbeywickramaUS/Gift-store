import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts, getPackages, getProducts } from '@/lib/queries';
import { COLLECTIONS, MINIS_MAX_PRICE, SITE_NAME, TAGLINE, whatsappLink } from '@/lib/constants';
import Shelf, { ShelfItem } from '@/components/shop/Shelf';
import ProductArt from '@/components/art/ProductArt';
import GiftBoxScene from '@/components/brand/GiftBoxScene';
import { BowMark, RibbonDivider, SatinRibbon, Sparkle } from '@/components/brand/Brand';
import { WhatsAppIcon } from '@/components/BrandIcons';

const STEPS = [
  { title: 'Fill your bag', body: 'Pick treats or a ready gift set, and add a note for the card if it’s a gift.' },
  { title: 'Get your Order ID', body: 'Enter your delivery details at checkout. Your Order ID appears straight away.' },
  { title: 'Send it on WhatsApp', body: 'WhatsApp opens with your whole order already written. Just press send.' },
  { title: 'Pay, and we wrap it', body: 'Transfer to our bank, share the receipt in the chat, and we pack and dispatch.' },
];

const PROMISES = [
  'Trendy, hard-to-find K-beauty and accessories',
  'Ready-to-gift sets with a handwritten card',
  'Student-friendly prices',
  'A real person on WhatsApp',
  'Island-wide delivery for Rs. 500',
];

/** Collection medallions use art that isn't repeated in the rows below. */
const COLLECTION_ART: Record<string, { slug: string; kind: string } | 'bow'> = {
  glow: { slug: 'overnight-sleeping-mask', kind: 'sleeping-masks' },
  charms: { slug: 'mini-hoop-earrings-set', kind: 'earrings' },
  moments: 'bow',
  minis: { slug: 'compact-pocket-mirror', kind: 'everyday-essentials' },
};

function SectionHead({ title, italic, blurb, href, cta }: { title: string; italic?: string; blurb?: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="max-w-2xl">
        <h2 className="font-display text-[2.1rem] leading-[1.1] text-brand sm:text-[2.6rem]">
          {title} {italic && <em className="text-rose-ink">{italic}</em>}
        </h2>
        {blurb && <p className="mt-3 text-ink-2">{blurb}</p>}
      </div>
      {href && cta && (
        <Link href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-brand">
          <span className="border-b border-champagne pb-0.5 group-hover:border-brand">{cta}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.6} aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [featured, packages, skincare, accessories] = await Promise.all([
    getFeaturedProducts(4),
    getPackages(),
    getProducts('skincare'),
    getProducts('accessories'),
  ]);
  const minis = [...skincare, ...accessories]
    .filter((p) => p.in_stock && p.price <= MINIS_MAX_PRICE)
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);
  const sets = packages.slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-8 pt-6 sm:px-6 md:grid-cols-[1fr_1fr] md:gap-10 md:pt-16 lg:gap-16 lg:px-8" aria-labelledby="hero-title">
        {/* on phones the box sits above the headline, cropped small */}
        <div className="md:order-2">
          <div className="md:hidden">
            <GiftBoxScene compact />
          </div>
          <div className="hidden md:block">
            <GiftBoxScene />
          </div>
        </div>
        <div className="md:order-1">
          <BowMark className="hidden h-9 w-auto md:block" sparkles />
          <h1 id="hero-title" className="font-display text-[clamp(2.7rem,6.6vw,5.4rem)] leading-[1.02] tracking-[-0.015em] text-brand md:mt-6">
            Little Gifts, <em className="block text-rose-ink">Big Smiles.</em>
          </h1>
          <p className="mt-4 max-w-[34rem] text-[1.02rem] leading-7 text-ink-2 md:mt-6 md:leading-8">
            Hand-picked K-beauty treats, cute accessories and ready-to-give gift boxes from {SITE_NAME}, Sri Lanka.
            <span className="hidden md:inline"> Find something lovely for yourself, or send a thoughtful surprise to someone special.</span>
          </p>
          <div className="mt-6 flex gap-3 md:mt-9">
            <Link href="/packages" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-medium text-on-brand shadow-[0_12px_24px_-14px_rgb(122_31_61/0.8)] hover:bg-brand/90 sm:px-7">
              Shop gift sets <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
            </Link>
            <Link href="/category/skincare" className="inline-flex items-center rounded-full border border-brand/40 px-5 py-3.5 text-sm font-medium text-brand hover:border-brand hover:bg-brand/5 sm:px-7">
              Explore skincare
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-3 md:mt-8">
            <Sparkle className="size-3" /> Wrapped with love, delivered island-wide for Rs. 500.
          </p>
        </div>
      </section>

      {/* ---------- Collections: medallions on a satin band ---------- */}
      <section className="relative mt-16 bg-tint py-14" aria-labelledby="collections-title">
        <SatinRibbon className="absolute inset-x-0 top-0 h-2.5" />
        <SatinRibbon className="absolute inset-x-0 bottom-0 h-2.5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="collections-title" className="text-center font-display text-[2.1rem] text-brand sm:text-[2.6rem]">
            Shop our <em className="text-rose-ink">collections</em>
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {COLLECTIONS.map((c) => {
              const art = COLLECTION_ART[c.key];
              return (
                <li key={c.key}>
                  <Link href={c.href} className="group block text-center">
                    <span className="window-lift relative mx-auto flex size-32 items-center justify-center rounded-full bg-[#fff6ef] ring-1 ring-[#ecd8d2] sm:size-40">
                      <span aria-hidden className="absolute inset-[6%] rounded-full border border-[#d4af7f]/70" />
                      {art === 'bow' ? (
                        <BowMark className="h-[46%] w-auto" sparkles />
                      ) : (
                        <span className="art-luxe absolute inset-[22%]">
                          <ProductArt slug={art.slug} kind={art.kind} />
                        </span>
                      )}
                    </span>
                    <span className="mt-4 block font-display text-[1.7rem] italic text-brand">{c.name}</span>
                    <span className="mt-0.5 block text-sm text-ink-2 group-hover:text-brand">{c.line}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Our favourites ---------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="favourites-title">
          <div id="favourites-title">
            <SectionHead title="Our" italic="favourites" blurb="Hand-picked by us: lovely little treats to start with." href="/category/skincare" cta="Shop all skincare" />
          </div>
          <Shelf items={featured.map((item) => ({ kind: 'product' as const, item }))} variant="rail" label="Our favourites" popularBadge={false} />
        </section>
      )}

      {/* ---------- Moments: gift sets, one big window and two small, tied by a ribbon ---------- */}
      {sets.length > 0 && (
        <section className="relative mt-24 overflow-hidden bg-[#f6d9e1] py-20 dark:bg-tint" aria-labelledby="moments-title">
          <SatinRibbon vertical className="absolute inset-y-0 left-[6%] hidden w-3 lg:block" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[23rem_1fr] lg:gap-16">
              <div className="lg:pl-10 lg:pt-6">
                <h2 id="moments-title" className="font-display text-[2.4rem] leading-[1.08] text-brand sm:text-[2.9rem]">
                  <span className="whitespace-nowrap">Ready-to-gift</span> <em className="block text-rose-ink">Moments</em>
                </h2>
                <p className="mt-5 leading-7 text-ink-2">
                  Each set arrives wrapped in blush paper and satin ribbon, with your message handwritten on a {SITE_NAME} card. Every set shows exactly what you
                  save.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  {['Gift-wrapped, ready to hand over', 'Your note, handwritten on the card', 'Sent anywhere on the island'].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <BowMark className="h-3.5 w-auto shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
                <Link href="/packages" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-on-brand hover:bg-brand/90">
                  See all gift sets <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
                </Link>
              </div>
              <ul aria-label="Gift sets" className="grid grid-cols-2 items-end gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-[1.45fr_1fr_1fr]">
                {sets.map((item, i) => (
                  <ShelfItem
                    key={item.id}
                    kind="package"
                    item={item}
                    priority={i === 0}
                    className={i === 0 ? 'col-span-2 mx-auto w-full max-w-[22rem] lg:col-span-1 lg:max-w-none' : ''}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Minis ---------- */}
      {minis.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="minis-title">
          <div id="minis-title">
            <SectionHead title="Minis" italic={`under Rs. ${MINIS_MAX_PRICE}`} blurb="Small treats, perfect for adding to a gift or treating yourself." href="/minis" cta="Shop all Minis" />
          </div>
          <Shelf items={minis.map((item) => ({ kind: 'product' as const, item }))} variant="rail" label="Minis" />
        </section>
      )}

      {/* ---------- How ordering works: a ribbon timeline ---------- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="how-title">
        <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <div>
            <h2 id="how-title" className="font-display text-[2.2rem] leading-[1.1] text-brand sm:text-[2.6rem]">
              How ordering <em className="block text-rose-ink">works</em>
            </h2>
            <p className="mt-4 leading-7 text-ink-2">No accounts and no card details. You order on WhatsApp and pay by bank transfer.</p>
            <Link href="/order-help" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">
              <span className="border-b border-champagne pb-0.5">Delivery, payment &amp; ordering questions</span>
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden />
            </Link>
          </div>
          <ol className="relative space-y-9 pl-14 sm:pl-20">
            <SatinRibbon vertical className="absolute bottom-6 left-[1.05rem] top-6 w-2 rounded-full sm:left-[1.55rem]" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-14 top-0 flex size-10 items-center justify-center rounded-full border border-champagne bg-ground font-display text-lg italic text-brand sm:-left-20 sm:size-[3.25rem] sm:text-xl">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl text-brand sm:text-[1.4rem]">{s.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-6 text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Our story teaser + promises ---------- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="story-title">
        <div className="grid items-center gap-12 rounded-[28px] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr]">
          {/* the thank-you card that goes in every parcel */}
          <figure className="mx-auto w-full max-w-md rotate-[-2deg] rounded-[18px] border-[1.5px] border-[#d4af7f] bg-[#fff6ef] px-8 py-10 text-center shadow-[0_24px_40px_-26px_rgb(122_31_61/0.55)]">
            <BowMark className="mx-auto h-12 w-auto" sparkles />
            <p className="mt-5 font-display text-[2.6rem] leading-none text-[#7a1f3d]">Thank you!</p>
            <p className="mt-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#7a1f3d]">for shopping with {SITE_NAME}</p>
            <p className="mt-6 font-display text-lg italic text-[#3a1a27]">A little surprise, picked with love.</p>
            <figcaption className="sr-only">The thank-you card in every {SITE_NAME} parcel</figcaption>
          </figure>
          <div>
            <h2 id="story-title" className="font-display text-[2.1rem] leading-[1.1] text-brand sm:text-[2.6rem]">
              Gift <span className="text-champagne">+</span> <em className="text-rose-ink">Admire</em>
            </h2>
            <p className="mt-5 leading-7 text-ink-2">
              {SITE_NAME} began with a simple wish: beautiful little things to give, receive and treasure. Every treat is picked by hand, every set is wrapped
              with care, and a real person answers your messages.
            </p>
            <ul className="mt-7 divide-y divide-line border-y border-line">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-center gap-3 py-3 text-sm text-ink">
                  <BowMark className="h-3.5 w-auto shrink-0" /> {p}
                </li>
              ))}
            </ul>
            <Link href="/our-story" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand">
              <span className="border-b border-champagne pb-0.5">Read our story</span>
              <ArrowRight className="size-4" strokeWidth={1.6} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Close ---------- */}
      <section className="mx-auto max-w-3xl px-4 pt-24 text-center sm:px-6">
        <RibbonDivider className="mb-10" />
        <p className="font-display text-[2rem] italic leading-tight text-brand sm:text-[2.4rem]">{TAGLINE}</p>
        <p className="mt-4 text-ink-2">Looking for something special, or a set made just for them? Ask us. We love a custom gift.</p>
        <a
          href={whatsappLink(`Hi ${SITE_NAME}! I'd love help choosing a gift.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand hover:bg-brand/90"
        >
          <WhatsAppIcon className="size-4" /> Ask us on WhatsApp
        </a>
      </section>
    </>
  );
}
