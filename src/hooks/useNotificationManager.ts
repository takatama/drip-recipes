import { useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';
import { TimerContext } from '@/contexts/TimerContext';
import { useSettings } from '@/contexts/SettingsContext';

export const useNotificationManager = () => {
  const { state, dispatch } = useContext(NotificationContext);
  const { state: timerState } = useContext(TimerContext);
  const { notificationMode, language, voice } = useSettings();
  
  // Audio related references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const currentTypeRef = useRef<'finish' | 'next-step' | null>(null);
  const [currentAudioType, setCurrentAudioType] = useState<'finish' | 'next-step' | null>(null);
  
  // Track the last notified step to prevent duplicate notifications
  const lastNotifiedStepRef = useRef(-1);
  
  // Notification lock to prevent multiple notifications being processed simultaneously
  const notificationLockRef = useRef(false);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      const handleEnded = () => {
        console.log('Audio playback ended');
        isPlayingRef.current = false;
        notificationLockRef.current = false;
        
        // Reset notification flag after playback completes
        if (currentTypeRef.current === 'next-step') {
          dispatch({ type: 'NEXT_STEP_HANDLED' });
        } else if (currentTypeRef.current === 'finish') {
          dispatch({ type: 'FINISH_HANDLED' });
        }
        currentTypeRef.current = null;
      };

      const handleError = (e: ErrorEvent) => {
        console.error('Audio loading error:', e);
        isPlayingRef.current = false;
        notificationLockRef.current = false;
        
        // Reset notification flag on error
        if (currentTypeRef.current === 'next-step') {
          dispatch({ type: 'NEXT_STEP_HANDLED' });
        } else if (currentTypeRef.current === 'finish') {
          dispatch({ type: 'FINISH_HANDLED' });
        }
        currentTypeRef.current = null;
      };

      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [dispatch]);

  // Monitor timer state changes and trigger notifications
  useEffect(() => {
    // Ignore if same state as before
    if (lastNotifiedStepRef.current === timerState.stepIndex) {
      return;
    }
    
    console.log(`Timer state changed: ${timerState.status}, stepIndex: ${timerState.stepIndex}`);
    
    // Notification for upcoming step
    if (timerState.status === 'upcoming' && timerState.stepIndex >= 0) {
      console.log(`Dispatching NEXT_STEP for step ${timerState.stepIndex}`);
      dispatch({ type: 'NEXT_STEP' });
      lastNotifiedStepRef.current = timerState.stepIndex;
    }
    
    // Notification for completion
    if (timerState.status === 'finished') {
      console.log('Dispatching FINISH');
      dispatch({ type: 'FINISH' });
    }
  }, [timerState.status, timerState.stepIndex, dispatch]);

  // Handle notification state changes and play actual notifications
  useEffect(() => {
    // Skip if already processing a notification
    if (notificationLockRef.current) {
      console.log('Notification locked - skipping');
      return;
    }

    // Nothing to do if no notification flags are set
    if (!state.isNextStep && !state.isFinish && !state.shouldVibrate) {
      return;
    }
    
    // Sound notifications
    if (notificationMode === 'sound' && (state.isNextStep || state.isFinish) && audioRef.current) {
      // Set lock to prevent multiple notifications
      notificationLockRef.current = true;
      
      const type = state.isFinish ? 'finish' : 'next-step';
      console.log(`Preparing to play ${type} audio`);
      
      // Stop current playback if any
      if (isPlayingRef.current && audioRef.current) {
        console.log('Stopping current audio playback to start new one');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
      
      const audio = audioRef.current;
      
      const playAudio = () => {
        if (!audio) {
          notificationLockRef.current = false;
          return;
        }
        
        audio.oncanplaythrough = null;
        isPlayingRef.current = true;
        currentTypeRef.current = type;
        
        console.log(`Playing ${type} audio`);
        audio.play().catch(e => {
          console.error('Audio playback failed:', e);
          isPlayingRef.current = false;
          currentTypeRef.current = null;
          notificationLockRef.current = false;
          
          // Fall back to vibration if audio fails
          vibrate();
          
          // Reset notification flags
          if (type === 'next-step') {
            dispatch({ type: 'NEXT_STEP_HANDLED' });
          } else if (type === 'finish') {
            dispatch({ type: 'FINISH_HANDLED' });
          }
        });
      };
      
      // Setup audio source
      const audioPath = `/audio/${language}-${voice}-${type}.wav`;
      
      audio.src = audioPath;
      setCurrentAudioType(type);
      audio.oncanplaythrough = playAudio;
      audio.load();
    }
    
    // Vibration notifications
    if (notificationMode === 'vibrate' && state.shouldVibrate) {
      vibrate();
      dispatch({ type: 'VIBRATE_HANDLED' });
    }
  }, [state.isNextStep, state.isFinish, state.shouldVibrate, notificationMode, language, voice, dispatch]);

  // Handle reset state
  useEffect(() => {
    if (state.isReset && audioRef.current) {
      console.log('Resetting notification state');
      isPlayingRef.current = false;
      currentTypeRef.current = null;
      notificationLockRef.current = false;
      lastNotifiedStepRef.current = -1;
      setCurrentAudioType(null);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [state.isReset]);

  // Vibration function
  const vibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      console.log('Vibrating device');
      navigator.vibrate(200);
    }
  };

  // Public API functions
  const triggerVibration = () => {
    dispatch({ type: 'VIBRATE' });
  };

  const resetNotifications = () => {
    dispatch({ type: 'RESET' });
  };

  const openSnackbar = () => {
    dispatch({ type: 'OPEN_SNACKBAR' });
  };

  const closeSnackbar = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
  };

  return {
    ...state,
    triggerVibration,
    resetNotifications,
    openSnackbar,
    closeSnackbar,
  };
};
