import { TranslationType } from "../types";

export const translations: Record<'en' | 'ja', TranslationType> = {
  en: {
    title: "New Hybrid Method",
    beansAmount: "Beans",
    waterVolume: "Water",
    taste: "Taste",
    strength: "Strength",
    sweet: "Sweet",
    middle: "Middle",
    medium: "Med",
    sour: "Sour",
    light: "Light",
    strong: "Strong",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    preparation: "Preparation:",
    preparationSteps: [
      "Prepare room temperature water",
      "Warm up and rinse dripper",
      "Keep the switch closed"
    ],
    flavorPour1: (amount: number) => `(Close) Pour up to ${amount}g`,
    flavorPour2: (amount: number) => `(Open) Pour up to ${amount}g`,
    strengthPour1: (amount: number) => `Pour up to ${amount}g then cool to 70℃`,
    strengthPour2: (amount: number) => `(Close) Pour up to ${amount}g`,
    strengthPour3: (amount: number) => `Pour up to ${amount}g`,
    open: () => "(Open) Wait until the water drains",
    finish: () => "Finish",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    roastLevel: "Roast",
    lightRoast: "Light",
    mediumRoast: "Medium",
    darkRoast: "Dark",
    waterTemp: "Temp",
    footerMethodBy: "The new hybrid method was developed by Tetsu Kasuya",
    footerMethodVideo: "Watch the Method Video",
    footerCreatedBy: "Drip Recipes was developed by Hirokazu Takatama",
    usesHarioSwitch: (link: JSX.Element) => (<>This recipe uses {link}.</>),
    harioSwitchLink: "https://amzn.to/40TjUkH",
    amazonAssociate: "As an Amazon Associate, Drip Recipes earns from qualifying purchases.",
  },
  ja: {
    title: "新しいハイブリッドメソッド",
    beansAmount: "豆の量",
    waterVolume: "湯量",
    taste: "味",
    strength: "濃さ",
    sweet: "甘味",
    middle: "バランス",
    medium: "バランス",
    sour: "酸味",
    light: "薄い",
    strong: "濃い",
    play: "再生",
    pause: "一時停止",
    reset: "リセット",
    preparation: "準備:",
    preparationSteps: [
      "常温の水を準備",
      "ドリッパーをお湯ですすぐ",
      "スイッチを閉める (Close)"
    ],
    flavorPour1: (amount: number) => `(Close) ${amount}g まで注湯`,
    flavorPour2: (amount: number) => `(Open) ${amount}g まで注湯`,
    strengthPour1: (amount: number) => `${amount}g まで注湯後、70℃まで下げる`,
    strengthPour2: (amount: number) => `(Close) ${amount}g まで注湯`,
    strengthPour3: (amount: number) => `${amount}g まで注湯`,
    open: () => "(Open) お湯が落ち切るまで待つ",
    finish: () => "完成",
    language: "言語",
    darkMode: "ダークモード",
    lightMode: "ライトモード",
    roastLevel: "焙煎度",
    lightRoast: "浅煎り",
    mediumRoast: "中煎り",
    darkRoast: "深煎り",
    waterTemp: "湯温",
    footerMethodBy: "新しいハイブリッドメソッドは粕谷哲氏が考案しました",
    footerMethodVideo: "メソッドの解説動画",
    footerCreatedBy: "Drip Recipes was developed by Hirokazu Takatama",
    usesHarioSwitch: (link: JSX.Element) => (<>このレシピは {link} を使います。</>),
    harioSwitchLink: "https://amzn.to/3QjLse1",
    amazonAssociate: "Amazonのアソシエイトとして、Drip Recipesは適格販売により収入を得ています。",
  }
};
