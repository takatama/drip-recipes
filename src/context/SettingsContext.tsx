import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { LangageType, NotificationMode, VoiceType } from '../types';
import { useMediaQuery } from '@mui/material';

interface SettingsContextProps {
  language: LangageType;
  setLanguage: (lang: LangageType) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  notificationMode: NotificationMode;
  setNotificationMode: (notification: NotificationMode) => void;
  voice: VoiceType;
  setVoice: (voice: VoiceType) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LangageType>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationMode, setNotificationMode] = useState<NotificationMode>('none');
  const [voice, setVoice] = useState<VoiceType>('male');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { lang } = useParams();
  
  // Update dark mode when system preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'ja')) {
      setLanguage(lang);
    }
  }, [lang]);

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        notificationMode,
        setNotificationMode,
        voice,
        setVoice
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