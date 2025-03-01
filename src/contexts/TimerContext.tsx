import React, { createContext, useReducer, useContext } from 'react';
import { timerReducer, initialTimerState, TimerState, TimerAction } from '../reducers/timerReducer';

interface TimerContextType {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}

export const TimerContext = createContext<TimerContextType>({
  state: initialTimerState,
  dispatch: () => null,
});

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
