import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Extract locale from path
  const pathnameSegments = pathname.split('/');
  const locale = pathnameSegments[1];
  const pathWithoutLocale = '/' + pathnameSegments.slice(2).join('/');

  // Public routes that don't require auth
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/pricing', '/help', '/imprint', '/privacy', '/terms'];
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale === '';

  // If user is not logged in and trying to access a protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access login/register
  if (user && (pathWithoutLocale === '/login' || pathWithoutLocale === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
