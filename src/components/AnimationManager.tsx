import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { TranslationType } from '../types';
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
type AnimationStep = 'switch_open' | 'switch_close' | 'pour' | 'cool' | null;

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
    lastActionType: '',
    lastTargetAmount: 0,
    currentStep: null as AnimationStep | null,
    animationQueue: [] as AnimationStep[],
    countingActive: false,
  });
  
  // Component state - minimized to reduce update cycles
  const [waterAmount, setWaterAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnimationStep | null>(null);

  // Effect to initialize animation state when showAnimation changes
  useEffect(() => {
    if (!showAnimation) {
      // Reset animation state when hiding
      const state = animationStateRef.current;
      state.animationQueue = [];
      state.currentStep = null;
      state.countingActive = false;
      
      setCurrentStep(null);
      return;
    }

    setupAnimationQueue();
  }, [showAnimation]);

  // Setup animation queue - called manually to avoid dependency loops
  const setupAnimationQueue = () => {
    const state = animationStateRef.current;
    
    // Check if we need to create a new animation sequence
    const shouldCreateNewQueue = 
      state.lastActionType !== currentActionType ||
      state.lastTargetAmount !== targetWaterAmount;
    
    if (!shouldCreateNewQueue) {
      return;
    }
    
    // Store the new animation parameters
    state.lastActionType = currentActionType;
    state.lastTargetAmount = targetWaterAmount;
    setWaterAmount(currentWaterAmount);
    
    // Create the animation queue
    console.log("Creating new animation queue for:", currentActionType);
    const queue: AnimationStep[] = [];

    // Handle combined action types
    if (currentActionType === 'switch_close_pour') {
      queue.push('switch_close');
      queue.push('pour');
    } else if (currentActionType === 'switch_open_pour') {
      queue.push('switch_open');
      queue.push('pour');
    } else if (currentActionType === 'pour_cool') {
      queue.push('pour');
      queue.push('cool');
    } else {
      // Handle individual actions
      if (currentActionType.includes('switch_close')) {
        queue.push('switch_close');
      } else if (currentActionType.includes('switch_open')) {
        queue.push('switch_open');
      }

      // Add pour animation if needed
      const hasWaterChange = currentWaterAmount !== targetWaterAmount;
      if (currentActionType === 'pour' || currentActionType.includes('pour') || hasWaterChange) {
        queue.push('pour');
      }
    }

    // If we have animations, start the sequence
    if (queue.length > 0) {
      console.log("Starting animation sequence:", queue);
      state.animationQueue = queue;
      state.currentStep = queue[0];
      
      setCurrentStep(queue[0]);
    } else {
      // No animations needed, complete immediately
      completeAnimation();
    }
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    const state = animationStateRef.current;
    const completedStep = state.currentStep;
    console.log(`Animation step completed:`, completedStep);

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
      
      // Update the state
      state.currentStep = nextStep;
      
      setCurrentStep(nextStep);
      
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
    if (!showAnimation || currentStep !== 'pour') return;
    
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
    if (currentStep === 'pour') {
      startWaterCounting();
    }
  }, [currentStep]);

  // If not visible, don't render anything
  if (!showAnimation) return null;

  // Get the appropriate animation data
  const getAnimationData = () => {
    switch (currentStep) {
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
          key={`animation-${currentStep}`}
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
