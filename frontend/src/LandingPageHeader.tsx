import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';

const StyledImage = styled('img')({
  height: '60px',
  marginRight: '16px',
  flexShrink: 0,
});

const LandingPageHeader = () => {
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{
      backgroundColor: theme.palette.grey['900'],
      boxShadow: 'none', // Remove shadow for a flatter look
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' , margin: {xs: '0.25rem 0', sm:'0.5rem'}, gap: 1}}>
        <StyledImage
          src="/XVIII ABC Dragon Spark Logo-modified.png"
          alt="Dragon Spark logo"
          sx={{height: {xs: 44, sm: 60}, marginRight: {xs: 0, sm: 2}}}
        />
        <Box textAlign="center">
          <Typography variant="h6" component="div" sx={{fontSize: {xs: '0.95rem', sm: '1.25rem'}}}>
            XVIII Airborne Corps
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{fontSize: {xs: '0.72rem', sm: '1rem'}}}>
            DRAGON SPARK INNOVATION HUB
          </Typography>
        </Box>
        <Typography variant="body2" color="white" fontWeight="bold" sx={{display: {xs: 'none', sm: 'block'}}}>
          JIOP / ODS
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default LandingPageHeader;
