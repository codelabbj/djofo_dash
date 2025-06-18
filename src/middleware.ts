import createMiddleware from 'next-intl/middleware';

export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[number];

export default createMiddleware({
  locales: locales,
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)',]
};