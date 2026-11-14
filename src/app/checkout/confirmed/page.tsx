'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { formatWeight } from '@/lib/delivery';
import { useLastOrder } from '@/lib/last-order';
import { shelfPrice } from '@/components/shop/Shelf';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { BowMark } from '@/components/brand/Brand';

const AUTO_OPEN_SECONDS = 5;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — text is still visible to copy by hand */
        }
      }}
      className="inline-flex items-center gap-1 rounded-full border border-current px-2.5 py-1 text-xs font-medium hover:bg-ink/8"
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-champagne pt-5">
      <span className="font-display text-3xl leading-none text-brand tabular-nums" aria-hidden>{n}</span>
      <div>
        <h2 className="font-display text-xl text-brand">{title}</h2>
        <div className="mt-2">{children}</div>
      </div>
    </li>
  );
}

export default function OrderConfirmedPage() {
  const last = useLastOrder();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const ref = last?.order.orderRef;
  const url = last?.whatsappUrl;

  // Open WhatsApp automatically once per order (not again on refresh / coming back).
  useEffect(() => {
    if (!ref || !url) return;
    const flag = `gift-store-wa-opened-${ref}`;
    try {
      if (sessionStorage.getItem(flag)) return;
    } catch {
      return;
    }
    let left = AUTO_OPEN_SECONDS;
    const tick = setInterval(() => {
      left -= 1;
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        try {
          sessionStorage.setItem(flag, '1');
        } catch {}
        window.location.href = url;
      }
    }, 1000);
    const start = setTimeout(() => setSecondsLeft(AUTO_OPEN_SECONDS), 0);
    return () => {
      clearInterval(tick);
      clearTimeout(start);
    };
  }, [ref, url]);

  if (last === undefined) {
    return <div className="mx-auto h-96 max-w-2xl px-4 py-16" aria-busy="true" />;
  }

  if (last === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand">No recent order on this phone</h1>
        <p className="mt-3 text-ink-2">If you placed an order, your details are in your WhatsApp chat with us.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-ground hover:bg-brand/90">
          Back to the shop
        </Link>
      </div>
    );
  }

  const { order, bank, whatsappUrl } = last;
  const cancelAutoOpen = () => {
    setSecondsLeft(null);
    try {
      sessionStorage.setItem(`gift-store-wa-opened-${order.orderRef}`, '1');
    } catch {}
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* The order ID on a GIFMIRA thank-you card */}
      <div className="rounded-[22px] border-[1.5px] border-[#d4af7f] bg-[#fff6ef] px-6 py-9 text-center text-[#3a1a27] shadow-[0_24px_40px_-28px_rgb(122_31_61/0.55)] sm:px-10">
        <BowMark className="mx-auto h-11 w-auto" sparkles />
        <h1 className="mt-4 font-display text-[2.6rem] leading-none text-[#7a1f3d]">Thank you!</h1>
        <p className="mt-3 text-sm text-[#66404f]">Your order is placed. Your Order ID is</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[#7a1f3d]">
          <p className="font-display text-[clamp(2.2rem,9vw,3.4rem)] leading-none tabular-nums">{order.orderRef}</p>
          <CopyButton text={order.orderRef} label="Order ID" />
        </div>
        <p className="mx-auto mt-5 w-fit border-t border-[#d4af7f]/60 pt-4 text-sm">
          Total to pay <span className="font-display text-xl tabular-nums text-[#7a1f3d]">{shelfPrice(order.total)}</span>
        </p>
      </div>

      <ol className="mt-10 space-y-8">
        <Step n={1} title="Send your order on WhatsApp">
          <p className="text-ink-2">Everything is already written. Just press send.</p>
          <a
            href={whatsappUrl}
            onClick={cancelAutoOpen}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-medium text-on-brand hover:bg-brand/90"
          >
            <WhatsAppIcon /> Open WhatsApp and send
          </a>
          {secondsLeft !== null && secondsLeft > 0 && (
            <p className="mt-3 text-sm text-ink-3" role="status">
              Opening WhatsApp in {secondsLeft}s.{' '}
              <button type="button" onClick={cancelAutoOpen} className="font-medium text-ink underline">
                Stay here
              </button>
            </p>
          )}
        </Step>

        <Step n={2} title={`Transfer ${shelfPrice(order.total)}`}>
          <dl className="divide-y divide-line rounded-xl bg-surface px-4 text-sm shadow-[0_2px_10px_-4px_rgb(122_31_61/0.15)]">
            {[
              ['Bank', bank.bank],
              ['Branch', bank.branch],
              ['Account name', bank.accountName],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-ink-3">{k}</dt>
                <dd className="text-right font-semibold text-ink">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-ink-3">Account number</dt>
              <dd className="flex items-center gap-2 font-semibold tabular-nums text-ink">
                {bank.accountNumber}
                <CopyButton text={bank.accountNumber} label="account number" />
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-ink-3">Reference</dt>
              <dd className="font-semibold tabular-nums text-ink">{order.orderRef}</dd>
            </div>
          </dl>
        </Step>

        <Step n={3} title="Send us the receipt">
          <p className="text-ink-2">
            Reply in the same WhatsApp chat with a photo or screenshot of the transfer. We pack and dispatch once it&apos;s in. Orders not
            paid within 48 hours are cancelled.
          </p>
        </Step>
      </ol>

      <details className="mt-10 rounded-xl border border-line p-5">
        <summary className="cursor-pointer font-medium text-ink">Order details</summary>
        <ul className="mt-4 space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="text-ink-2">
                <span className="font-medium tabular-nums text-ink">{i.quantity} ×</span> {i.name}
              </span>
              <span className="tabular-nums">{shelfPrice(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between"><dt className="text-ink-3">Items</dt><dd className="tabular-nums">{shelfPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-3">Delivery · {formatWeight(order.weightGrams)}</dt><dd className="tabular-nums">{shelfPrice(order.deliveryFee)}</dd></div>
          <div className="flex justify-between font-medium"><dt>Total</dt><dd className="tabular-nums">{shelfPrice(order.total)}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-ink-2">
          Sending to {order.customer.name}, {order.customer.address}, {order.customer.city}, {order.customer.district}.
        </p>
      </details>

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-medium text-ink underline-offset-4 hover:underline">Keep shopping</Link>
      </p>
    </div>
  );
}
