export interface NotificationState {
  isNextStep: boolean;
  isFinish: boolean;
  shouldVibrate: boolean;
  isReset: boolean;
  snackbarOpen: boolean;
}

export type NotificationAction =
  | { type: 'NEXT_STEP' }
  | { type: 'FINISH' }
  | { type: 'VIBRATE' }
  | { type: 'RESET' }
  | { type: 'OPEN_SNACKBAR' }
  | { type: 'CLOSE_SNACKBAR' }
  | { type: 'NEXT_STEP_HANDLED' }
  | { type: 'FINISH_HANDLED' }
  | { type: 'VIBRATE_HANDLED' };

export const initialNotificationState: NotificationState = {
  isNextStep: false,
  isFinish: false,
  shouldVibrate: false,
  isReset: false,
  snackbarOpen: false,
};

export const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, isNextStep: true };
    case 'FINISH':
      return { ...state, isFinish: true };
    case 'VIBRATE':
      return { ...state, shouldVibrate: true };
    case 'RESET':
      return { ...initialNotificationState, isReset: true };
    case 'OPEN_SNACKBAR':
      return { ...state, snackbarOpen: true };
    case 'CLOSE_SNACKBAR':
      return { ...state, snackbarOpen: false };
    case 'NEXT_STEP_HANDLED':
      return { ...state, isNextStep: false };
    case 'FINISH_HANDLED':
      return { ...state, isFinish: false };
    default:
      return state;
  }
};
