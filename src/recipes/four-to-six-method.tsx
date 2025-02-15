import { CoffeeRecipe, Step } from "../types";

export const fourToSixMethod: CoffeeRecipe = {
  id: "four-to-six-method",
  name: {
    en: "4:6 Method",
    ja: "4:6 メソッド",
  },
  description: {
    en: "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. Unlike standard methods that stick solely to either immersion or pour-over, this approach begins with a full-immersion bloom to draw out deep, natural sweetness, then shifts to a pour-over to highlight vibrant, aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor that makes you want to try it right away.",
    ja: "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",
  },
  youTubeEmbedUrl: "https://www.youtube.com/embed/4FeUp_zNiiY",
  equipments: {
    en: (theme) => (<>
    This recipe uses <a href="https://amzn.to/40TjUkH" target="_blank" rel="noopener noreferrer"
        style={{ color: theme.palette.primary.main }}
      >
        Hario Switch
      </a> .</>),
    ja: (theme) => (<>
    このレシピは <a href="https://amzn.to/3QjLse1" target="_blank" rel="noopener noreferrer"
        style={{ color: theme.palette.primary.main }}
      >
        Hario Switch
      </a> を使います。</>),
  },
  params: [
    { key: "roastLevel", type: "enum", input: true, options: ["lightRoast", "mediumRoast", "darkRoast"], default: "mediumRoast" },
    { key: "waterTemp", unit: "℃", type: "number", input: false, formula: (roastLevel: string) => roastLevel === "light" ? 93 : (roastLevel === "medium" ? 88 : 83) },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 20 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formula: (beansAmount, waterRatio) => beansAmount * waterRatio },
    { key: "flavor", type: "enum", input: true, options: ["sweet", "neutral", "sour"], default: "neutral" },
    { key: "strength", type: "enum", input: true, options: ["light", "medium", "strong"], default: "med" }
  ],
  waterRatio: 15,
  steps: [
    {
      timeFomula: (_strengthSteps) => 0,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.42 : (flavor === 'sour' ? 0.58 : 0.5)),
      action: {
        en: (cumulativeWaterMl?: number) => `Pour up to ${cumulativeWaterMl}g`,
        ja: (cumulativeWaterMl?: number) => `${cumulativeWaterMl}g まで注湯`,
      },
    },
    {
      timeFomula: (_strengthSteps) => 45,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.58 : (flavor === 'sour' ? 0.42 : 0.5)),
      action: {
        en: (cumulativeWaterMl?: number) => `Pour up to ${cumulativeWaterMl}g`,
        ja: (cumulativeWaterMl?: number) => `${cumulativeWaterMl}g まで注湯`,
      },
    },
    {
      timeFomula: (_strengthSteps) => 90,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulativeWaterMl?: number) => `Pour up to ${cumulativeWaterMl}g`,
        ja: (cumulativeWaterMl?: number) => `1 ${cumulativeWaterMl}g まで注湯`,
      },
    },
    {
      timeFomula: (strengthSteps) => strengthSteps > 1 ? 90 + (210 - 90) / strengthSteps : null,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulativeWaterMl?: number) => `Pour up to ${cumulativeWaterMl}g`,
        ja: (cumulativeWaterMl?: number) => `2 ${cumulativeWaterMl}g まで注湯`,
      },
    },
    {
      timeFomula: (strengthSteps) => strengthSteps > 2 ? 90 + (210 - 90) / strengthSteps * 2 : null,
      waterFormula: (beansAmount, waterRatio, _flavor, strengthSteps) => {
        return beansAmount * waterRatio * 0.6 / strengthSteps;
      },
      action: {
        en: (cumulativeWaterMl?: number) => `Pour up to ${cumulativeWaterMl}g`,
        ja: (cumulativeWaterMl?: number) => `3 ${cumulativeWaterMl}g まで注湯`,
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
    console.log(beansAmount, flavor, strength);
    const strengthSteps = strength === 'light' ? 1 : (strength === 'strong' ? 3 : 2);

    for (const step of recipe.steps) {
      const rawTime = step.timeFomula?.(strengthSteps);
      console.log(strengthSteps, rawTime);
      if (rawTime === null) {
        continue;
      }
      let increment = step.waterFormula(beansAmount, recipe.waterRatio, flavor, strengthSteps);
      cumulative += increment;

      outputSteps.push({
        timeSec: rawTime ?? 0,
        pourWaterMl: increment,
        cumulativeWaterMl: cumulative,
        action: step.action,
        status: 'upcoming'
      });
    }
    return outputSteps;
  },
};
