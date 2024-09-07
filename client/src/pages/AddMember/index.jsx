import React from 'react';
import MemberForm from '../../components/MemberForm';
import Header from '../../components/Header';
import { Box } from '@mui/material';

const AddMember = () => {
    return (
        <Box m="20px">
            <Header title="Add Member" subTitle="Enter Member Details" />
            <Box mt="80px">
                <MemberForm />
            </Box>
        </Box>
    );
}

export default AddMember;