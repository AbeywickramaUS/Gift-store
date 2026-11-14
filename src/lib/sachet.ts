// ============================================
// Sachet colours — every sub-category / gift-set type owns one packet
// colour and an ink that reads on it (all pairs ≥ 4.5:1).
// ============================================

export interface SachetColour {
  bg: string;
  ink: string;
  /** Short label printed on the packet */
  label: string;
}

const INK = '#2a1b3d';
const WHITE = '#ffffff';

export const SACHET: Record<string, SachetColour> = {
  // Skincare
  'sheet-masks': { bg: '#8ee3c8', ink: INK, label: 'Sheet mask' },
  'eye-masks': { bg: '#c9b8ff', ink: INK, label: 'Eye patch' },
  'lip-masks': { bg: '#ff9db4', ink: INK, label: 'Lip care' },
  'sleeping-masks': { bg: '#3a3f8f', ink: WHITE, label: 'Sleeping mask' },
  'foot-masks': { bg: '#ffe17a', ink: INK, label: 'Foot mask' },
  'facial-razors': { bg: '#a3d8ff', ink: INK, label: 'Razor' },
  // Accessories
  necklaces: { bg: '#ffbb8c', ink: INK, label: 'Necklace' },
  earrings: { bg: '#f3abe6', ink: INK, label: 'Earrings' },
  'hair-clips': { bg: '#ff6f7e', ink: INK, label: 'Hair clips' },
  'everyday-essentials': { bg: '#c8e48c', ink: INK, label: 'Everyday' },
  // Gift sets
  'skincare-sets': { bg: '#1f8a78', ink: WHITE, label: 'Skincare set' },
  'birthday-gifts': { bg: '#e2337a', ink: WHITE, label: 'Birthday set' },
  'anniversary-gifts': { bg: '#a3203f', ink: WHITE, label: 'Anniversary' },
};

export const DEFAULT_SACHET: SachetColour = { bg: '#d8d6e6', ink: INK, label: 'Treat' };

export function sachetFor(kind: string, isPackage = false): SachetColour {
  // 'everyday-essentials' is both a sub-category and a gift-set type
  if (isPackage && kind === 'everyday-essentials') return { bg: '#5b7f1d', ink: WHITE, label: 'Everyday set' };
  return SACHET[kind] ?? DEFAULT_SACHET;
}

/** "Collagen Gold Eye Patches (5 pairs)" → ["Collagen Gold Eye Patches", "5 pairs"] */
export function splitName(name: string): [string, string | null] {
  const m = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? [m[1], m[2]] : [name, null];
}
