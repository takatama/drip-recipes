import CoffeeRecipe from '../../../../../components/CoffeeRecipe';
import { LanguageType } from '@/types';

// export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { lang: 'en', recipeId: 'new-hybrid-method' }, { lang: 'ja', recipeId: 'new-hybrid-method' },
    { lang: 'en', recipeId: 'hoffmann-better-1cup-v60' }, { lang: 'ja', recipeId: 'hoffmann-better-1cup-v60' },
    { lang: 'en', recipeId: 'four-to-six-method' }, { lang: 'ja', recipeId: 'four-to-six-method' },
  ];
}

export default async function CoffeeRecipePage({
  params,
}: {
  params: Promise<{ lang: LanguageType; recipeId: string; }>
}) {
  const lang = (await params).lang;
  const recipeId = (await params).recipeId;
  return <CoffeeRecipe lang={lang} recipeId={recipeId} />;
}
