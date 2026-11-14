import type { CartOrderLine } from './types';
import { formatLKR } from './constants';
import { formatWeight } from './delivery';

export interface BankDetails {
  bank: string;
  branch: string;
  accountName: string;
  accountNumber: string;
}

/**
 * Bank account customers transfer to. Server-only env vars;
 * PLACEHOLDERS until they are set in .env.local / Vercel.
 */
export function getBankDetails(): BankDetails {
  return {
    bank: process.env.BANK_NAME || 'YOUR BANK NAME',
    branch: process.env.BANK_BRANCH || 'YOUR BRANCH',
    accountName: process.env.BANK_ACCOUNT_NAME || 'YOUR ACCOUNT NAME',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '0000000000',
  };
}

export interface OrderSummary {
  orderRef: string;
  items: CartOrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  weightGrams: number;
  customer: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string | null;
    address: string;
    city: string;
    district: string;
  };
  giftNote: string | null;
}

/** The pre-filled WhatsApp message the customer sends to the shop. */
export function buildOrderMessage(o: OrderSummary, bank: BankDetails): string {
  const lines = [
    `🎁 *New Order — ${o.orderRef}*`,
    '',
    '*Items*',
    ...o.items.map((i) => `• ${i.quantity} × ${i.name} — ${formatLKR(Number(i.line_total))}`),
    '',
    `Subtotal: ${formatLKR(o.subtotal)}`,
    `Delivery (${formatWeight(o.weightGrams)}): ${formatLKR(o.deliveryFee)}`,
    `*Total to pay: ${formatLKR(o.total)}*`,
    '',
    '*Deliver to*',
    o.customer.name,
    o.customer.address,
    `${o.customer.city}, ${o.customer.district} District`,
    `📞 ${o.customer.phone}`,
    ...(o.customer.whatsapp !== o.customer.phone ? [`💬 WhatsApp: ${o.customer.whatsapp}`] : []),
    ...(o.customer.email ? [`✉️ ${o.customer.email}`] : []),
    ...(o.giftNote ? ['', `💌 Gift note: "${o.giftNote}"`] : []),
    '',
    `*Payment:* bank transfer to ${bank.bank} (${bank.branch}), ${bank.accountName}, A/C ${bank.accountNumber}`,
    `I'll send the transfer receipt here. Reference: ${o.orderRef}`,
  ];
  return lines.join('\n');
}
