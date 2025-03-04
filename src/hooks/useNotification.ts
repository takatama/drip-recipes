import { useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export const useNotification = () => {
  const { language, voice, notificationMode } = useSettings();
  const isPlayingRef = useRef(false);
  const nextStepAudio = useRef<HTMLAudioElement | null>(null);
  const finishAudio = useRef<HTMLAudioElement | null>(null);

  // Instantiate Audio objects only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
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

  const playNextStep = () => {
    if (notificationMode !== 'sound' || !nextStepAudio.current) return;

    nextStepAudio.current.pause();
    nextStepAudio.current.currentTime = 0;
    nextStepAudio.current.play();
    isPlayingRef.current = true;
  };

  const playFinish = () => {
    if (notificationMode !== 'sound' || !finishAudio.current) return;

    finishAudio.current.pause();
    finishAudio.current.currentTime = 0;
    finishAudio.current.play();
    isPlayingRef.current = true;
  };

  const vibrateUpcoming = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      console.log('Vibrating upcoming...');
      navigator.vibrate([100]);
    }
  };

  const vibrateNextStep = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      console.log('Vibrating next step...');
      navigator.vibrate([200, 100, 200]);
    }
  };

  return {
    playNextStep,
    playFinish,
    vibrateUpcoming,
    vibrateNextStep,
  };
};