import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { LangageType, TranslationType } from '../types';

interface HeaderProps {
  language: LangageType;
  t: TranslationType;
}

const Header: React.FC<HeaderProps> = ({ language, t }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
      <IconButton
        onClick={() => navigate(`/${language}/settings`)}
        color="inherit"
        title={t.settings}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  );
}

export default Header;
