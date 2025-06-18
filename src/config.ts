const pathnamesObj = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/dashboard/content': '/dashboard/content',
  '/dashboard/media': '/dashboard/media',
  '/dashboard/settings': '/dashboard/settings',
};

export const pathnames = pathnamesObj;

export type AppPathnames = keyof typeof pathnames;