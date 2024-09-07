import React, { useState } from 'react';
import { Box, TextField, Button, Typography, useTheme } from '@mui/material';
import { tokens } from "./../../theme";

//firebase imports
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const LoginForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);


  // Handle form submission and login logic here
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const login = await signInWithEmailAndPassword(auth, email, password);

      if (login){      
        console.log('login successful');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Password or Email is incorrect');
      } else {
        setError('Unknown error occured');
      }
    }
  }

  return (
    <Box sx={{ mt: 5, p: 3 }}>
      <Typography variant="h2" color={colors.greenAccent[400]} fontWeight="bold">Login</Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2, mt: 3 }}>
          {error}
        </Typography>
      )}
      <TextField label="Email" type="email" variant="outlined" fullWidth sx={{ my: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ my: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ width: '20%' }} onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
