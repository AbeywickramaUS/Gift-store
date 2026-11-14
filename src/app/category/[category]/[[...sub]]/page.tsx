import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CATEGORY_LABELS, SHOP_CATEGORIES } from '@/lib/constants';
import { getProducts } from '@/lib/queries';
import type { ProductCategory, ProductSubCategory } from '@/lib/types';
import Shelf, { ShelfSkeleton } from '@/components/shop/Shelf';
import PageHeader from '@/components/brand/PageHeader';

/**
 * /category/skincare             → all skincare
 * /category/skincare/sheet-masks → one sub-category
 *
 * Filters are path segments (not ?query) so every combination is
 * prerendered at build time and served statically.
 */
type Params = Promise<{ category: string; sub?: string[] }>;

function resolve(category: string, sub?: string[]) {
  if (!(category in SHOP_CATEGORIES)) return null;
  const cat = category as ProductCategory;
  if (!sub || sub.length === 0) return { cat, subCategory: undefined };
  if (sub.length > 1) return null;
  const allowed = SHOP_CATEGORIES[cat].subCategories as readonly string[];
  if (!allowed.includes(sub[0])) return null;
  return { cat, subCategory: sub[0] as ProductSubCategory };
}

export function generateStaticParams() {
  return Object.entries(SHOP_CATEGORIES).flatMap(([category, info]) => [
    { category, sub: [] },
    ...info.subCategories.map((s) => ({ category, sub: [s] })),
  ]);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, sub } = await params;
  const r = resolve(category, sub);
  if (!r) return {};
  const title = r.subCategory ? CATEGORY_LABELS[r.subCategory] : SHOP_CATEGORIES[r.cat].label;
  return { title, description: SHOP_CATEGORIES[r.cat].blurb };
}

async function CategoryContent({ params }: { params: Params }) {
  const { category, sub } = await params;
  const r = resolve(category, sub);
  if (!r) notFound();

  const info = SHOP_CATEGORIES[r.cat];
  const products = await getProducts(r.cat, r.subCategory);
  const title = r.subCategory ? CATEGORY_LABELS[r.subCategory] : info.label;
  const chip = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[0.82rem] font-medium transition-colors ${
      active ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink-2 hover:border-brand hover:text-brand'
    }`;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Home', href: '/' },
          ...(r.subCategory ? [{ label: info.label, href: `/category/${r.cat}` }, { label: title }] : [{ label: title }]),
        ]}
        title={title}
        italic={r.subCategory ? undefined : `The ${info.collection} collection`}
        intro={info.blurb}
      />

      {/* Sub-category filter, each with its packet colour */}
      <nav aria-label={`${info.label} types`} className="rail -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={`/category/${r.cat}`} className={chip(!r.subCategory)} aria-current={!r.subCategory ? 'page' : undefined}>
          All
        </Link>
        {info.subCategories.map((s) => (
          <Link key={s} href={`/category/${r.cat}/${s}`} className={chip(r.subCategory === s)} aria-current={r.subCategory === s ? 'page' : undefined}>
            {CATEGORY_LABELS[s]}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-2xl text-brand">Nothing here just yet</p>
          <p className="mt-2 text-ink-2">New stock is on the way. See the other {info.label.toLowerCase()} for now.</p>
          <Link href={`/category/${r.cat}`} className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-on-brand">
            All {info.label.toLowerCase()}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-3" aria-live="polite">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
          <Shelf items={products.map((item) => ({ kind: 'product' as const, item }))} label={title} />
        </>
      )}
    </>
  );
}

export default function CategoryPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<ShelfSkeleton />}>
        <CategoryContent params={params} />
      </Suspense>
    </div>
  );
}
