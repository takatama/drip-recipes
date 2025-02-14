export interface StaticTranslations {
  title: string;
  beansAmount: string;
  waterVolume: string;
  taste: string;
  strength: string;
  sweet: string;
  middle: string;
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
  footerMethodBy: string;
  footerMethodVideo: string;
  footerCreatedBy: string;
  usesHarioSwitch: (link: JSX.Element) => JSX.Element;
  harioSwitchLink: string;
  amazonAssociate: string;
  preparation: string;
  preparationSteps: string[];
  keepScreenOn: string;
  recipeTitle: string;
  recipeDescription: string;
  recipeYouTubeEmbedUrl: string;
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
  time: number;
  pourAmount: number;
  cumulative: number;
  descriptionKey: keyof DynamicTranslations;
  status: StepStatus;
}

export type NotificationMode = 'none' | 'vibrate' | 'sound';
