import React from 'react';
import LoginForm from '../../components/LoginForm';
import { Typography, Box, useMediaQuery } from '@mui/material';

const Login = () => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <Box
      className="login-container"
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
      justifyContent="center"
      height={isMobile ? "80vh" : "100vh"}
      p={isMobile ? 0 : 10}
    >
      <Box
        className="left-content"
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={isMobile ? 0 : 0}
        height={isMobile ? "10%" : "100%"}
      >
        <Typography
          variant={isMobile ? "h2" : "h1"}
          color="secondary"
          fontWeight="bold"
          align={isMobile ? "center" : "left"}
          ml={isMobile ? 0 : 12}
        >
          Welcome to the Chathura Fitness!
        </Typography>
      </Box>
      <Box
        className="right-content"
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <main>
          <LoginForm />
        </main>
      </Box>
    </Box>
  );
}

export default Login;