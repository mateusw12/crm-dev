import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value ?? 'en';
  const validLocales = ['en', 'pt'];
  const resolvedLocale = validLocales.includes(locale) ? locale : 'en';

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  };
});
