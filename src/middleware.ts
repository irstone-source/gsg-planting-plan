import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Whitelist of allowed email addresses
const ALLOWED_EMAILS = [
  'ian@cambraydesigndesign.co.uk',
  'ian@cambraydesign.co.uk' // In case of typo in original
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/callback',
  '/auth/error',
  '/_next',
  '/favicon.ico',
  '/api/webhooks/stripe' // Stripe webhooks must be public
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // No user - redirect to login
  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // User logged in but email not whitelisted
  if (!ALLOWED_EMAILS.includes(user.email || '')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/error';
    redirectUrl.searchParams.set('message', 'Access restricted. Contact ian@cambraydesigndesign.co.uk for access.');
    return NextResponse.redirect(redirectUrl);
  }

  // User is whitelisted - allow access
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
