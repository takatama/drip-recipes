export interface StaticTranslations {
  title: string;
  beansAmount: string;
  waterAmount: string;
  flavor: string;
  strength: string;
  sweet: string;
  neutral: string;
  medium: string;
  sour: string;
  light: string;
  strong: string;
  play: string;
  pause: string;
  reset: string;
  language: string;
  darkMode: string;
  lightMode: string;
  roastLevel: string;
  lightRoast: string;
  mediumRoast: string;
  darkRoast: string;
  waterTemp: string;
  footerCreatedBy: string;
  usesHarioSwitch: (link: JSX.Element) => JSX.Element;
  harioSwitchLink: string;
  amazonAssociate: string;
  preparation: string;
  preparationSteps: string[];
  keepScreenOn: string;
  recipeTitle: string;
}

export interface DynamicTranslations {
  flavorPour1: (amount: number) => string;
  flavorPour2: (amount: number) => string;
  strengthPour1: (amount: number) => string;
  strengthPour2: (amount: number) => string;
  strengthPour3: (amount: number) => string;
  open: () => string;
  finish: () => string;
}

export type TranslationType = StaticTranslations & DynamicTranslations;

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'next';

export interface Step {
  timeSec: number;
  pourWaterMl: number;
  cumulativeWaterMl: number;
  descriptionKey: keyof DynamicTranslations;
  status: StepStatus;
}

export type NotificationMode = 'none' | 'vibrate' | 'sound';

export interface CoffeeParam {
  key: keyof StaticTranslations;
  unit?: string;
  type: 'number' | 'enum';
  input: boolean;
  default?: any;
  formula?: (beansAmount: number, waterRatio: number) => number;
  options?: string[];
}

interface CoffeeStep {
  time: number;
  waterFormula: (beansAmount: number, waterRatio: number, flavor?: string) => number;
  key: keyof DynamicTranslations;
}

export interface CoffeeRecipe {
  id: string;
  name: { en:string; ja:string };
  description: { en:string; ja:string };
  youTubeEmbedUrl: string;
  params: CoffeeParam[];
  waterRatio: number;
  steps: CoffeeStep[];
}

export interface OutputStep {
  timeSec: number;
  pourWaterMl: number;
  cumulativeWaterMl: number;
  descriptionKey: keyof DynamicTranslations;
  status: StepStatus;
}
