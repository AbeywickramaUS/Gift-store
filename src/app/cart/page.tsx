'use client';

import Link from 'next/link';
import { ArrowRight, Trash2 } from 'lucide-react';
import { cart, cartTotals, useCart } from '@/lib/cart';
import { deliveryFee, formatWeight, DELIVERY_BASE_WEIGHT_GRAMS } from '@/lib/delivery';
import { QuantityStepper } from '@/components/shop/AddToCart';
import MiniPacket from '@/components/shop/MiniPacket';
import { shelfPrice } from '@/components/shop/Shelf';
import { BowMark, SatinRibbon } from '@/components/brand/Brand';

export default function CartPage() {
  const lines = useCart();
  const totals = cartTotals(lines);
  const fee = deliveryFee(totals.weightGrams);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] text-brand">Your bag</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-2xl text-brand">Nothing in here yet</p>
          <p className="mt-2 text-ink-2">Tap Add on anything you like and it lands here.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/category/skincare" className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-ground hover:bg-brand/90">Skincare</Link>
            <Link href="/category/accessories" className="rounded-full border border-brand/40 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5">Accessories</Link>
            <Link href="/packages" className="rounded-full border border-brand/40 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5">Gift sets</Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-4 py-5">
                <MiniPacket slug={l.slug} kind={l.kind} isPackage={l.type === 'package'} />
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link href={l.type === 'package' ? `/packages/${l.slug}` : `/product/${l.slug}`} className="font-medium text-ink hover:text-accent">
                      {l.name}
                    </Link>
                    <p className="text-sm text-ink-3 tabular-nums">{shelfPrice(l.price)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <QuantityStepper size="sm" value={l.quantity} max={Math.min(l.maxQty, 20)} onChange={(q) => cart.setQuantity(l.id, q)} label={`Quantity of ${l.name}`} />
                    <p className="w-24 text-right font-medium tabular-nums text-ink">{shelfPrice(l.price * l.quantity)}</p>
                    <button
                      type="button"
                      onClick={() => cart.remove(l.id)}
                      className="flex size-9 items-center justify-center rounded-full text-ink-3 hover:bg-ink/8 hover:text-danger"
                      aria-label={`Remove ${l.name}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="relative overflow-hidden rounded-2xl bg-surface p-6 pt-9 shadow-[0_2px_10px_-4px_rgb(122_31_61/0.15)] lg:sticky lg:top-24" aria-label="Order total">
            {/* wrapped like a parcel: a satin band across the top, tied with the bow */}
            <SatinRibbon className="absolute inset-x-0 top-0 h-2.5" />
            <BowMark className="absolute left-1/2 top-0 h-6 w-auto -translate-x-1/2" />
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Items ({totals.count})</dt>
                <dd className="tabular-nums text-ink">{shelfPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Delivery · {formatWeight(totals.weightGrams)}</dt>
                <dd className="tabular-nums text-ink">{shelfPrice(fee)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="font-display text-2xl tabular-nums text-brand">{shelfPrice(totals.subtotal + fee)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-ground hover:bg-brand/90">
              Check out <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="mt-4 text-xs leading-5 text-ink-3">
              Delivery is {shelfPrice(500)} up to {DELIVERY_BASE_WEIGHT_GRAMS / 1000} kg. You pay by bank transfer after ordering on WhatsApp. No Cash on Delivery.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
