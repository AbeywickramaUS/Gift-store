'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cart, useCart, type CartLine } from '@/lib/cart';
import { MAX_QTY_PER_ITEM } from '@/lib/constants';

type Props = Omit<CartLine, 'quantity'>;

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  size = 'md',
}: {
  value: number;
  max: number;
  onChange: (q: number) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'size-9' : 'size-12';
  const btn = `flex ${dim} items-center justify-center text-brand transition-colors hover:bg-brand/8 disabled:opacity-30 disabled:hover:bg-transparent`;
  return (
    <div className="inline-flex items-center rounded-full border border-brand/40 bg-surface" role="group" aria-label={label}>
      <button type="button" className={`${btn} rounded-l-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" strokeWidth={2.5} aria-hidden />
      </button>
      <span className="w-7 text-center font-medium tabular-nums text-ink" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${btn} rounded-r-full`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
}

/** Quantity picker + "Add to bag" for product and gift-set pages. */
export default function AddToCart(props: Props) {
  const lines = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = lines.find((l) => l.id === props.id)?.quantity ?? 0;
  const max = Math.max(0, Math.min(props.maxQty, MAX_QTY_PER_ITEM) - inCart);

  if (max === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-ink-2">All available ({inCart}) are already in your bag.</p>
        <Link href="/cart" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand">
          <ShoppingBag className="size-4" aria-hidden /> Go to bag
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={Math.min(qty, max)} max={max} onChange={(q) => setQty(Math.max(1, Math.min(q, max)))} label="Quantity" />
        <button
          type="button"
          onClick={() => {
            cart.add(props, Math.min(qty, max));
            setQty(1);
            setAdded(true);
          }}
          className="inline-flex h-12 min-w-48 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-medium text-on-brand shadow-[0_12px_24px_-14px_rgb(122_31_61/0.8)] transition-transform hover:bg-brand/90 active:scale-[0.98] sm:flex-none"
        >
          <ShoppingBag className="size-5" aria-hidden /> Add to bag
        </button>
      </div>
      {added && (
        <p className="flex items-center gap-2 text-sm font-medium text-ink" role="status">
          <Check className="size-4 text-wa" strokeWidth={3} aria-hidden />
          In your bag.
          <Link href="/cart" className="text-brand underline">
            Check out
          </Link>
        </p>
      )}
    </div>
  );
}
