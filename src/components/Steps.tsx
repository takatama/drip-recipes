import React, { useRef, useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Step } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../hooks/useNotification';

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

  // Add function to update step statuses
  const updateStepStatuses = (currentTimeValue: number) => {
    if (steps.length === 0) return;

    const lastStep = steps[steps.length - 1];
    if (currentTimeValue >= lastStep.timeSec) {
      onTimerComplete();
    }

    setSteps(prevSteps =>
      prevSteps.map((step, index) => {
        if (currentTimeValue >= step.timeSec && (index === prevSteps.length - 1 || currentTimeValue < prevSteps[index + 1].timeSec)) {
          return { ...step, status: 'current' };
        }
        if (currentTimeValue >= step.timeSec) {
          if (step.status === 'current') {
            vibrate();
          }
          return { ...step, status: 'completed' };
        }
        if (currentTimeValue >= step.timeSec - INDICATE_NEXT_STEP_SEC && currentTimeValue < step.timeSec) {
          const isFinish = index === prevSteps.length - 1;
          playAudio(isFinish);
          return { ...step, status: 'next' };
        }
        return { ...step, status: 'upcoming' };
      })
    );
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