'use client';

import { useParams } from 'next/navigation';
import RecipeList from '../../../components/RecipeList';
import { newHybridMethod } from '../../../recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '../../../recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '../../../recipes/four-to-six-method';

const recipeMap: { [key: string]: any } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

const recipes = Object.values(recipeMap);

export default function RecipeListPage() {
  const params = useParams();
  const { lang } = params;

  return <RecipeList recipes={recipes} lang={String(lang)} />;
}
