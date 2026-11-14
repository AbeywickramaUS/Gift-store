// ============================================
// Gift Store — App Constants
// ============================================

export const SITE_NAME = 'GIFMIRA';
export const TAGLINE = 'Little Gifts, Big Smiles.';
export const SHORT_LINE = 'Beauty · Accessories · Gifts';
export const SITE_DESCRIPTION = 'Shop K-beauty treats, cute accessories and ready-to-gift boxes at GIFMIRA Sri Lanka. Thoughtfully picked, beautifully wrapped and delivered islandwide.';
export const CURRENCY = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';

/** Format a number as LKR price string */
export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Order reference prefix */
export const ORDER_REF_PREFIX = 'GIFT';

/**
 * WhatsApp number that receives orders, in international format without "+"
 * (e.g. 94771234567). PLACEHOLDER until NEXT_PUBLIC_WHATSAPP_NUMBER is set.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94770000000').replace(/\D/g, '');

/**
 * WhatsApp chat link, optionally with a pre-filled message.
 * Uses api.whatsapp.com directly: the wa.me short link redirects and
 * re-encodes the text, which turns emoji into "�".
 */
export function whatsappLink(text?: string): string {
  return whatsappLinkTo(WHATSAPP_NUMBER, text);
}

/** "0771234567" / "+94771234567" → "94771234567" */
export function toWhatsappNumber(slMobile: string): string {
  const digits = slMobile.replace(/\D/g, '');
  return digits.startsWith('0') ? `94${digits.slice(1)}` : digits;
}

/** Chat link to any number (used by the admin page to message customers) */
export function whatsappLinkTo(number: string, text?: string): string {
  const params = new URLSearchParams({ phone: toWhatsappNumber(number) });
  if (text) params.set('text', text);
  return `https://api.whatsapp.com/send?${params.toString().replace(/\+/g, '%20')}`;
}

/** Social media (follow links — orders go through WhatsApp) */
export const INSTAGRAM_URL = `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'gifmira'}`;
export const FACEBOOK_URL = `https://facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || 'gifmira'}`;

/** Sri Lanka's 25 districts, for the delivery address */
export const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
] as const;

/** Sri Lankan mobile: 07XXXXXXXX or +947XXXXXXXX (same rule as the database) */
export const SL_MOBILE_REGEX = /^(\+94|0)7[0-9]{8}$/;

/** Max of one item per order line (same limit as the database) */
export const MAX_QTY_PER_ITEM = 20;

/** Navigation items */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Skincare', href: '/category/skincare' },
  { label: 'Accessories', href: '/category/accessories' },
  { label: 'Gift Sets', href: '/packages' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Order Help', href: '/order-help' },
] as const;

/** Brand collection architecture (GIFMIRA brand kit) */
export const COLLECTIONS = [
  { key: 'glow', name: 'Glow', line: 'Skincare & masks', href: '/category/skincare', art: { slug: 'aloe-vera-sheet-mask', kind: 'sheet-masks' } },
  { key: 'charms', name: 'Charms', line: 'Jewellery & hair accessories', href: '/category/accessories', art: { slug: 'pearl-drop-necklace', kind: 'necklaces' } },
  { key: 'moments', name: 'Moments', line: 'Ready-to-gift sets', href: '/packages', art: { slug: 'birthday-girl-box', kind: 'birthday-gifts', isPackage: true } },
  { key: 'minis', name: 'Minis', line: 'Little treats under Rs. 500', href: '/minis', art: { slug: 'cherry-lip-patch', kind: 'lip-masks' } },
] as const;

/** Minis collection: in-stock treats at or under this price */
export const MINIS_MAX_PRICE = 500;

/** Category display names */
export const CATEGORY_LABELS: Record<string, string> = {
  skincare: 'Skincare & Beauty',
  accessories: 'Fashion & Accessories',
  'sheet-masks': 'Sheet Masks',
  'eye-masks': 'Eye Masks',
  'lip-masks': 'Lip Masks',
  'sleeping-masks': 'Sleeping Masks',
  'foot-masks': 'Foot Masks',
  'facial-razors': 'Facial Razors',
  necklaces: 'Fancy Necklaces',
  earrings: 'Earrings',
  'hair-clips': 'Hair Clips',
  'everyday-essentials': 'Everyday Essentials',
  'skincare-sets': 'Skincare Sets',
  'birthday-gifts': 'Birthday Gifts',
  'anniversary-gifts': 'Anniversary Gifts',
};

/** Shop categories and their sub-categories (order = display order) */
export const SHOP_CATEGORIES = {
  skincare: {
    label: 'Skincare',
    collection: 'Glow',
    blurb: 'Sheet masks, eye patches, lip and sleeping masks: hand-picked K-beauty treats for a little glow.',
    subCategories: ['sheet-masks', 'eye-masks', 'lip-masks', 'sleeping-masks', 'foot-masks', 'facial-razors'],
  },
  accessories: {
    label: 'Accessories',
    collection: 'Charms',
    blurb: 'Dainty necklaces, earrings, hair clips and everyday charms to wear, keep or give.',
    subCategories: ['necklaces', 'earrings', 'hair-clips', 'everyday-essentials'],
  },
} as const;

/** No-COD notice text */
export const NO_COD_NOTICE =
  'No Cash on Delivery. Every order is paid by bank transfer before dispatch. ' +
  'After ordering you get an Order ID and our bank details; send your transfer receipt on WhatsApp.';
