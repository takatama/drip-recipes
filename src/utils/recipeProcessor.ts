import { CoffeeRecipe, Step } from "../types";

export function generateNewHybridSteps(recipe: CoffeeRecipe, beansAmount: number, flavor: string): Step[] {
  const outputSteps: Step[] = [];
  let currentTime = 0;
  let cumulative = 0;

  for (const step of recipe.steps) {
    currentTime = step.time;
    let increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor);
    cumulative += increment;

    outputSteps.push({
      timeSec: currentTime,
      pourWaterMl: increment,
      cumulativeWaterMl: cumulative,
      action: step.action,
      status: 'upcoming'
    });
  }
  return outputSteps;
}
