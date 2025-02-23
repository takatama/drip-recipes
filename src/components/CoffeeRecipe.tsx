import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();

  const getDefaultValue = (key: string) => {
    const param = recipe.params.find(p => p.key === key);
    return param?.default || null;
  };

  const [roastLevel, setRoastLevel] = useState(getDefaultValue('roastLevel') || 'mediumRoast');
  const [beansAmount, setBeansAmount] = useState(getDefaultValue('beansAmount') || 20);
  const [flavor, setFlavor] = useState(getDefaultValue('flavor') || 'neutral');
  const [strength, setStrength] = useState(getDefaultValue('strength') || 'medium');
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (lang && lang !== language) {
      const pathParts = window.location.pathname.split('/');
      pathParts[1] = language;
      router.replace(pathParts.join('/'));
    }
  }, [lang, language, router]);

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
      <Header language={language} t={t} pathname={`/${language}/recipes/featured/${recipe.id}`}/>

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

      {recipe.preparationSteps && recipe.preparationSteps[language]?.length > 0 && (<Typography
        variant="body2"
        component="div"
        sx={{
          fontSize: '1.1rem',
          mb: 2,
          ml: 4,
        }}
      >
        <div style={{ marginBottom: '8px' }}>{t.preparation}</div>
        {recipe.preparationSteps[language].map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ marginRight: '8px' }}>•</span>
            {step}
          </div>
        ))}
      </Typography>)}

      <Timeline
        t={t}
        darkMode={darkMode}
        language={language}
        steps={steps}
        setSteps={setSteps}
        isDence={recipe.isDence}
      />

      <Footer t={t} />
    </Container>
  );
};

export default CoffeeRecipe;