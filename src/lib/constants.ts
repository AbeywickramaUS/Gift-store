// ============================================
// Gift Store — App Constants
// ============================================

export const SITE_NAME = 'Gift Store';
export const SITE_DESCRIPTION = 'Your favourite online gift & accessories shop in Sri Lanka 🇱🇰';
export const CURRENCY = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';

/** Format a number as LKR price string */
export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Order reference prefix */
export const ORDER_REF_PREFIX = 'GIFT';

/** Social media links */
export const INSTAGRAM_URL = `https://ig.me/m/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'gift_store_lk'}`;
export const FACEBOOK_MESSENGER_URL = `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || 'giftstorelk'}`;

/** Navigation items */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Skincare', href: '/category/skincare' },
  { label: 'Accessories', href: '/category/accessories' },
  { label: 'Gift Sets', href: '/packages' },
  { label: 'Build Your Box', href: '/custom-box' },
  { label: 'Dev Blog', href: '/dev-blog' },
] as const;

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

/** No-COD notice text */
export const NO_COD_NOTICE = 
  '⚠️ Cash on Delivery (COD) is NOT available. ' +
  'Payment must be made via Bank Transfer or Online Payment before dispatch. ' +
  'After placing your order, you will receive bank details to complete your payment.';
