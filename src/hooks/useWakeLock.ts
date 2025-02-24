// Define types for the WakeLock API
interface WakeLockSentinel extends EventTarget {
  readonly released: boolean;
  readonly type: 'screen';
  onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
  release: () => Promise<void>;
}

interface NavigatorWithWakeLock extends Navigator {
  wakeLock: {
    request: (type: 'screen') => Promise<WakeLockSentinel>;
  };
}

import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await (navigator as NavigatorWithWakeLock).wakeLock.request('screen');
        console.log('WakeLock acquired');
        setWakeLock(lock);
      }
    } catch (err) {
      console.error('WakeLock request failed:', err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        console.log('WakeLock released');
        setWakeLock(null);
      } catch (err) {
        console.error('WakeLock release failed:', err);
      }
    }
  }, [wakeLock]);

  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  return { wakeLock, requestWakeLock, releaseWakeLock };
};