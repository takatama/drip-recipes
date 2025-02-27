import React, { useRef, useEffect, useState } from 'react';
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
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      // Add proper event listeners
      const handleEnded = () => {
        isPlayingRef.current = false;
      };
      
      const handleCanPlayThrough = () => {
        setAudioLoaded(true);
      };
      
      const handleError = (e: ErrorEvent) => {
        console.error('Audio loading error:', e);
        setAudioLoaded(false);
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, []);

  // Update audio source when language changes
  useEffect(() => {
    if (audioRef.current) {
      setAudioLoaded(false);
      const type = isFinish ? 'finish' : 'next-step';
      try {
        // Use a more reliable path format and check for file existence
        const audioPath = `/audio/${language}-${voice}-${type}.wav`;
        console.log(`Loading audio from: ${audioPath}`);
        audioRef.current.src = audioPath;
        
        // Preload the audio
        audioRef.current.load();
      } catch (error) {
        console.error('Failed to set audio source:', error);
      }
    }
  }, [language, voice, isFinish]);

  // Play audio when requested
  useEffect(() => {
    if (notificationMode === 'sound' && 
        (isNextStep || isFinish) && 
        audioRef.current && 
        audioLoaded && 
        !isPlayingRef.current) {
      
      isPlayingRef.current = true;
      audioRef.current.currentTime = 0;
      
      audioRef.current.play()
        .catch(e => {
          console.error('Audio playback failed:', e);
          isPlayingRef.current = false;
          
          // Fall back to vibration if audio fails
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(200);
          }
        });
    }
  }, [isNextStep, isFinish, notificationMode, audioLoaded]);

  // Vibrate when requested
  useEffect(() => {
    if (notificationMode === 'vibrate' && shouldVibrate && 
        typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, [shouldVibrate, notificationMode]);

  // This component doesn't render anything
  return null;
};

export default NotificationManager;