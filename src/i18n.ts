// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async ({locale}) => {
//   const resolvedLocale = locale ?? 'en';
//   return {
//     messages: (await import(`./messages/${resolvedLocale}.json`)).default,
//     locale: resolvedLocale
//   };
// });


import { getRequestConfig } from 'next-intl/server'
import { locales, type Locale } from './middleware'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  let resolvedLocale: string = 'fr' // Default to French
  if (locale && locales.includes(locale as Locale)) {
    resolvedLocale = locale
  }

  try {
    const messages = (await import(`./messages/${resolvedLocale}.json`)).default
    return {
      messages,
      locale: resolvedLocale,
      timeZone: 'Africa/Porto-Novo'
    }
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${resolvedLocale}`, error)
    
    // Fallback to English if the locale file doesn't exist
    if (resolvedLocale !== 'en') {
      try {
        const fallbackMessages = (await import(`./messages/en.json`)).default
        return {
          messages: fallbackMessages,
          locale: 'en',
          timeZone: 'Africa/Porto-Novo'
        }
      } catch (fallbackError) {
        console.error('Failed to load fallback messages', fallbackError)
        return {
          messages: {},
          locale: 'en',
          timeZone: 'Africa/Porto-Novo'
        }
      }
    }
    
    return {
      messages: {},
      locale: 'en',
      timeZone: 'Africa/Porto-Novo'
    }
  }
})