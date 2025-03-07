'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
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
  showAnimation: boolean;
  setShowAnimation: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface Settings {
  language: LanguageType;
  darkMode: boolean;
  notificationMode: NotificationMode;
  voice: VoiceType;
  showAnimation: boolean;
}

// Get initial settings from localStorage or use defaults
const getInitialSettings = (): Settings => {
  const storedSettings = Cookies.get('settings');
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings);
    } catch (error) {
      console.error('Cookie parse error:', error);
    }
  }

  // Default settings
  const userLang = typeof navigator !== 'undefined' ? (navigator.language || navigator.languages[0]) : "en";
  const defaultLang: LanguageType = userLang.startsWith('ja') ? 'ja' : 'en';
  let prefersDark = false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return {
    language: defaultLang,
    darkMode: prefersDark,
    notificationMode: 'none' as NotificationMode,
    voice: 'male' as VoiceType,
    showAnimation: true,
  };
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings());

  // Save settings to cookie whenever they change
  useEffect(() => {
    Cookies.set('settings', JSON.stringify(settings), { expires: 365 });
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
    setSettings(prev => ({ ...prev, voice }));
  };

  const setShowAnimation = (show: boolean) => {
    setSettings(prev => ({ ...prev, showAnimation: show }));
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
        showAnimation: settings.showAnimation === undefined ? true : settings.showAnimation,
        setShowAnimation,
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
