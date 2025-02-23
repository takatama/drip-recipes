import { CoffeeRecipe, Step } from "../types";

export const fourToSixMethod: CoffeeRecipe = {
  id: "four-to-six-method",
  name: {
    en: "4:6 Method",
    ja: "4:6 メソッド",
  },
  description: {
    en: "Experience the precision of the 4:6 method, where the total water is meticulously divided into a 40% flavor extraction and a 60% strength extraction. The first pour gently blooms the coffee to release its natural sweetness, while the second pour extracts a robust body and balanced aroma. This method yields a cup with vibrant clarity, harmonious flavor, and a smooth finish that showcases every nuance of the beans.",
    ja: "4:6メソッドは、全体の水量を40％の風味抽出と60％の濃度抽出に緻密に分割することで、その真価を発揮します。最初の注ぎでコーヒーをやさしく蒸らして自然な甘みを引き出し、次の注ぎでしっかりとしたボディとバランスの取れた香りを抽出します。この方法により、鮮やかな透明感と調和の取れた風味、そしてまろやかな飲みごこちを持つ一杯を実現し、豆の魅力を余すところなく引き出します。"
  },
  youTubeVideoId: "lJNPp-onikk",
  equipments: {
    en: <>
    Use a <a href="https://amzn.to/4aXhmH3" target="_blank" rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        Hario V60
      </a> dripper for this method.</>,
    ja: <>
    ドリッパーは <a href="https://amzn.to/3X1jxUi" target="_blank" rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        Hario V60
      </a> を使います。</>,
  },
  params: [
    { key: "roastLevel", type: "enum", input: true, options: ["lightRoast", "mediumRoast", "darkRoast"], default: "mediumRoast" },
    { key: "waterTemp", unit: "℃", type: "number", input: false, formula: (_beansAmount, _waterRatio, roastLevel: string) => roastLevel === "lightRoast" ? 93 : (roastLevel === "mediumRoast" ? 88 : 83) },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 20 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formula: (beansAmount, waterRatio) => beansAmount * waterRatio },
    { key: "flavor", type: "enum", input: true, options: ["sweet", "neutral", "sour"], default: "neutral" },
    { key: "strength", type: "enum", input: true, options: ["light", "medium", "strong"], default: "medium" }
  ],
  waterRatio: 15,
  steps: [
    {
      timeFomula: (_strengthSteps) => 0,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.42 : (flavor === 'sour' ? 0.58 : 0.5)),
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g`,
        ja: (cumulative: number) => `${cumulative}g まで注湯`,
      },
    },
    {
      timeFomula: (_strengthSteps) => 45,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.58 : (flavor === 'sour' ? 0.42 : 0.5)),
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g`,
        ja: (cumulative: number) => `${cumulative}g まで注湯`,
      },
    },
    {
      timeFomula: (_strengthSteps) => 90,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g`,
        ja: (cumulative: number) => `${cumulative}g まで注湯`,
      },
    },
    {
      timeFomula: (strengthSteps) => strengthSteps > 1 ? 90 + (210 - 90) / strengthSteps : null,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g`,
        ja: (cumulative: number) => `${cumulative}g まで注湯`,
      },
    },
    {
      timeFomula: (strengthSteps) => strengthSteps > 2 ? 90 + (210 - 90) / strengthSteps * 2 : null,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g`,
        ja: (cumulative: number) => `${cumulative}g まで注湯`,
      },
    },
    {
      timeFomula: () => 210,
      waterFormula: (_beansAmount, _waterRatio) => 0,
      action: {
        en: () => "Finish",
        ja: () => "完成",
      },
    },
  ],
  generateSteps: (recipe: CoffeeRecipe, beansAmount: number, flavor: string, strength: string): Step[] => {
    const outputSteps: Step[] = [];
    let cumulative = 0;
    const strengthSteps = strength === 'light' ? 1 : (strength === 'strong' ? 3 : 2);

    for (const step of recipe.steps) {
      const rawTime = step.timeFomula?.(strengthSteps);
      if (rawTime === null) {
        continue;
      }
      let increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor, strengthSteps);
      cumulative += increment;

      outputSteps.push({
        timeSec: rawTime ?? 0,
        pourWaterMl: increment,
        cumulative: cumulative,
        action: step.action,
        status: 'upcoming'
      });
    }
    return outputSteps;
  },
};
