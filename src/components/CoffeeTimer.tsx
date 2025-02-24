'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import InputParams from './InputParams';
import Timeline from './Timeline';
import { CoffeeRecipe as CoffeeRecipeType, LanguageType, Step } from '../types';
import { generateSteps } from '@/utils/generateSteps';

interface CoffeeTimerProps {
  recipe: CoffeeRecipeType;
  t: any;
  language: LanguageType;
}

const CoffeeTimer: React.FC<CoffeeTimerProps> = ({ recipe, t, language }) => {
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
    const newSteps = generateSteps(recipe, beansAmount, flavor, strength);
    setSteps(newSteps);
  }, [beansAmount, flavor, strength, recipe]);

  return (
    <>
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

      {recipe.preparationSteps && recipe.preparationSteps[language]?.length > 0 && (
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
          {recipe.preparationSteps[language].map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ marginRight: '8px' }}>•</span>
              {step}
            </div>
          ))}
        </Typography>
      )}

      <Timeline
        t={t}
        language={language}
        steps={steps}
        setSteps={setSteps}
        isDence={recipe.isDence}
      />
    </>
  );
};

export default CoffeeTimer;