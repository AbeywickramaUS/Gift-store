import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-only Supabase client for the admin page. Keeps the admin's
 * sign-in session in localStorage. Uses the same public key as the
 * shop — what an admin can do is decided by Row-Level Security
 * (see supabase/migrations/20261113000004_admin.sql), not by this code.
 */
let client: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'gift-store-admin-auth' },
    });
  }
  return client;
}
