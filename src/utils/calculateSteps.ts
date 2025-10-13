import { CoffeeRecipeType, CalculatedStep } from "../types";

type RecipeStep = CoffeeRecipeType['steps'][number];
type WaterAmountType = NonNullable<RecipeStep['waterAmountType']>;

type StrengthSetting = 'light' | 'medium' | 'strong';

const STRENGTH_START_TIME = 90;
const STRENGTH_END_TIME = 210;
const DEFAULT_STRENGTH_STEPS = 2;

const STRENGTH_STEP_MAP: Record<StrengthSetting, number> = {
  light: 1,
  medium: DEFAULT_STRENGTH_STEPS,
  strong: 3,
};

interface StepComputationContext {
  beansAmount: number;
  waterRatio: number;
  flavor: string;
  strengthSteps: number;
}

const roundMl = (value: number): number => Math.round(value);

const isStrengthSetting = (value: string | undefined): value is StrengthSetting =>
  value === 'light' || value === 'medium' || value === 'strong';

const getStrengthSteps = (strength?: string): number =>
  isStrengthSetting(strength) ? STRENGTH_STEP_MAP[strength] : DEFAULT_STRENGTH_STEPS;

const flavorModifier = (flavor: string, sweet: number, sour: number, neutral: number): number => {
  if (flavor === 'sweet') return sweet;
  if (flavor === 'sour') return sour;
  return neutral;
};

const WATER_AMOUNT_CALCULATORS: Record<WaterAmountType, (context: StepComputationContext) => number> = {
  flavor1: ({ beansAmount, waterRatio, flavor }) =>
    beansAmount * waterRatio * 0.4 * flavorModifier(flavor, 0.42, 0.58, 0.5),
  flavor2: ({ beansAmount, waterRatio, flavor }) =>
    beansAmount * waterRatio * 0.4 * flavorModifier(flavor, 0.58, 0.42, 0.5),
  strength: ({ beansAmount, waterRatio, strengthSteps }) =>
    (beansAmount * waterRatio * 0.6) / strengthSteps,
  fivePour: ({ beansAmount, waterRatio }) => (beansAmount * waterRatio) / 5,
};

const getWaterIncrement = (
  waterAmountType: RecipeStep['waterAmountType'],
  context: StepComputationContext,
): number => {
  if (!waterAmountType) return 0;
  const calculator = WATER_AMOUNT_CALCULATORS[waterAmountType];
  return calculator ? calculator(context) : 0;
};

const getStrengthStepTime = (strengthSteps: number, stepCount: number): number | null => {
  if (strengthSteps <= stepCount) {
    return null;
  }

  const interval = (STRENGTH_END_TIME - STRENGTH_START_TIME) / strengthSteps;
  return STRENGTH_START_TIME + interval * stepCount;
};

interface StepTimeResult {
  time: number | null;
  processedAutoTimedSteps: number;
}

const getStepTime = (
  step: RecipeStep,
  context: StepComputationContext,
  processedAutoTimedSteps: number,
): StepTimeResult => {
  if (step.calcTime) {
    const nextCount = processedAutoTimedSteps + 1;
    return {
      time: getStrengthStepTime(context.strengthSteps, nextCount),
      processedAutoTimedSteps: nextCount,
    };
  }

  return {
    time: typeof step.time === 'number' ? step.time : null,
    processedAutoTimedSteps,
  };
};

const replaceCumulativePlaceholder = (text: string, cumulative: number): string =>
  text.replaceAll('${cumulative}', cumulative.toString());

const createCalculatedStep = (
  step: RecipeStep,
  stepTime: number,
  incrementMl: number,
  cumulativeMl: number,
): CalculatedStep => ({
  timeSec: stepTime,
  incrementMl,
  cumulativeMl,
  name: step.name,
  action: {
    en: replaceCumulativePlaceholder(step.action.en, cumulativeMl),
    ja: replaceCumulativePlaceholder(step.action.ja, cumulativeMl),
  },
  actionType: step.actionType,
  status: 'upcoming',
});

const buildSteps = (
  recipe: CoffeeRecipeType,
  context: StepComputationContext,
): CalculatedStep[] => {
  let cumulative = 0;
  const calculatedSteps: CalculatedStep[] = [];
  let processedAutoTimedSteps = 0;

  for (const step of recipe.steps) {
    const { time, processedAutoTimedSteps: nextProcessedAutoTimedSteps } = getStepTime(
      step,
      context,
      processedAutoTimedSteps,
    );

    processedAutoTimedSteps = nextProcessedAutoTimedSteps;

    if (time === null) {
      continue;
    }

    const incrementMl = getWaterIncrement(step.waterAmountType, context);
    cumulative += roundMl(incrementMl);

    calculatedSteps.push(createCalculatedStep(step, time, incrementMl, cumulative));
  }

  return calculatedSteps;
};

export function calculateSteps(
  recipe: CoffeeRecipeType,
  beansAmount: number,
  flavor: string,
  strength?: string,
): CalculatedStep[] {
  const strengthSteps = getStrengthSteps(strength);
  const context: StepComputationContext = {
    beansAmount,
    waterRatio: recipe.waterRatio,
    flavor,
    strengthSteps,
  };

  return buildSteps(recipe, context);
}
