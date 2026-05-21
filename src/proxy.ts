import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Handle i18n routing (locale redirect / locale detection)
  const intlResponse = intlMiddleware(request);

  try {
    // Handle Supabase session refresh + auth-guard redirects
    const supabaseResponse = await updateSession(request);

    // If Supabase issued a redirect (e.g. unauthenticated → /login), honour it
    if (supabaseResponse.headers.get('location')) {
      return supabaseResponse;
    }

    // Carry auth cookies onto the i18n response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
  } catch (err) {
    // Never let a Supabase error crash the entire request pipeline.
    // The page will still render; auth state is re-checked in Server Components.
    console.error('[proxy] Supabase session update failed:', err);
  }

  return intlResponse;
}

export const config = {
  // Match every path except Next.js internals, static files, and the
  // auth callback route which handles its own locale detection.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|auth|api|.*\\..*).*)']
};

