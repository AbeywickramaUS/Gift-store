// ============================================
// Gift Store — Global Type Definitions
// ============================================

/** Product category types */
export type ProductCategory = 
  | 'skincare'
  | 'accessories';

/** Sub-categories for more granular filtering */
export type ProductSubCategory =
  | 'sheet-masks'
  | 'eye-masks'
  | 'lip-masks'
  | 'sleeping-masks'
  | 'foot-masks'
  | 'facial-razors'
  | 'necklaces'
  | 'earrings'
  | 'hair-clips'
  | 'everyday-essentials';

/** Package category for curated gift sets */
export type PackageCategory =
  | 'skincare-sets'
  | 'birthday-gifts'
  | 'anniversary-gifts'
  | 'everyday-essentials';

/** Media item — supports both Supabase-hosted and external URLs */
export interface MediaItem {
  type: 'image' | 'video';
  /** Full URL — either Supabase Storage public URL or external (YouTube/Cloudinary/Instagram) */
  url: string;
  /** 'supabase' | 'youtube' | 'cloudinary' | 'instagram' | 'external' */
  source: 'supabase' | 'youtube' | 'cloudinary' | 'instagram' | 'external';
  /** Alt text for images, title for videos */
  alt?: string;
  /** Thumbnail URL for video previews */
  thumbnail?: string;
}

/** Product stored in Supabase */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in LKR
  category: ProductCategory;
  sub_category: ProductSubCategory;
  /** JSONB — array of media items (images + videos) */
  media: MediaItem[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Curated gift package */
export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in LKR
  category: PackageCategory;
  /** JSONB — array of product IDs included */
  product_ids: string[];
  /** JSONB — media for the package itself */
  media: MediaItem[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Custom box item selected by customer */
export interface CustomBoxItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number; // LKR
}

/** Order stored in Supabase */
export interface Order {
  id: string;
  /** Human-readable reference e.g. #GIFT-1001 */
  order_ref: string;
  /** 'curated' | 'custom' */
  order_type: 'curated' | 'custom';
  /** Customer info */
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  /** JSONB — for curated: package details; for custom: box items */
  items: CustomBoxItem[] | { package_id: string; package_name: string };
  /** Custom box specifics (null for curated orders) */
  box_style?: string;
  gift_note?: string;
  /** Total in LKR */
  total_lkr: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

/** Dev blog entry for the /dev-blog page */
export interface DevLogEntry {
  step: number;
  title: string;
  date: string;
  filesChanged: string[];
  description: string;
  stateAndChallenges: string;
}
