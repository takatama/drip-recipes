import { Step } from "../types";

// Function to calculate timer steps based on the new hybrid method
export function calculateSteps(beansAmount: number, flavor: string) {
  // Total water used = beansAmount * 15
  const totalWater = beansAmount * 15;
  const flavorWater = totalWater * 0.4;
  const strengthWater = totalWater * 0.6;
  let flavor1, flavor2;
  // Adjust flavor pours based on taste selection
  if (flavor === "sweet") {
    flavor1 = flavorWater * 0.42;
    flavor2 = flavorWater * 0.58;
  } else if (flavor === "sour") {
    flavor1 = flavorWater * 0.58;
    flavor2 = flavorWater * 0.42;
  } else {
    flavor1 = flavorWater * 0.5;
    flavor2 = flavorWater * 0.5;
  }
  // Fixed strength steps
  let strengthSteps = 2;

  const steps: Array<Step> = [];
  // Flavor pours are fixed at 0s and 45s
  steps.push({
    time: 0,
    pourAmount: flavor1,
    cumulative: flavor1,
    descriptionKey: "flavorPour1",
    status: 'upcoming'
  });
  steps.push({
    time: 40,
    pourAmount: flavor2,
    cumulative: flavor1 + flavor2,
    descriptionKey: "flavorPour2",
    status: 'upcoming'
  });
  // Strength pour 1 is fixed at 90 seconds (1:30)
  const strengthPourAmount = strengthWater / strengthSteps;
  steps.push({
    time: 90,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthWater * 0.444,
    descriptionKey: "strengthPour1",
    status: 'upcoming'
  });
  // Strength pour 2 is fixed at 130 seconds (2:10)
  steps.push({
    time: 130,
    pourAmount: strengthPourAmount,
    cumulative: steps[steps.length - 1].cumulative + strengthWater * 0.556,
    descriptionKey: "strengthPour2",
    status: 'upcoming'
  });
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 165,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "open",
    status: 'upcoming'
  });
  // Final step (finish) is fixed at 210 seconds
  steps.push({
    time: 210,
    pourAmount: 0,
    cumulative: totalWater,
    descriptionKey: "finish",
    status: 'upcoming'
  });
  return steps;
}
