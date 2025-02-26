import React, { useState } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, TranslationType } from '../types';
import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';

interface TimelineProps {
  language: 'en' | 'ja';
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  isDence?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  steps,
  setSteps,
  isDence,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePlay = async () => {
    if (isRunning) return;
    setSnackbarOpen(true);
    await requestWakeLock();
    start();
  };

  const handlePause = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    pause();
  };

  // Reset the timer
  const handleReset = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    reset();
  };

  const handleTimerComplete = async () => {
    await releaseWakeLock();
    pause();
  };

  const t = useTranslations('Recipe');

  return (
    <>
      <Controls
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
      />
      <Steps
        steps={steps}
        setSteps={setSteps}
        currentTime={currentTime}
        onTimerComplete={handleTimerComplete}
        isDence={isDence}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={t('keepScreenOn')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default Timeline;
