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
  amazonAssociate: string;
  preparation: string;
  keepScreenOn: string;
  aboutThisRecipe: string;
  settings: string;
  notification: string;
  voice: string;
  backToRecipe: string;
}

export type NotificationMode = 'none' | 'vibrate' | 'sound';

export interface CoffeeParam {
  key: keyof TranslationType;
  unit?: string;
  type: 'number' | 'enum';
  input: boolean;
  default?: any;
  formula?: (...args: any[]) => number;
  options?: string[];
}

interface CoffeeStep {
  time?: number;
  timeFomula?: (...args: any[]) => number | null;
  waterFormula: (...args: any[]) => number;
  action: { en: (cumulativeWaterMl?: number) => string; ja: (cumulativeWaterMl?: number) => string; };
}

export interface CoffeeRecipe {
  id: string;
  name: { en:string; ja:string };
  description: { en:string; ja:string };
  youTubeVideoId: string;
  equipments: { en: JSX.Element; ja: JSX.Element; };
  params: CoffeeParam[];
  waterRatio: number;
  preparationSteps?: { en: string[]; ja: string[] };
  steps: CoffeeStep[];
  generateSteps: (recipe: CoffeeRecipe, ...args: any[]) => Step[];
}

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'next';

export interface Step {
  timeSec: number;
  pourWaterMl: number;
  cumulativeWaterMl: number;
  action: { en: (amount?: number) => string; ja: (amount?: number) => string; };
  status: StepStatus;
}

export type LanguageType = 'en' | 'ja';

export type VoiceType = 'male' | 'female';
