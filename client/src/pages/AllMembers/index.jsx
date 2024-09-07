import React from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import MemberTable from '../../components/MemberTable'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

const UploadData = () => {
  return (
    <Box m="20px">
      <Header title="Gym Members" />
      <Box mt="80px">
      <Button variant="contained" color="secondary" href="/add-member">
        Add New Member <AddIcon />
      </Button>
      <MemberTable />
      </Box>
    </Box>
  )
}

export default UploadData
