import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        gap: 2,
      }}
    >
      {/* Drip Recipes logo */}
      <Typography
        variant="h6"
        onClick={() => navigate(`/${language}/recipes`)}
        sx={{
          cursor: 'pointer',
          fontFamily: 'Raleway',
          fontWeight: 'bold',
        }}
      >
        Drip Recipes
      </Typography>

      {/* Settings Button */}
      <IconButton
        onClick={() =>
          navigate(`/${language}/settings`, {
            state: { from: location.pathname },
          })
        }
        color="inherit"
        title={t.settings}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

export default Header;