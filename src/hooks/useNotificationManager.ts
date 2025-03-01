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
  
  // 最後に通知したstepIndexを追跡
  const lastNotifiedStepRef = useRef(-1);
  
  // 最後に通知した状態を追跡
  const lastStateRef = useRef({
    stepIndex: -1,
    status: 'initial' as 'initial' | 'upcoming' | 'running' | 'finished',
    isNextStep: false,
    isFinish: false,
  });
  
  // 通知ロックを追加 - 同時に複数の通知が処理されないようにする
  const notificationLockRef = useRef(false);

  // オーディオの初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      const handleEnded = () => {
        console.log('Audio playback ended');
        isPlayingRef.current = false;
        notificationLockRef.current = false;
        
        // 再生完了後にフラグをリセット
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
        
        // エラー時もフラグリセット
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

  // タイマーの状態変化を監視して通知をトリガー
  useEffect(() => {
    // 前回と同じ状態なら無視
    if (
      lastStateRef.current.stepIndex === timerState.stepIndex &&
      lastStateRef.current.status === timerState.status
    ) {
      return;
    }
    
    console.log(`Timer state changed: ${timerState.status}, stepIndex: ${timerState.stepIndex}`);
    
    // 次のステップの通知
    if (timerState.status === 'upcoming' && timerState.stepIndex >= 0) {
      // 既にこのステップの通知を行っていたら、二重通知を防止
      if (lastNotifiedStepRef.current !== timerState.stepIndex) {
        console.log(`Dispatching NEXT_STEP for step ${timerState.stepIndex}`);
        dispatch({ type: 'NEXT_STEP' });
        lastNotifiedStepRef.current = timerState.stepIndex;
      } else {
        console.log(`Skipping duplicate NEXT_STEP for step ${timerState.stepIndex}`);
      }
    }
    
    // 完了通知
    if (timerState.status === 'finished') {
      console.log('Dispatching FINISH');
      dispatch({ type: 'FINISH' });
    }
    
    // 状態を記録
    lastStateRef.current = {
      stepIndex: timerState.stepIndex,
      status: timerState.status,
      isNextStep: state.isNextStep,
      isFinish: state.isFinish,
    };
  }, [timerState.status, timerState.stepIndex, dispatch, state.isNextStep, state.isFinish]);

  // 通知状態の変化を監視して実際に通知を実行
  useEffect(() => {
    // ロックされていたら何もしない（既に処理中）
    if (notificationLockRef.current) {
      console.log('Notification locked - skipping');
      return;
    }

    // 状態がなければ何もしない
    if (!state.isNextStep && !state.isFinish) {
      return;
    }
    
    console.log(`Notification state: isNextStep=${state.isNextStep}, isFinish=${state.isFinish}`);
    
    // 1. 音声通知
    if (notificationMode === 'sound' && (state.isNextStep || state.isFinish) && audioRef.current) {
      // ロックを設定
      notificationLockRef.current = true;
      
      const type = state.isFinish ? 'finish' : 'next-step';
      console.log(`Preparing to play ${type} audio`);
      
      // 既に再生中なら、現在の再生を中止して新しい音を再生
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
          
          // 音声再生に失敗したら振動にフォールバック
          vibrate();
          
          // フラグをリセット
          if (type === 'next-step') {
            dispatch({ type: 'NEXT_STEP_HANDLED' });
          } else if (type === 'finish') {
            dispatch({ type: 'FINISH_HANDLED' });
          }
        });
      };
      
      // オーディオソースの設定
      const audioPath = `/audio/${language}-${voice}-${type}.wav`;
      console.log(`Setting audio source: ${audioPath}`);
      
      // ソース更新
      audio.src = audioPath;
      setCurrentAudioType(type);
      audio.oncanplaythrough = playAudio;
      audio.load();
    }
    
    // 2. 振動通知
    if (notificationMode === 'vibrate' && state.shouldVibrate) {
      vibrate();
    }
    
  }, [state.isNextStep, state.isFinish, state.shouldVibrate, notificationMode, language, voice, dispatch]);

  // 通知のリセット時の処理
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
      
      // 参照状態もリセット
      lastStateRef.current = {
        stepIndex: -1,
        status: 'initial',
        isNextStep: false,
        isFinish: false,
      };
    }
  }, [state.isReset]);

  // 振動機能
  const vibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      console.log('Vibrating device');
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
