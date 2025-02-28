import React, { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import NotificationManager from './NotificationManager';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, StepStatus, TranslationType, ActionType } from '../types';
import { Snackbar } from '@mui/material';
import dynamic from 'next/dynamic';

const AnimationManager = dynamic(() => import('./AnimationManager'), {
  ssr: false,
});

interface TimelineProps {
  t: TranslationType;
  language: 'en' | 'ja';
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  isDence?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  t,
  steps,
  setSteps,
  isDence,
}) => {
  const { currentTime, isRunning, start, pause, reset } = useTimer();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // アニメーション関連の状態
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [targetWaterAmount, setTargetWaterAmount] = useState(0);
  const [currentActionType, setCurrentActionType] = useState<ActionType>('none');

  // 通知関連の状態
  const [isNextStep, setIsNextStep] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [shouldVibrate, setShouldVibrate] = useState(false);
  const [isReset, setIsReset] = useState(false);

  // タイマーの状態
  const timerReadyRef = useRef(false);

  // 通知フラグをリセットするタイマー
  useEffect(() => {
    // Set a longer timeout for the finish sound (it's typically longer)
    const timeout = isFinish ? 3000 : 1000;

    if (isNextStep || isFinish || shouldVibrate) {
      const timer = setTimeout(() => {
        if (isFinish) setIsFinish(false);
        if (isNextStep) setIsNextStep(false);
        if (shouldVibrate) setShouldVibrate(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isNextStep, isFinish, shouldVibrate]);

  // 初期アニメーション後の開始処理
  useEffect(() => {
    if (!showAnimation && timerReadyRef.current) {
      // 初期アニメーションが終了し、タイマー開始準備完了
      start();
      timerReadyRef.current = false;
    }
  }, [showAnimation, start]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePlay = async () => {
    if (isRunning) return;

    setSnackbarOpen(true);
    await requestWakeLock();

    if (currentTime === 0 && steps.length > 0) {
      // タイマーが0の場合は最初のアニメーションを表示
      console.log("Starting initial animation for first step");
      const firstStep = steps[0];

      // Get the correct action type from the first step
      const firstStepActionType = firstStep.actionType || 'none';

      console.log("First step info:", {
        step: firstStep,
        actionType: firstStepActionType,
        waterAmount: firstStep.cumulative || 0
      });

      // Set up animation with the correct action type
      setCurrentWaterAmount(0);
      setTargetWaterAmount(firstStep.cumulative || 0);
      setCurrentActionType(firstStepActionType);
      setShowAnimation(true);
      timerReadyRef.current = true;

      // Remove the timeout that automatically hides the animation
      // and rely on the onAnimationComplete callback instead
      // setTimeout(() => {
      //   setShowAnimation(false);
      // }, 3000);
    } else {
      // それ以外の場合は直接タイマーを開始
      start();
    }
  };

  const handlePause = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    pause();

    // アニメーション中の場合は状態をリセット
    if (showAnimation) {
      setShowAnimation(false);
      timerReadyRef.current = false;
    }
  };

  // Reset the timer
  const handleReset = async () => {
    console.log("Reset button pressed");
    setSnackbarOpen(false);
    await releaseWakeLock();
    reset();

    // アニメーション関連の状態をリセット
    console.log("Resetting animation state");
    setShowAnimation(false);
    setCurrentWaterAmount(0);
    setTargetWaterAmount(0);
    setCurrentActionType('none');
    
    // Set the reset flag to true
    setIsReset(true);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsReset(false);
    }, 100);
  };

  const handleTimerComplete = async () => {
    await releaseWakeLock();
    pause();
  };

  // ステップ間のアニメーション表示用のハンドラ
  const handleStepTransition = (index: number, currentAmount: number, targetAmount: number) => {
    console.log("handleStepTransition called:", {
      index,
      currentAmount,
      targetAmount,
      showAnimation,
      step: steps[index]
    });

    // すでにアニメーション中の場合は何もしない
    if (showAnimation) {
      console.log("Animation already in progress, ignoring");
      return;
    }

    // ステップからアクションタイプを取得
    const step = steps[index];
    const actionType = step.actionType || 'none';
    const hasChange = currentAmount !== targetAmount;

    console.log("Action analysis:", {
      actionType,
      hasChange,
      step
    });

    // アニメーションが必要ない場合は何もしない
    if (actionType === 'none' && !hasChange) {
      console.log("No animation needed");
      return;
    }

    // アニメーション表示に必要な状態を設定
    console.log("Starting animation with:", {
      currentWaterAmount: currentAmount,
      targetWaterAmount: targetAmount,
      actionType
    });

    setCurrentWaterAmount(currentAmount);
    setTargetWaterAmount(targetAmount);
    setCurrentActionType(actionType);
    setShowAnimation(true);
  };

  // アニメーション完了ハンドラ
  const handleStepStatusChange = (index: number, oldStatus: StepStatus, newStatus: StepStatus) => {
    const isLastStep = index === steps.length - 1;

    if (newStatus === 'next') {
      // Only set one flag at a time, prioritizing "finish" for the last step
      if (isLastStep) {
        setIsFinish(true);
      } else {
        setIsNextStep(true);
      }
    } else if (newStatus === 'current' && oldStatus === 'next') {
      // nextからcurrentになったらバイブレーション
      setShouldVibrate(true);
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed");
    setShowAnimation(false);
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
      <Steps
        steps={steps}
        setSteps={setSteps}
        currentTime={currentTime}
        onTimerComplete={handleTimerComplete}
        isDence={isDence}
        onStepTransition={handleStepTransition}
        onStepStatusChange={handleStepStatusChange}
      />

      {/* 通知マネージャー（非表示） */}
      <NotificationManager
        isNextStep={isNextStep}
        isFinish={isFinish}
        shouldVibrate={shouldVibrate}
        isReset={isReset}
      />

      {/* アニメーションマネージャー */}
      <AnimationManager
        isVisible={showAnimation}
        actionType={currentActionType}
        currentWaterAmount={currentWaterAmount}
        targetWaterAmount={targetWaterAmount}
        onAnimationComplete={handleAnimationComplete}
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
