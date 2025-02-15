import React from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Brightness4, Brightness7, VolumeOff, Vibration, VolumeUp, Man, Woman } from '@mui/icons-material';
import { NotificationMode } from '../types';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../translations/index';

const SettingsScreen : React.FC = () => {
  const { language, setLanguage, darkMode, setDarkMode, notificationMode, setNotificationMode, voice, setVoice } = useSettings();
  const t = translations[language];
  const navigate = useNavigate();

  const handleLanguageChange = (_e: React.MouseEvent<HTMLElement>, newLang: 'en' | 'ja') => {
    if (newLang) setLanguage(newLang);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotificationMode = () => {
    const modes: NotificationMode[] = ['vibrate', 'sound', 'none'];
    setNotificationMode(modes[(modes.indexOf(notificationMode) + 1) % modes.length]);
  };

  const toggleVoice = () => {
    setVoice(voice === 'male' ? 'female' : 'male');
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
      <IconButton onClick={toggleDarkMode} color="inherit">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Notification Mode */}
      <Typography>{t.notification}</Typography>
      <IconButton onClick={toggleNotificationMode} color="inherit">
        {notificationMode === 'none'
          ? <VolumeOff />
          : notificationMode === 'vibrate'
          ? <Vibration />
          : <VolumeUp />
        }
      </IconButton>

      {/* Voice Mode */}
      <Typography>{t.voice}</Typography>
      <IconButton
        onClick={toggleVoice}
        sx={{ visibility: notificationMode === 'sound' ? 'visible' : 'hidden' }}
      >
        {voice === 'male' ? <Man /> : <Woman />}
      </IconButton>

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