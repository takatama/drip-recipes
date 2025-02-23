'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CoffeeRecipe from '../../../../../components/CoffeeRecipe';
import { newHybridMethod } from '../../../../../recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '../../../../../recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '../../../../../recipes/four-to-six-method';

const recipeMap: { [key: string]: any } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

export default function CoffeeRecipePage() {
  const params = useParams();
  const router = useRouter();
  const { lang, recipeId } = params;

  const recipe = recipeId ? recipeMap[String(recipeId)] : undefined;

  useEffect(() => {
    if (!recipe) {
      router.replace(`/${lang}/recipes`);
    }
  }, [recipe, lang, router]);

  if (!recipe) {
    return null; // リダイレクト中は何も描画しない
  }

  return <CoffeeRecipe recipe={recipe} />;
}
