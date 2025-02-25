import CoffeeRecipe from '@/components/CoffeeRecipe';
import { LanguageType } from '@/types';
import { newHybridMethod } from '@/recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '@/recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '@/recipes/four-to-six-method';
import { CoffeeRecipeType } from '@/types';

const recipeMap: { [key: string]: CoffeeRecipeType } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

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
  const recipe = recipeMap[recipeId];
  return <CoffeeRecipe lang={lang} recipe={recipe} />;
}
