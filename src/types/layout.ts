import type { Locale } from '@/middleware';

export interface LocaleLayoutParams {
  locale: Locale;
}

export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: LocaleLayoutParams;
}