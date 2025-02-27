import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Step, StepStatus } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../hooks/useNotification';
import PourAnimation from './PourAnimation';

interface StepsProps {
  steps: Step[];
  currentTime: number;
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  onTimerComplete: () => void;
  isDence?: boolean;
}

const CONTAINER_HEIGHT = 400;
const MARKER_SIZE = 8;
const ARROW_OFFSET = 45;
const TIMELINE_WIDTH = 340;
const SMALL_TIMELINE_WIDTH = 260;
const STEP_TEXT_MARGIN = 20;
const FIRST_STEP_OFFSET = 10;
const FONT_SIZE = '1.1rem';
const INDICATE_NEXT_STEP_SEC = 3;

const Steps: React.FC<StepsProps> = ({ steps, setSteps, currentTime, onTimerComplete, isDence }) => {
  const isPlayingRef = useRef(false);
  const nextStepAudio = useRef<HTMLAudioElement | null>(null);
  const finishAudio = useRef<HTMLAudioElement | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:465px)');
  const { darkMode, notificationMode, language, voice } = useSettings();
  const { playAudio, vibrate } = useNotification({ language, voice, notificationMode });
  const totalTime = steps[steps.length - 1]?.timeSec;
  const arrowHeight = isDence ? 12 : 25;

  // Initialize Audio objects on client side
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      nextStepAudio.current = new Audio();
      finishAudio.current = new Audio();

      nextStepAudio.current.addEventListener('ended', () => (isPlayingRef.current = false));
      finishAudio.current.addEventListener('ended', () => (isPlayingRef.current = false));
    }
  }, []);

  // Update audio sources when language changes
  useEffect(() => {
    if (nextStepAudio.current && finishAudio.current) {
      nextStepAudio.current.src = `/audio/${language}-${voice}-next-step.wav`;
      finishAudio.current.src = `/audio/${language}-${voice}-finish.wav`;
    }
  }, [language, voice]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  };

  // Calculate arrow position (for timeline progress)
  const getArrowTop = () => {
    const clampedTime = Math.min(currentTime, totalTime);
    return (clampedTime / totalTime) * CONTAINER_HEIGHT - arrowHeight + FIRST_STEP_OFFSET;
  };

  // Add function to update step statuses
  const getStepPosition = (time: number) => {
    const topPos = (time / totalTime) * CONTAINER_HEIGHT;
    return time === 0 ? FIRST_STEP_OFFSET : topPos + FIRST_STEP_OFFSET;
  };

  // レンダリング中のアニメーション状態
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [targetWaterAmount, setTargetWaterAmount] = useState(0);

  // トリガーフラグとして使用する状態変数を追加
  const [triggerAnimation, setTriggerAnimation] = useState(0);
// 次のステップに移るときのデータを保存するref
const nextStepDataRef = useRef<{
  currentAmount: number;
  targetAmount: number;
}>({
  currentAmount: 0,
  targetAmount: 0
});

// トリガー処理を副作用に移動
useEffect(() => {
  if (triggerAnimation > 0) {
    // アニメーション表示
    setCurrentWaterAmount(nextStepDataRef.current.currentAmount);
    setTargetWaterAmount(nextStepDataRef.current.targetAmount);
    setShowAnimation(true);
    
    // 3秒後に自動的にアニメーションを非表示にする
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    
    // クリーンアップ関数でタイマーをクリア
    return () => clearTimeout(timer);
  }
}, [triggerAnimation]);

// アニメーションを設定するだけで、状態は更新しない関数
const triggerWaterAnimation = (currentStep: Step, nextStep: Step | undefined) => {
  // refにデータを保存
  nextStepDataRef.current = {
    currentAmount: currentStep.cumulative || 0,
    targetAmount: nextStep?.cumulative || currentStep.cumulative || 0
  };
  
  // トリガーのカウンターを増加させて副作用を実行
  setTriggerAnimation(prev => prev + 1);
};

  // Add function to update step statuses
  const updateStepStatuses = (currentTimeValue: number) => {
    if (steps.length === 0) return;

    const lastStep = steps[steps.length - 1];
    if (currentTimeValue >= lastStep.timeSec) {
      onTimerComplete();
    }

    const updatedSteps = steps.map((step, index) => {
      const nextStep = index < steps.length - 1 ? steps[index + 1] : undefined;

      if (currentTimeValue >= step.timeSec && (index === steps.length - 1 || currentTimeValue < steps[index + 1].timeSec)) {
        return { ...step, status: 'current' as StepStatus };
      }

      if (currentTimeValue >= step.timeSec) {
        if (step.status === 'current') {
          vibrate();
        }
        return { ...step, status: 'completed' as StepStatus };
      }

      if (currentTimeValue >= step.timeSec - INDICATE_NEXT_STEP_SEC && currentTimeValue < step.timeSec) {
        const isFinish = index === steps.length - 1;

        // 次のステップになる前の3秒間のとき
        if (step.status !== 'next') {
          // ステータスが変更される最初の時だけアニメーション設定
          triggerWaterAnimation(
            index > 0 ? steps[index - 1] : { ...step, cumulative: 0 },
            step
          );
          playAudio(isFinish);
        }

        return { ...step, status: 'next' as StepStatus };
      }

      return { ...step, status: 'upcoming' as StepStatus };
    });

    // バッチでステップを更新
    setSteps(updatedSteps);
  };

  // Update useEffect for timer
  useEffect(() => {
    updateStepStatuses(currentTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: `${CONTAINER_HEIGHT}px`,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        mb: 10
      }}
    >
      {/* アニメーションコンポーネント */}
      <PourAnimation
        isVisible={showAnimation}
        currentWaterAmount={currentWaterAmount}
        targetWaterAmount={targetWaterAmount}
      />

      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: isSmallScreen ? SMALL_TIMELINE_WIDTH : TIMELINE_WIDTH,
          minWidth: isSmallScreen ? SMALL_TIMELINE_WIDTH : TIMELINE_WIDTH,
        }}
      >
        {/* Timeline vertical line */}
        <Box
          sx={{
            position: 'absolute',
            top: `${isDence ? FIRST_STEP_OFFSET : FIRST_STEP_OFFSET - 16}px`,
            left: -2,
            height: `${CONTAINER_HEIGHT}px`,
            borderLeft: '3px solid #ccc'
          }}
        />
        {/* Render each step using absolute positioning */}
        {steps.map((step, index) => {
          const topPos = getStepPosition(step.timeSec);
          return (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${topPos}px`,
                left: '0px',
                transform: 'translateY(-50%)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: -1,
                  top: `${isDence ? '50%' : '20%'}`,
                  width: `${MARKER_SIZE}px`,
                  height: `${MARKER_SIZE}px`,
                  bgcolor: darkMode ? 'white' : 'black',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              {isDence ? (
                <Typography
                  variant="body2"
                  sx={{
                    ml: `${STEP_TEXT_MARGIN}px`,
                    fontSize: FONT_SIZE,
                    ...{
                      current: { fontWeight: 'bold' },
                      next: { fontWeight: 'bold', color: 'primary.main' },
                      completed: { textDecoration: 'line-through', color: 'text.secondary' },
                      upcoming: { color: 'text.primary' }
                    }[step.status]
                  }}
                >
                  {formatTime(step.timeSec)} {step.action[language]}
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: `${STEP_TEXT_MARGIN}px`,
                      fontSize: FONT_SIZE,
                      ...{
                        current: { fontWeight: 'bold' },
                        next: { fontWeight: 'bold', color: 'primary.main' },
                        completed: { textDecoration: 'line-through', color: 'text.secondary' },
                        upcoming: { color: 'text.primary' }
                      }[step.status]
                    }}
                  >
                    {formatTime(step.timeSec)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: `${STEP_TEXT_MARGIN}px`,
                      fontSize: FONT_SIZE,
                      ...{
                        current: { fontWeight: 'bold' },
                        next: { fontWeight: 'bold', color: 'primary.main' },
                        completed: { textDecoration: 'line-through', color: 'text.secondary' },
                        upcoming: { color: 'text.primary' }
                      }[step.status]
                    }}
                  >
                    {step.action[language]}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
        {/* Progress arrow with timer display */}
        <Box
          id="arrowContainer"
          sx={{
            position: 'absolute',
            left: `-${ARROW_OFFSET}px`,
            top: `${getArrowTop()}px`,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1" sx={{ fontSize: FONT_SIZE }}>
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: FONT_SIZE }} className="blinking">
            ▼
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Steps;