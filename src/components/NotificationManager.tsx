import React from 'react';
import { useNotificationManager } from '../hooks/useNotificationManager';

const NotificationManager: React.FC = () => {
  // このコンポーネントは、状態監視のみを行い、実際のUIは何も表示しない
  // すべてのロジックはカスタムフックに移動済み
  useNotificationManager();
  
  // このコンポーネントはUI要素を表示しない
  return null;
};

export default NotificationManager;