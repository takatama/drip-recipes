import { CoffeeRecipeType } from "../types";

export const fourToSixMethod: CoffeeRecipeType = {
  id: "four-to-six-method",
  name: {
    en: "4:6 Method",
    ja: "4:6 メソッド",
  },
  description: {
    en: "Experience the precision of the 4:6 method by Tetsu Kasuya, where the total water is meticulously divided into a 40% flavor extraction and a 60% strength extraction. The first pour gently blooms the coffee to release its natural sweetness, while the second pour extracts a robust body and balanced aroma. This method yields a cup with vibrant clarity, harmonious flavor, and a smooth finish that showcases every nuance of the beans.",
    ja: "粕谷哲氏の4:6メソッドは、全体の水量を40％の風味抽出と60％の濃度抽出に緻密に分割することで、その真価を発揮します。最初の注ぎでコーヒーをやさしく蒸らして自然な甘みを引き出し、次の注ぎでしっかりとしたボディとバランスの取れた香りを抽出します。この方法により、鮮やかな透明感と調和の取れた風味、そしてまろやかな飲みごこちを持つ一杯を実現し、豆の魅力を余すところなく引き出します。"
  },
  imageUrl: "https://drip-recipes.pages.dev/images/julien-labelle-G163WX71GFE-unsplash.jpg",
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
    { key: "waterTemp", unit: "℃", type: "number", input: false, formulaType: "waterTemp", temps: { "lightRoast": 93, "mediumRoast": 88, "darkRoast" : 83 } },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 20 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formulaType: "waterAmount" },
    { key: "flavor", type: "enum", input: true, options: ["sweet", "neutral", "sour"], default: "neutral" },
    { key: "strength", type: "enum", input: true, options: ["light", "medium", "strong"], default: "medium" }
  ],
  waterRatio: 15,
  steps: [
    {
      time: 0,
      waterAmountType: 'flavor1',
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
      time: 45,
      waterAmountType: 'flavor2',
      name: {
        en: "Flavor Extraction",
        ja: "風味を抽出",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 90,
      waterAmountType: 'strength',
      name: {
        en: "First Strength Pour",
        ja: "一回目の濃度調整",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      calcTime: true,
      waterAmountType: 'strength',
      name: {
        en: "Second Strength Pour",
        ja: "二回目の濃度調整",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      calcTime: true,
      waterAmountType: 'strength',
      name: {
        en: "Third Strength Pour",
        ja: "三回目の濃度調整",
      },
      action: {
        en: "Pour up to ${cumulative}g total",
        ja: "${cumulative}g まで注湯",
      },
      actionType: 'pour',
    },
    {
      time: 210,
      action: {
        en: "Finish",
        ja: "完成",
      },
      actionType: 'none',
    },
  ],
};
