import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CoffeeRecipe, LanguageType } from '../types';
import { translations } from '../translations';
import Header from './Header';
import Footer from './Footer';
import Container from '@mui/material/Container';

interface RecipeListProps {
  recipes: CoffeeRecipe[];
  lang: LanguageType;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, lang }) => {
  const t = translations[lang];

  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header language={lang} t={t} pathname={`/${lang}/recipes`}/>

      <Grid container spacing={3} sx={{ p: 2, mb: 2 }}>
        {recipes.map((recipe) => (
          <Grid size={{ xs: 12, sm: 6 }} key={recipe.id}>
            <Link href={`/${lang}/recipes/featured/${recipe.id}`}
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
                  image={`https://img.youtube.com/vi/${recipe.youTubeVideoId}/maxresdefault.jpg`}
                  alt={recipe.name[lang]}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {recipe.name[lang]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.description[lang]}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Footer t={t} />
    </Container>
  );
};

export default RecipeList;