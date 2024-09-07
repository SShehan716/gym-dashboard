import React, { useState } from 'react';

//mui imports
import { Box, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//firebase imports
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MemberForm = () => {

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [registeredDate, setRegisteredDate] = useState(new Date().toISOString().split('T')[0]);
    const [membershipNumber, setMembershipNumber] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);

    // form validation
    const isFormValid = () => {
        return name.trim() !== '' && mobile.trim() !== '' && dob.trim() !== '' && registeredDate.trim() !== '' && membershipNumber.trim() !== '';
    };

    //reset form
    const resetForm = () => {
        setName('');
        setMobile('');
        setDob('');
        setWeight('');
        setHeight('');
        setRegisteredDate(new Date().toISOString().split('T')[0]);
        setMembershipNumber('');
    };

    // open alert box
    const showSuccessSnackbar = () => {
        setOpenSnackbar(true);
    };

    //close alert box
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    //create member
    const createMember = async (e) => {
        e.preventDefault();
        try {
            const memberId = new Date().getTime().toString(); // Generate a unique ID for the member

            await setDoc(doc(db, "members", memberId), {
                name: name,
                mobile: mobile,
                dob: dob,
                weight: weight,
                height: height,
                registeredDate: registeredDate,
                membershipNumber: membershipNumber,
                createdBy: auth.currentUser.email,
            });

            //show alert box
            showSuccessSnackbar();

            //reset form
            resetForm();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ mt: 5, p: 3 }}>
            <TextField
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <TextField
                label="Mobile Number"
                type="text"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />

            <TextField
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                InputLabelProps={{ shrink: true }}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />

            <TextField
                label="Weight (kg)"
                type="number"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />

            <TextField
                label="Height (cm)"
                type="number"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
            />

            <TextField
                label="Registered Date"
                type="date"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                InputLabelProps={{ shrink: true }}
                value={registeredDate}
                onChange={(e) => setRegisteredDate(e.target.value)}
            />

            <TextField
                label="Membership Number"
                type="text"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={membershipNumber}
                onChange={(e) => setMembershipNumber(e.target.value)}
            />

            <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ width: '20%' }}
                onClick={createMember}
                disabled={!isFormValid()}
            >
                Register
            </Button>

            {/* Snackbar for successfully registered notifications */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Member successfully registered!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MemberForm;