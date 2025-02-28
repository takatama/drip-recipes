import React, { useRef, useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

interface NotificationManagerProps {
  isNextStep: boolean;
  isFinish: boolean;
  shouldVibrate: boolean;
  isReset?: boolean;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  isNextStep,
  isFinish,
  shouldVibrate,
  isReset = false
}) => {
  const { notificationMode, language, voice } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const currentTypeRef = useRef<'finish' | 'next-step' | null>(null);

  // Keep track of which audio type we're currently working with
  const [currentAudioType, setCurrentAudioType] = useState<'finish' | 'next-step' | null>(null);
  
  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      const handleEnded = () => {
        console.log("Audio playback ended");
        isPlayingRef.current = false;
      };

      const handleError = (e: ErrorEvent) => {
        console.error('Audio loading error:', e);
        isPlayingRef.current = false;
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
  }, []);

  // Reset state when isReset is true
  useEffect(() => {
    if (isReset && audioRef.current) {
      console.log("Resetting notification manager state");
      isPlayingRef.current = false;
      currentTypeRef.current = null;
      setCurrentAudioType(null);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isReset]);

  // Play audio when requested
  useEffect(() => {
    // Early return if audio isn't available
    if (!audioRef.current) return;
    
    // Check if we should play a notification sound
    const shouldPlaySound = 
      notificationMode === 'sound' &&
      (isNextStep || isFinish) &&
      !isPlayingRef.current;
    
    if (!shouldPlaySound) return;
    
    // Determine which sound to play
    const type = isFinish ? 'finish' : 'next-step';
    
    // If we're already playing this type, don't restart
    if (currentTypeRef.current === type && isPlayingRef.current) {
      return;
    }
    
    console.log(`Preparing to play ${type} audio`);
    const audio = audioRef.current;
    
    // Set up one-time handler for this specific play operation
    const playAudio = () => {
      if (!audio) return;
      
      // Remove the handler to prevent loops
      audio.oncanplaythrough = null;
      
      console.log(`Playing ${type} audio`);
      isPlayingRef.current = true;
      currentTypeRef.current = type;
      
      // Try to play the audio
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
    };
    
    // Set up the audio source
    const audioPath = `/audio/${language}-${voice}-${type}.wav`;
    
    // Only update the source if needed
    if (currentAudioType !== type) {
      console.log(`Loading new audio source: ${audioPath}`);
      audio.src = audioPath;
      setCurrentAudioType(type);
      
      // Set up the handler before loading
      audio.oncanplaythrough = playAudio;
      audio.load();
    } else {
      // We already have the right source loaded, just play
      console.log(`Using existing audio source for ${type}`);
      audio.currentTime = 0;
      playAudio();
    }
    
  }, [isNextStep, isFinish, notificationMode, language, voice, currentAudioType]);

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
