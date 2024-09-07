import React from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import DashboardCards from '../../components/DashboardCards';

const DashboardPage = () => {
  return (
    <Box m="20px">
      <Header title="Dashboard" subTitle="Welcome to your dashboard" />
      <Box mt="80px">
        <DashboardCards />
      </Box>
    </Box>
  );
};

export default DashboardPage;