import { ActionType } from '../types';

export interface AnimationState {
  showAnimation: boolean;
  currentWaterAmount: number;
  targetWaterAmount: number;
  currentActionType: ActionType;
}

export type AnimationAction =
  | { 
      type: 'START_ANIMATION';
      payload: { currentWaterAmount: number; targetWaterAmount: number; currentActionType: ActionType }
    }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'RESET_ANIMATION' };

export const initialAnimationState: AnimationState = {
  showAnimation: false,
  currentWaterAmount: 0,
  targetWaterAmount: 0,
  currentActionType: 'none',
};

export const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'START_ANIMATION':
      return {
        ...state,
        showAnimation: true,
        currentWaterAmount: action.payload.currentWaterAmount,
        targetWaterAmount: action.payload.targetWaterAmount,
        currentActionType: action.payload.currentActionType,
      };
    case 'ANIMATION_COMPLETE':
      return {
        ...state,
        showAnimation: false,
      };
    case 'RESET_ANIMATION':
      return initialAnimationState;
    default:
      return state;
  }
};
