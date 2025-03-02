import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { ActionType, TranslationType } from '../types';
import { useAnimationManager } from '../hooks/useAnimationManager';

import Lottie from 'react-lottie-player';
import pourAnimationData from '@/assets/lottie/pour.json';
import switchOpenAnimationData from '@/assets/lottie/switch_open.json';
import switchCloseAnimationData from '@/assets/lottie/switch_close.json';
import coolAnimationData from '@/assets/lottie/cool.json';

interface AnimationManagerProps {
  t: TranslationType;
}

// Animation sequence types
type AnimationType = 'switch_open' | 'switch_close' | 'pour' | 'cool' | null;

const AnimationManager: React.FC<AnimationManagerProps> = ({ t }) => {
  const { 
    showAnimation,
    currentWaterAmount,
    targetWaterAmount,
    currentActionType,
    completeAnimation
  } = useAnimationManager();
  
  // Ref to track all animation state to prevent update loops
  const animationStateRef = useRef({
    animationQueue: [] as AnimationType[],
    countingActive: false,
  });
  
  // Component state - minimized to reduce update cycles
  const [waterAmount, setWaterAmount] = useState(0);
  const [currentAnimationType, setAnimationType] = useState<AnimationType | null>(null);

  // Effect to initialize animation state when showAnimation changes
  useEffect(() => {
    if (!showAnimation) {
      // Reset animation state when hiding
      const state = animationStateRef.current;
      state.animationQueue = [];
      state.countingActive = false;
      
      setAnimationType(null);
      return;
    }

    setupAnimationQueue();
  }, [showAnimation]);

  const createAnimationQueue = (actionType: ActionType): AnimationType[] => {
    if (actionType === 'switch_close_pour') {
      return ['switch_close', 'pour'];
    } else if (actionType === 'switch_open_pour') {
      return ['switch_open', 'pour'];
    } else if (actionType === 'pour_cool') {
      return ['pour', 'cool'];
    } else if (actionType === 'switch_close') {
      return ['switch_close'];
    } else if (actionType === 'switch_open') {
      return ['switch_open'];
    } else if (actionType === 'pour') {
      return ['pour'];
    }
    return [];
  };
  
  // Setup animation queue - called manually to avoid dependency loops
  const setupAnimationQueue = () => {
    const state = animationStateRef.current;
    setWaterAmount(currentWaterAmount);
    
    // Create the animation queue
    console.log("Creating new animation queue for:", currentActionType);
    const queue: AnimationType[] = createAnimationQueue(currentActionType);

    // If we have animations, start the sequence
    if (queue.length > 0) {
      console.log("Starting animation sequence:", queue);
      state.animationQueue = queue;
      
      setAnimationType(queue[0]);
    } else {
      // No animations needed, complete immediately
      completeAnimation();
    }
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    const state = animationStateRef.current;
    console.log(`Animation step completed:`, state.animationQueue[0]);

    // If we were counting, stop and set final water amount
    if (state.countingActive) {
      state.countingActive = false;
      setWaterAmount(targetWaterAmount);
    }

    // Get the next animation in the queue
    const updatedQueue = state.animationQueue.slice(1);
    state.animationQueue = updatedQueue;
    
    if (updatedQueue.length > 0) {
      // Move to the next animation
      const nextStep = updatedQueue[0];
      console.log("Moving to next animation:", nextStep);      
      setAnimationType(nextStep);
      
      // Start water counting if it's a pour step
      if (nextStep === 'pour') {
        startWaterCounting();
      }
    } else {
      // All animations complete
      console.log("All animations completed");
      
      // Call completeAnimation to update context state
      completeAnimation();
    }
  };

  // Start water counting animation
  const startWaterCounting = () => {
    if (!showAnimation || currentAnimationType !== 'pour') return;
    
    const state = animationStateRef.current;
    let startTime: number;
    const duration = 1000; // 1 second counting duration

    setTimeout(() => {
      state.countingActive = true;
      startTime = performance.now();

      const updateCounter = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newAmount = currentWaterAmount + (targetWaterAmount - currentWaterAmount) * progress;
        setWaterAmount(Math.round(newAmount));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setWaterAmount(targetWaterAmount);
        }
      };

      requestAnimationFrame(updateCounter);
    }, 500);
  };

  // Start water counting when pour animation starts
  useEffect(() => {
    if (currentAnimationType === 'pour') {
      startWaterCounting();
    }
  }, [currentAnimationType]);

  // If not visible, don't render anything
  if (!showAnimation) return null;

  // Get the appropriate animation data
  const getAnimationData = () => {
    switch (currentAnimationType) {
      case 'switch_open': return switchOpenAnimationData;
      case 'switch_close': return switchCloseAnimationData;
      case 'pour': return pourAnimationData;
      case 'cool': return coolAnimationData;
      default: return pourAnimationData; // Default to pour animation
    }
  };

  const animationData = getAnimationData();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: ({ palette }) =>
          palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 300
      }}
    >
      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
        {t['nextStep']}
      </Typography>

      {animationData && (
        <Lottie
          key={`animation-${currentAnimationType}`}
          loop={false}
          animationData={animationData}
          play={showAnimation}
          style={{
            width: 200,
            height: 200,
            opacity: showAnimation ? 1 : 0 // Hide animation when complete
          }}
          onComplete={handleAnimationComplete}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      )}

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
        {waterAmount} g
      </Typography>
    </Box>
  );
};

export default AnimationManager;
