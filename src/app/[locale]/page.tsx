import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export const runtime = 'edge';

export default async function Home() {
  const locale = await getLocale();

  redirect(`/${locale}/recipes`);
}