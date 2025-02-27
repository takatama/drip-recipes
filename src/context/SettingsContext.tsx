'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LanguageType, NotificationMode, VoiceType } from '../types';

interface SettingsContextProps {
  locale: LanguageType;
  setLocale: (lang: LanguageType) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  notificationMode: NotificationMode;
  setNotificationMode: (notification: NotificationMode) => void;
  voice: VoiceType;
  setVoice: (voice: VoiceType) => void;
}

interface SettingsWithoutLocale {
  darkMode: boolean;
  notificationMode: NotificationMode;
  voice: VoiceType;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Get initial settings from cookies or use defaults
const getInitialSettings = () => {
  // Locale from NEXT_LOCALE cookie
  const nextLocale = Cookies.get('NEXT_LOCALE');
  const userLang = typeof navigator !== 'undefined' ? (navigator.language || navigator.languages[0]) : "en";
  const locale: LanguageType = nextLocale as LanguageType || (userLang.startsWith('ja') ? 'ja' : 'en');
  
  // Other settings from settings cookie
  const storedSettings = Cookies.get('settings');
  let settingsWithoutLocale: SettingsWithoutLocale = {
    darkMode: false,
    notificationMode: 'none',
    voice: 'male',
  };
  
  if (storedSettings) {
    try {
      settingsWithoutLocale = JSON.parse(storedSettings);
    } catch (error) {
      console.error('Cookie parse error:', error);
    }
  } else {
    // Default dark mode from system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      settingsWithoutLocale.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  // Combine locale and other settings
  return {
    locale,
    ...settingsWithoutLocale
  };
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(getInitialSettings());

  // Save settings to cookie whenever they change
  useEffect(() => {
    // Store locale in NEXT_LOCALE cookie
    Cookies.set('NEXT_LOCALE', settings.locale, { 
      expires: 365,
      path: '/',
      sameSite: 'lax'
    });
    
    // Store other settings in settings cookie
    const settingsWithoutLocale = {
      darkMode: settings.darkMode,
      notificationMode: settings.notificationMode,
      voice: settings.voice
    };
    
    Cookies.set('settings', JSON.stringify(settingsWithoutLocale), { expires: 365 });
  }, [settings]);

  const setLocale = (locale: LanguageType) => {
    setSettings(prev => ({ ...prev, locale }));
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

  return (
    <SettingsContext.Provider
      value={{
        locale: settings.locale,
        setLocale,
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
