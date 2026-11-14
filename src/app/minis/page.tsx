import type { Metadata } from 'next';
import { getProducts } from '@/lib/queries';
import { MINIS_MAX_PRICE, SITE_NAME } from '@/lib/constants';
import Shelf from '@/components/shop/Shelf';
import PageHeader from '@/components/brand/PageHeader';

export const metadata: Metadata = {
  title: `Minis: Little Treats Under Rs. ${MINIS_MAX_PRICE}`,
  description: `Budget-friendly K-beauty treats and accessories under Rs. ${MINIS_MAX_PRICE} from ${SITE_NAME} Sri Lanka.`,
};

export default async function MinisPage() {
  const [skincare, accessories] = await Promise.all([getProducts('skincare'), getProducts('accessories')]);
  const minis = [...skincare, ...accessories].filter((p) => p.price <= MINIS_MAX_PRICE).sort((a, b) => Number(b.in_stock) - Number(a.in_stock) || a.price - b.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Minis' }]}
        title="Minis"
        italic={`Little treats under Rs. ${MINIS_MAX_PRICE}`}
        intro="Small, sweet and easy on the budget. Perfect to add to a gift, or to treat yourself."
      />
      {minis.length === 0 ? (
        <p className="text-ink-2">New Minis are on the way. Check back soon.</p>
      ) : (
        <Shelf items={minis.map((item) => ({ kind: 'product' as const, item }))} label="Minis" />
      )}
    </div>
  );
}
