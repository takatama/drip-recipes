import React from 'react';
import { Typography, Accordion, AccordionSummary, Box } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { TranslationType } from '../types';

type Props = {
  t: TranslationType;
};

const RecipeDescription: React.FC<Props> = ({ t }) => {
  return (
    <Accordion
      square
      disableGutters
      variant='outlined'
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        margin: 2
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant='body2'>{t.recipeTitle}</Typography>
      </AccordionSummary>
      <AccordionSummary>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='body2'>{t.recipeDescription}</Typography>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
            }}
          >
            <iframe
              src={t.recipeYouTubeEmbedUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Recipe Video"
            />
          </Box>
        </Box>
      </AccordionSummary>
    </Accordion>
  );
};

export default RecipeDescription;
