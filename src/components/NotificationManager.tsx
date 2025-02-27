import React, { useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface NotificationManagerProps {
  isNextStep: boolean;
  isFinish: boolean;
  shouldVibrate: boolean;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  isNextStep,
  isFinish,
  shouldVibrate
}) => {
  const { notificationMode, language, voice } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        isPlayingRef.current = false;
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', () => {
            isPlayingRef.current = false;
          });
        }
      };
    }
  }, []);

  // Update audio source when language changes
  useEffect(() => {
    if (audioRef.current) {
      const type = isFinish ? 'finish' : 'next-step';
      audioRef.current.src = `/audio/${language}-${voice}-${type}.wav`;
    }
  }, [language, voice, isFinish]);

  // Play audio when requested
  useEffect(() => {
    if (notificationMode === 'sound' && (isNextStep || isFinish) && audioRef.current && !isPlayingRef.current) {
      isPlayingRef.current = true;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.error('Audio playback failed:', e);
        isPlayingRef.current = false;
      });
    }
  }, [isNextStep, isFinish, notificationMode]);

  // Vibrate when requested
  useEffect(() => {
    if (notificationMode === 'vibrate' && shouldVibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, [shouldVibrate, notificationMode]);

  // このコンポーネントは何も描画しない
  return null;
};

export default NotificationManager;
