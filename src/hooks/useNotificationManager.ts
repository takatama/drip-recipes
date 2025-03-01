import { useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';
import { TimerContext } from '@/contexts/TimerContext';
import { useSettings } from '@/contexts/SettingsContext';

export const useNotificationManager = () => {
  const { state, dispatch } = useContext(NotificationContext);
  const { state: timerState } = useContext(TimerContext);
  const { notificationMode, language, voice } = useSettings();
  
  // Audio関連
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const currentTypeRef = useRef<'finish' | 'next-step' | null>(null);
  const [currentAudioType, setCurrentAudioType] = useState<'finish' | 'next-step' | null>(null);

  // オーディオの初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      const handleEnded = () => {
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

  // タイマーの状態変化を監視して通知をトリガー
  useEffect(() => {
    if (timerState.status === 'upcoming' && timerState.stepIndex >= 0) {
      dispatch({ type: 'NEXT_STEP' });
    }
    if (timerState.status === 'finished') {
      dispatch({ type: 'FINISH' });
    }
  }, [timerState.status, timerState.stepIndex, dispatch]);

  // 通知状態の変化を監視して実際に通知を実行
  useEffect(() => {
    // 1. 音声通知
    if (notificationMode === 'sound' && (state.isNextStep || state.isFinish) && audioRef.current) {
      const type = state.isFinish ? 'finish' : 'next-step';
      
      // 既に同じ種類の通知を再生中なら飛ばす
      if (currentTypeRef.current === type && isPlayingRef.current) {
        return;
      }
      
      const audio = audioRef.current;
      
      const playAudio = () => {
        if (!audio) return;
        
        audio.oncanplaythrough = null;
        isPlayingRef.current = true;
        currentTypeRef.current = type;
        
        audio.play().catch(e => {
          console.error('Audio playback failed:', e);
          isPlayingRef.current = false;
          currentTypeRef.current = null;
          
          // 音声再生に失敗したら振動にフォールバック
          vibrate();
        });
      };
      
      // オーディオソースの設定
      const audioPath = `/audio/${language}-${voice}-${type}.wav`;
      
      // 必要な場合のみソース更新
      if (currentAudioType !== type) {
        audio.src = audioPath;
        setCurrentAudioType(type);
        audio.oncanplaythrough = playAudio;
        audio.load();
      } else {
        audio.currentTime = 0;
        playAudio();
      }
    }
    
    // 2. 振動通知
    if (notificationMode === 'vibrate' && state.shouldVibrate) {
      vibrate();
    }
    
  }, [state.isNextStep, state.isFinish, state.shouldVibrate, notificationMode, language, voice, currentAudioType]);

  // 通知のリセット時の処理
  useEffect(() => {
    if (state.isReset && audioRef.current) {
      isPlayingRef.current = false;
      currentTypeRef.current = null;
      setCurrentAudioType(null);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [state.isReset]);

  // 振動機能
  const vibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

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
