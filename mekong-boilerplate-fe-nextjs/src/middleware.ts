import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from './types/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create i18n middleware with locale detection from cookie and Accept-Language
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
  localePrefix: 'always',
});

// Define public routes that support i18n (multi-language)
const publicI18nRoutes = ['/', '/docs', '/privacy', '/terms', '/about', '/contact', '/refund'];

// Define protected routes and their required roles
const protectedRoutes = [
  {
    path: '/admin',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/client',
    roles: [UserRole.MANAGER, UserRole.MEMBER, UserRole.ADMIN],
  },
];

// Define auth routes that should redirect to dashboard if user is already logged in
const authRoutes = ['/login', '/auth/verify'];

// Routes that require authentication but should not redirect based on role
const authRequiredNoRedirect = ['/auth/accept-invitation'];

/**
 * Check if the given pathname is a public i18n route
 * These routes support multi-language and should have locale prefix
 */
function isPublicI18nRoute(pathname: string): boolean {
  // Strip locale prefix if present to check against public routes
  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';
  
  return publicI18nRoutes.some(route => {
    // Exact match for root
    if (route === '/' && pathnameWithoutLocale === '/') {
      return true;
    }
    // Match route and its sub-paths
    return pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/');
  });
}

/**
 * Get locale from cookie or Accept-Language header
 * Priority: Cookie > Accept-Language > Default (en)
 */
function getPreferredLocale(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && ['en', 'vi'].includes(cookieLocale)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7")
    const languages = acceptLanguage.split(',').map(lang => {
      const [locale] = lang.trim().split(';');
      return locale.split('-')[0]; // Get base language (vi from vi-VN)
    });
    
    // Find first supported language (prioritize English)
    for (const lang of languages) {
      if (lang === 'en') return 'en';
      if (lang === 'vi') return 'vi';
    }
  }

  // Default to English
  return 'en';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a public i18n route
  const isPublicRoute = isPublicI18nRoute(pathname);
  
  // If it's a public i18n route, apply i18n middleware
  if (isPublicRoute) {
    // Let next-intl handle locale detection and routing
    const response = intlMiddleware(request);
    
    // Set cookie for locale preference if not already set
    const locale = pathname.match(/^\/(en|vi)/)?.[1] || getPreferredLocale(request);
    if (locale && response instanceof NextResponse) {
      response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }
    
    return response;
  }

  // For non-i18n routes (protected, auth), continue with auth logic
  // These routes don't have locale prefix
  
  // Check if it's a protected route
  const protectedRoute = protectedRoutes.find(route => 
    pathname.startsWith(route.path)
  );
  
  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Check if it's logout route (special handling)
  const isLogoutRoute = pathname.startsWith('/logout');

  // Check if it's accept-invitation route (special handling)
  const isAcceptInvitationRoute = authRequiredNoRedirect.some(route => 
    pathname.startsWith(route)
  );

  // Allow logout route to proceed regardless of session status
  if (isLogoutRoute) {
    console.log('[Middleware] Logout route detected, allowing access');
    return NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    });
  }

  // Get session token
  const token = await getToken({ req: request });

  // Handle accept-invitation route - require auth but no redirect
  if (isAcceptInvitationRoute) {
    if (!token) {
      console.log('[Middleware] Accept invitation route requires auth, redirecting to login');
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    // Allow access, no redirect
    console.log('[Middleware] Accept invitation route, allowing access');
    return NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    });
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && protectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If has token
  if (token) {
    // Check if this is a forced verification (email login with existing session)
    const forceVerify = request.nextUrl.searchParams.get('force_verify');

    // If on auth route (including login) and logged in, redirect to appropriate dashboard
    if (isAuthRoute && !forceVerify) {
      // Extract locale if present
      const hasLocale = /^\/(en|vi)/.test(pathname);
      const localePrefix = hasLocale ? pathname.match(/^\/(en|vi)/)![0] : '';
      
      const dashboardUrl = request.nextUrl.clone();
      if (token.role === UserRole.ADMIN) {
        // Admin dashboard doesn't have locale
        dashboardUrl.pathname = '/admin/dashboard';
        return NextResponse.redirect(dashboardUrl);
      } else {
        // Client profile doesn't have locale
        dashboardUrl.pathname = '/client/profile';
        return NextResponse.redirect(dashboardUrl);
      }
    }
    
    // If on protected route, check role
    if (protectedRoute && (!token.role || !protectedRoute.roles.includes(token.role as UserRole))) {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }
  
  // Clone the request headers and continue
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Public i18n routes (with locale prefix)
    '/',
    '/(en|vi)/:path*',
    // Protected routes (no locale)
    '/admin/:path*',
    '/client/:path*',
    // Auth routes (no locale)
    '/login',
    '/logout',
    '/auth/:path*',
    // Exclude API, static files, etc.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};