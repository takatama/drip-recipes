import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export const useSystemTimer = (updateInterval: number = 0.1) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);
  const lastSetTimeRef = useRef(0);

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current || !isRunningRef.current) return;

    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    
    // Update only if enough time has passed since the last update and the value has changed
    if (elapsedTime - lastUpdateRef.current >= updateInterval && 
        Math.abs(elapsedTime - lastSetTimeRef.current) >= 0.01) {
      lastUpdateRef.current = elapsedTime;
      lastSetTimeRef.current = elapsedTime;
      setCurrentTime(elapsedTime);
    }

    animationFrameId.current = requestAnimationFrame(updateTimer);
  }, [updateInterval]);

  const start = useCallback(() => {
    if (isRunning) return;

    isRunningRef.current = true;
    setIsRunning(true);
    startTimeRef.current = Date.now() - currentTime * 1000;
    lastSetTimeRef.current = currentTime;
    animationFrameId.current = requestAnimationFrame(updateTimer);
  }, [currentTime, isRunning, updateTimer]);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    startTimeRef.current = null;
    setIsRunning(false);
    lastSetTimeRef.current = 0;
    setCurrentTime(0);
    lastUpdateRef.current = 0;
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const setTime = useCallback((newTime: number) => {
    setCurrentTime(newTime);
  }, []);

  return { currentTime, isRunning, start, pause, reset, setTime };
};
