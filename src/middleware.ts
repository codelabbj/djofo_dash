import createMiddleware from 'next-intl/middleware';

export type Locale = 'en' | 'fr';

export default createMiddleware({
  locales: ['en', 'fr'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)',]
};