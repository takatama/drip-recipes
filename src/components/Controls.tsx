import React from 'react';
import { Box, Button } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled?: boolean; // Disabled when animation is running
  isRunning: boolean; // Running state from the outside
}

const Controls: React.FC<ControlsProps> = ({ 
  t, 
  onPlay, 
  onPause, 
  onReset, 
  disabled = false,
  isRunning 
}) => {
  const handlePlayPause = () => {
    if (isRunning) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      {!isRunning ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlayPause}
          disabled={disabled}
          sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <PlayArrow />
          {t.play}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlayPause}
          disabled={disabled}
          sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Pause />
          {t.pause}
        </Button>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleReset}
        disabled={disabled}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Replay />
        {t.reset}
      </Button>
    </Box>
  );
};

export default Controls;