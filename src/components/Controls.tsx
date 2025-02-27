import React from 'react';
import { Box, Button } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled?: boolean; // アニメーション中はボタンを無効化
  isRunning: boolean; // 外部から現在の実行状態を受け取る
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
      {/* Play/Pause ボタンを状態に応じて切り替え */}
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