const pathnamesObj = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/dashboard/content': '/dashboard/content',
  '/dashboard/media': '/dashboard/media',
  '/dashboard/subscriptions': '/dashboard/subscriptions',
  '/dashboard/formations': '/dashboard/formations',
  '/dashboard/settings': '/dashboard/settings',
};

export const pathnames = pathnamesObj;

export type AppPathnames = keyof typeof pathnames;