import { ReactNode } from 'react'
import { Locale } from '@/middleware'

export interface BaseLayoutProps {
  children: ReactNode
}

export interface LocaleParams {
  locale: Locale
}

export interface LocaleLayoutProps extends BaseLayoutProps {
  params: Promise<LocaleParams>
}