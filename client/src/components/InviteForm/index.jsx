import React, { useState } from 'react';

//mui imports
import { Box, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//emailjs imports
import emailjs from 'emailjs-com';

//firebase imports
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InviteForm = () => {

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailInUseError, setEmailInUseError] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);

    //email validation
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailRegex.test(email);
    };

    const validateEmailOnBlur = () => {
        if (email && !validateEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    // form validation
    const isFormValid = () => {
        return name.trim() !== '' && role.trim() !== '' && email.trim() !== '' && !emailError;
    };

    //generate password
    const generateStrongPassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+{}[]|;:,.<>?';

        const allChars = uppercase + lowercase + numbers + symbols;
        let newPassword = '';

        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            newPassword += allChars[randomIndex];
        }

        return newPassword;
    };

    //reset form
    const resetForm = () => {
        setName('');
        setRole('');
        setEmail('');
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

    //create user
    const createUser = async (e) => {
        try {
            const password = generateStrongPassword();

            // Save the current user
            const currentUser = auth.currentUser;

            const userAuth = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userAuth.user.uid), {
                name: name,
                role: role,
                email: email,
            });

            // Send an invitation email
            await emailjs.send("service_q78ryeh","template_7ddpq88",{
                name : name,
                email : email,
                password : password,
                role : role
            }, "HZcc1JRXplnGjrMLi");

            // Sign out the newly created user
            await signOut(auth);

            // Restore the original user session
            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
            }

            //show alert box
            showSuccessSnackbar();

            //reset form
            resetForm();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setEmailInUseError('This email address is already in use!');
            }
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
                fullWidth
                label="User Role"
                name="UserRole"
                select
                sx={{ gridColumn: "span 2" }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
            </TextField>

            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmailOnBlur}
                error={Boolean(emailError || emailInUseError)}
                helperText={emailError || emailInUseError}
            />

            <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ width: '20%' }}
                onClick={createUser}
                disabled={!isFormValid()}
            >
                Invite
            </Button>

            {/* Snackbar for successfully invited notifications */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    User successfully invited!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InviteForm;