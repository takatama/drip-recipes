import CoffeeRecipe from '@/components/CoffeeRecipe';
import { LanguageType } from '@/types';
import { newHybridMethod } from '@/recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '@/recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '@/recipes/four-to-six-method';
import { CoffeeRecipeType } from '@/types';
import { generateRecipeJsonLd } from '@/utils/generateRecipeJsonLd';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { setRequestLocale } from 'next-intl/server';

// Generate metadata including JSON-LD
export async function generateMetadata({ params }: { 
  params: Promise<{ locale: string; recipeId: string; }> 
}): Promise<Metadata> {
  const locale = (await params).locale as LanguageType;
  setRequestLocale(locale);
  const recipeId = (await params).recipeId;
  const recipe = recipeMap[recipeId];
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found'
    };
  }
  
  return {
    title: recipe.name[locale],
    description: recipe.description[locale],
    openGraph: {
      title: recipe.name[locale],
      description: recipe.description[locale],
      images: recipe.imageUrl ? [recipe.imageUrl] : [],
      type: 'article',
    },
  };
}

const recipeMap: { [key: string]: CoffeeRecipeType } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

export const dynamicParams = false;
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
  params: Promise<{ locale: string; recipeId: string; }>
}) {
  const locale = (await params).locale as LanguageType;
  setRequestLocale(locale);
  const recipeId = (await params).recipeId;
  const recipe = recipeMap[recipeId];
  return (
    <>
      <JsonLd data={generateRecipeJsonLd(recipe, locale)} />
      <CoffeeRecipe locale={locale} recipe={recipe} />
    </>
  );
}
