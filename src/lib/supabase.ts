import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please copy .env.example to .env.local and fill in your Supabase credentials.'
  );
}

/**
 * Supabase client for browser/client-side usage.
 * Uses the anon (public) key — safe to expose in the browser.
 * Row-Level Security (RLS) policies protect data server-side.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper: Get a public URL for a file in a Supabase Storage bucket.
 * Used for product images and short videos stored in Supabase.
 */
export function getStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
