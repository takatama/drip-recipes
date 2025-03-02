import { useContext } from 'react';
import { AnimationContext } from '@/contexts/AnimationContext';
import { ActionType } from '@/types';

export const useAnimationManager = () => {
  const { state, dispatch } = useContext(AnimationContext);

  const startAnimation = (currentWaterAmount: number, targetWaterAmount: number, actionType: ActionType) => {
    dispatch({
      type: 'START_ANIMATION',
      payload: { currentWaterAmount, targetWaterAmount, currentActionType: actionType },
    });
  };

  const completeAnimation = () => {
    dispatch({ type: 'ANIMATION_COMPLETE' });
  };

  const resetAnimation = () => {
    dispatch({ type: 'RESET_ANIMATION' });
  };

  return {
    ...state,
    startAnimation,
    completeAnimation,
    resetAnimation,
  };
};
