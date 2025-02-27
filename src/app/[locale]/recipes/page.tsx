import RecipeList from '@/components/RecipeList';
import { LanguageType, CoffeeRecipeType } from '@/types';
import { newHybridMethod } from '@/recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '@/recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '@/recipes/four-to-six-method';
import { generateItemListJsonLd } from '@/utils/generateRecipeJsonLd';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getTranslations } from 'next-intl/server';
// export const runtime = 'edge';

export const dynamicParams = false;
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }];
}

const recipeMap: { [key: string]: CoffeeRecipeType } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

const recipes = Object.values(recipeMap);

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations('RecipeList');
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
    }
  };
}

export default async function RecipeListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale as LanguageType;
  const t = await getTranslations('RecipeList');
  const itemListJsonLd = generateItemListJsonLd(recipes, locale, t('title'));
  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <RecipeList locale={locale} recipes={recipes}/>
    </>
  );
}