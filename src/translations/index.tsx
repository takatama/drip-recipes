import { TranslationType } from "../types";

export const translations: Record<'en' | 'ja', TranslationType> = {
  en: {
    title: "New Hybrid Method",
    beansAmount: "Beans",
    waterAmount: "Water",
    flavor: "Flavor",
    strength: "Strength",
    sweet: "Sweet",
    neutral: "Neutral",
    medium: "Med",
    sour: "Sour",
    light: "Light",
    strong: "Strong",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    preparation: "Preparation:",
    flavorPour1: (amount: number) => `(Close / Up) Pour up to ${amount}g`,
    flavorPour2: (amount: number) => `(Open / Down) Pour up to ${amount}g`,
    strengthPour1: (amount: number) => `Pour up to ${amount}g then cool to 70℃`,
    strengthPour2: (amount: number) => `(Close / Up) Pour up to ${amount}g`,
    strengthPour3: (amount: number) => `Pour up to ${amount}g`,
    open: () => "(Open / Down) Wait until the water drains",
    finish: () => "Finish",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    roastLevel: "Roast",
    lightRoast: "Light",
    mediumRoast: "Medium",
    darkRoast: "Dark",
    waterTemp: "Temp",
    footerCreatedBy: "Drip Recipes was created by Hirokazu Takatama",
    usesHarioSwitch: (link: JSX.Element) => (<>This recipe uses {link}.</>),
    harioSwitchLink: "https://amzn.to/40TjUkH",
    amazonAssociate: "As an Amazon Associate, Drip Recipes earns from qualifying purchases.",
    keepScreenOn: "Screen will stay on while playing",
    aboutThisRecipe: "☕About this recipe",
  },
  ja: {
    title: "新しいハイブリッドメソッド",
    beansAmount: "豆の量",
    waterAmount: "湯量",
    flavor: "味わい",
    strength: "濃さ",
    sweet: "甘味",
    neutral: "バランス",
    medium: "バランス",
    sour: "酸味",
    light: "薄い",
    strong: "濃い",
    play: "再生",
    pause: "一時停止",
    reset: "リセット",
    preparation: "準備:",
    flavorPour1: (amount: number) => `(Close / Up) ${amount}g まで注湯`,
    flavorPour2: (amount: number) => `(Open / Down) ${amount}g まで注湯`,
    strengthPour1: (amount: number) => `${amount}g まで注湯後、70℃まで下げる`,
    strengthPour2: (amount: number) => `(Close / Up) ${amount}g まで注湯`,
    strengthPour3: (amount: number) => `${amount}g まで注湯`,
    open: () => "(Open / Down) お湯が落ち切るまで待つ",
    finish: () => "完成",
    language: "言語",
    darkMode: "ダークモード",
    lightMode: "ライトモード",
    roastLevel: "焙煎度",
    lightRoast: "浅煎り",
    mediumRoast: "中煎り",
    darkRoast: "深煎り",
    waterTemp: "湯温",
    footerCreatedBy: "Drip Recipes was created by Hirokazu Takatama",
    usesHarioSwitch: (link: JSX.Element) => (<>このレシピは {link} を使います。</>),
    harioSwitchLink: "https://amzn.to/3QjLse1",
    amazonAssociate: "Amazonのアソシエイトとして、Drip Recipesは適格販売により収入を得ています。",
    keepScreenOn: "再生中は画面をつけたままにします",
    aboutThisRecipe: "☕このレシピについて",
  }
};
