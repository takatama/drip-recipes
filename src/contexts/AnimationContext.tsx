import React, { createContext, useReducer, useContext } from 'react';
import { animationReducer, initialAnimationState, AnimationState, AnimationAction } from '../reducers/animationReducer';

interface AnimationContextType {
  state: AnimationState;
  dispatch: React.Dispatch<AnimationAction>;
}

export const AnimationContext = createContext<AnimationContextType>({
  state: initialAnimationState,
  dispatch: () => null,
});

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialAnimationState);

  return (
    <AnimationContext.Provider value={{ state, dispatch }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
