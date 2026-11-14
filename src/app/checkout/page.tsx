'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { AlertCircle, ArrowLeft, Banknote, Loader2 } from 'lucide-react';
import { cart, cartTotals, useCart } from '@/lib/cart';
import { SRI_LANKA_DISTRICTS } from '@/lib/constants';
import { deliveryFee, formatWeight } from '@/lib/delivery';
import { saveLastOrder } from '@/lib/last-order';
import MiniPacket from '@/components/shop/MiniPacket';
import { shelfPrice } from '@/components/shop/Shelf';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { BowMark, SatinRibbon } from '@/components/brand/Brand';
import { placeOrder, type FieldErrors } from './actions';

const inputBase =
  'mt-1.5 block w-full rounded-xl border-2 bg-surface px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink';

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-champagne pt-5">
      <legend className="float-left mb-3 w-full font-display text-xl text-brand">{title}</legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart();
  const totals = cartTotals(lines);
  const fee = deliveryFee(totals.weightGrams);

  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand">Your bag is empty</h1>
        <p className="mt-2 text-ink-2">Add something first, then come back to check out.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-ground hover:bg-brand/90">
          Back to the shop
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '');
    setFormError(null);
    startTransition(async () => {
      const result = await placeOrder({
        name: get('name'),
        phone: get('phone'),
        whatsapp: sameWhatsapp ? '' : get('whatsapp'),
        email: get('email'),
        address: get('address'),
        city: get('city'),
        district: get('district'),
        giftNote: get('giftNote'),
        website: get('website'),
        items: lines.map((l) => ({ type: l.type, id: l.id, quantity: l.quantity })),
      });
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      saveLastOrder({ order: result.order, bank: result.bank, whatsappUrl: result.whatsappUrl, message: result.message });
      cart.clear();
      router.push('/checkout/confirmed');
    });
  }

  const cls = (k: keyof FieldErrors) => `${inputBase} ${errors[k] ? 'border-danger' : 'border-line'}`;
  const aria = (k: keyof FieldErrors, hasHint = false) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-error` } : hasHint ? { 'aria-describedby': `${k}-hint` } : {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Back to bag
      </Link>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] text-brand">Checkout</h1>
      <p className="mt-3 max-w-xl text-ink-2">Fill in where to send it. When you confirm, we open WhatsApp with your order already written.</p>

      {formError && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border-2 border-danger bg-surface px-4 py-3 text-sm font-semibold text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {formError}
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-12">
          <Section title="Your details">
            <Field id="name" label="Full name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" required maxLength={100} className={cls('name')} {...aria('name')} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="Mobile number" hint="Sri Lankan mobile, like 077 123 4567" error={errors.phone}>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16} className={cls('phone')} {...aria('phone', true)} />
              </Field>
              <Field id="email" label="Email (optional)" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={200} className={cls('email')} {...aria('email')} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input type="checkbox" checked={sameWhatsapp} onChange={(e) => setSameWhatsapp(e.target.checked)} className="size-5 rounded accent-[#7a1f3d] dark:accent-[#f3f2fa]" />
              I use WhatsApp on this number
            </label>
            {!sameWhatsapp && (
              <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp}>
                <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" maxLength={16} className={cls('whatsapp')} {...aria('whatsapp')} />
              </Field>
            )}
          </Section>

          <Section title="Delivery address">
            <Field id="address" label="Address" hint="House number, street and area" error={errors.address}>
              <textarea id="address" name="address" autoComplete="street-address" required rows={2} maxLength={300} className={cls('address')} {...aria('address', true)} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="city" label="City or town" error={errors.city}>
                <input id="city" name="city" autoComplete="address-level2" required maxLength={80} className={cls('city')} {...aria('city')} />
              </Field>
              <Field id="district" label="District" error={errors.district}>
                <select id="district" name="district" required defaultValue="" className={cls('district')} {...aria('district')}>
                  <option value="" disabled>Choose your district</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Gift note (optional)">
            <div className="grid gap-6 sm:grid-cols-[1fr_13rem] sm:items-start">
              <Field id="giftNote" label="Message for the card" hint="We handwrite it on a GIFMIRA card in the parcel. Up to 300 characters." error={errors.giftNote}>
                <textarea
                  id="giftNote"
                  name="giftNote"
                  rows={4}
                  maxLength={300}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className={cls('giftNote')}
                  {...aria('giftNote', true)}
                />
              </Field>
              {/* live preview of the card they'll receive */}
              <figure aria-hidden className="mx-auto w-52 rotate-[-2deg] rounded-[14px] border border-[#d4af7f] bg-[#fff6ef] px-5 py-6 text-center shadow-[0_18px_30px_-20px_rgb(122_31_61/0.55)] sm:mt-7">
                <BowMark className="mx-auto h-7 w-auto" />
                <p className="mt-3 min-h-[3.5rem] whitespace-pre-wrap break-words font-display text-[0.95rem] italic leading-snug text-[#7a1f3d]">
                  {giftNote.trim() || 'Your message will be handwritten here.'}
                </p>
                <p className="mt-3 border-t border-[#d4af7f]/50 pt-2 text-[0.55rem] uppercase tracking-[0.24em] text-[#7a1f3d]">Little Gifts, Big Smiles.</p>
              </figure>
            </div>
          </Section>

          {/* Honeypot: hidden from people, bots fill it in */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-2xl bg-surface p-6 pt-9 shadow-[0_2px_10px_-4px_rgb(122_31_61/0.15)] lg:sticky lg:top-24" aria-label="Order summary">
            {/* wrapped like a parcel: a satin band across the top, tied with the bow */}
            <SatinRibbon className="absolute inset-x-0 top-0 h-2.5" />
            <BowMark className="absolute left-1/2 top-0 h-6 w-auto -translate-x-1/2" />
          <h2 className="font-display text-xl text-brand">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <MiniPacket slug={l.slug} kind={l.kind} isPackage={l.type === 'package'} className="h-12 w-10" />
                <span className="min-w-0 flex-1 text-ink-2">
                  <span className="font-medium tabular-nums text-ink">{l.quantity} ×</span> {l.name}
                </span>
                <span className="shrink-0 tabular-nums text-ink">{shelfPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Items</dt>
              <dd className="tabular-nums">{shelfPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Delivery · {formatWeight(totals.weightGrams)}</dt>
              <dd className="tabular-nums">{shelfPrice(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-2xl tabular-nums">{shelfPrice(totals.subtotal + fee)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-medium text-on-brand shadow-[0_12px_24px_-14px_rgb(122_31_61/0.8)] transition hover:bg-brand/90 disabled:cursor-wait disabled:opacity-80"
          >
            {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <WhatsAppIcon />}
            {pending ? 'Placing your order…' : 'Confirm & send on WhatsApp'}
          </button>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-ink-3">
            <Banknote className="mt-0.5 size-4 shrink-0" aria-hidden />
            No Cash on Delivery. Next you get your Order ID and our bank details. Send the transfer receipt on WhatsApp and we dispatch.
          </p>
        </aside>
      </form>
    </div>
  );
}
