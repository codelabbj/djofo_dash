import { Pathnames } from 'next-intl/navigation';

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/dashboard/content': '/dashboard/content',
  '/dashboard/media': '/dashboard/media',
  '/dashboard/settings': '/dashboard/settings',
} satisfies Pathnames<typeof pathnames>;

export type AppPathnames = keyof typeof pathnames;