import createMiddleware from 'next-intl/middleware';
import { pathnames } from './config';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export default createMiddleware({
  defaultLocale: 'fr',
  locales,
  pathnames,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',]
};