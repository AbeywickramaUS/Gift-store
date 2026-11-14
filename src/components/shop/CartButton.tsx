'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { cartTotals, onCartAdd, useCart } from '@/lib/cart';
import { BowMark } from '@/components/brand/Brand';

export default function CartButton() {
  const { count } = cartTotals(useCart());
  // bumps each time something is added, so the bow replays (never on page load)
  const [pops, setPops] = useState(0);
  useEffect(() => onCartAdd(() => setPops((n) => n + 1)), []);

  return (
    <Link
      href="/cart"
      className="relative flex size-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/8"
      aria-label={count > 0 ? `Bag, ${count} ${count === 1 ? 'item' : 'items'}` : 'Bag'}
    >
      <ShoppingBag className="size-[1.2rem]" strokeWidth={1.6} aria-hidden />
      {pops > 0 && (
        <span key={pops} aria-hidden className="bow-pop pointer-events-none absolute left-1/2 top-0">
          <BowMark className="h-4 w-auto" />
        </span>
      )}
      {count > 0 && (
        <span
          key={count}
          className="bump absolute right-0 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-on-brand ring-2 ring-ground"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
