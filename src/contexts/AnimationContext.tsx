import React, { createContext, useState } from 'react';
import { ActionType } from '@/types';

interface AnimationState {
  showAnimation: boolean;
  currentWaterAmount: number;
  targetWaterAmount: number;
  currentActionType: ActionType;
}

interface AnimationContextType {
  state: AnimationState;
  startAnimation: (currentAmount: number, targetAmount: number, actionType: ActionType) => void;
  completeAnimation: () => void;
  resetAnimation: () => void;
}

const initialState: AnimationState = {
  showAnimation: false,
  currentWaterAmount: 0,
  targetWaterAmount: 0,
  currentActionType: 'none',
};

export const AnimationContext = createContext<AnimationContextType>({
  state: initialState,
  startAnimation: () => {},
  completeAnimation: () => {},
  resetAnimation: () => {},
});

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AnimationState>(initialState);

  const startAnimation = (currentWaterAmount: number, targetWaterAmount: number, currentActionType: ActionType) => {
    setState({
      showAnimation: true,
      currentWaterAmount,
      targetWaterAmount,
      currentActionType,
    });
  };

  const completeAnimation = () => {
    setState(prev => ({ ...prev, showAnimation: false }));
  };

  const resetAnimation = () => {
    setState(initialState);
  };

  const contextValue = {
    state,
    startAnimation,
    completeAnimation,
    resetAnimation,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};
