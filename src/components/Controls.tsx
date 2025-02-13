import React from 'react';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import { VolumeOff, Vibration, VolumeUp, Man, Woman, PlayArrow, Pause, Replay } from '@mui/icons-material';
import { NotificationMode, TranslationType } from '../types';

interface ControlsProps {
  t: TranslationType;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  notificationMode: NotificationMode;
  setNotificationMode: (notificationMode: NotificationMode) => void;
  voice: 'male' | 'female';
  setVoice: (newVoice: 'male' | 'female') => void;
}

const Controls: React.FC<ControlsProps> = ({ t, onPlay, onPause, onReset, notificationMode, setNotificationMode, voice, setVoice }) => {
  const isSmallScreen = useMediaQuery('(max-width:465px)');

  const handleToggleNotificationMode = () => {
    const getNextMode = (currentMode: NotificationMode) => {
      switch (currentMode) {
        case 'none':
          return 'vibrate';
        case 'vibrate':
          return 'sound';
        case 'sound':
          return 'none';
      }
    };
    const next = getNextMode(notificationMode);
    setNotificationMode(next);
  };

  const handleToggleVoice = () => {
    setVoice(voice === 'male' ? 'female' : 'male');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5, ml: -6}}>
      <IconButton
        onClick={handleToggleVoice}
        sx={{ visibility: notificationMode === 'sound' ? 'visible' : 'hidden' }}
      >
        {voice === 'male' ? <Man /> : <Woman />}
      </IconButton>
      <IconButton onClick={handleToggleNotificationMode} sx={{ mr: 1 }}>
        {notificationMode === 'none' ? (<VolumeOff />) : notificationMode === 'vibrate' ? (<Vibration />) : (<VolumeUp />)}  
      </IconButton>

      <Button
        variant="contained"
        color="primary"
        onClick={onPlay}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <PlayArrow />
        {!isSmallScreen && t.play}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onPause}
        sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Pause />
        {!isSmallScreen && t.pause}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onReset}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Replay />
        {!isSmallScreen && t.reset}
      </Button>
    </Box>
  );
};

export default Controls;