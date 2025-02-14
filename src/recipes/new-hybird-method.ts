import { CoffeeRecipe } from "../types";

export const newHybridMethodDSL: CoffeeRecipe = {
  id: "new-hybrid-method",
  name: {
    en: "New Hybrid Method",
    ja: "新しいハイブリッドメソッド",
  },
  description: {
    en: "New hybrid method based on the 4:6 method by its author. It maximizes extraction early and slows it later.",
    ja: "4:6メソッドをベースにした新しいハイブリッドメソッド。初めに抽出を最大化し、後に遅くします。",
  },
  params: [
    { key: "waterTemp" , unit: "℃", type: "number", input: false, default: 90 },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 20 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formula: (beansAmount, waterRatio) => beansAmount * waterRatio },
    { key: "flavor", type: "enum", input: true, options: ["sweet", "neutral", "sour"], default: "neutral" }
  ],
  waterRatio: 15,
  steps: [
    {
      time: 0,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.42 : (flavor === 'sour' ? 0.58 : 0.5)),
      key: "flavorPour1"
    },
    {
      time: 40,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.58 : (flavor === 'sour' ? 0.42 : 0.5)),
      key: "flavorPour2"
    },
    {
      time: 90,
      waterFormula: (beansAmount, waterRatio) => beansAmount * waterRatio * 0.6 / 2,
      key: "strengthPour1"
    },
    {
      time: 130,
      waterFormula: (beansAmount, waterRatio) => beansAmount * waterRatio * 0.6 / 2,
      key: "strengthPour2"
    },
    {
      time: 165,
      waterFormula: (_beansAmount, _waterRatio) => 0,
      key: "open"
    },
    {
      time: 210,
      waterFormula: (_beansAmount, _waterRatio) => 0,
      key: "finish"
    }
  ]
};
