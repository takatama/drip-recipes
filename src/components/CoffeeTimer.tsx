import React, { useEffect, useRef, useState, Suspense } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import SnackbarManager from './SnackbarManager';
import { useSystemTimer } from '../hooks/useSystemTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { useAnimation } from '@/hooks/useAnimation';
import { useNotification } from '@/hooks/useNotification';
import { TranslationType, CalculatedStep, ActionType } from '../types';
import dynamic from 'next/dynamic';
import { useStepStatus } from '../hooks/useStepStatus';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { useSearchParams } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';

const AnimationManager = dynamic(() => import('./AnimationManager'), {
  ssr: false,
});

const TimeParamHandler = ({ setTime }: { setTime: (time: number) => void }) => {
  const searchParams = useSearchParams();
  const time = searchParams.get('time');

  useEffect(() => {
    if (time) {
      const parsedTime = Number(time);
      if (!isNaN(parsedTime)) {
        setTime(parsedTime);
      }
    }
  }, [time, setTime]);

  return null;
};

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
  const { currentTime, isRunning, start, pause, reset, setTime } = useSystemTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { showAnimation, startAnimation, resetAnimation } = useAnimation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { playNextStep, playFinish, vibrateUpcoming, vibrateNextStep } = useNotification();
  const timerReadyRef = useRef(false);
  const [calculatedSteps, setCalculatedSteps] = useState<CalculatedStep[]>(steps);
  const prevCalculatedStepsRef = useRef<string>('');
  const { showAnimation: animationEnabled } = useSettings();

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

    // For initial start (time at 0)
    if (currentTime === 0 && steps.length > 0) {
      const firstStep = steps[0];
      const firstStepActionType = firstStep.actionType || 'none';
      const initialAmount = firstStep.cumulativeMl || 0;

      if (animationEnabled) {
        startAnimation(0, initialAmount, firstStepActionType);
        timerReadyRef.current = true;
        // Timer will start after animation ends (handled by useEffect above)
        return;
      }
    }

    // For continuing after pause or when animation is disabled
    start();
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

  const handleUpcomingStep = (isFinish: boolean, actionType: ActionType, currentAmount: number, targetAmount: number) => {
    if (isFinish) {
      playFinish();
    } else {
      playNextStep();
    }
    vibrateUpcoming();
    
    const hasChange = currentAmount !== targetAmount;
    if (actionType === 'none' && !hasChange) return;
    if (animationEnabled) {
      startAnimation(currentAmount, targetAmount, actionType);
    } else {
      start();
    }
  };

  const handleNextStep = () => {
    vibrateNextStep();
  };

  const handleFinishStep = async () => {
    pause();
    await releaseWakeLock();
  };

  const { calculateStepStatuses } = useStepStatus(
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
      <Suspense fallback={null}>
        <TimeParamHandler setTime={setTime} />
      </Suspense>
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
