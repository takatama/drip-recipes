import { useRef, useCallback } from 'react';
import { CalculatedStep, StepStatus } from '../types';

const INDICATE_NEXT_STEP_SEC = 5;

export const useStepCalculation = (
  onStepStatusChange?: (index: number, oldStatus: StepStatus, newStatus: StepStatus) => void,
  onStepTransition?: (index: number, currentAmount: number, targetAmount: number) => void,
  onTimerComplete?: () => void,
) => {
  const previousStepsStatusRef = useRef<Record<number, StepStatus>>({});

  const calculateStepStatuses = useCallback((
    currentTimeValue: number, 
    currentSteps: CalculatedStep[]
  ): CalculatedStep[] => {
    const lastStep = currentSteps[currentSteps.length - 1];
    if (currentTimeValue >= lastStep?.timeSec && onTimerComplete) {
      onTimerComplete();
    }

    return currentSteps.map((step, index) => {
      let newStatus: StepStatus = 'upcoming';

      if (currentTimeValue >= step.timeSec && (index === currentSteps.length - 1 || currentTimeValue < currentSteps[index + 1].timeSec)) {
        newStatus = 'current';
      } else if (currentTimeValue >= step.timeSec) {
        newStatus = 'completed';
      } else if (currentTimeValue >= step.timeSec - INDICATE_NEXT_STEP_SEC && currentTimeValue < step.timeSec) {
        newStatus = 'next';
      }

      const previousStatus = previousStepsStatusRef.current[index];
      if (previousStatus !== newStatus) {
        if (onStepStatusChange) {
          onStepStatusChange(index, previousStatus || 'upcoming', newStatus);
        }
        
        if (newStatus === 'next' && onStepTransition) {
          const currentAmount = index > 0 ? (currentSteps[index - 1].cumulativeMl || 0) : 0;
          const targetAmount = step.cumulativeMl || 0;
          onStepTransition(index, currentAmount, targetAmount);
        }

        previousStepsStatusRef.current[index] = newStatus;
      }

      return { ...step, status: newStatus };
    });
  }, [onStepStatusChange, onStepTransition, onTimerComplete]);

  return { calculateStepStatuses };
};
