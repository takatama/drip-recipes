import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { LanguageType, TranslationType } from '../types';

interface HeaderProps {
  language: LanguageType;
  t: TranslationType;
}

const Header: React.FC<HeaderProps> = ({ language, t }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
      <IconButton
        onClick={() => navigate(`/${language}/settings`, { 
          state: { from: location.pathname } 
        })}
        color="inherit"
        title={t.settings}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  );
}

export default Header;
