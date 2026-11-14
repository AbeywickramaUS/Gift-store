'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { cart, useCart, type CartLine } from '@/lib/cart';
import { MAX_QTY_PER_ITEM } from '@/lib/constants';

/** One-tap "Add to bag" under a product window. */
export default function QuickAdd(props: Omit<CartLine, 'quantity'>) {
  const lines = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inBag = lines.find((l) => l.id === props.id)?.quantity ?? 0;
  const full = inBag >= Math.min(props.maxQty, MAX_QTY_PER_ITEM);

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => {
        cart.add(props, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
      }}
      aria-label={full ? `${props.name}: all available are in your bag` : `Add ${props.name} to bag`}
      className="relative z-10 inline-flex h-10 items-center gap-1.5 rounded-full border border-brand px-4 text-[0.8rem] font-medium text-brand transition-colors hover:bg-brand hover:text-on-brand active:scale-[0.97] disabled:border-line disabled:text-ink-3 disabled:hover:bg-transparent"
    >
      {justAdded ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : <Plus className="size-4" strokeWidth={2} aria-hidden />}
      <span aria-live="polite">{justAdded ? 'Added' : inBag > 0 ? `${inBag} in bag · add more` : 'Add to bag'}</span>
    </button>
  );
}
