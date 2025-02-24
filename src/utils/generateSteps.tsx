import { CoffeeRecipeType, Step } from "../types";

const calcTimeForStrengthStep = (strengthSteps: number, stepCount: number) => strengthSteps > stepCount ? 90 + (210 - 90) / strengthSteps * stepCount: null;

const generateStrengthSteps = (recipe: CoffeeRecipeType, beansAmount: number, flavor: string, strengthSteps: number) => {
  const outputSteps: Step[] = [];
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

    // If the step has a timeFormula, calculate the time
    let increment: number;
    if (step.waterFormula.length >= 4 && strengthSteps !== undefined) {
      increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor, strengthSteps);
    } else {
      increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor);
    }
    cumulative += increment;

    outputSteps.push({
      timeSec: stepTime,
      pourWaterMl: increment,
      cumulative: cumulative,
      action: step.action,
      status: 'upcoming',
    });
  }
  return outputSteps;
}

const generateNormalSteps = (recipe: CoffeeRecipeType, beansAmount: number, flavor: string) => {
  const outputSteps: Step[] = [];
  let cumulative = 0;

  for (const step of recipe.steps) {
    let stepTime = Number(step.time);
    const increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor);
    cumulative += increment;

    outputSteps.push({
      timeSec: stepTime,
      pourWaterMl: increment,
      cumulative: cumulative,
      action: step.action,
      status: 'upcoming',
    });
  }
  return outputSteps;
}

export function generateSteps(
  recipe: CoffeeRecipeType,
  beansAmount: number,
  flavor: string,
  strength?: string
): Step[] {
  if (recipe.stepType === 'strength') {
    const strengthSteps = strength === 'light' ? 1 : strength === 'strong' ? 3 : 2;
    return generateStrengthSteps(recipe, beansAmount, flavor, strengthSteps);
  }
  return generateNormalSteps(recipe, beansAmount, flavor);
}
