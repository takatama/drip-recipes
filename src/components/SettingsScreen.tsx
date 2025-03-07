'use client';

import React from 'react';
import { Container, Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brightness4, Brightness7, VolumeOff, Vibration, VolumeUp, Man, Woman, Visibility, VisibilityOff } from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { translations } from '../translations/index';
import { LanguageType } from '../types';
import Header from './Header';
import Footer from './Footer';

const SettingsScreen: React.FC = () => {
  const {
    language, setLanguage,
    darkMode, setDarkMode,
    notificationMode, setNotificationMode,
    voice, setVoice,
    showAnimation, setShowAnimation,
  } = useSettings();
  const t = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from') || `/${language}/recipes/featured/new-hybrid-method`;

  const handleBack = () => {
    router.push(fromPath);
  };

  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: LanguageType) => {
    if (newLang) {
      const newFromPath = fromPath.replace(`/${language}/`, `/${newLang}/`);
      router.push(`/${newLang}/settings?from=${encodeURIComponent(newFromPath)}`);
      setLanguage(newLang);
    }
  };

  return (
    <Container maxWidth="sm" sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      py: 2,
      width: '100%',
    }}>
      <Header language={language} t={t} pathname={`/${language}/settings`} />

      <Typography variant="h6" sx={{ mb: 2 }}>{t.settings}</Typography>

      {/* Language */}
      <Typography>{t.language}</Typography>
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleLanguageChange}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="en">EN</ToggleButton>
        <ToggleButton value="ja">JA</ToggleButton>
      </ToggleButtonGroup>

      {/* Dark Mode */}
      <Typography>{t.darkMode}</Typography>
      <ToggleButtonGroup
        value={darkMode}
        exclusive
        onChange={(_e, newValue) => {
          if (newValue !== null) setDarkMode(newValue);
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value={false}>
          <Brightness7 />
        </ToggleButton>
        <ToggleButton value={true}>
          <Brightness4 />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Notification Mode */}
      <Typography>{t.notification}</Typography>
      <ToggleButtonGroup
        value={notificationMode}
        exclusive
        onChange={(_e, newValue) => {
          if (newValue !== null) setNotificationMode(newValue);
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="none">
          <VolumeOff />
        </ToggleButton>
        <ToggleButton value="vibrate">
          <Vibration />
        </ToggleButton>
        <ToggleButton value="sound">
          <VolumeUp />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Voice Mode */}
      <Typography>{t.voice}</Typography>
      <ToggleButtonGroup
        value={voice}
        exclusive
        onChange={(_e, newValue) => {
          if (newValue !== null) setVoice(newValue);
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="male">
          <Man />
        </ToggleButton>
        <ToggleButton value="female">
          <Woman />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Animation Guide Settings */}
      <Typography>{t.animation}</Typography>
      <ToggleButtonGroup
        value={showAnimation}
        exclusive
        onChange={(_e, newValue) => {
          if (newValue !== null) setShowAnimation(newValue);
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value={true}>
          <Visibility sx={{ mr: 1 }} />
          {t.animationOn}
        </ToggleButton>
        <ToggleButton value={false}>
          <VisibilityOff sx={{ mr: 1 }} />
          {t.animationOff}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Back button */}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography
          onClick={handleBack}
          sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
        >
          {t.backToRecipe}
        </Typography>
      </Box>

      <Footer t={t} />
    </Container>
  );
}

export default SettingsScreen;