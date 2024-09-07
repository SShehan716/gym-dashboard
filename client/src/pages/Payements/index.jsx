import React from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import PaymentTable from '../../components/PaymentTable'

const Payments = () => {
  return (
    <Box m="10px">
      <Header title="Monthly Payments" />
      <Box mt="80px">
        <PaymentTable />
      </Box>
    </Box>
  )
}
export default Payments;
