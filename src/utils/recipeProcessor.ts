import { CoffeeRecipe, OutputStep } from "../types";

export function generateNewHybridSteps(recipe: CoffeeRecipe, userInputs: { [key: string]: any }): OutputStep[] {
  // グローバルコンテキストの作成
  let context: { [key: string]: any } = { ...userInputs };
  context["prevCumulative"] = 0;
  let outputSteps: OutputStep[] = [];
  let currentTime = 0;

  // 各ステップの処理
  for (const step of recipe.steps) {
    currentTime = step.time;
    let increment = step.waterFormula(context["beansAmount"], recipe.waterRatio, context["flavor"]);
    let cumulative = context["prevCumulative"] + increment;
    context["prevCumulative"] = cumulative;

    outputSteps.push({
      timeSec: currentTime,
      pourWaterMl: increment,
      cumulativeWaterMl: cumulative,
      descriptionKey: step.key,
      status: 'upcoming'
    });
  }
  return outputSteps;
}
