'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import InputParams from './InputParams';
import CoffeeTimer from './CoffeeTimer';
import { CoffeeRecipeType, LanguageType, CalculatedStep, TranslationType, RoastLevelType } from '../types';
import { generateSteps } from '@/utils/generateSteps';

interface CoffeeCalculatorProps {
  recipe: CoffeeRecipeType;
  t: TranslationType;
  language: LanguageType;
}

const CoffeeCalculator: React.FC<CoffeeCalculatorProps> = ({ recipe, t, language }) => {
  const getDefaultValue = (key: string) => {
    const param = recipe.params.find(p => p.key === key);
    return param?.default || null;
  };

  const [roastLevel, setRoastLevel] = useState<RoastLevelType>(getDefaultValue('roastLevel') as RoastLevelType || 'mediumRoast');
  const [beansAmount, setBeansAmount] = useState<number>(Number(getDefaultValue('beansAmount')) || 20);
  const [flavor, setFlavor] = useState<string>(String(getDefaultValue('flavor')) || 'neutral');
  const [strength, setStrength] = useState<string>(String(getDefaultValue('strength')) || 'medium');
  const [steps, setSteps] = useState<CalculatedStep[]>([]);

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
          if (key === 'beansAmount') setBeansAmount(Number(value));
          if (key === 'flavor') setFlavor(String(value));
          if (key === 'roastLevel') setRoastLevel(value as RoastLevelType);
          if (key === 'strength') setStrength(String(value));
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

      <CoffeeTimer
        t={t}
        language={language}
        steps={steps}
        setSteps={setSteps}
        isDence={recipe.isDence}
      />
    </>
  );
};

export default CoffeeCalculator;