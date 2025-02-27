import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import RecipeDescription from './RecipeDescription';
import { CoffeeRecipeType, LanguageType } from '../types';
import CoffeeTimer from './CoffeeTimer';

interface CoffeeRecipeProps {
  locale: LanguageType;
  recipe: CoffeeRecipeType;
}

const CoffeeRecipe: React.FC<CoffeeRecipeProps> = ({ locale, recipe }) => {
  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  
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
      <Header locale={locale} pathname={`/${locale}/recipes/featured/${recipe.id}`} />

      <Typography variant="h5" align="center" gutterBottom>
        {recipe.name[locale]}
      </Typography>

      <RecipeDescription locale={locale} recipe={recipe} />

      <Typography variant="body1" align="center" gutterBottom>
        {recipe.equipments[locale]}
      </Typography>

      <CoffeeTimer recipe={recipe} locale={locale} />

      <Footer />
    </Container>
  );
};

export default CoffeeRecipe;