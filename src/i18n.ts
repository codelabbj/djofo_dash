// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async ({locale}) => {
//   const resolvedLocale = locale ?? 'en';
//   return {
//     messages: (await import(`./messages/${resolvedLocale}.json`)).default,
//     locale: resolvedLocale
//   };
// });


import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'en';
  return {
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    locale: resolvedLocale
  };
});