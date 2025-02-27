import { useRef, useEffect } from 'react';
import { LanguageType, NotificationMode, VoiceType } from '../types';

interface UseNotificationProps {
  locale: LanguageType;
  voice: VoiceType;
  notificationMode: NotificationMode;
}

export const useNotification = ({ locale, voice, notificationMode }: UseNotificationProps) => {
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
      nextStepAudio.current.src = `/audio/${locale}-${voice}-next-step.wav`;
      finishAudio.current.src = `/audio/${locale}-${voice}-finish.wav`;
    }
  }, [locale, voice]);

  const playAudio = (isFinish: boolean) => {
    if (notificationMode === 'none' || isPlayingRef.current) return;
    if (notificationMode === 'sound' && nextStepAudio.current && finishAudio.current) {
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
    if (notificationMode === 'vibrate' && typeof navigator !== 'undefined' && navigator.vibrate) {
      console.log('Vibrating...');
      navigator.vibrate([200, 100, 200]);
    }
  };

  return {
    playAudio,
    vibrate,
  };
};
