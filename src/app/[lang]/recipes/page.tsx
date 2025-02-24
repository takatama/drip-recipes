import RecipeList from '../../../components/RecipeList';
import { newHybridMethod } from '../../../recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '../../../recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '../../../recipes/four-to-six-method';
import { CoffeeRecipeType, LanguageType } from '@/types';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }];
}

const recipeMap: { [key: string]: CoffeeRecipeType } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

const recipes = Object.values(recipeMap);

export default async function RecipeListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const lang = (await params).lang;
  const validLang = ['en', 'ja'].includes(lang) ? lang : 'en';
  return <RecipeList recipes={recipes} lang={validLang as LanguageType} />;
}