import React, { createContext, useReducer, useContext } from 'react';
import { notificationReducer, initialNotificationState, NotificationState, NotificationAction } from '../reducers/notificationReducer';

interface NotificationContextType {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
}

// デフォルト値を持つコンテキストを作成
export const NotificationContext = createContext<NotificationContextType>({
  state: initialNotificationState,
  dispatch: () => null,
});

// Provider コンポーネント
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

// カスタムフック
export const useNotification = () => useContext(NotificationContext);
