import { useContext, useEffect } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';
import { TimerContext } from '@/contexts/TimerContext';

export const useNotificationManager = () => {
  const { state, dispatch } = useContext(NotificationContext);
  const { state: timerState } = useContext(TimerContext);

  // タイマーの状態変化を監視して通知をトリガー
  useEffect(() => {
    if (timerState.status === 'upcoming' && timerState.stepIndex >= 0) {
      dispatch({ type: 'NEXT_STEP' });
    }
    if (timerState.status === 'finished') {
      dispatch({ type: 'FINISH' });
    }
  }, [timerState.status, timerState.stepIndex, dispatch]);

  const triggerVibration = () => {
    dispatch({ type: 'VIBRATE' });
  };

  const resetNotifications = () => {
    dispatch({ type: 'RESET' });
  };

  const openSnackbar = () => {
    dispatch({ type: 'OPEN_SNACKBAR' });
  };

  const closeSnackbar = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
  };

  return {
    ...state,
    triggerVibration,
    resetNotifications,
    openSnackbar,
    closeSnackbar,
  };
};
