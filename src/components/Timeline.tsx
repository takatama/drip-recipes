import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { CalculatedStep } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface TimelineProps {
  steps: CalculatedStep[];
  currentTime: number;
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

const Timeline: React.FC<TimelineProps> = ({
  steps,
  currentTime,
  isDence
}) => {
  const isSmallScreen = useMediaQuery('(max-width:465px)');
  const { darkMode, language } = useSettings();
  const totalTime = steps[steps.length - 1]?.timeSec || 1;
  const arrowHeight = isDence ? 12 : 25;

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

export default Timeline;
