import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Lottie from 'react-lottie-player';
import pourAnimationData from '@/assets/lottie/pouring.json';
import switchOpenAnimationData from '@/assets/lottie/switch_open.json';
import switchCloseAnimationData from '@/assets/lottie/switch_close.json';
import { ActionType } from '../types';

interface AnimationManagerProps {
  isVisible: boolean;
  actionType: ActionType;
  currentWaterAmount: number;
  targetWaterAmount: number;
  onAnimationComplete?: () => void;
}

// Animation sequence types
type AnimationStep = 'switch_open' | 'switch_close' | 'pour' | null;

const AnimationManager: React.FC<AnimationManagerProps> = ({
  isVisible,
  actionType,
  currentWaterAmount,
  targetWaterAmount,
  onAnimationComplete
}) => {
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
    actionType,
    currentWaterAmount,
    targetWaterAmount
  });

  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible) {
      animationsCompletedRef.current = false;
      isProcessingQueueRef.current = false;
      initialPropsRef.current = {
        actionType,
        currentWaterAmount,
        targetWaterAmount
      };
    }
  }, [isVisible, actionType, currentWaterAmount, targetWaterAmount]);

  // Determine the animation sequence based on actionType and water amounts
  useEffect(() => {
    if (!isVisible) return;
    
    // Skip queue creation if we're already processing a queue
    // This prevents restarting when state changes during animation steps
    if (isProcessingQueueRef.current && animationQueue.length > 0) {
      console.log("Already processing animation queue, skipping queue creation");
      return;
    }

    console.log("Animation starting with action type:", actionType);
    
    const queue: AnimationStep[] = [];

    // Handle combined action types
    if (actionType === 'switch_close_pour') {
      queue.push('switch_close');
      queue.push('pour');
    } else if (actionType === 'switch_open_pour') {
      queue.push('switch_open');
      queue.push('pour');
    } else {
      // Handle individual actions
      if (actionType.includes('switch_close')) {
        queue.push('switch_close');
      } else if (actionType.includes('switch_open')) {
        queue.push('switch_open');
      }

      // Add pour animation if needed
      const hasWaterChange = currentWaterAmount !== targetWaterAmount;
      if (actionType === 'pour' || actionType.includes('pour') || hasWaterChange) {
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
    } else if (onAnimationComplete) {
      // If no animations needed, complete immediately
      onAnimationComplete();
    }
  }, [isVisible, actionType, currentWaterAmount, targetWaterAmount, onAnimationComplete]);

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
      
      // Call onAnimationComplete immediately
      if (onAnimationComplete) {
        console.log("Calling onAnimationComplete callback");
        onAnimationComplete();
      }
    }
  };

  // Water counting effect
  useEffect(() => {
    if (!isVisible || currentStep !== 'pour') return;

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
  }, [currentStep, currentWaterAmount, targetWaterAmount, isVisible]);

  // If not visible, don't render anything
  if (!isVisible) return null;

  // Get the appropriate animation data
  const getAnimationData = () => {
    switch (currentStep) {
      case 'switch_open': return switchOpenAnimationData;
      case 'switch_close': return switchCloseAnimationData;
      case 'pour': return pourAnimationData;
      default: return pourAnimationData; // Default to pour animation instead of null
    }
  };

  // Get text based on current animation
  const getAnimationText = () => {
    switch (currentStep) {
      case 'switch_open': return "バルブを開く";
      case 'switch_close': return "バルブを閉じる";
      case 'pour': return "注水中...";
      default: return "完了"; // Show "Completed" instead of empty text
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
          segments={[0, 100]} // Ensure we play the full animation
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      )}

      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
        {getAnimationText()}
      </Typography>

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
        {waterAmount} g
      </Typography>
    </Box>
  );
};

export default AnimationManager;