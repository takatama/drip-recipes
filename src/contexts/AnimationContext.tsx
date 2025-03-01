import React, { createContext, useReducer, useContext } from 'react';
import { animationReducer, initialAnimationState, AnimationState, AnimationAction } from '../reducers/animationReducer';

interface AnimationContextType {
  state: AnimationState;
  dispatch: React.Dispatch<AnimationAction>;
}

// デフォルト値を持つコンテキストを作成
export const AnimationContext = createContext<AnimationContextType>({
  state: initialAnimationState,
  dispatch: () => null,
});

// Provider コンポーネント
export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialAnimationState);

  return (
    <AnimationContext.Provider value={{ state, dispatch }}>
      {children}
    </AnimationContext.Provider>
  );
};

// カスタムフック
export const useAnimation = () => useContext(AnimationContext);
