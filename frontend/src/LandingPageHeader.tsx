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
});

const LandingPageHeader = () => {
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{
      backgroundColor: theme.palette.grey['900'],
      boxShadow: 'none', // Remove shadow for a flatter look
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' , margin:'0.5rem'}}>
        <StyledImage
          src="/XVIII ABC Dragon Spark Logo-modified.png"
          alt="Dragon Spark logo"
        />
        <Box textAlign="center">
          <Typography variant="h6" component="div">
            XVIII Airborne Corps
          </Typography>
          <Typography variant="subtitle1" component="div">
            DRAGON SPARK INNOVATION HUB
          </Typography>
        </Box>
        <Typography variant="body2" color="white" fontWeight="bold">
          JIOP / ODS
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default LandingPageHeader;
