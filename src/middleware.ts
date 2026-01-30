import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);
  const refCode = searchParams.get('ref');

  // If there's a ref parameter, set affiliate cookie and track click
  if (refCode) {
    const response = NextResponse.next();

    // Set 30-day cookie for attribution
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    response.cookies.set('affiliate_ref', refCode, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Track click asynchronously (fire and forget)
    trackAffiliateClick(refCode, request);

    return response;
  }

  return NextResponse.next();
}

/**
 * Track affiliate click in background
 * Fire-and-forget - don't block the request
 */
async function trackAffiliateClick(refCode: string, request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Call tracking API asynchronously
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/affiliates/track-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateCode: refCode,
        ipAddress: ip,
        userAgent,
      }),
    }).catch((err) => {
      console.warn('Failed to track affiliate click:', err);
    });
  } catch (error) {
    console.warn('Affiliate tracking error:', error);
    // Don't throw - tracking failures shouldn't break the user experience
  }
}
