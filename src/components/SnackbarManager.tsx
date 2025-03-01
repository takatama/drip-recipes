import React from 'react';
import { Snackbar } from '@mui/material';
import { TranslationType } from '../types';
import { useNotificationManager } from '../hooks/useNotificationManager';

interface SnackbarManagerProps {
  t: TranslationType;
}

const SnackbarManager: React.FC<SnackbarManagerProps> = ({ t }) => {
  const { snackbarOpen, closeSnackbar } = useNotificationManager();

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      message={t.keepScreenOn}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
};

export default SnackbarManager;
