import { useContext } from 'react';
import { AnimationContext } from '@/contexts/AnimationContext';

export const useAnimation = () => {
  const { state, startAnimation, completeAnimation, resetAnimation } = useContext(AnimationContext);
  const { showAnimation, currentWaterAmount, targetWaterAmount, currentActionType } = state;

  return {
    showAnimation,
    currentWaterAmount,
    targetWaterAmount,
    currentActionType,
    startAnimation,
    completeAnimation,
    resetAnimation,
  };
};
