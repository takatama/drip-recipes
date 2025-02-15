import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import { CoffeeRecipe } from '../types';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../translations';

interface RecipeListProps {
  recipes: CoffeeRecipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const { language } = useSettings();
  const t = translations[language];
  const navigate = useNavigate();

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {recipes.map((recipe) => (
        <Grid size={{xs: 12, sm: 6}} key={recipe.id}>
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
            onClick={() => navigate(`/${language}/recipes/featured/${recipe.id}`)}
          >
            <CardMedia
              component="img"
              height="180"
              image={getYouTubeThumbnail(recipe.youTubeEmbedUrl)}
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
  );
};

export default RecipeList;