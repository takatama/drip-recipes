import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import RecipeDescription from './RecipeDescription';
import { CoffeeRecipeType, LanguageType } from '../types';
import CoffeeTimer from './CoffeeTimer';

interface CoffeeRecipeProps {
  lang: LanguageType;
  recipe: CoffeeRecipeType;
}

const CoffeeRecipe: React.FC<CoffeeRecipeProps> = ({ lang, recipe }) => {
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
      <Header language={lang} pathname={`/${lang}/recipes/featured/${recipe.id}`} />

      <Typography variant="h5" align="center" gutterBottom>
        {recipe.name[lang]}
      </Typography>

      <RecipeDescription recipe={recipe} language={lang} />

      <Typography variant="body1" align="center" gutterBottom>
        {recipe.equipments[lang]}
      </Typography>

      <CoffeeTimer recipe={recipe} language={lang} />

      <Footer />
    </Container>
  );
};

export default CoffeeRecipe;