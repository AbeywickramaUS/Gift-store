'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, EyeOff, Loader2, Plus, Search } from 'lucide-react';
import type { MediaItem, Package, PackageCategory, Product, ProductCategory, ProductSubCategory } from '@/lib/types';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { CATEGORY_LABELS, SHOP_CATEGORIES, formatLKR } from '@/lib/constants';
import { refreshCatalog } from '@/app/admin/actions';
import ProductArt from '@/components/art/ProductArt';
import { coverImage } from '@/components/shop/ProductVisual';
import PhotoManager, { MEDIA_BUCKET } from './PhotoManager';

type Mode = 'product' | 'set';
type Row = Product | Package;

const SET_CATEGORIES: PackageCategory[] = ['skincare-sets', 'birthday-gifts', 'anniversary-gifts', 'everyday-essentials'];
const SET_LABEL: Record<string, string> = { ...CATEGORY_LABELS, 'everyday-essentials': 'Everyday Essentials' };

const PRODUCT_COLS = 'id, name, slug, description, price, category, sub_category, media, stock_quantity, in_stock, weight_grams, featured, is_active, created_at, updated_at';
const PACKAGE_COLS = 'id, name, slug, description, price, category, product_ids, media, stock_quantity, in_stock, weight_grams, featured, is_active, created_at, updated_at';

interface Draft {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  weight: string;
  featured: boolean;
  active: boolean;
  media: MediaItem[];
  category: string;
  subCategory: string;
  productIds: string[];
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

const rupees = (n: number) => formatLKR(n).replace(/\.00$/, '');

function emptyDraft(mode: Mode): Draft {
  return {
    id: null,
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '0',
    weight: mode === 'set' ? '400' : '100',
    featured: false,
    active: true,
    media: [],
    category: mode === 'set' ? 'skincare-sets' : 'skincare',
    subCategory: 'sheet-masks',
    productIds: [],
  };
}

function toDraft(row: Row, mode: Mode): Draft {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    price: String(Number(row.price)),
    stock: String(row.stock_quantity),
    weight: String(row.weight_grams),
    featured: row.featured,
    active: row.is_active,
    media: row.media ?? [],
    category: row.category,
    subCategory: mode === 'product' ? (row as Product).sub_category : '',
    productIds: mode === 'set' ? [...(row as Package).product_ids] : [],
  };
}

function Thumb({ row, mode }: { row: Row; mode: Mode }) {
  const cover = coverImage(row.media ?? []);
  if (cover) {
    return (
      <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl bg-ground">
        <Image src={cover.url} alt="" fill sizes="48px" className="object-cover" unoptimized={cover.item.source !== 'supabase'} />
      </span>
    );
  }
  return (
    <span className="die-cut-sm block size-12 shrink-0">
      <ProductArt slug={row.slug} kind={mode === 'product' ? (row as Product).sub_category : row.category} isPackage={mode === 'set'} />
    </span>
  );
}

const input = 'mt-1.5 block w-full rounded-xl border-2 border-line bg-surface px-3.5 py-2.5 text-base text-ink outline-none focus:border-ink';
const label = 'block text-sm font-medium text-ink';

function Toggle({ checked, onChange, children, hint }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-line bg-surface p-3.5 hover:border-ink/40">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 accent-[#7a1f3d] dark:accent-[#f7b6c8]" />
      <span>
        <span className="block text-sm font-medium text-ink">{children}</span>
        {hint && <span className="block text-xs text-ink-3">{hint}</span>}
      </span>
    </label>
  );
}

export default function CatalogAdmin({ mode, accessToken }: { mode: Mode; accessToken: string }) {
  const table = mode === 'product' ? 'products' : 'packages';
  const noun = mode === 'product' ? 'product' : 'gift set';

  const [rows, setRows] = useState<Row[] | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pickQuery, setPickQuery] = useState('');

  const load = useCallback(async () => {
    const supabase = getBrowserSupabase();
    const main = await supabase
      .from(table)
      .select(mode === 'product' ? PRODUCT_COLS : PACKAGE_COLS)
      .order('category')
      .order('name');
    if (main.error) {
      setLoadError(main.error.message);
      return;
    }
    setLoadError(null);
    setRows((main.data as unknown as Row[]).map((r) => ({ ...r, price: Number(r.price) })));
    if (mode === 'set') {
      const p = await supabase.from('products').select(PRODUCT_COLS).order('name');
      if (!p.error) setAllProducts((p.data as unknown as Product[]).map((r) => ({ ...r, price: Number(r.price) })));
    }
  }, [mode, table]);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive) load();
    };
    run();
    return () => {
      alive = false;
    };
  }, [load]);

  const filterOptions =
    mode === 'product'
      ? [{ key: 'all', label: 'All' }, ...Object.entries(SHOP_CATEGORIES).map(([k, v]) => ({ key: k, label: v.label })), { key: 'hidden', label: 'Hidden' }, { key: 'low', label: 'Low stock' }]
      : [{ key: 'all', label: 'All' }, { key: 'hidden', label: 'Hidden' }, { key: 'low', label: 'Low stock' }];

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (q && !`${r.name} ${r.slug}`.toLowerCase().includes(q)) return false;
      if (filter === 'hidden') return !r.is_active;
      if (filter === 'low') return r.stock_quantity <= 5;
      if (filter !== 'all') return r.category === filter;
      return true;
    });
  }, [rows, query, filter]);

  const open = (d: Draft) => {
    setDraft(d);
    setPendingDeletes([]);
    setError(null);
    setNotice(null);
    setPickQuery('');
    window.scrollTo({ top: 0 });
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  async function save() {
    if (!draft) return;
    setError(null);
    const name = draft.name.trim();
    const slug = draft.id ? draft.slug : slugify(draft.slug || name);
    const price = Number(draft.price);
    const stock = Number(draft.stock);
    const weight = Number(draft.weight);
    if (!name) return setError('Give it a name.');
    if (!slug) return setError('The web address can only use letters and numbers.');
    if (!Number.isFinite(price) || price < 0) return setError('Enter a price in rupees, like 450.');
    if (!Number.isInteger(stock) || stock < 0) return setError('Stock must be a whole number (0 or more).');
    if (!Number.isInteger(weight) || weight <= 0) return setError('Weight must be a whole number of grams, like 30.');
    if (mode === 'set' && draft.productIds.length === 0) return setError('Pick at least one product for this set.');

    const common = {
      name,
      description: draft.description.trim(),
      price,
      stock_quantity: stock,
      weight_grams: weight,
      featured: draft.featured,
      is_active: draft.active,
      media: draft.media,
      category: draft.category,
      ...(mode === 'product' ? { sub_category: draft.subCategory } : { product_ids: draft.productIds }),
    };

    setSaving(true);
    const supabase = getBrowserSupabase();
    const result = draft.id
      ? await supabase.from(table).update(common).eq('id', draft.id).select('id').single()
      : await supabase.from(table).insert({ ...common, slug }).select('id').single();
    if (result.error) {
      setSaving(false);
      if (result.error.code === '23505') return setError(`Another ${noun} already uses the web address "${slug}". Change the name or address.`);
      return setError(`Couldn't save: ${result.error.message}`);
    }
    if (pendingDeletes.length) await supabase.storage.from(MEDIA_BUCKET).remove(pendingDeletes);
    const refreshed = await refreshCatalog(accessToken);
    await load();
    setSaving(false);
    setDraft(null);
    setNotice(
      refreshed.ok
        ? `Saved "${name}". It's updated on the shop now.`
        : `Saved "${name}". The shop will show the change within a few minutes.`,
    );
  }

  /* ---------------- List view ---------------- */
  if (!draft) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-4xl text-brand">{mode === 'product' ? 'Products' : 'Gift sets'}</h1>
          <button
            type="button"
            onClick={() => open(emptyDraft(mode))}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-ground hover:bg-brand/90"
          >
            <Plus className="size-4" aria-hidden /> New {noun}
          </button>
        </div>

        {notice && (
          <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-[#8ee3c8] px-4 py-3 text-sm font-semibold text-[#3a1a27]">
            <Check className="size-4" strokeWidth={3} aria-hidden /> {notice}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="rail -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Filter">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${filter === f.key ? 'bg-brand text-on-brand' : 'border border-line bg-surface text-ink-2 hover:border-ink hover:text-ink'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-72">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${noun}s`}
              className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-ink"
            />
          </label>
        </div>

        {loadError && (
          <p role="alert" className="mt-6 rounded-xl border-2 border-danger px-4 py-3 text-sm font-semibold text-danger">
            Couldn&apos;t load: {loadError}
          </p>
        )}

        {rows === null ? (
          <div className="mt-6 space-y-2" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-line" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-3">Nothing here.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-[0_10px_30px_-18px_rgb(122_31_61/0.5)]">
            {shown.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => open(toDraft(r, mode))} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-ink/5">
                  <Thumb row={r} mode={mode} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{r.name}</span>
                    <span className="block truncate text-xs text-ink-3">
                      {mode === 'product' ? CATEGORY_LABELS[(r as Product).sub_category] : SET_LABEL[r.category]}
                      {!(r.media && r.media.length) && ' · no photo yet'}
                    </span>
                  </span>
                  <span className="hidden flex-wrap justify-end gap-1 sm:flex">
                    {!r.is_active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-line px-2 py-0.5 text-xs font-medium text-ink-2">
                        <EyeOff className="size-3" aria-hidden /> Hidden
                      </span>
                    )}
                    {r.featured && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">Popular</span>}
                  </span>
                  <span className="w-20 text-right font-medium tabular-nums text-ink">{rupees(r.price)}</span>
                  <span
                    className={`w-20 text-right text-sm font-semibold tabular-nums ${r.stock_quantity === 0 ? 'text-danger' : r.stock_quantity <= 5 ? 'text-warn-ink' : 'text-ink-2'}`}
                  >
                    {r.stock_quantity === 0 ? 'Sold out' : `${r.stock_quantity} left`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  /* ---------------- Editor ---------------- */
  const d = draft;
  const isNew = d.id === null;
  const subOptions = mode === 'product' ? (SHOP_CATEGORIES[d.category as ProductCategory]?.subCategories ?? []) : [];
  const folder = `${mode === 'product' ? 'products' : 'sets'}/${d.id ? d.slug : slugify(d.slug || d.name) || 'new'}`;
  const included = allProducts.filter((p) => d.productIds.includes(p.id));
  const itemsTotal = included.reduce((s, p) => s + p.price, 0);
  const setPrice = Number(d.price) || 0;
  const pickList = allProducts.filter((p) => (p.is_active || d.productIds.includes(p.id)) && p.name.toLowerCase().includes(pickQuery.trim().toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
      <button type="button" onClick={() => setDraft(null)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All {noun}s
      </button>
      <h1 className="mt-3 font-display text-3xl text-brand sm:text-4xl">{isNew ? `New ${noun}` : d.name || `Edit ${noun}`}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="photos-title">
          <h2 id="photos-title" className="font-display text-xl text-brand">Photos</h2>
          <p className="mb-3 mt-1 text-sm text-ink-2">Until you add a photo, the shop shows the drawing.</p>
          <PhotoManager
            media={d.media}
            onChange={(m) => set('media', m)}
            folder={folder}
            altText={d.name || noun}
            onRemoveFile={(p) => setPendingDeletes((x) => [...x, p])}
          />
        </section>

        <section aria-labelledby="details-title" className="space-y-5">
          <h2 id="details-title" className="font-display text-xl text-brand">Details</h2>
          <div>
            <label htmlFor="f-name" className={label}>Name</label>
            <input id="f-name" value={d.name} maxLength={120} onChange={(e) => set('name', e.target.value)} className={input} />
          </div>
          <div>
            <label htmlFor="f-slug" className={label}>Web address</label>
            <div className="mt-1.5 flex items-center overflow-hidden rounded-xl border-2 border-line bg-ground text-sm">
              <span className="shrink-0 px-3 text-ink-3">/{mode === 'product' ? 'product' : 'packages'}/</span>
              <input
                id="f-slug"
                value={isNew ? d.slug || slugify(d.name) : d.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                readOnly={!isNew}
                className="min-w-0 flex-1 bg-surface px-3 py-2.5 text-ink outline-none read-only:bg-ground read-only:text-ink-3"
                aria-describedby="f-slug-hint"
              />
            </div>
            <p id="f-slug-hint" className="mt-1 text-xs text-ink-3">{isNew ? 'Made from the name. It can’t be changed after saving.' : 'Fixed, so old links keep working.'}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {mode === 'product' ? (
              <>
                <div>
                  <label htmlFor="f-cat" className={label}>Category</label>
                  <select
                    id="f-cat"
                    value={d.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      setDraft((x) => (x ? { ...x, category: cat, subCategory: SHOP_CATEGORIES[cat].subCategories[0] } : x));
                    }}
                    className={input}
                  >
                    {Object.entries(SHOP_CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="f-sub" className={label}>Type</label>
                  <select id="f-sub" value={d.subCategory} onChange={(e) => set('subCategory', e.target.value as ProductSubCategory)} className={input}>
                    {subOptions.map((s) => (
                      <option key={s} value={s}>{CATEGORY_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label htmlFor="f-cat" className={label}>Occasion</label>
                <select id="f-cat" value={d.category} onChange={(e) => set('category', e.target.value)} className={input}>
                  {SET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{SET_LABEL[c]}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="f-desc" className={label}>Description</label>
            <textarea id="f-desc" rows={3} value={d.description} onChange={(e) => set('description', e.target.value)} className={input} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="f-price" className={label}>Price (Rs.)</label>
              <input id="f-price" inputMode="decimal" value={d.price} onChange={(e) => set('price', e.target.value.replace(/[^\d.]/g, ''))} className={input} />
            </div>
            <div>
              <label htmlFor="f-stock" className={label}>In stock</label>
              <input id="f-stock" inputMode="numeric" value={d.stock} onChange={(e) => set('stock', e.target.value.replace(/\D/g, ''))} className={input} />
            </div>
            <div>
              <label htmlFor="f-weight" className={label}>Weight (g)</label>
              <input id="f-weight" inputMode="numeric" value={d.weight} onChange={(e) => set('weight', e.target.value.replace(/\D/g, ''))} className={input} aria-describedby="f-weight-hint" />
            </div>
          </div>
          <p id="f-weight-hint" className="-mt-3 text-xs text-ink-3">Packed weight, used for the delivery fee (Rs. 500 up to 1 kg).</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle checked={d.active} onChange={(v) => set('active', v)} hint="Off = hidden from the shop. Old orders are kept.">
              Show on the shop
            </Toggle>
            <Toggle checked={d.featured} onChange={(v) => set('featured', v)} hint="Shown in “Popular now” with a badge.">
              Popular
            </Toggle>
          </div>
        </section>
      </div>

      {mode === 'set' && (
        <section aria-labelledby="inside-title" className="mt-10">
          <h2 id="inside-title" className="font-display text-xl text-brand">What&apos;s in the box</h2>
          <p className="mt-1 text-sm text-ink-2">
            {included.length} picked · items on their own {rupees(itemsTotal)}
            {setPrice > 0 && itemsTotal > 0 && (
              <>
                {' · '}
                {itemsTotal > setPrice ? (
                  <strong className="text-ink">customers save {rupees(itemsTotal - setPrice)}</strong>
                ) : (
                  <strong className="text-danger">the set costs more than its items</strong>
                )}
              </>
            )}
          </p>
          <label className="relative mt-3 block sm:w-72">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <input
              type="search"
              value={pickQuery}
              onChange={(e) => setPickQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-ink"
            />
          </label>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pickList.map((p) => {
              const on = d.productIds.includes(p.id);
              return (
                <li key={p.id}>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-surface p-2.5 ${on ? 'border-ink' : 'border-line hover:border-ink/40'}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => set('productIds', e.target.checked ? [...d.productIds, p.id] : d.productIds.filter((x) => x !== p.id))}
                      className="size-5 accent-[#7a1f3d] dark:accent-[#f7b6c8]"
                    />
                    <Thumb row={p} mode="product" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                      <span className="block text-xs tabular-nums text-ink-3">{rupees(p.price)}{!p.is_active && ' · hidden'}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_-16px_rgb(122_31_61/0.5)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3">
          {error && (
            <p role="alert" className="mr-auto flex items-center gap-2 text-sm font-semibold text-danger">
              <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
            </p>
          )}
          <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-brand/40 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5">
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-ground hover:bg-brand/90 disabled:opacity-70"
          >
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {saving ? 'Saving…' : isNew ? `Add ${noun}` : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
