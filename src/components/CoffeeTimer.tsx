'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import InputParams from './InputParams';
import Timeline from './Timeline';
import { CoffeeRecipeType, LanguageType, Step, RoastLevelType } from '../types';
import { generateSteps } from '@/utils/generateSteps';
import { useTranslations } from 'next-intl';

interface CoffeeTimerProps {
  locale: LanguageType;
  recipe: CoffeeRecipeType;
}

const CoffeeTimer: React.FC<CoffeeTimerProps> = ({ locale, recipe }) => {
  const getDefaultValue = (key: string) => {
    const param = recipe.params.find(p => p.key === key);
    return param?.default || null;
  };

  const [roastLevel, setRoastLevel] = useState<RoastLevelType>(getDefaultValue('roastLevel') as RoastLevelType || 'mediumRoast');
  const [beansAmount, setBeansAmount] = useState<number>(Number(getDefaultValue('beansAmount')) || 20);
  const [flavor, setFlavor] = useState<string>(String(getDefaultValue('flavor')) || 'neutral');
  const [strength, setStrength] = useState<string>(String(getDefaultValue('strength')) || 'medium');
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const newSteps = generateSteps(recipe, beansAmount, flavor, strength);
    setSteps(newSteps);
  }, [beansAmount, flavor, strength, recipe]);

  const t = useTranslations('Recipe');

  return (
    <>
      <InputParams
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

      {recipe.preparationSteps && recipe.preparationSteps[locale]?.length > 0 && (
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontSize: '1.1rem',
            mb: 2,
            ml: 4,
          }}
        >
          <div style={{ marginBottom: '8px' }}>{t('preparation')}</div>
          {recipe.preparationSteps[locale].map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ marginRight: '8px' }}>•</span>
              {step}
            </div>
          ))}
        </Typography>
      )}

      <Timeline
        locale={locale}
        steps={steps}
        setSteps={setSteps}
        isDence={recipe.isDence}
      />
    </>
  );
};

export default CoffeeTimer;