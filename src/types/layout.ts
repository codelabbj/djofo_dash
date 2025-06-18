import type { Locale } from '@/middleware';

export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}