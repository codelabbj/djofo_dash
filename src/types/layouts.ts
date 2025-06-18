import { ReactNode } from 'react'
import { Locale } from '@/middleware'

export interface RootLayoutProps {
  children: ReactNode
}

export interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: Locale
  }
}