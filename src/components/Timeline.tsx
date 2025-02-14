// TimerPanel.tsx
import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, NotificationMode, TranslationType } from '../types';
import { Snackbar } from '@mui/material';
import { CoffeeRecipe } from '../types';
import { generateNewHybridSteps } from '../utils/recipeProcessor';

interface TimelineProps {
  recipe: CoffeeRecipe;
  t: TranslationType;
  darkMode: boolean;
  language: 'en' | 'ja';
  beansAmount: number;
  flavor: string;
}

const Timeline: React.FC<TimelineProps> = ({
  recipe,
  t,
  darkMode,
  language,
  beansAmount,
  flavor,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const [steps, setSteps] = useState<Step[]>([]);
  const [notificationMode, setNotificationMode] = useState<NotificationMode>('none');
  const [voice, setVoice] = useState<'male' | 'female'>('female');

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // const newSteps = calculateSteps(beansAmount, flavor);
    const newSteps = generateNewHybridSteps(recipe, beansAmount, flavor);
    setSteps(newSteps);
  }, [beansAmount, flavor]);

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
        t={t}
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
