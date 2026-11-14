import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_NAME, TAGLINE } from '@/lib/constants';
import PageHeader from '@/components/brand/PageHeader';
import { BowMark, RibbonDivider, Sparkle } from '@/components/brand/Brand';
import ProductArt from '@/components/art/ProductArt';

export const metadata: Metadata = {
  title: 'Our Story',
  description: `${SITE_NAME} (Gift + Admire) is a Sri Lankan boutique for K-beauty treats, cute accessories and ready-to-gift sets, hand-picked and wrapped with love.`,
};

const PROMISES = [
  { title: 'Hand-picked', body: 'Trendy, hard-to-find K-beauty treats and little accessories, chosen one by one.' },
  { title: 'Wrapped with love', body: 'Blush paper, satin ribbon, and your note handwritten on a card.' },
  { title: 'Kind to your budget', body: 'Student-friendly prices, with Minis under Rs. 500.' },
  { title: 'A real person', body: 'Questions, custom sets and order updates, all on WhatsApp.' },
];

export default function OurStoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader crumbs={[{ label: 'Home', href: '/' }, { label: 'Our Story' }]} title="Our Story" italic="Gift + Admire" center />

      <div className="grid items-center gap-12 md:grid-cols-[1fr_1fr]">
        <div className="space-y-5 text-[1.05rem] leading-8 text-ink-2">
          <p>
            <span className="font-display text-brand">{SITE_NAME}</span> (say it <em>Gif-MEE-ra</em>) is a name we made from two little words: <em>gift</em> and{' '}
            <em>admire</em>. It&apos;s what we hope every parcel feels like: something lovely to give, receive and treasure.
          </p>
          <p>
            We&apos;re your go-to place in Sri Lanka for K-beauty treats, cute accessories and ready-to-send gift sets. Everything is hand-picked, trendy and
            thoughtfully wrapped, whether it&apos;s for you or for someone special.
          </p>
          <p>
            We keep things simple and personal. You fill your bag here, send us your order on WhatsApp, and a real person takes it from there, wrapping it,
            writing your card and sending it anywhere on the island.
          </p>
        </div>

        <div aria-hidden className="relative mx-auto aspect-square w-full max-w-md">
          <div className="arch absolute inset-x-[12%] inset-y-0 bg-tint ring-1 ring-line" />
          <div className="art-luxe absolute inset-x-[22%] bottom-[8%] top-[22%]">
            <ProductArt slug="birthday-girl-box" kind="birthday-gifts" isPackage />
          </div>
          <BowMark className="absolute left-1/2 top-[6%] h-14 w-auto -translate-x-1/2" sparkles />
          <Sparkle className="absolute left-[6%] top-[40%] size-5" />
          <Sparkle className="absolute right-[6%] top-[62%] size-4" />
        </div>
      </div>

      <RibbonDivider className="my-20" />

      <section aria-labelledby="promise-title">
        <h2 id="promise-title" className="text-center font-display text-[2.2rem] text-brand">
          What we <em className="text-rose-ink">promise</em>
        </h2>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p) => (
            <li key={p.title} className="text-center">
              <BowMark className="mx-auto h-7 w-auto" />
              <h3 className="mt-4 font-display text-xl text-brand">{p.title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-ink-2">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 rounded-[28px] bg-[#7a1f3d] px-6 py-14 text-center text-[#fff6ef] sm:px-12" aria-labelledby="close-title">
        <p id="close-title" className="font-display text-[2.2rem] italic leading-tight text-[#f7b6c8] sm:text-[2.8rem]">
          {TAGLINE}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[#f6dfe5]">Share your happy moment and tag us. We love seeing our little gifts arrive.</p>
        <Link href="/packages" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fff6ef] px-6 py-3.5 text-sm font-medium text-[#7a1f3d] hover:bg-white">
          Find a gift <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
