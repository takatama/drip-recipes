import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Step, StepStatus } from '../types';
import { useSettings } from '../context/SettingsContext';

interface StepsProps {
  steps: Step[];
  currentTime: number;
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  onTimerComplete: () => void;
  isDence?: boolean;
  onStepTransition?: (currentAmount: number, targetAmount: number) => void;
  onStepStatusChange?: (index: number, oldStatus: StepStatus, newStatus: StepStatus) => void;
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

const Steps: React.FC<StepsProps> = ({
  steps,
  setSteps,
  currentTime,
  onTimerComplete,
  isDence,
  onStepTransition,
  onStepStatusChange
}) => {
  const isSmallScreen = useMediaQuery('(max-width:465px)');
  const { darkMode, language } = useSettings();
  const totalTime = steps[steps.length - 1]?.timeSec;
  const arrowHeight = isDence ? 12 : 25;

  // ステップの状態を内部で管理し、親コンポーネントへの更新を制御する
  const [internalSteps, setInternalSteps] = useState<Step[]>(steps);

  // 親のstepsが変更されたときだけ内部状態を更新
  useEffect(() => {
    setInternalSteps(steps);
  }, [steps]);

  // 内部的なステップ状態の更新が完了したら親に通知する
  // throttleを使って更新頻度を制限
  useEffect(() => {
    const timer = setTimeout(() => {
      // 内部ステップと外部ステップが異なる場合のみ更新
      if (JSON.stringify(internalSteps) !== JSON.stringify(steps)) {
        setSteps(internalSteps);
      }
    }, 100); // 100ms間隔で制限

    return () => clearTimeout(timer);
  }, [internalSteps, setSteps, steps]);

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

  // ステップのステータス追跡用の参照を追加
  const previousStepsStatusRef = useRef<Record<number, StepStatus>>({});
  const previousTimeRef = useRef<number>(currentTime);

  // ステップ状態を更新する関数（内部状態のみを更新）
  const updateStepStatuses = useCallback((currentTimeValue: number) => {
    // 前回と同じ時間の場合は更新しない
    if (previousTimeRef.current === currentTimeValue || internalSteps.length === 0) return;
    previousTimeRef.current = currentTimeValue;

    const lastStep = internalSteps[internalSteps.length - 1];
    if (currentTimeValue >= lastStep.timeSec) {
      onTimerComplete();
    }

    setInternalSteps(prevSteps => {
      return prevSteps.map((step, index) => {
        let newStatus: StepStatus = 'upcoming';

        if (currentTimeValue >= step.timeSec && (index === prevSteps.length - 1 || currentTimeValue < prevSteps[index + 1].timeSec)) {
          newStatus = 'current';
        } else if (currentTimeValue >= step.timeSec) {
          newStatus = 'completed';
        } else if (currentTimeValue >= step.timeSec - INDICATE_NEXT_STEP_SEC && currentTimeValue < step.timeSec) {
          newStatus = 'next';
        }

        // ステータス変更を検出
        const previousStatus = previousStepsStatusRef.current[index];
        if (previousStatus !== newStatus) {
          // ステータス変更を親に通知
          if (onStepStatusChange) {
            onStepStatusChange(index, previousStatus || 'upcoming', newStatus);
          }
          
          // 状態が「next」に変わった時だけアニメーション設定
          if (newStatus === 'next' && onStepTransition) {
            const currentAmount = index > 0 ? (prevSteps[index - 1].cumulative || 0) : 0;
            const targetAmount = step.cumulative || 0;
            onStepTransition(currentAmount, targetAmount);
          }

          // ステータスを保存
          previousStepsStatusRef.current[index] = newStatus;
        }

        return { ...step, status: newStatus };
      });
    });
  }, [internalSteps, onStepTransition, onTimerComplete, onStepStatusChange]);

  // Update useEffect for timer
  useEffect(() => {
    updateStepStatuses(currentTime);
  }, [currentTime, updateStepStatuses]);

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
        {internalSteps.map((step, index) => {
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