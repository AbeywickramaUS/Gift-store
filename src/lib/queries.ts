import { cacheLife, cacheTag } from 'next/cache';
import { supabase } from './supabase';
import type { Package, Product, ProductCategory, ProductSubCategory } from './types';

// ============================================
// Catalogue reads (server-side, cached)
//
// Every read is cached for a few minutes and tagged 'catalog', so
// pages are served from cache and Supabase egress stays tiny.
// A future admin action can call revalidateTag('catalog') to show
// changes immediately; otherwise edits appear within minutes.
//
// Only active rows are returned — RLS enforces that for the public
// key anyway; the filter keeps intent explicit.
// ============================================

const PRODUCT_COLUMNS =
  'id, name, slug, description, price, category, sub_category, media, stock_quantity, in_stock, weight_grams, featured, is_active, created_at, updated_at';
const PACKAGE_COLUMNS =
  'id, name, slug, description, price, category, product_ids, media, stock_quantity, in_stock, weight_grams, featured, is_active, created_at, updated_at';

/** Supabase returns numeric as number via PostgREST, but normalise defensively. */
function normaliseProduct(row: Product): Product {
  return { ...row, price: Number(row.price) };
}
function normalisePackage(row: Package): Package {
  return { ...row, price: Number(row.price) };
}

export async function getProducts(
  category: ProductCategory,
  subCategory?: ProductSubCategory,
): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  let query = supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('category', category);
  if (subCategory) query = query.eq('sub_category', subCategory);

  // In-stock first, then featured, then name
  const { data, error } = await query
    .order('in_stock', { ascending: false })
    .order('featured', { ascending: false })
    .order('name');
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data as Product[]).map(normaliseProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('featured', true)
    .order('in_stock', { ascending: false })
    .order('name')
    .limit(limit);
  if (error) throw new Error(`Failed to load featured products: ${error.message}`);
  return (data as Product[]).map(normaliseProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? normaliseProduct(data as Product) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .in('id', ids)
    .order('name');
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data as Product[]).map(normaliseProduct);
}

/** Related items: same sub-category first, then same category. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .eq('category', product.category)
    .neq('id', product.id)
    .order('in_stock', { ascending: false })
    .order('name');
  if (error) return [];
  const rows = (data as Product[]).map(normaliseProduct);
  const same = rows.filter((p) => p.sub_category === product.sub_category);
  const rest = rows.filter((p) => p.sub_category !== product.sub_category);
  return [...same, ...rest].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase.from('products').select('slug').eq('is_active', true);
  if (error) throw new Error(`Failed to load product slugs: ${error.message}`);
  return data.map((r) => r.slug as string);
}

export async function getPackages(): Promise<Package[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase
    .from('packages')
    .select(PACKAGE_COLUMNS)
    .eq('is_active', true)
    .order('in_stock', { ascending: false })
    .order('featured', { ascending: false })
    .order('price');
  if (error) throw new Error(`Failed to load gift sets: ${error.message}`);
  return (data as Package[]).map(normalisePackage);
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('catalog');

  const { data, error } = await supabase
    .from('packages')
    .select(PACKAGE_COLUMNS)
    .eq('is_active', true)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load gift set: ${error.message}`);
  return data ? normalisePackage(data as Package) : null;
}
