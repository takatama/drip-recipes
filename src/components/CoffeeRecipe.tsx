import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import RecipeDescription from './RecipeDescription';
import { translations } from '../translations';
import { CoffeeRecipeType, LanguageType } from '../types';
import CoffeeCalculator from './CoffeeCalculator';

interface CoffeeRecipeProps {
  lang: LanguageType;
  recipe: CoffeeRecipeType;
}

const CoffeeRecipe: React.FC<CoffeeRecipeProps> = ({ lang, recipe }) => {
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

      <CoffeeCalculator recipe={recipe} t={t} language={lang} />

      <Footer t={t} />
    </Container>
  );
};

export default CoffeeRecipe;