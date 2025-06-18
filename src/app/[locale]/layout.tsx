import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import type { LocaleLayoutProps } from '@/types/layouts';

function getMessages(locale: string) {
  return import(`@/messages/${locale}.json`).then((module) => module.default);
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const messages = getMessages(params.locale);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={params.locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}