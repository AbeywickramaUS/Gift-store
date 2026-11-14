'use client';

import { useSyncExternalStore } from 'react';
import type { BankDetails, OrderSummary } from './order-message';

/**
 * The order just placed, kept in sessionStorage so the confirmation
 * page survives a refresh or coming back from WhatsApp. Customers
 * can't read orders from the database (by design), so this is the
 * only copy in the browser.
 */
export interface LastOrder {
  order: OrderSummary;
  bank: BankDetails;
  whatsappUrl: string;
  message: string;
}

const KEY = 'gift-store-last-order';
let cache: { raw: string | null; value: LastOrder | null } = { raw: null, value: null };

function getSnapshot(): LastOrder | null {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw !== cache.raw) {
    let value: LastOrder | null = null;
    try {
      value = raw ? (JSON.parse(raw) as LastOrder) : null;
    } catch {
      value = null;
    }
    cache = { raw, value };
  }
  return cache.value;
}

export function saveLastOrder(o: LastOrder) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* ignore */
  }
}

export function useLastOrder(): LastOrder | null | undefined {
  // undefined on the server / first paint, so the page can show a loader instead of "no order"
  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    () => undefined,
  );
}
