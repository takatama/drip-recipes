import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import { LanguageType, TranslationType } from '../types';

interface HeaderProps {
  language: LanguageType;
  t: TranslationType;
}

const Header: React.FC<HeaderProps> = ({ language, t }) => {
  const router = useRouter();
  const pathname = usePathname();

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
        onClick={() => router.push(`/${language}/recipes`)}
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
          router.push(`/${language}/settings?from=${encodeURIComponent(pathname)}`)
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