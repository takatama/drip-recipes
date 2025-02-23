import React from 'react';
import { Box, Button } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ t, onPlay, onPause, onReset }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onPlay}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <PlayArrow />
        {t.play}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onPause}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Pause />
        {t.pause}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onReset}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Replay />
        {t.reset}
      </Button>
    </Box>
  );
};

export default Controls;