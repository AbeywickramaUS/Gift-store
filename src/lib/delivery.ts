// ============================================
// Delivery fee — PLACEHOLDER RULE
//
// Rs. 500 up to 1 kg, then + Rs. 100 for every extra kg
// (or part of one). The database function public.delivery_fee()
// is the source of truth for the final order; this copy only
// powers the cart preview. Change BOTH together.
// ============================================

export const DELIVERY_BASE_FEE = 500;
export const DELIVERY_BASE_WEIGHT_GRAMS = 1000;
export const DELIVERY_EXTRA_PER_KG = 100; // placeholder — confirm with your courier

export function deliveryFee(weightGrams: number): number {
  const extraKg = Math.max(0, Math.ceil((weightGrams - DELIVERY_BASE_WEIGHT_GRAMS) / 1000));
  return DELIVERY_BASE_FEE + DELIVERY_EXTRA_PER_KG * extraKg;
}

export function formatWeight(grams: number): string {
  return grams >= 1000 ? `${(grams / 1000).toFixed(2).replace(/\.?0+$/, '')} kg` : `${grams} g`;
}
