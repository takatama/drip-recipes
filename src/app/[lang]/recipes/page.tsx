import RecipeList from '@/components/RecipeList';
import { LanguageType, CoffeeRecipeType } from '@/types';
import { newHybridMethod } from '@/recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '@/recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '@/recipes/four-to-six-method';
import { generateItemListJsonLd } from '@/utils/generateRecipeJsonLd';
import { Metadata } from 'next';
import { translations } from '@/translations';
import { isValidLanguage } from '@/utils/isValidLanguage';
import JsonLd from '@/components/JsonLd';

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
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const lang = (await params).lang;
  const typedLang: LanguageType = isValidLanguage(lang) ? lang : 'en';
  const { recipeListTitle, recipeListDescription } = translations[typedLang];
  
  return {
    title: recipeListTitle,
    description: recipeListDescription,
    openGraph: {
      title: recipeListTitle,
      description: recipeListDescription,
      type: 'website',
      locale: typedLang === 'en' ? 'en_US' : 'ja_JP',
    }
  };
}

export default async function RecipeListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const lang = (await params).lang;
  const typedLang: LanguageType = isValidLanguage(lang) ? lang : 'en';
  const itemListJsonLd = generateItemListJsonLd(recipes, typedLang);
  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <RecipeList lang={typedLang} recipes={recipes}/>
    </>
  );
}