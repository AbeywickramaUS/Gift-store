import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SITE_NAME } from '@/lib/constants';
import { getPackageBySlug, getPackages, getProductsByIds } from '@/lib/queries';
import OrderPanel from '@/components/shop/OrderPanel';
import HeroSticker from '@/components/shop/HeroSticker';
import { ProductWindow, shelfPrice } from '@/components/shop/Boutique';
import { coverImage } from '@/components/shop/ProductVisual';
import { BowMark, Sparkle } from '@/components/brand/Brand';

type Params = Promise<{ slug: string }>;

const MOMENT_LINE: Record<string, string> = {
  'skincare-sets': 'A pamper-night Moment',
  'birthday-gifts': 'A birthday Moment',
  'anniversary-gifts': 'An anniversary Moment',
  'everyday-essentials': 'An everyday Moment',
};

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  const cover = coverImage(pkg.media);
  return {
    title: `${pkg.name} · Gift Set`,
    description: pkg.description,
    openGraph: { title: pkg.name, description: pkg.description, images: cover ? [{ url: cover.url }] : undefined },
  };
}

async function PackageDetails({ params }: { params: Params }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const items = await getProductsByIds(pkg.product_ids);
  const separateTotal = items.reduce((sum, p) => sum + p.price, 0);
  const saving = separateTotal - pkg.price;

  return (
    <>
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span aria-hidden className="text-champagne">/</span>
        <Link href="/packages" className="hover:text-brand">Gift Sets</Link>
        <span aria-hidden className="text-champagne">/</span>
        <span aria-current="page" className="text-ink-2">{pkg.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <HeroSticker
          slug={pkg.slug}
          kind={pkg.category}
          isPackage
          media={pkg.media}
          name={pkg.name}
          price={pkg.price}
          soldOut={!pkg.in_stock}
          stock={pkg.stock_quantity}
          featured={pkg.featured}
        />

        <div className="md:pt-2 lg:pt-6">
          <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.06] text-brand [text-wrap:balance]">{pkg.name}</h1>
          <p className="mt-2 font-display text-xl italic text-rose-ink">{MOMENT_LINE[pkg.category] ?? 'A ready-to-gift Moment'}</p>
          {pkg.description && <p className="mt-5 max-w-prose leading-8 text-ink-2">{pkg.description}</p>}
          {saving > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-champagne px-4 py-2 text-sm text-brand">
              <Sparkle className="size-3.5" /> Save {shelfPrice(saving)} vs. buying the {items.length} items separately
            </p>
          )}
          <div className="mt-8">
            <OrderPanel
              type="package"
              id={pkg.id}
              slug={pkg.slug}
              name={pkg.name}
              price={pkg.price}
              weightGrams={pkg.weight_grams}
              stock={pkg.stock_quantity}
              kind={pkg.category}
            />
          </div>

          {/* The gift tag: what their note will look like */}
          <div className="mt-8 flex items-center gap-5 rounded-2xl border border-line bg-surface p-5">
            <div className="relative w-24 shrink-0 rotate-[-6deg] rounded-[10px] border border-[#d4af7f] bg-[#fff6ef] px-2 pb-3 pt-5 text-center shadow-[0_10px_18px_-12px_rgb(122_31_61/0.5)]">
              <span aria-hidden className="absolute left-1/2 top-1.5 size-2.5 -translate-x-1/2 rounded-full border border-[#d4af7f] bg-[#fbe7ec]" />
              <BowMark className="mx-auto h-5 w-auto" />
              <p className="mt-1 font-display text-[0.7rem] text-[#7a1f3d]">{SITE_NAME}</p>
              <p className="text-[0.5rem] uppercase tracking-[0.2em] text-[#7a1f3d]">Wrapped with love</p>
            </div>
            <p className="text-sm leading-6 text-ink-2">
              <strong className="font-medium text-ink">Wrapped and tagged for you.</strong> Write a message at checkout and we&apos;ll handwrite it on
              the card inside.
            </p>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <section className="mt-24" aria-labelledby="inside-title">
          <h2 id="inside-title" className="font-display text-[2.2rem] text-brand">
            What&apos;s <em className="text-rose-ink">inside</em>
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="group block text-center">
                  <ProductWindow slug={p.slug} kind={p.sub_category} media={p.media} name={p.name} className="window-lift aspect-[4/5]" />
                  <span className="mt-3 block font-display text-[0.98rem] text-ink group-hover:text-brand group-hover:underline">{p.name}</span>
                  <span className="block text-xs tabular-nums text-ink-3">{shelfPrice(p.price)} on its own</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default function PackagePage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="grid gap-10 md:grid-cols-2" aria-hidden>
            <div className="arch mx-auto aspect-[4/5] w-full max-w-[28rem] animate-pulse bg-tint" />
            <div className="h-64 animate-pulse rounded-2xl bg-line" />
          </div>
        }
      >
        <PackageDetails params={params} />
      </Suspense>
    </div>
  );
}
