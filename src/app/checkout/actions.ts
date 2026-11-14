'use server';

import { supabase } from '@/lib/supabase';
import { SL_MOBILE_REGEX, SRI_LANKA_DISTRICTS, whatsappLink } from '@/lib/constants';
import { buildOrderMessage, getBankDetails, type BankDetails, type OrderSummary } from '@/lib/order-message';
import type { CartOrderLine } from '@/lib/types';

export interface CheckoutInput {
  name: string;
  phone: string;
  whatsapp: string; // empty = same as phone
  email: string;
  address: string;
  city: string;
  district: string;
  giftNote: string;
  /** Honeypot — hidden field that real people leave empty */
  website: string;
  items: { type: 'product' | 'package'; id: string; quantity: number }[];
}

export type FieldErrors = Partial<Record<'name' | 'phone' | 'whatsapp' | 'email' | 'address' | 'city' | 'district' | 'giftNote', string>>;

export type CheckoutResult =
  | {
      ok: true;
      order: OrderSummary;
      bank: BankDetails;
      whatsappUrl: string;
      message: string;
    }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
/** Accept spaces/dashes people type: "077 123 4567" → "0771234567" */
const cleanPhone = (v: unknown) => str(v, 20).replace(/[\s-]/g, '');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Places a WhatsApp order. Reachable by direct POST, so everything is
 * validated here, and prices/stock/delivery are recomputed by the
 * database function create_order() — nothing from the browser is trusted.
 */
export async function placeOrder(raw: CheckoutInput): Promise<CheckoutResult> {
  // Bots fill every field; people never see this one. Pretend nothing happened.
  if (str(raw?.website, 200)) {
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  const input = {
    name: str(raw?.name, 100),
    phone: cleanPhone(raw?.phone),
    whatsapp: cleanPhone(raw?.whatsapp),
    email: str(raw?.email, 200).toLowerCase(),
    address: str(raw?.address, 300),
    city: str(raw?.city, 80),
    district: str(raw?.district, 40),
    giftNote: str(raw?.giftNote, 300),
  };

  const fieldErrors: FieldErrors = {};
  if (input.name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!SL_MOBILE_REGEX.test(input.phone)) fieldErrors.phone = 'Enter a Sri Lankan mobile number, e.g. 0771234567.';
  if (input.whatsapp && !SL_MOBILE_REGEX.test(input.whatsapp)) fieldErrors.whatsapp = 'Enter a Sri Lankan mobile number, e.g. 0771234567.';
  if (input.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) fieldErrors.email = 'That email doesn’t look right.';
  if (input.address.length < 5) fieldErrors.address = 'Please enter your delivery address.';
  if (input.city.length < 2) fieldErrors.city = 'Please enter your city / town.';
  if (!(SRI_LANKA_DISTRICTS as readonly string[]).includes(input.district)) fieldErrors.district = 'Please choose your district.';
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Please check the highlighted fields.', fieldErrors };
  }

  const items = Array.isArray(raw?.items)
    ? raw.items
        .filter((i) => i && (i.type === 'product' || i.type === 'package') && UUID.test(String(i.id)))
        .slice(0, 30)
        .map((i) => ({ type: i.type, id: String(i.id), quantity: Math.trunc(Number(i.quantity)) }))
    : [];
  if (items.length === 0) return { ok: false, error: 'Your cart is empty.' };

  const { data, error } = await supabase.rpc('create_order', {
    p_order: {
      name: input.name,
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      email: input.email || null,
      address: input.address,
      city: input.city,
      district: input.district,
      gift_note: input.giftNote || null,
      items,
    },
  });

  if (error) {
    // P0001 = our own friendly messages from create_order()
    if (error.code === 'P0001') return { ok: false, error: error.message };
    console.error('[checkout] create_order failed:', error);
    return { ok: false, error: 'We couldn’t place your order right now. Please try again or message us on WhatsApp.' };
  }

  const r = data as {
    order_ref: string;
    items: CartOrderLine[];
    subtotal: number;
    delivery_fee: number;
    total: number;
    weight_grams: number;
  };

  const order: OrderSummary = {
    orderRef: r.order_ref,
    items: r.items.map((i) => ({ ...i, unit_price: Number(i.unit_price), line_total: Number(i.line_total) })),
    subtotal: Number(r.subtotal),
    deliveryFee: Number(r.delivery_fee),
    total: Number(r.total),
    weightGrams: r.weight_grams,
    customer: {
      name: input.name,
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      email: input.email || null,
      address: input.address,
      city: input.city,
      district: input.district,
    },
    giftNote: input.giftNote || null,
  };
  const bank = getBankDetails();
  const message = buildOrderMessage(order, bank);

  return { ok: true, order, bank, message, whatsappUrl: whatsappLink(message) };
}
