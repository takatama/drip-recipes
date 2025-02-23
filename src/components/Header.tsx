import React from 'react';
import Link from 'next/link';
import { Box, IconButton, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { LanguageType, TranslationType } from '../types';

interface HeaderProps {
  language: LanguageType;
  t: TranslationType;
  pathname: string;
}

const Header: React.FC<HeaderProps> = ({ language, t, pathname }) => {

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
      <Link href={`/${language}/recipes`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            fontFamily: 'Raleway',
            fontWeight: 'bold',
          }}
        >
          Drip Recipes
        </Typography>
      </Link>

      {/* Settings Button */}
      <Link
        href={`/${language}/settings${
          pathname ? `?from=${encodeURIComponent(pathname)}` : ''
        }`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton color="inherit" title={t.settings}>
          <SettingsIcon />
        </IconButton>
      </Link>
    </Box>
  );
};

export default Header;