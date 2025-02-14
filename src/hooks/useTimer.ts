// useTimer.ts
import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = (updateInterval: number = 0.1) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current || !isRunningRef.current) return;

    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    if (elapsedTime - lastUpdateRef.current >= updateInterval) {
      lastUpdateRef.current = elapsedTime;
      setCurrentTime(elapsedTime);
    }

    animationFrameId.current = requestAnimationFrame(updateTimer);
  }, [updateInterval]);

  const start = useCallback(() => {
    if (isRunning) return;

    isRunningRef.current = true;
    setIsRunning(true);
    startTimeRef.current = Date.now() - currentTime * 1000;
    animationFrameId.current = requestAnimationFrame(updateTimer);
  }, [currentTime, isRunning, updateTimer]);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    startTimeRef.current = null;
    setIsRunning(false);
    setCurrentTime(0);
    lastUpdateRef.current = 0;
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return { currentTime, isRunning, start, pause, reset };
};
