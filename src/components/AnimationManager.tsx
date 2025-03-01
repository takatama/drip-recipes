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
  const { showAnimation, currentWaterAmount, targetWaterAmount, currentActionType, completeAnimation } = useAnimationManager();
  
  const [waterAmount, setWaterAmount] = useState(currentWaterAmount);
  const [currentStep, setCurrentStep] = useState<AnimationStep>(null);
  const [animationQueue, setAnimationQueue] = useState<AnimationStep[]>([]);
  const [countingActive, setCountingActive] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Ref to track if we're in the middle of a sequence
  const isProcessingQueueRef = useRef(false);

  // Ref to track if animations are completed
  const animationsCompletedRef = useRef(false);

  // Ref to store the initial props to detect actual changes
  const initialPropsRef = useRef({
    currentActionType,
    currentWaterAmount,
    targetWaterAmount
  });

  // Reset state when visibility changes
  useEffect(() => {
    if (showAnimation) {
      animationsCompletedRef.current = false;
      isProcessingQueueRef.current = false;
      initialPropsRef.current = {
        currentActionType,
        currentWaterAmount,
        targetWaterAmount
      };
    }
  }, [showAnimation, currentActionType, currentWaterAmount, targetWaterAmount]);

  // Determine the animation sequence based on actionType and water amounts
  useEffect(() => {
    if (!showAnimation) return;

    // Skip queue creation if we're already processing a queue
    if (isProcessingQueueRef.current && animationQueue.length > 0) {
      console.log("Already processing animation queue, skipping queue creation");
      return;
    }

    console.log("Animation starting with action type:", currentActionType);

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

    console.log("Animation queue created:", queue);
    setAnimationQueue(queue);
    setWaterAmount(currentWaterAmount);

    // Start the animation sequence if we have animations
    if (queue.length > 0) {
      isProcessingQueueRef.current = true;
      const firstStep = queue[0];
      setCurrentStep(firstStep);
      setAnimationKey(prevKey => prevKey + 1); // Force Lottie to re-render
      console.log("Starting first animation:", firstStep);
    } else {
      // If no animations needed, complete immediately
      completeAnimation();
    }
  }, [showAnimation, currentActionType, currentWaterAmount, targetWaterAmount, completeAnimation]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    const completedStep = currentStep;
    console.log(`Animation step completed:`, completedStep);

    // If we were counting, stop
    if (countingActive) {
      setCountingActive(false);
      setWaterAmount(targetWaterAmount);
    }

    // Remove the current animation from the queue and get the next one
    const updatedQueue = animationQueue.slice(1);
    console.log("Updated queue after completion:", updatedQueue);

    if (updatedQueue.length > 0) {
      // Get the next animation in the queue
      const nextStep = updatedQueue[0];
      console.log("Moving to next animation:", nextStep);

      // Important: Update the queue first, then set the current step
      setAnimationQueue(updatedQueue);
      setCurrentStep(nextStep);
      setAnimationKey(prevKey => prevKey + 1); // Force Lottie component to re-render
    } else {
      // All animations complete
      console.log("All animations completed");
      animationsCompletedRef.current = true;
      isProcessingQueueRef.current = false; // Mark that we're done with this queue

      // Call completeAnimation to update context state
      completeAnimation();
    }
  };

  // Water counting effect
  useEffect(() => {
    if (!showAnimation || currentStep !== 'pour') return;

    let startTime: number;
    let animationFrameId: number;
    const duration = 1000; // 1 second counting duration

    // Start counting after a short delay
    const timerId = setTimeout(() => {
      setCountingActive(true);
      startTime = performance.now();

      const updateCounter = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newAmount = currentWaterAmount + (targetWaterAmount - currentWaterAmount) * progress;
        setWaterAmount(Math.round(newAmount));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCounter);
        } else {
          setWaterAmount(targetWaterAmount);
        }
      };

      animationFrameId = requestAnimationFrame(updateCounter);
    }, 500); // Start counting after 500ms

    return () => {
      clearTimeout(timerId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentStep, currentWaterAmount, targetWaterAmount, showAnimation]);

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
          key={`animation-${currentStep}-${animationKey}`}
          loop={false}
          animationData={animationData}
          play={!animationsCompletedRef.current}
          style={{
            width: 200,
            height: 200,
            opacity: animationsCompletedRef.current ? 0 : 1 // Hide animation when complete
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
