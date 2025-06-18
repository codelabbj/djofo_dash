import createMiddleware from 'next-intl/middleware'
import { pathnames } from './config'

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

const middleware = createMiddleware({
  defaultLocale: 'fr',
  locales,
  pathnames,
  localePrefix: 'always'
})

export default middleware

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}