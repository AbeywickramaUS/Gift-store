import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CATEGORY_LABELS, SHOP_CATEGORIES, SITE_NAME } from '@/lib/constants';
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { splitName } from '@/lib/sachet';
import MediaGallery from '@/components/shop/MediaGallery';
import OrderPanel from '@/components/shop/OrderPanel';
import HeroSticker from '@/components/shop/HeroSticker';
import Shelf from '@/components/shop/Shelf';
import { coverImage } from '@/components/shop/ProductVisual';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const cover = coverImage(product.media);
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: cover ? [{ url: cover.url }] : undefined },
  };
}

async function ProductDetails({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryInfo = SHOP_CATEGORIES[product.category];
  const related = await getRelatedProducts(product, 5);
  const [main, detail] = splitName(product.name);
  const showGallery = product.media.length > 1 || product.media.some((m) => m.type === 'video');

  return (
    <>
      <script
        type="application/ld+json"
        // Product structured data for search engines (real catalogue values only)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            brand: { '@type': 'Brand', name: SITE_NAME },
            category: CATEGORY_LABELS[product.sub_category],
            ...(coverImage(product.media) ? { image: [coverImage(product.media)!.url] } : {}),
            offers: {
              '@type': 'Offer',
              priceCurrency: 'LKR',
              price: product.price.toFixed(2),
              availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span aria-hidden className="text-champagne">/</span>
        <Link href={`/category/${product.category}`} className="hover:text-brand">{categoryInfo.label}</Link>
        <span aria-hidden className="text-champagne">/</span>
        <Link href={`/category/${product.category}/${product.sub_category}`} className="hover:text-brand">
          {CATEGORY_LABELS[product.sub_category]}
        </Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        {/* The product in its arched window */}
        <div>
          <HeroSticker
            slug={product.slug}
            kind={product.sub_category}
            media={showGallery ? [] : product.media}
            name={product.name}
            price={product.price}
            soldOut={!product.in_stock}
            stock={product.stock_quantity}
            featured={product.featured}
          />
          {showGallery && (
            <div className="mt-8">
              <MediaGallery media={product.media} kind={product.sub_category} name={product.name} />
            </div>
          )}
          {product.media.length === 0 && <p className="mt-4 text-center text-xs text-ink-3">Illustration. Product photos coming soon.</p>}
        </div>

        <div className="md:pt-2 lg:pt-6">
          <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.06] text-brand [text-wrap:balance]">{main}</h1>
          {detail && <p className="mt-2 font-display text-xl italic text-rose-ink">{detail}</p>}
          {product.description && <p className="mt-5 max-w-prose leading-8 text-ink-2">{product.description}</p>}
          <div className="mt-8">
            <OrderPanel
              type="product"
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              weightGrams={product.weight_grams}
              stock={product.stock_quantity}
            kind={product.sub_category}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-title">
          <h2 id="related-title" className="font-display text-[2.2rem] text-brand">You may <em className="text-rose-ink">also love</em></h2>
          <Shelf items={related.map((item) => ({ kind: 'product' as const, item }))} variant="rail" label="You may also love" />
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16" aria-hidden>
      <div className="arch mx-auto aspect-[4/5] w-full max-w-[26rem] animate-pulse bg-tint" />
      <div className="space-y-4 lg:pt-6">
        <div className="h-12 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-20 animate-pulse rounded bg-line" />
        <div className="h-12 w-1/3 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </div>
  );
}
