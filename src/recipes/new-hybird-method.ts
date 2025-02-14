import { CoffeeRecipe } from "../types";

export const newHybridMethodDSL: CoffeeRecipe = {
  id: "new-hybrid-method",
  name: {
    en: "New Hybrid Method",
    ja: "新しいハイブリッドメソッド",
  },
  description: {
    en: "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. Unlike standard methods that stick solely to either immersion or pour-over, this approach begins with a full-immersion bloom to draw out deep, natural sweetness, then shifts to a pour-over to highlight vibrant, aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor that makes you want to try it right away.",
    ja:  "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",  
  },
  youTubeEmbedUrl: "https://www.youtube.com/embed/4FeUp_zNiiY",
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
