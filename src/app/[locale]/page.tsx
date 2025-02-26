import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

export const runtime = 'edge';

export default async function Home() {
  const settingsCookie = (await cookies()).get('settings');
  let lang = 'en'; // Default language is English

  if (settingsCookie) {
    try {
      const settings = JSON.parse(settingsCookie.value);
      lang = settings.language || lang;
    } catch (error) {
      console.error('Cookie parse error:', error);
    }
  } else {
    // If no settings in cookie, check Accept-Language header
    const acceptLanguage = (await headers()).get('accept-language');
    if (acceptLanguage) {
      // For example: "en-US,en;q=0.9,ja;q=0.8"
      // Split by comma semicolon, and hyphen, then get the first part
      lang = acceptLanguage.split(/,|;/)[0].split('-')[0];
    }
  }

  redirect(`/${lang}/recipes`);
}
