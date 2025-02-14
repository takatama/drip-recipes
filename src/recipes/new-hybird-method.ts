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
  preparationSteps: {
    en: [
      "Prepare room temperature water",
      "Warm up and rinse dripper",
      "Keep the switch closed (Up)"
    ],
    ja: [
      "常温の水を準備",
      "ドリッパーをお湯ですすぐ",
      "スイッチを閉める (Close / Up)"
    ]
  },
  steps: [
    {
      time: 0,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.42 : (flavor === 'sour' ? 0.58 : 0.5)),
      action: {
        en: (amount?: number) => `(Close / Up) Pour up to ${amount}g`,
        ja: (amount?: number) => `(Close / Up) ${amount}g まで注湯`,
      },
    },
    {
      time: 40,
      waterFormula: (beansAmount, waterRatio, flavor) => beansAmount * waterRatio * 0.4 * (flavor === 'sweet' ? 0.58 : (flavor === 'sour' ? 0.42 : 0.5)),
      action: {
        en: (amount?: number) => `(Open / Down) Pour up to ${amount}g`,
        ja: (amount?: number) => `(Open / Down) ${amount}g まで注湯`,
      },
    },
    {
      time: 90,
      waterFormula: (beansAmount, waterRatio) => beansAmount * waterRatio * 0.6 / 2,
      action: {
        en: (amount?: number) => `Pour up to ${amount}g then cool to 70℃`,
        ja: (amount?: number) => `${amount}g まで注湯後、70℃まで下げる`,
      },
    },
    {
      time: 130,
      waterFormula: (beansAmount, waterRatio) => beansAmount * waterRatio * 0.6 / 2,
      action: {
        en: (amount?: number) => `(Close / Up) Pour up to ${amount}g`,
        ja: (amount?: number) => `(Close / Up) ${amount}g まで注湯`,
      },
    },
    {
      time: 165,
      waterFormula: (_beansAmount, _waterRatio) => 0,
      action: {
        en: () => "(Open / Down) Wait until the water drains",
        ja: () => "(Open / Down) お湯が落ち切るまで待つ",
      },
    },
    {
      time: 210,
      waterFormula: (_beansAmount, _waterRatio) => 0,
      action: {
        en: () => "Finish",
        ja: () => "完成",
      },
    },
  ]
};
