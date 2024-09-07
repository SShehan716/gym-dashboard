import React from 'react';
import InviteForm from '../../components/InviteForm';
import Header from '../../components/Header';
import { Box } from '@mui/material';

const AddUser = () => {
    return (
        <Box m="20px">
            <Header title="Invite User" subTitle="Enter User Details" />
            <Box mt="80px">
                <InviteForm />
            </Box>
        </Box>
    );
}

export default AddUser;
