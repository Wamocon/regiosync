import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // First handle i18n routing
  const intlResponse = intlMiddleware(request);
  
  // Then handle Supabase session
  const supabaseResponse = await updateSession(request);
  
  // If supabase redirected, use that
  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse;
  }

  // Copy supabase cookies to intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(de|en)/:path*']
};
