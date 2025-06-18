import { Locale } from '@/middleware';

export interface LocaleParams {
  locale: Locale;
}

export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: LocaleParams;
}