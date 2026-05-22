import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Health check endpoint to diagnose production Supabase connectivity.
 * GET /api/debug/health
 *
 * Returns env var presence and Supabase auth status without exposing secrets.
 * REMOVE THIS ROUTE after diagnosing the production issue.
 */
export async function GET() {
  const info: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    node_version: process.version,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `set (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...)`
        : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `set (length=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length})`
        : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? `set (length=${process.env.SUPABASE_SERVICE_ROLE_KEY.length})`
        : 'MISSING',
      SUPABASE_DB_SCHEMA: process.env.SUPABASE_DB_SCHEMA ?? 'not set',
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    info.supabase = {
      status: 'ok',
      user: data.user ? `logged in (${data.user.id.substring(0, 8)}...)` : 'not authenticated',
      error: error?.message ?? null,
    };
  } catch (err) {
    info.supabase = {
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return NextResponse.json(info);
}
