import { CoffeeRecipeType } from "../types";

export const newHybridMethod: CoffeeRecipeType = {
  id: "new-hybrid-method",
  name: {
    en: "New Hybrid Method",
    ja: "新しいハイブリッドメソッド",
  },
  description: {
    en: "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. Unlike standard methods that stick solely to either immersion or pour-over, this approach begins with a full-immersion bloom to draw out deep, natural sweetness, then shifts to a pour-over to highlight vibrant, aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor that makes you want to try it right away.",
    ja: "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",
  },
  imageUrl: "https://drip-recipes.pages.dev/images/goran-ivos-1JsjRW6Sbwg-unsplash.jpg",
  youTubeVideoId: "4FeUp_zNiiY",
  equipments: {
    en: <>
    Use a <a href="https://amzn.to/40TjUkH" target="_blank" rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        Hario Switch
      </a> dripper for this method.</>,
    ja: <>
    ドリッパーは <a href="https://amzn.to/3QjLse1" target="_blank" rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        Hario Switch
      </a> を使います。</>,
  },
  params: [
    { key: "waterTemp", unit: "℃", type: "number", input: false, default: 90 },
    { key: "beansAmount", unit: "g", type: "number", input: true, default: 20 },
    { key: "waterAmount", unit: "ml", type: "number", input: false, formulaType: "waterAmount" },
    { key: "flavor", type: "enum", input: true, options: ["sweet", "neutral", "sour"], default: "neutral" }
  ],
  waterRatio: 15,
  preparationSteps: {
    en: [
      "Prepare room temperature water",
      "Keep the switch closed (Up)"
    ],
    ja: [
      "常温の水を準備",
      "スイッチを閉める (Close / Up)"
    ]
  },
  steps: [
    {
      time: 0,
      waterAmountType: 'flavor1',
      name: {
        en: "Initial Bloom",
        ja: "蒸らし",
      },
      action: {
        en: "(Close / Up) Pour up to ${cumulative}g",
        ja: "(Close / Up) ${cumulative}g まで注湯",
      },
      actionType: 'switch_close_pour',
    },
    {
      time: 40,
      waterAmountType: 'flavor2',
      name: {
        en: "Flavor Extraction",
        ja: "風味を抽出",
      },
      action: {
        en: "(Open / Down) Pour up to ${cumulative}g",
        ja: "(Open / Down) ${cumulative}g まで注湯",
      },
      actionType: 'switch_open_pour',
    },
    {
      time: 90,
      waterAmountType: 'strength',
      name: {
        en: "Percolation Extraction",
        ja: "透過式で抽出",
      },
      action: {
        en: "Pour up to ${cumulative}g then cool to 70℃",
        ja: "${cumulative}g まで注湯後、70℃まで下げる",
      },
      actionType: 'pour_cool',
    },
    {
      time: 130,
      waterAmountType: 'strength',
      name: {
        en: "Cool Immersion",
        ja: "低温の浸漬式で抽出",
      },
      action: {
        en: "(Close / Up) Pour up to ${cumulative}g",
        ja: "(Close / Up) ${cumulative}g まで注湯",
      },
      actionType: 'switch_close_pour',
    },
    {
      time: 165,
      name: {
        en: "Open the valve",
        ja: "バルブを開ける",
      },
      action: {
        en: "(Open / Down) Wait until the water drains",
        ja: "(Open / Down) お湯が落ち切るまで待つ",
      },
      actionType: 'switch_open',
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
