import createMiddleware from 'next-intl/middleware'
import { pathnames } from './config'
import { NextRequest, NextResponse } from 'next/server'

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname.includes('/login');
  const accessToken = request.cookies.get('accessToken');
  
  // If user is not authenticated and not on login page, redirect to login
  if (!accessToken && !isLoginPage) {
    // Extract locale from pathname or use default
    const pathSegments = pathname.split('/').filter(Boolean);
    const detectedLocale = pathSegments[0];
    const locale = locales.includes(detectedLocale as Locale) ? detectedLocale : 'fr';
    
    // Create absolute URL for redirect
    const baseUrl = request.nextUrl.origin;
    const loginUrl = `${baseUrl}/${locale}/login`;
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Continue with next-intl middleware
  return createMiddleware({
    defaultLocale: 'fr',
    locales,
    pathnames,
    localePrefix: 'always',
  })(request);
}

export default middleware

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}