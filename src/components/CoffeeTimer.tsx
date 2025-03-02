import React from 'react';
import { TimerProvider } from '@/contexts/TimerContext';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { TranslationType, CalculatedStep } from '../types';
import { CoffeeTimerContent } from './CoffeeTimerContent';

interface CoffeeTimerProps {
  t: TranslationType;
  language: 'en' | 'ja';
  steps: CalculatedStep[];
  setSteps: React.Dispatch<React.SetStateAction<CalculatedStep[]>>;
  isDence?: boolean;
}

const CoffeeTimer: React.FC<CoffeeTimerProps> = (props) => {
  return (
    <TimerProvider>
      <AnimationProvider>
        <CoffeeTimerContent {...props} />
      </AnimationProvider>
    </TimerProvider>
  );
};

export default CoffeeTimer;
