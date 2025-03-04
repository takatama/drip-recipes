import React, { useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import SnackbarManager from './SnackbarManager';
import { useSystemTimer } from '../hooks/useSystemTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { useAnimation } from '@/hooks/useAnimation';
import { useNotification } from '@/hooks/useNotification';
import { TranslationType, CalculatedStep } from '../types';
import dynamic from 'next/dynamic';
import { useStepCalculation } from '../hooks/useStepCalculation';
import { AnimationProvider } from '@/contexts/AnimationContext';

const AnimationManager = dynamic(() => import('./AnimationManager'), {
  ssr: false,
});

interface CoffeeTimerProps {
  t: TranslationType;
  steps: CalculatedStep[];
  isDence?: boolean;
}

const CoffeeTimerContent: React.FC<CoffeeTimerProps> = ({
  t,
  steps,
  isDence,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useSystemTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { showAnimation, startAnimation, resetAnimation } = useAnimation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { playNextStep, playFinish, vibrate } = useNotification();
  const timerReadyRef = useRef(false);
  const [calculatedSteps, setCalculatedSteps] = useState<CalculatedStep[]>(steps);
  const prevCalculatedStepsRef = useRef<string>('');

  useEffect(() => {
    if (!showAnimation && timerReadyRef.current) {
      start();
      timerReadyRef.current = false;
    }
  }, [showAnimation, start]);

  const handlePlay = async () => {
    if (isRunning) return;

    setShowSnackbar(true);
    await requestWakeLock();

    if (currentTime === 0 && steps.length > 0) {
      const firstStep = steps[0];
      const firstStepActionType = firstStep.actionType || 'none';
      startAnimation(0, firstStep.cumulativeMl || 0, firstStepActionType);
      timerReadyRef.current = true;
    } else {
      start();
    }
  };

  const handlePause = async () => {
    closeSnackbar();
    await releaseWakeLock();
    pause();

    if (showAnimation) {
      resetAnimation();
    }
  };

  const handleReset = async () => {
    closeSnackbar();
    await releaseWakeLock();
    reset();
  };

  const handleUpcomingStep = (stepIndex: number, currentAmount: number, targetAmount: number) => {
    playNextStep();
    
    const step = steps[stepIndex];
    const actionType = step.actionType || 'none';
    const hasChange = currentAmount !== targetAmount;

    if (actionType === 'none' && !hasChange) return;
    startAnimation(currentAmount, targetAmount, actionType);
  };

  const handleNextStep = (stepIndex: number) => {
    vibrate();
  };

  const handleFinishStep = async () => {
    playFinish();
    pause();
    await releaseWakeLock();
  };

  const { calculateStepStatuses } = useStepCalculation(
    handleUpcomingStep,
    handleNextStep,
    handleFinishStep,
  );

  // Calculate step statuses when time changes
  useEffect(() => {
    const updatedSteps = calculateStepStatuses(currentTime, steps);

    // Notifiy only when the status changes
    const updatedStepsJson = JSON.stringify(updatedSteps);
    if (updatedStepsJson !== prevCalculatedStepsRef.current) {
      prevCalculatedStepsRef.current = updatedStepsJson;
      setCalculatedSteps(updatedSteps);
    }
  }, [currentTime, calculateStepStatuses, steps]);

  const closeSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <Controls
        t={t}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        disabled={showAnimation}
        isRunning={isRunning}
      />
      <Timeline
        steps={calculatedSteps}
        currentTime={currentTime}
        isDence={isDence}
      />
      <AnimationManager t={t} />
      <SnackbarManager t={t} showSnackbar={showSnackbar} closeSnackbar={closeSnackbar} />
    </>
  );
};

export const CoffeeTimer: React.FC<CoffeeTimerProps> = (props) => {
  return (
    <AnimationProvider>
      <CoffeeTimerContent {...props} />
    </AnimationProvider>
  );
};
