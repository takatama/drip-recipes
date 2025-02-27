import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CoffeeRecipeType, LanguageType } from '../types';
import Header from './Header';
import Footer from './Footer';
import Container from '@mui/material/Container';

interface RecipeListProps {
  locale: LanguageType;
  recipes: CoffeeRecipeType[];
}

const RecipeList: React.FC<RecipeListProps> = ({ locale, recipes }) => {
  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header locale={locale} pathname={`/${locale}/recipes`}/>

      <Grid container spacing={3} sx={{ p: 2, mb: 2 }}>
        {recipes.map((recipe) => (
          <Grid size={{ xs: 12, sm: 6 }} key={recipe.id}>
            <Link href={`/${locale}/recipes/featured/${recipe.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={recipe.imageUrl}
                  alt={recipe.name[locale]}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {recipe.name[locale]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.description[locale]}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </Container>
  );
};

export default RecipeList;