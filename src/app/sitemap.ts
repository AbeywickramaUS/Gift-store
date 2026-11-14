import type { MetadataRoute } from 'next';
import { getAllProductSlugs, getPackages } from '@/lib/queries';
import { SHOP_CATEGORIES } from '@/lib/constants';

const base = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')).replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, packages] = await Promise.all([getAllProductSlugs(), getPackages()]);
  const pages = ['', '/packages', '/minis', '/our-story', '/order-help', ...Object.keys(SHOP_CATEGORIES).map((c) => `/category/${c}`)];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...packages.map((p) => ({ url: `${base}/packages/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...slugs.map((s) => ({ url: `${base}/product/${s}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
