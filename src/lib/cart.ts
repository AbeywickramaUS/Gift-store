'use client';

import { useSyncExternalStore } from 'react';
import { MAX_QTY_PER_ITEM } from './constants';

// ============================================
// Shopping cart — kept in the browser (localStorage).
//
// Prices here are for DISPLAY only. When the order is placed the
// database re-prices every line (create_order), so an edited
// localStorage can't change what the customer pays.
// ============================================

export interface CartLine {
  type: 'product' | 'package';
  id: string;
  slug: string;
  name: string;
  price: number;
  weightGrams: number;
  /** Sub-category / gift-set type, for the packet colour in the bag */
  kind?: string;
  /** Stock when added — caps the quantity picker */
  maxQty: number;
  quantity: number;
}

const STORAGE_KEY = 'gift-store-cart-v1';
const EMPTY: CartLine[] = [];
let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function load(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l && typeof l.id === 'string' && l.quantity > 0) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): CartLine[] {
  if (cache === null) cache = load();
  return cache;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function write(next: CartLine[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full / blocked — cart still works for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = load();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const addListeners = new Set<() => void>();
/** Fires only when something is added (not on load, remove or quantity edits). */
export function onCartAdd(listener: () => void) {
  addListeners.add(listener);
  return () => {
    addListeners.delete(listener);
  };
}

const clampQty = (q: number, max: number) => Math.max(1, Math.min(q, max, MAX_QTY_PER_ITEM));

export const cart = {
  add(line: Omit<CartLine, 'quantity'>, quantity = 1) {
    const lines = getSnapshot();
    const existing = lines.find((l) => l.id === line.id && l.type === line.type);
    if (existing) {
      write(lines.map((l) => (l === existing ? { ...l, ...line, quantity: clampQty(l.quantity + quantity, line.maxQty) } : l)));
    } else {
      write([...lines, { ...line, quantity: clampQty(quantity, line.maxQty) }]);
    }
    addListeners.forEach((l) => l());
  },
  setQuantity(id: string, quantity: number) {
    write(getSnapshot().map((l) => (l.id === id ? { ...l, quantity: clampQty(quantity, l.maxQty) } : l)));
  },
  remove(id: string) {
    write(getSnapshot().filter((l) => l.id !== id));
  },
  clear() {
    write([]);
  },
};

/** Live cart lines. Empty during server render and the first client render. */
export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartTotals(lines: CartLine[]) {
  return lines.reduce(
    (t, l) => ({
      count: t.count + l.quantity,
      subtotal: t.subtotal + l.price * l.quantity,
      weightGrams: t.weightGrams + l.weightGrams * l.quantity,
    }),
    { count: 0, subtotal: 0, weightGrams: 0 },
  );
}
