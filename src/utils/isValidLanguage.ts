import { LanguageType } from '../types';

export function isValidLanguage(lang: string): lang is LanguageType {
  return ['en', 'ja'].includes(lang);
}