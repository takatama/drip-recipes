// TimerPanel.tsx
import React, { useState } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, NotificationMode, TranslationType } from '../types';
import { Snackbar } from '@mui/material';

interface TimelineProps {
  t: TranslationType;
  darkMode: boolean;
  language: 'en' | 'ja';
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
}

const Timeline: React.FC<TimelineProps> = ({
  t,
  darkMode,
  language,
  steps,
  setSteps,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const [notificationMode, setNotificationMode] = useState<NotificationMode>('none');
  const [voice, setVoice] = useState<'male' | 'female'>('female');

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

  const handleTimerComplete = () => {
    pause();
  };

  return (
    <>
      <Controls
        t={t}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        notificationMode={notificationMode}
        setNotificationMode={setNotificationMode}
        voice={voice}
        setVoice={setVoice}
      />
      <Steps
        steps={steps}
        setSteps={setSteps}
        currentTime={currentTime}
        darkMode={darkMode}
        notificationMode={notificationMode}
        language={language}
        voice={voice}
        onTimerComplete={handleTimerComplete}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={t.keepScreenOn}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default Timeline;
