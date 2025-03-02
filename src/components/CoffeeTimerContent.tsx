import React, { useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import SnackbarManager from './SnackbarManager';
import { useSystemTimer } from '../hooks/useSystemTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { useTimer } from '../contexts/TimerContext';
import { useAnimationManager } from '@/hooks/useAnimationManager';
import { useNotification } from '@/hooks/useNotification';
import { TranslationType, CalculatedStep, LanguageType } from '../types';
import dynamic from 'next/dynamic';
import { useStepCalculation } from '../hooks/useStepCalculation';

const AnimationManager = dynamic(() => import('./AnimationManager'), {
  ssr: false,
});

interface CoffeeTimerContentProps {
  t: TranslationType;
  language: LanguageType;
  steps: CalculatedStep[];
  setSteps: React.Dispatch<React.SetStateAction<CalculatedStep[]>>;
  isDence?: boolean;
}

export const CoffeeTimerContent: React.FC<CoffeeTimerContentProps> = ({
  t,
  steps,
  setSteps,
  isDence,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useSystemTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { dispatch: timerDispatch } = useTimer();
  const { showAnimation, startAnimation, resetAnimation } = useAnimationManager();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { playNextStep, playFinish, vibrate } = useNotification();
  const timerReadyRef = useRef(false);
  const [internalSteps, setInternalSteps] = useState<CalculatedStep[]>(steps);

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

      timerDispatch({ type: 'START' });
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
    timerDispatch({ type: 'RESET' });
  };

  const handleTimerComplete = async () => {
    await releaseWakeLock();
    pause();
  };

  const handleStepTransition = (index: number, currentAmount: number, targetAmount: number) => {
    if (steps.length === index + 1) {
      playFinish();
    } else {
      playNextStep();
    }

    if (showAnimation) return;

    const step = steps[index];
    const actionType = step.actionType || 'none';
    const hasChange = currentAmount !== targetAmount;
    
    if (actionType === 'none' && !hasChange) return;
    
    startAnimation(currentAmount, targetAmount, actionType);
  };

  const handleStepStatusChange = (index: number, oldStatus: string, newStatus: string) => {
    const isLastStep = index === steps.length - 1;

    if (newStatus === 'next') {
      if (isLastStep) {
        timerDispatch({ type: 'FINISH' });
      } else {
        timerDispatch({ type: 'NEXT_STEP_UPCOMING' });
      }
    } else if (newStatus === 'current' && oldStatus === 'next') {
      vibrate();
      timerDispatch({ type: 'NEXT_STEP_RUNNING' });
    }
  };

  const { calculateStepStatuses } = useStepCalculation(
    internalSteps,
    handleStepStatusChange,
    handleStepTransition,
    handleTimerComplete
  );

    // Update steps when parent steps changes
    useEffect(() => {
      setInternalSteps(steps);
    }, [steps]);

      // Update parent steps when internal steps change (throttled)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(internalSteps) !== JSON.stringify(steps)) {
        setSteps(internalSteps);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [internalSteps, setSteps, steps]);

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
        steps={internalSteps}
        currentTime={currentTime}
        isDence={isDence}
      />
      <AnimationManager t={t} />
      <SnackbarManager t={t} showSnackbar={showSnackbar} closeSnackbar={closeSnackbar} />
    </>
  );
};
