import { useRef, useEffect } from 'react';
import { LanguageType, NotificationMode, VoiceType } from '../types';

interface UseNotificationProps {
  language: LanguageType;
  voice: VoiceType;
  notificationMode: NotificationMode;
}

export const useNotification = ({ language, voice, notificationMode }: UseNotificationProps) => {
  const isPlayingRef = useRef(false);
  const nextStepAudio = useRef(new Audio());
  const finishAudio = useRef(new Audio());

  // Reset isPlaying when audio ends
  useEffect(() => {
    nextStepAudio.current.addEventListener('ended', () => isPlayingRef.current = false);
    finishAudio.current.addEventListener('ended', () => isPlayingRef.current = false);
  }, []);

  // Update audio sources when language changes
  useEffect(() => {
    nextStepAudio.current.src = `/audio/${language}-${voice}-next-step.wav`;
    finishAudio.current.src = `/audio/${language}-${voice}-finish.wav`;
  }, [language, voice]);

  const playAudio = (isFinish: boolean) => {
    if (notificationMode === 'none' || isPlayingRef.current) return;
    if (notificationMode === 'sound') {
      if (isFinish) {
        finishAudio.current.pause();
        finishAudio.current.currentTime = 0;
        finishAudio.current.play();
      } else {
        nextStepAudio.current.pause();
        nextStepAudio.current.currentTime = 0;
        nextStepAudio.current.play();
      }
      isPlayingRef.current = true;
    }
  };

  const vibrate = () => {
    if (notificationMode === 'vibrate') {
      console.log('Vibrating...');
      navigator.vibrate([200, 100, 200]);
    }
  };

  return {
    playAudio,
    vibrate
  };
};