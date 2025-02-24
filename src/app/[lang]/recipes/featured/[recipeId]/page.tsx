import CoffeeRecipe from '../../../../../components/CoffeeRecipe';
import { LanguageType } from '@/types';

export default async function CoffeeRecipePage({
  params,
}: {
  params: Promise<{ lang: LanguageType; recipeId: string; }>
}) {
  const lang = (await params).lang;
  const recipeId = (await params).recipeId;
  return <CoffeeRecipe lang={lang} recipeId={recipeId} />;
}
