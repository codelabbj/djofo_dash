import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export type Locale = 'en' | 'fr';

// Add type safety to the middleware
const middleware = createMiddleware({
  locales: ['en', 'fr'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always'
});

export default function (request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)',]
};