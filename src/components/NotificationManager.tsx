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
  const currentTypeRef = useRef<'finish' | 'next-step' | null>(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      // Add proper event listeners
      const handleEnded = () => {
        console.log("Audio playback ended");
        isPlayingRef.current = false;
        currentTypeRef.current = null;
      };

      const handleCanPlayThrough = () => {
        setAudioLoaded(true);
      };

      const handleError = (e: ErrorEvent) => {
        console.error('Audio loading error:', e);
        setAudioLoaded(false);
        isPlayingRef.current = false;
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

  // Update audio source when language changes or when switching between finish/next-step
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Get the type we should be using now
    const type = isFinish ? 'finish' : 'next-step';
    
    // If already playing the correct type, don't reload
    if (isPlayingRef.current && currentTypeRef.current === type) {
      console.log(`Already playing ${type} audio, not reloading`);
      return;
    }
    
    // If any audio is currently playing, don't interrupt
    if (isPlayingRef.current) {
      console.log('Audio currently playing, not changing source');
      return;
    }

    setAudioLoaded(false);
    try {
      // Use a more reliable path format and check for file existence
      const audioPath = `/audio/${language}-${voice}-${type}.wav`;
      console.log(`Loading audio from: ${audioPath}`);
      audio.src = audioPath;
      currentTypeRef.current = type;  // Track what type we're loading

      // Preload the audio
      audio.load();
    } catch (error) {
      console.error('Failed to set audio source:', error);
      currentTypeRef.current = null;
    }
  }, [language, voice, isFinish]);

  // Play audio when requested
  useEffect(() => {
    const audio = audioRef.current;
    
    // Check if we should play a notification sound
    const shouldPlaySound = 
      notificationMode === 'sound' &&
      (isNextStep || isFinish) &&
      !!audio && 
      audioLoaded &&
      !isPlayingRef.current;
    
    if (shouldPlaySound && audio) {
      // Determine which sound to play
      const type = isFinish ? 'finish' : 'next-step';
      
      console.log(`Playing ${type} notification sound`);
      isPlayingRef.current = true;
      currentTypeRef.current = type;
      audio.currentTime = 0;

      audio.play()
        .catch(e => {
          console.error('Audio playback failed:', e);
          isPlayingRef.current = false;
          currentTypeRef.current = null;

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
