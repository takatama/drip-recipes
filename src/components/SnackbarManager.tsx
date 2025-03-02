import React from 'react';
import { Snackbar } from '@mui/material';
import { TranslationType } from '../types';

interface SnackbarManagerProps {
  t: TranslationType;
  showSnackbar: boolean;
  closeSnackbar: () => void;
}

const SnackbarManager: React.FC<SnackbarManagerProps> = ({
  t,
  showSnackbar,
  closeSnackbar,
}) => {
  return (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      message={t.keepScreenOn}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
};

export default SnackbarManager;
