import { JSX } from "react";

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
  recipeListTitle: string;
  recipeListDescription: string;
  nextStep: string;
  animation: string;
  animationOn: string;
  animationOff: string;
}

export type NotificationMode = 'none' | 'vibrate' | 'sound';

export interface CoffeeParam {
  key: keyof TranslationType;
  unit?: string;
  type: 'number' | 'enum';
  input: boolean;
  default?: number | string;
  formulaType?: 'waterAmount' | 'waterTemp';
  temps?: Record<RoastLevelType, number>;
  options?: string[];
}

export type ActionType = 
  | 'none'
  | 'pour'
  | 'switch_open'
  | 'switch_close'
  | 'pour_cool'
  | 'switch_open_pour'
  | 'switch_close_pour';

interface CoffeeRecipeStep {
  time?: number;
  calcTime?: boolean;
  waterAmountType?: 'fivePour' | 'flavor1' | 'flavor2' |'strength';
  name?: { en: string; ja: string; };
  action: { en: string; ja: string; };
  actionType: ActionType;
}

export interface CoffeeRecipeType {
  id: string;
  name: { en: string; ja: string };
  description: { en: string; ja: string };
  imageUrl: string;
  youTubeVideoId: string;
  equipments: { en: JSX.Element; ja: JSX.Element; };
  params: CoffeeParam[];
  waterRatio: number;
  preparationSteps?: { en: string[]; ja: string[] };
  steps: CoffeeRecipeStep[];
  isDence?: boolean;
}

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'next';

export interface CalculatedStep {
  timeSec: number;
  incrementMl: number;
  cumulativeMl: number;
  name?: { en: string; ja: string; };
  action: { en: string; ja: string; };
  actionType: ActionType;
  status: StepStatus;
}

export type LanguageType = 'en' | 'ja';

export type VoiceType = 'male' | 'female';

export type RoastLevelType = 'lightRoast' | 'mediumRoast' | 'darkRoast';


export interface CoffeeTimerState {
  currentWaterAmount: number;
  targetWaterAmount: number;
  currentActionType: ActionType;
  isNextStep: boolean;
  isFinish: boolean;
  shouldVibrate: boolean;
  isReset: boolean;
  showAnimation: boolean;
}

export interface CoffeeTimerAction {
  type: 
    | 'START'
    | 'ANIMATION_COMPLETE'
    | 'NEXT_STEP_UPCOMING'
    | 'NEXT_STEP_RUNNING'
    | 'FINISH'
    | 'RESET'
    | 'SET_CURRENT_WATER_AMOUNT'
    | 'SET_TARGET_WATER_AMOUNT'
    | 'SET_ACTION_TYPE';
  payload?: { currentWaterAmount: number; targetWaterAmount: number; currentActionType: ActionType };
}

