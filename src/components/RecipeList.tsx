import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { CoffeeRecipe } from '../types';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../translations';
import Header from './Header';
import Footer from './Footer';
import Container from '@mui/material/Container';

interface RecipeListProps {
  recipes: CoffeeRecipe[];
  lang: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, lang }) => {
  const { language } = useSettings();
  const t = translations[language];
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header language={language} t={t} pathname={`/${language}/recipes`}/>

      <Grid container spacing={3} sx={{ p: 2, mb: 2 }}>
        {recipes.map((recipe) => (
          <Grid size={{ xs: 12, sm: 6 }} key={recipe.id}>
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
              onClick={() => 
                router.push(`/${language}/recipes/featured/${recipe.id}`)
              }
            >
              <CardMedia
                component="img"
                height="180"
                image={`https://img.youtube.com/vi/${recipe.youTubeVideoId}/maxresdefault.jpg`}
                alt={recipe.name[language]}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {recipe.name[language]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recipe.description[language]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Footer t={t} />
    </Container>
  );
};

export default RecipeList;