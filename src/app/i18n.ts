import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    notFound();
    throw new Error('Locale not found');
  }
  try {
    return {
      messages: (await import(`@/messages/${locale}.json`)).default,
      timeZone: 'Europe/Paris',
      now: new Date(),
      locale,
    };
  } catch {
    notFound();
    throw new Error('Messages not found');
  }
}); 