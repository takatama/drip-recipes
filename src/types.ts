export interface TranslationType {
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
  keepScreenOn: string;
  aboutThisRecipe: string;
}

export type NotificationMode = 'none' | 'vibrate' | 'sound';

export interface CoffeeParam {
  key: keyof TranslationType;
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
  action: { en: (cumulativeWaterMl?: number) => string; ja: (cumulativeWaterMl?: number) => string; };
}

export interface CoffeeRecipe {
  id: string;
  name: { en:string; ja:string };
  description: { en:string; ja:string };
  youTubeEmbedUrl: string;
  params: CoffeeParam[];
  waterRatio: number;
  preparationSteps: { en: string[]; ja: string[] };
  steps: CoffeeStep[];
}

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'next';

export interface Step {
  timeSec: number;
  pourWaterMl: number;
  cumulativeWaterMl: number;
  action: { en: (amount?: number) => string; ja: (amount?: number) => string; };
  status: StepStatus;
}
