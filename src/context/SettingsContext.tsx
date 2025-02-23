'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageType, NotificationMode, VoiceType } from '../types';

interface SettingsContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  notificationMode: NotificationMode;
  setNotificationMode: (notification: NotificationMode) => void;
  voice: VoiceType;
  setVoice: (voice: VoiceType) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface Settings {
  language: LanguageType;
  darkMode: boolean;
  notificationMode: NotificationMode;
  voice: VoiceType;
}

// Get initial settings from localStorage or use defaults
const getInitialSettings = (): Settings => {
  const storedSettings = localStorage.getItem('settings');
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }

  // Default settings
  const userLang = navigator.language || navigator.languages[0];
  const defaultLang: LanguageType = userLang.startsWith('ja') ? 'ja' : 'en';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    language: defaultLang,
    darkMode: prefersDark,
    notificationMode: 'none' as NotificationMode,
    voice: 'male' as VoiceType,
  };
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(getInitialSettings());

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const setLanguage = (lang: LanguageType) => {
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const setDarkMode = (mode: boolean) => {
    setSettings(prev => ({ ...prev, darkMode: mode }));
  };

  const setNotificationMode = (mode: NotificationMode) => {
    setSettings(prev => ({ ...prev, notificationMode: mode }));
  };

  const setVoice = (voice: VoiceType) => {
    setSettings(prev => ({ ...prev, voice: voice }));
  };

  return (
    <SettingsContext.Provider
      value={{
        language: settings.language,
        setLanguage,
        darkMode: settings.darkMode,
        setDarkMode,
        notificationMode: settings.notificationMode,
        setNotificationMode,
        voice: settings.voice,
        setVoice,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}