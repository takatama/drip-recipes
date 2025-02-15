import React from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Brightness4, Brightness7, VolumeOff, Vibration, VolumeUp, Man, Woman } from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../translations/index';
import { LangageType } from '../types';

const SettingsScreen : React.FC = () => {
  const { language, setLanguage, darkMode, setDarkMode, notificationMode, setNotificationMode, voice, setVoice } = useSettings();
  const t = translations[language];
  const navigate = useNavigate();

  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: LangageType) => {
    if (newLang) setLanguage(newLang);
    navigate(`/${newLang}/settings`);
  };

  return (
    <Box sx={{ 
      p: 2,
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
     }}>
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

      {/* Back button */}
      <Box sx={{ mt: 3 }}>
        <Typography
          onClick={() => navigate(`/${language}/recipes/featured/new-hybrid-method`)}
          sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
        >
          {t.backToRecipe}
        </Typography>
      </Box>
    </Box>
  );
}

export default SettingsScreen;