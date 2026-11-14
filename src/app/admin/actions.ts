'use server';

import { updateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

/**
 * Makes catalogue edits (photos, prices, stock) show on the shop
 * immediately instead of after the few-minute cache window.
 *
 * Reachable by direct POST, so it checks the caller is a signed-in
 * admin (their access token + is_admin() in the database) first.
 */
export async function refreshCatalog(accessToken: string): Promise<{ ok: boolean }> {
  if (typeof accessToken !== 'string' || accessToken.length < 20 || accessToken.length > 4096) return { ok: false };

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc('is_admin');
  if (error || data !== true) return { ok: false };

  updateTag('catalog');
  return { ok: true };
}
