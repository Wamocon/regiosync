import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle i18n locale routing (redirect / to /en, etc.)
  const intlResponse = intlMiddleware(request);

  try {
    // Refresh Supabase session + enforce auth-guard redirects
    const supabaseResponse = await updateSession(request);

    // If Supabase issued a redirect (unauthenticated → /login), honour it
    if (supabaseResponse.headers.get('location')) {
      return supabaseResponse;
    }

    // Carry auth cookies onto the i18n response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
  } catch (err) {
    // Never let a Supabase error crash the entire request pipeline.
    // Pages still render; auth state is re-checked in Server Components.
    console.error('[middleware] Supabase session update failed:', err);
  }

  return intlResponse;
}

export const config = {
  // Match every path except Next.js internals, static assets, and the
  // Supabase auth-callback route which handles its own locale detection.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|auth|api|.*\\..*).*)']
};
