import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Timeline from './Timeline';
import Footer from './Footer';
import RecipeDescription from './RecipeDescription';
import InputParams from './InputParams';
import { Step } from '../types';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../translations';
import { CoffeeRecipe as CoffeeRecipeType } from '../types';

interface CoffeeRecipeProps {
  recipe: CoffeeRecipeType;
}

const CoffeeRecipe: React.FC<CoffeeRecipeProps> = ({ recipe }) => {
  const { darkMode, language } = useSettings();
  const t = translations[language];
  const { lang } = useParams();
  const navigate = useNavigate();
  const [beansAmount, setBeansAmount] = useState(20);
  const [flavor, setFlavor] = useState('neutral');
  const [steps, setSteps] = useState<Step[]>([]);
  const [roastLevel, setRoastLevel] = useState('mediumRoast');
  const [strength, setStrength] = useState('medium');

  useEffect(() => {
    if (lang && lang !== language) {
      const pathParts = window.location.pathname.split('/');
      pathParts[1] = language;
      navigate(pathParts.join('/'), { replace: true });
    }
  }, [lang, language, navigate]);

  useEffect(() => {
    const steps = recipe.generateSteps(recipe, beansAmount, flavor, strength);
    setSteps(steps);
  }, [beansAmount, flavor, strength, recipe]);

  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header language={language} t={t} />

      <Typography variant="h5" align="center" gutterBottom>
        {recipe.name[language]}
      </Typography>

      <RecipeDescription recipe={recipe} language={language} t={t} />

      <Typography variant="body1" align="center" gutterBottom>
        {recipe.equipments[language]}
      </Typography>

      <InputParams
        t={t}
        params={recipe.params}
        values={{
          beansAmount,
          waterRatio: recipe.waterRatio,
          flavor,
          roastLevel,
          strength,
        }}
        onChange={(key, value) => {
          if (key === 'beansAmount') setBeansAmount(value);
          if (key === 'flavor') setFlavor(value);
          if (key === 'roastLevel') setRoastLevel(value);
          if (key === 'strength') setStrength(value);
        }}
      />

      <Typography
        variant="body2"
        component="div"
        sx={{
          fontSize: '1.1rem',
          mb: 2,
          ml: 4,
        }}
      >
        <div style={{ marginBottom: '8px' }}>{t.preparation}</div>
        {recipe.preparationSteps && recipe.preparationSteps[language].map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ marginRight: '8px' }}>•</span>
            {step}
          </div>
        ))}
      </Typography>

      <Timeline
        t={t}
        darkMode={darkMode}
        language={language}
        steps={steps}
        setSteps={setSteps}
      />

      <Footer t={t} />
    </Container>
  );
};

export default CoffeeRecipe;