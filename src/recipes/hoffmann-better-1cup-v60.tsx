import { CoffeeRecipe } from "../types";

export const hoffmannBetter1CupV60: CoffeeRecipe = {
  id: "hoffmann-better-1cup-v60",
  name: {
    en: "A Better 1 Cup V60 Technique",
    ja: "1杯どりV60テクニック"
  },
  description: {
    en: "Unlock incredible flavor in your V60 with this simple, repeatable technique by James Hoffmann. Using just 15g of coffee and 250g of water with a finer grind, you'll consistently brew a sweeter, fuller-bodied cup. The secret? Five precise 50g pours with short pauses to maintain optimal temperature and minimize acidity. Stop wasting water and start enjoying a truly exceptional single-cup V60 experience.",
    ja: "V60で驚くほどの風味を引き出す、James Hoffmann氏によるシンプルで再現性の高いテクニックです。コーヒー15gと水250g（細かい挽き）を使い、50gずつ5回に分けて注ぐことで、甘くコクのある一杯を実現。最適な温度維持と短いポーズで酸味を抑え、水の無駄をなくします。"
  },
  youTubeVideoId: "1oB1oDrDkHM",
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
  waterRatio: 16.67,
  params: [
    { key: "roastLevel", type: "enum", input: true, options: ["lightRoast", "mediumRoast", "darkRoast"], default: "mediumRoast" },
    { key: "waterTemp", unit: "℃", type: "number", input: false, formula: (_b: number, _w: number, roastLevel: string) => roastLevel === "lightRoast" ? 100 : (roastLevel === "mediumRoast" ? 93 : 83) },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 15 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formula: (beansAmount: number, waterRatio: number) => Math.floor(beansAmount * waterRatio) },
  ],
  steps: [
    {
      time: 0,
      waterFormula: (beansAmount: number, waterRatio: number) => (beansAmount * waterRatio) / 5,
      action: {
        en: (cumulative: number) => `Pour ${cumulative}g to bloom`,
        ja: (cumulative: number) => `${cumulative}gまで注湯し蒸らす`
      }
    },
    {
      time: 10,
      waterFormula: (_beansAmount: number, _waterRatio: number) => 0,
      action: {
        en: () => "Gently swirl",
        ja: () => "ドリッパーを揺する"
      }
    },
    {
      time: 45,
      waterFormula: (beansAmount: number, waterRatio: number) => (beansAmount * waterRatio) / 5,
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g total`,
        ja: (cumulative: number) => `${cumulative}gまで注湯`
      }
    },
    {
      time: 70,
      waterFormula: (beansAmount: number, waterRatio: number) => (beansAmount * waterRatio) / 5,
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g total`,
        ja: (cumulative: number) => `${cumulative}gまで注湯`
      }
    },
    {
      time: 90,
      waterFormula: (beansAmount: number, waterRatio: number) => (beansAmount * waterRatio) / 5,
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g total`,
        ja: (cumulative: number) => `${cumulative}gまで注湯`
      }
    },
    {
      time: 110,
      waterFormula: (beansAmount: number, waterRatio: number) => (beansAmount * waterRatio) / 5,
      action: {
        en: (cumulative: number) => `Pour up to ${cumulative}g total`,
        ja: (cumulative: number) => `${cumulative}gまで注湯`
      }
    },
    {
      time: 120,
      waterFormula: (_beansAmount: number, _waterRatio: number) => 0,
      action: {
        en: () => "Gently swirl",
        ja: () => "ドリッパーを揺する"
      }
    },
    {
      time: 180,
      waterFormula: (_beansAmount: number, _waterRatio: number) => 0,
      action: {
        en: () => "Finish.",
        ja: () => "完成。"
      }
    }
  ],
  generateSteps: (recipe: CoffeeRecipe, beansAmount: number) => {
    const outputSteps: any[] = [];
    let cumulative = 0;
    let currentTime = 0;
    for (const step of recipe.steps) {
      currentTime = step.time || 0;
      const increment = step.waterFormula(beansAmount, recipe.waterRatio);
      cumulative += increment;
      outputSteps.push({
        timeSec: currentTime,
        pourWaterMl: increment,
        cumulative,
        action: step.action,
        status: 'upcoming'
      });
    }
    return outputSteps;
  },
  isDence: true
};
