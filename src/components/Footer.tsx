import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { TranslationType } from '../types';

interface FooterProps {
  t: TranslationType;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <Box sx={{
      mt: 'auto',
      pt: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
      textAlign: 'center',
    }}>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
        {t.footerCreatedBy}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
        <Link
          href="https://github.com/takatama/drip-recipes"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <GitHubIcon fontSize="small" />
          Drip Recipes
        </Link>
        <Link
          href="https://x.com/takatama_jp"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <TwitterIcon fontSize="small" />
          @takatama_jp
        </Link>
      </Box>
      <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
        {t.amazonAssociate}
      </Typography>
    </Box>
  );
};

export default Footer;
