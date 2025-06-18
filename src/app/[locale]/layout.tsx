import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/theme-provider'
import type { LocaleLayoutProps } from '@/types/layouts'

async function getMessages(locale: string) {
  try {
    const messages = await import(`@/messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to English if the locale file doesn't exist
    if (locale !== 'en') {
      try {
        const fallbackMessages = await import(`@/messages/en.json`)
        return fallbackMessages.default
      } catch (fallbackError) {
        console.error('Failed to load fallback messages', fallbackError)
        return {}
      }
    }
    return {}
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  const messages = await getMessages(locale)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}