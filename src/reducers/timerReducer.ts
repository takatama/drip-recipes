import { CalculatedStep } from '../types';

export interface TimerState {
  stepIndex: number;
  status: 'initial' | 'upcoming' | 'running' | 'finished';
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'NEXT_STEP_UPCOMING' }
  | { type: 'NEXT_STEP_RUNNING' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

export const initialTimerState: TimerState = {
  stepIndex: -1,
  status: 'initial',
};

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { 
        ...state, 
        status: 'upcoming', 
      };
    case 'ANIMATION_COMPLETE':
      return {
        ...state,
        status: 'running',
        stepIndex: state.stepIndex === -1 ? 0 : state.stepIndex,
      };
    case 'NEXT_STEP_UPCOMING':
      return {
        ...state,
        status: 'upcoming',
      };
    case 'NEXT_STEP_RUNNING':
      return {
        ...state,
        status: 'running',
        stepIndex: state.stepIndex + 1,
      };
    case 'FINISH':
      return {
        ...state,
        status: 'finished',
      };
    case 'RESET':
      return initialTimerState;
    default:
      return state;
  }
};
