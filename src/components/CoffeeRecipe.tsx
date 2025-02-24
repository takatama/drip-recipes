import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import RecipeDescription from './RecipeDescription';
import { translations } from '../translations';
import { CoffeeRecipe as CoffeeRecipeType, LanguageType } from '../types';
import CoffeeTimer from './CoffeeTimer';
import { newHybridMethod } from '../recipes/new-hybird-method';
import { hoffmannBetter1CupV60 } from '../recipes/hoffmann-better-1cup-v60';
import { fourToSixMethod } from '../recipes/four-to-six-method';

interface CoffeeRecipeProps {
  recipeId: string;
  lang: LanguageType;
}

const recipeMap: { [key: string]: any } = {
  'new-hybrid-method': newHybridMethod,
  'hoffmann-better-1cup-v60': hoffmannBetter1CupV60,
  'four-to-six-method': fourToSixMethod,
};

const CoffeeRecipe: React.FC<CoffeeRecipeProps> = ({ recipeId, lang }) => {
  const recipe = recipeMap[recipeId] as CoffeeRecipeType;

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const t = translations[lang];

  return (
    <Container
      maxWidth="sm"
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        py: 2,
        width: '100%',
      }}
    >
      <Header language={lang} t={t} pathname={`/${lang}/recipes/featured/${recipe.id}`} />

      <Typography variant="h5" align="center" gutterBottom>
        {recipe.name[lang]}
      </Typography>

      <RecipeDescription recipe={recipe} language={lang} t={t} />

      <Typography variant="body1" align="center" gutterBottom>
        {recipe.equipments[lang]}
      </Typography>

      <CoffeeTimer recipe={recipe} t={t} language={lang} />

      <Footer t={t} />
    </Container>
  );
};

export default CoffeeRecipe;