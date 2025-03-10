import { CoffeeRecipeType, CalculatedStep } from "../types";

const calcTimeForStrengthStep = (strengthSteps: number, stepCount: number) => strengthSteps > stepCount ? 90 + (210 - 90) / strengthSteps * stepCount: null;

const calcFlavor1WaterAmount = (beansAmount: number, waterRatio: number, flavor: string) => {
  return beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.42 : (flavor === 'sour' ? 0.58 : 0.5));
};

const calcFlavor2WaterAmount = (beansAmount: number, waterRatio: number, flavor: string) => {
  return beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.58 : (flavor === 'sour' ? 0.42 : 0.5));
};

const calcStrengthWaterAmount = (beansAmount: number, waterRatio: number, strengthSteps: number) => {
  return beansAmount * waterRatio * 0.6 / strengthSteps;
};

const calcFivePourWaterAmount = (beansAmount: number, waterRatio: number) => {
  return beansAmount * waterRatio / 5;
};

const calculateStrengthSteps = (recipe: CoffeeRecipeType, beansAmount: number, flavor: string, strengthSteps: number) => {
  const outputSteps: CalculatedStep[] = [];
  let cumulative = 0;
  let stepCount = 0;

  for (const step of recipe.steps) {
    let stepTime: number | null = 0;
    if (step.calcTime) {
      stepCount++;
      stepTime = calcTimeForStrengthStep(strengthSteps, stepCount);
    } else if (typeof step.time === 'number') {
      stepTime = step.time;
    }

    if (stepTime === null) {
      continue;
    }

    let increment: number = 0;
    if (step.waterAmountType === 'flavor1') {
      increment = calcFlavor1WaterAmount(beansAmount, recipe.waterRatio, flavor);
    } else if (step.waterAmountType === 'flavor2') {
      increment = calcFlavor2WaterAmount(beansAmount, recipe.waterRatio, flavor);
    } else if (step.waterAmountType === 'strength') {
      increment = calcStrengthWaterAmount(beansAmount, recipe.waterRatio, strengthSteps);
    } else if (step.waterAmountType === 'fivePour') {
      increment = calcFivePourWaterAmount(beansAmount, recipe.waterRatio);
    }
    cumulative += Math.floor(Math.round(increment));

    outputSteps.push({
      timeSec: stepTime,
      incrementMl: increment,
      cumulativeMl: cumulative,
      name: step.name,
      action: {
        en: step.action.en.replace('${cumulative}', cumulative.toString()),
        ja: step.action.ja.replace('${cumulative}', cumulative.toString()),
      },
      actionType: step.actionType,
      status: 'upcoming',
    });
  }
  return outputSteps;
}

export function calculateSteps(
  recipe: CoffeeRecipeType,
  beansAmount: number,
  flavor: string,
  strength?: string
): CalculatedStep[] {
  const strengthSteps = strength === 'light' ? 1 : strength === 'strong' ? 3 : 2;
  return calculateStrengthSteps(recipe, beansAmount, flavor, strengthSteps);
}
