/**
 * /api/keep-alive — Vercel Cron Job Route
 *
 * Purpose: Ping Supabase every 5 days to prevent the free-tier
 * PostgreSQL database from pausing due to inactivity.
 *
 * Scheduled via vercel.json cron config.
 * Protected by CRON_SECRET so only Vercel can trigger it.
 */

import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Note: edge runtime is not compatible with cacheComponents (Next.js 16).
// Using default Node.js runtime instead — still lightweight for a cron endpoint.

export async function GET(request: NextRequest) {
  // Verify the request comes from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Lightweight ping: select 1 from a system table — zero egress cost
    const { error } = await supabase.from('products').select('id').limit(1);

    if (error) {
      console.error('[keep-alive] Supabase ping failed:', error.message);
      return Response.json(
        { success: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    console.log('[keep-alive] Supabase ping successful:', new Date().toISOString());
    return Response.json({
      success: true,
      message: 'Supabase keep-alive ping successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[keep-alive] Unexpected error:', err);
    return Response.json(
      { success: false, error: 'Unexpected error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
