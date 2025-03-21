import { CoffeeRecipeType } from "../types";

export const hoffmannBetter1CupV60: CoffeeRecipeType = {
  id: "hoffmann-better-1cup-v60",
  name: {
    en: "A Better 1 Cup V60 Technique",
    ja: "1杯どりV60テクニック"
  },
  description: {
    en: "Unlock incredible flavor in your V60 with this simple, repeatable technique by James Hoffmann. Using just 15g of coffee and 250g of water with a finer grind, you'll consistently brew a sweeter, fuller-bodied cup. The secret? Five precise 50g pours with short pauses to maintain optimal temperature and minimize acidity. Stop wasting water and start enjoying a truly exceptional single-cup V60 experience.",
    ja: "V60で驚くほどの風味を引き出す、James Hoffmann氏によるシンプルで再現性の高いテクニックです。コーヒー15gと水250g（細かい挽き）を使い、50gずつ5回に分けて注ぐことで、甘くコクのある一杯を実現。最適な温度維持と短いポーズで酸味を抑え、水の無駄をなくします。"
  },
  imageUrl: "https://drip-recipes.pages.dev/images/di-bella-coffee-Ko7PFAommGE-unsplash.jpg",
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
    { key: "waterTemp", unit: "℃", type: "number", input: false, formulaType: "waterTemp", temps: { "lightRoast": 100, "mediumRoast": 93, "darkRoast" : 83 } },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 15 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formulaType: "waterAmount" },
  ],
  steps: [
    {
      time: 0,
      waterAmountType: 'fivePour',
      name: {
        en: "Initial Bloom",
        ja: "蒸らし",
      },
      action: {
        en: "Pour up to ${cumulative}g to bloom",
        ja: "${cumulative}g まで注湯し蒸らす",
      },
      actionType: 'pour',
    },
    {
      time: 10,
      name: {
        en: "Swirl",
        ja: "撹拌"
      },
      action: {
        en: "Gently swirl",
        ja: "ドリッパーを揺する"
      },
      actionType: 'none',
    },
    {
      time: 45,
      waterAmountType: 'fivePour',
      name: {
        en: "Second Pour",
        ja: "2回目の注湯",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 70,
      waterAmountType: 'fivePour',
      name: {
        en: "Third Pour",
        ja: "3回目の注湯",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 90,
      waterAmountType: 'fivePour',
      name: {
        en: "Fourth Pour",
        ja: "4回目の注湯",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 110,
      waterAmountType: 'fivePour',
      name: {
        en: "Final Pour",
        ja: "最後の注湯",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 120,
      name: {
        en: "Swirl",
        ja: "撹拌"
      },
      action: {
        en: "Gently swirl",
        ja: "ドリッパーを揺する"
      },
      actionType: 'none',
    },
    {
      time: 180,
      action: {
        en: "Finish.",
        ja: "完成。"
      },
      actionType: 'none',
    }
  ],
  isDence: true
};
