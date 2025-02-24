import RecipeList from '../../../components/RecipeList';
import { LanguageType } from '../../../types';

export const runtime = 'edge';

// export const dynamicParams = false;
// export async function generateStaticParams() {
//   return [{ lang: 'en' }, { lang: 'ja' }];
// }

export default async function RecipeListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const lang = (await params).lang;
  const validLang = ['en', 'ja'].includes(lang) ? lang : 'en';
  return <RecipeList lang={validLang as LanguageType} />;
}