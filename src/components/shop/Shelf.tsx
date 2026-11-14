import Link from 'next/link';
import type { Package, Product } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import QuickAdd from './QuickAdd';
import { Badge, PriceTag, ProductWindow } from './Boutique';

export { shelfPrice } from './Boutique';

type Item = { kind: 'product'; item: Product } | { kind: 'package'; item: Package };

/** One product in its arched window, with a price tag, name and Add to bag. */
export function ShelfItem(props: Item & { priority?: boolean; popularBadge?: boolean; className?: string }) {
  const { item } = props;
  const isPackage = props.kind === 'package';
  const href = isPackage ? `/packages/${item.slug}` : `/product/${item.slug}`;
  const kind = isPackage ? (item as Package).category : (item as Product).sub_category;
  const soldOut = !item.in_stock;
  const lowStock = !soldOut && item.stock_quantity <= 5;
  const label = CATEGORY_LABELS[kind] ?? '';

  return (
    <li className={`flex flex-col ${props.className ?? ''}`}>
      <Link href={href} className="group relative block">
        <ProductWindow
          slug={item.slug}
          kind={kind}
          isPackage={isPackage}
          media={item.media}
          name={item.name}
          soldOut={soldOut}
          priority={props.priority}
          className="window-lift aspect-[4/5]"
        >
          <span className="absolute bottom-[7%] left-1/2 z-20 flex -translate-x-1/2 gap-1 whitespace-nowrap">
            {soldOut && <Badge tone="muted">Back soon</Badge>}
            {lowStock && <Badge>Only {item.stock_quantity} left</Badge>}
            {!soldOut && !lowStock && item.featured && props.popularBadge !== false && <Badge>Our pick</Badge>}
          </span>
        </ProductWindow>
        <PriceTag price={item.price} muted={soldOut} className="absolute -top-1 right-[9%] z-20" />
        <span className="mt-4 block text-center">
          <span className="line-clamp-2 font-display text-[1.06rem] leading-snug text-ink group-hover:text-brand group-hover:underline">{item.name}</span>
          <span className="mt-1 block text-xs text-ink-3">
            {isPackage ? `${label} · ${(item as Package).product_ids.length} items` : label}
          </span>
        </span>
      </Link>
      <div className="mt-3 flex justify-center">
        {soldOut ? (
          <span className="py-2 text-xs font-medium text-ink-3">Sold out for now</span>
        ) : (
          <QuickAdd
            type={props.kind}
            id={item.id}
            slug={item.slug}
            name={item.name}
            price={item.price}
            weightGrams={item.weight_grams}
            maxQty={item.stock_quantity}
            kind={kind}
          />
        )}
      </div>
    </li>
  );
}

/** A row of product windows. `rail` scrolls sideways on phones and wraps from 640px. */
export default function Shelf({
  items,
  variant = 'grid',
  label,
  popularBadge = true,
  columns = 4,
}: {
  items: Item[];
  variant?: 'grid' | 'rail';
  label: string;
  popularBadge?: boolean;
  /** Desktop columns */
  columns?: 3 | 4;
}) {
  const layout =
    variant === 'rail'
      ? `rail -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 pt-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0 ${columns === 4 ? 'lg:grid-cols-4' : ''} [&>li]:w-[62vw] [&>li]:shrink-0 sm:[&>li]:w-auto`
      : `grid grid-cols-2 gap-x-5 gap-y-12 pt-2 sm:grid-cols-3 sm:gap-x-8 ${columns === 4 ? 'lg:grid-cols-4' : ''}`;
  return (
    <ul aria-label={label} className={`mt-8 ${layout}`}>
      {items.map((it, i) => (
        <ShelfItem key={it.item.id} {...it} priority={i < 2} popularBadge={popularBadge} />
      ))}
    </ul>
  );
}

export function ShelfSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul aria-hidden className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="arch aspect-[4/5] animate-pulse bg-tint" />
          <div className="mx-auto mt-4 h-4 w-3/4 animate-pulse rounded bg-line" />
          <div className="mx-auto mt-3 h-9 w-28 animate-pulse rounded-full bg-line" />
        </li>
      ))}
    </ul>
  );
}
