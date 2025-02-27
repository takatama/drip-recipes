import React, { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import NotificationManager from './NotificationManager';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, StepStatus, TranslationType } from '../types';
import { Snackbar } from '@mui/material';
import dynamic from 'next/dynamic';

// PourAnimationをクライアントサイドでのみレンダリングするように動的インポート
const PourAnimation = dynamic(() => import('./PourAnimation'), {
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
  // アニメーション表示のための状態管理
  const [animationStatus, setAnimationStatus] = useState<'idle' | 'initial' | 'step'>(
    'idle'
  );
  
  // 通知関連の状態
  const [isNextStep, setIsNextStep] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [shouldVibrate, setShouldVibrate] = useState(false);

  // タイマーの状態
  const timerReadyRef = useRef(false);

  // 通知フラグをリセットするタイマー
  useEffect(() => {
    if (isNextStep || isFinish || shouldVibrate) {
      const timer = setTimeout(() => {
        setIsNextStep(false);
        setIsFinish(false);
        setShouldVibrate(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isNextStep, isFinish, shouldVibrate]);

  // 初期アニメーション後の開始処理
  useEffect(() => {
    if (animationStatus === 'initial' && !showAnimation && timerReadyRef.current) {
      // 初期アニメーションが終了し、タイマー開始準備完了
      start();
      setAnimationStatus('idle');
      timerReadyRef.current = false;
    }
  }, [animationStatus, showAnimation, start]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePlay = async () => {
    if (isRunning) return;
    
    setSnackbarOpen(true);
    await requestWakeLock();
    
    if (currentTime === 0 && steps.length > 0) {
      // タイマーが0の場合は最初のアニメーションを表示
      setCurrentWaterAmount(0);
      setTargetWaterAmount(steps[0].cumulative || 0);
      setShowAnimation(true);
      setAnimationStatus('initial');
      timerReadyRef.current = true;
      
      // アニメーションが終わったら自動的に非表示にする
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
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
      setAnimationStatus('idle');
      timerReadyRef.current = false;
    }
  };

  // Reset the timer
  const handleReset = async () => {
    setSnackbarOpen(false);
    await releaseWakeLock();
    reset();
    
    // アニメーション関連の状態をリセット
    setShowAnimation(false);
    setAnimationStatus('idle');
    timerReadyRef.current = false;
  };

  const handleTimerComplete = async () => {
    await releaseWakeLock();
    pause();
  };

  // ステップ間のアニメーション表示用のハンドラ
  const handleStepTransition = (currentAmount: number, targetAmount: number) => {
    // すでにアニメーション中の場合は何もしない
    if (showAnimation) return;
    
    if (currentAmount === targetAmount) {
      // 量が変化しない場合はアニメーションを表示しない
      return;
    }
    
    setCurrentWaterAmount(currentAmount);
    setTargetWaterAmount(targetAmount);
    setShowAnimation(true);
    setAnimationStatus('step');
    
    // 3秒後にアニメーションを非表示にする
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
  };
  
  // ステップのステータス変更ハンドラ
  const handleStepStatusChange = (index: number, oldStatus: StepStatus, newStatus: StepStatus) => {
    const isLastStep = index === steps.length - 1;
    
    if (newStatus === 'next') {
      // 「next」状態になったらサウンド通知
      setIsNextStep(true);
      setIsFinish(isLastStep);
    } else if (newStatus === 'current' && oldStatus === 'next') {
      // nextからcurrentになったらバイブレーション
      setShouldVibrate(true);
    }
  };

  return (
    <>
      <Controls
        t={t}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        disabled={animationStatus === 'initial' && showAnimation}
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
      />
      
      {/* アニメーションコンポーネント */}
      <PourAnimation
        isVisible={showAnimation}
        currentWaterAmount={currentWaterAmount}
        targetWaterAmount={targetWaterAmount}
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
