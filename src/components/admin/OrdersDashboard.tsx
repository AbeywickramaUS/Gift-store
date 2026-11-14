'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { refreshCatalog } from '@/app/admin/actions';
import { SITE_NAME, formatLKR, whatsappLinkTo } from '@/lib/constants';
import { formatWeight } from '@/lib/delivery';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { WhatsAppIcon } from '@/components/BrandIcons';
import type { CartOrderLine, Order } from '@/lib/types';

// ============================================
// Admin: orders dashboard
// Reads/updates go straight to Supabase; RLS only allows admins,
// and only payment_status / status / admin_notes can be changed.
// ============================================

type Bucket = 'awaiting' | 'to_ship' | 'shipped' | 'delivered' | 'cancelled';

const BUCKETS: { key: Bucket | 'all'; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting payment' },
  { key: 'to_ship', label: 'Paid, to ship' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
];

function bucketOf(o: Order): Bucket {
  if (o.status === 'cancelled') return 'cancelled';
  if (o.status === 'delivered') return 'delivered';
  if (o.status === 'shipped') return 'shipped';
  if (o.payment_status === 'paid') return 'to_ship';
  return 'awaiting';
}

const EXPIRY_MS = 48 * 60 * 60 * 1000;

function timeAgo(iso: string, now: number): string {
  const mins = Math.round((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Colombo' });
}

/** Ready-made WhatsApp message to the customer for the order's current stage */
function customerMessage(o: Order): { label: string; text: string } {
  const first = o.customer_name.split(' ')[0];
  switch (bucketOf(o)) {
    case 'awaiting':
      return {
        label: 'Send payment reminder',
        text: `Hi ${first}! A friendly reminder that order ${o.order_ref} (${formatLKR(o.total_lkr)}) is waiting for payment. Please send the bank transfer receipt here and we'll get it packed 🎁 Unpaid orders are cancelled after 48 hours.`,
      };
    case 'to_ship':
      return {
        label: 'Confirm payment received',
        text: `Hi ${first}! We've received your payment for order ${o.order_ref} 🎉 We'll pack and dispatch it soon. Thank you for shopping with ${SITE_NAME}!`,
      };
    case 'shipped':
      return {
        label: 'Tell customer it shipped',
        text: `Hi ${first}! Your order ${o.order_ref} is on its way 🚚 It should reach you in ${o.customer_city} within a few days.`,
      };
    case 'delivered':
      return {
        label: 'Ask for feedback',
        text: `Hi ${first}! Hope you loved your order ${o.order_ref} 💖 We'd be so happy if you shared a photo or a review!`,
      };
    default:
      return { label: 'Message customer', text: `Hi ${first}, about your order ${o.order_ref}: ` };
  }
}

type Patch = Partial<Pick<Order, 'payment_status' | 'status' | 'admin_notes'>>;

interface Action {
  label: string;
  patch: Patch;
  style: 'primary' | 'danger' | 'plain';
  confirm?: string;
}

function actionsFor(o: Order): Action[] {
  switch (bucketOf(o)) {
    case 'awaiting':
      return [
        { label: 'Mark paid', patch: { payment_status: 'paid', status: 'confirmed' }, style: 'primary', confirm: `Receipt checked? This deducts stock for ${o.order_ref}.` },
        { label: 'Cancel order', patch: { status: 'cancelled' }, style: 'danger', confirm: `Cancel unpaid order ${o.order_ref}?` },
      ];
    case 'to_ship':
      return [
        { label: 'Mark shipped', patch: { status: 'shipped' }, style: 'primary' },
        { label: 'Refund & cancel', patch: { payment_status: 'refunded', status: 'cancelled' }, style: 'danger', confirm: `Refund ${formatLKR(o.total_lkr)} and cancel ${o.order_ref}? Stock is put back.` },
      ];
    case 'shipped':
      return [{ label: 'Mark delivered', patch: { status: 'delivered' }, style: 'primary' }];
    case 'cancelled':
      return o.payment_status === 'awaiting_payment'
        ? [{ label: 'Reopen order', patch: { status: 'pending' }, style: 'plain' }]
        : [];
    default:
      return [];
  }
}

const SELECT =
  'id, order_ref, order_type, customer_name, customer_phone, customer_whatsapp, customer_email, customer_address, customer_city, customer_district, items, box_style, gift_note, subtotal_lkr, delivery_fee_lkr, total_lkr, total_weight_grams, payment_status, status, admin_notes, created_at, updated_at';

function normalise(o: Order): Order {
  return { ...o, subtotal_lkr: Number(o.subtotal_lkr), delivery_fee_lkr: Number(o.delivery_fee_lkr), total_lkr: Number(o.total_lkr) };
}

function StatusBadge({ o, now }: { o: Order; now: number }) {
  const b = bucketOf(o);
  const expired = b === 'awaiting' && now - new Date(o.created_at).getTime() > EXPIRY_MS;
  const styles: Record<Bucket, string> = {
    awaiting: 'bg-[#ffe17a] text-[#3a1a27]',
    to_ship: 'bg-[#a3d8ff] text-[#3a1a27]',
    shipped: 'bg-[#c9b8ff] text-[#3a1a27]',
    delivered: 'bg-[#8ee3c8] text-[#3a1a27]',
    cancelled: 'bg-line text-ink-2',
  };
  const text: Record<Bucket, string> = {
    awaiting: 'Awaiting payment',
    to_ship: 'Paid — to ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: o.payment_status === 'refunded' ? 'Refunded' : 'Cancelled',
  };
  return (
    <span className="flex flex-wrap gap-1">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[b]}`}>{text[b]}</span>
      {expired && <span className="rounded-full border-2 border-danger px-2 py-px text-xs font-medium text-danger">Over 48 h</span>}
    </span>
  );
}

function OrderCard({ o, now, onUpdated }: { o: Order; now: number; onUpdated: (o: Order) => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [notes, setNotes] = useState(o.admin_notes ?? '');

  async function apply(patch: Patch) {
    setBusy(true);
    setError(null);
    const { data, error } = await getBrowserSupabase().from('orders').update(patch).eq('id', o.id).select(SELECT).single();
    setBusy(false);
    setConfirming(null);
    if (error) {
      setError(error.message);
      return;
    }
    onUpdated(normalise(data as Order));
  }

  const items = (o.order_type === 'cart' ? o.items : []) as CartOrderLine[];
  const msg = customerMessage(o);
  const whatsapp = o.customer_whatsapp || o.customer_phone;
  const btn = {
    primary: 'bg-brand text-on-brand hover:bg-brand/90',
    danger: 'border-2 border-danger text-danger hover:bg-danger/10',
    plain: 'border border-brand/40 text-ink hover:bg-ink/8',
  };

  return (
    <li className="rounded-2xl border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left"
      >
        <span className="font-display text-lg tabular-nums text-brand">{o.order_ref}</span>
        <StatusBadge o={o} now={now} />
        <span className="min-w-0 flex-1 truncate text-sm text-ink-2">
          {o.customer_name} · {o.customer_district}
        </span>
        <span className="text-sm font-semibold tabular-nums text-ink">{formatLKR(o.total_lkr)}</span>
        <span className="w-20 text-right text-xs text-ink-3">{timeAgo(o.created_at, now)}</span>
        <ChevronDown className={`size-4 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="grid gap-6 border-t border-line p-4 md:grid-cols-2">
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="mb-2 font-semibold text-ink">Items</h3>
              <ul className="space-y-1">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-ink-2">
                      {i.quantity} × {i.name}
                      {i.type === 'package' && <span className="ml-1 text-xs text-accent">(gift set)</span>}
                    </span>
                    <span className="tabular-nums">{formatLKR(Number(i.line_total))}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t border-line pt-2">
                <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="tabular-nums">{formatLKR(o.subtotal_lkr)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">Delivery{o.total_weight_grams != null && ` (${formatWeight(o.total_weight_grams)})`}</dt>
                  <dd className="tabular-nums">{formatLKR(o.delivery_fee_lkr)}</dd>
                </div>
                <div className="flex justify-between font-medium"><dt>Total</dt><dd className="tabular-nums">{formatLKR(o.total_lkr)}</dd></div>
              </dl>
            </div>
            {o.gift_note && (
              <div className="rounded-xl bg-[#fbe7ec] p-3 text-[#3a1a27]">
                <p className="text-xs font-medium">Gift note for the card</p>
                <p className="mt-1 whitespace-pre-wrap">{o.gift_note}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="mb-2 font-semibold text-ink">Deliver to</h3>
              <p className="text-ink">{o.customer_name}</p>
              <p className="whitespace-pre-wrap text-ink-2">{o.customer_address}</p>
              <p className="text-ink-2">{o.customer_city}, {o.customer_district} District</p>
              <p className="mt-2">
                <a href={`tel:${o.customer_phone}`} className="text-accent hover:underline">{o.customer_phone}</a>
                {o.customer_whatsapp && o.customer_whatsapp !== o.customer_phone && <> · WhatsApp {o.customer_whatsapp}</>}
              </p>
              {o.customer_email && (
                <p><a href={`mailto:${o.customer_email}`} className="text-accent hover:underline">{o.customer_email}</a></p>
              )}
              <p className="mt-2 text-xs text-ink-3">Placed {formatDate(o.created_at)}</p>
            </div>

            <a
              href={whatsappLinkTo(whatsapp, msg.text)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 font-medium text-white hover:brightness-95"
            >
              <WhatsAppIcon className="size-4" /> {msg.label}
            </a>

            {error && <p role="alert" className="rounded-xl border-2 border-danger px-3 py-2 font-semibold text-danger">{error}</p>}

            {confirming ? (
              <div className="rounded-xl bg-warn-bg p-3">
                <p className="font-semibold text-warn-ink">{confirming.confirm}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy} onClick={() => apply(confirming.patch)} className={`rounded-full px-4 py-2 font-semibold ${btn[confirming.style]}`}>
                    {busy ? 'Saving…' : `Yes, ${confirming.label.toLowerCase()}`}
                  </button>
                  <button type="button" disabled={busy} onClick={() => setConfirming(null)} className={`rounded-full px-4 py-2 font-semibold ${btn.plain}`}>
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {actionsFor(o).map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    disabled={busy}
                    onClick={() => (a.confirm ? setConfirming(a) : apply(a.patch))}
                    className={`rounded-full px-4 py-2 font-semibold disabled:opacity-60 ${btn[a.style]}`}
                  >
                    {busy && !a.confirm ? 'Saving…' : a.label}
                  </button>
                ))}
              </div>
            )}

            <div>
              <label htmlFor={`notes-${o.id}`} className="block text-xs font-semibold text-ink-2">
                Private notes (only admins see these)
              </label>
              <textarea
                id={`notes-${o.id}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
                placeholder="e.g. Receipt from BOC, tracking no. …"
              />
              {notes !== (o.admin_notes ?? '') && (
                <button type="button" disabled={busy} onClick={() => apply({ admin_notes: notes.trim() || null })} className={`mt-2 rounded-full px-4 py-1.5 text-xs font-semibold ${btn.plain}`}>
                  Save notes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default function OrdersDashboard({ accessToken }: { accessToken: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [tab, setTab] = useState<Bucket | 'all'>('awaiting');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  // Orders just changed stay in view (and open) until the tab changes
  const [sticky, setSticky] = useState<Set<string>>(() => new Set());

  const load = useCallback(async () => {
    const { data, error } = await getBrowserSupabase()
      .from('orders')
      .select(SELECT)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      setLoadError(error.message);
    } else {
      setLoadError(null);
      setOrders((data as Order[]).map(normalise));
    }
    setNow(Date.now());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive) load();
    };
    run();
    const t = setInterval(run, 60_000); // new orders appear within a minute
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    orders?.forEach((o) => (c[bucketOf(o)] = (c[bucketOf(o)] ?? 0) + 1));
    return c;
  }, [orders]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s/g, '');
    return (orders ?? []).filter((o) => {
      if (q) {
        const hay = `${o.order_ref}${o.customer_name}${o.customer_phone}${o.customer_whatsapp ?? ''}`.toLowerCase().replace(/\s/g, '');
        return hay.includes(q); // search ignores the tab
      }
      return tab === 'all' || bucketOf(o) === tab || sticky.has(o.id);
    });
  }, [orders, tab, query, sticky]);

  const toShipValue = (orders ?? []).filter((o) => bucketOf(o) === 'to_ship').reduce((s, o) => s + o.total_lkr, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-brand">Orders</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              load();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/8"
          >
            <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#ffe17a] p-4 text-[#3a1a27]">
          <p className="text-sm font-semibold">Waiting for receipt</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{counts.awaiting ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-[#a3d8ff] p-4 text-[#3a1a27]">
          <p className="text-sm font-semibold">Paid, ready to pack</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{counts.to_ship ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-[#8ee3c8] p-4 text-[#3a1a27]">
          <p className="text-sm font-semibold">Value of paid orders to ship</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{formatLKR(toShipValue)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0" role="tablist" aria-label="Order status">
          {BUCKETS.map((b) => (
            <button
              key={b.key}
              type="button"
              role="tab"
              aria-selected={tab === b.key && !query}
              onClick={() => {
                setTab(b.key);
                setQuery('');
                setSticky(new Set());
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === b.key && !query
                  ? 'bg-ink text-white'
                  : 'border border-line bg-surface text-ink-2 hover:border-ink hover:text-ink'
              }`}
            >
              {b.label} <span className="opacity-70">{counts[b.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFT-1001, name or phone"
          aria-label="Search orders"
          className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm lg:w-72"
        />
      </div>

      {loadError && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-danger px-4 py-3 text-sm font-semibold text-danger">
          Couldn&apos;t load orders: {loadError}
        </p>
      )}

      {orders === null ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-line" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-3">{query ? 'No orders match your search.' : 'No orders here.'}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {shown.map((o) => (
            <OrderCard
              key={o.id}
              o={o}
              now={now}
              onUpdated={(u) => {
                // Paid / refunded moves stock: show it on the shop right away
                if (u.payment_status !== o.payment_status) refreshCatalog(accessToken);
                setSticky((s) => new Set(s).add(u.id));
                setOrders((all) => all?.map((x) => (x.id === u.id ? u : x)) ?? null);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
