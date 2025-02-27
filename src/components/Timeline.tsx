import React, { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import Steps from './Steps';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { Step, TranslationType } from '../types';
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

  // タイマーの状態
  const timerReadyRef = useRef(false);

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
    
    setCurrentWaterAmount(currentAmount);
    setTargetWaterAmount(targetAmount);
    setShowAnimation(true);
    setAnimationStatus('step');
    
    // 3秒後にアニメーションを非表示にする
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
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
