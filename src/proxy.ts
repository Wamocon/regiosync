import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Handle i18n locale routing (redirects / -> /en, /de -> /de, etc.)
  const intlResponse = intlMiddleware(request);

  try {
    // Refresh Supabase session and enforce auth-guard redirects
    const supabaseResponse = await updateSession(request);

    // If Supabase issued a redirect (e.g. unauthenticated -> /login), honour it
    if (supabaseResponse.headers.get('location')) {
      return supabaseResponse;
    }

    // Carry auth cookies onto the i18n response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
  } catch (err) {
    console.error('[proxy] Supabase session update failed:', err);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|auth|api|.*\\..*).*)',
  ],
};
