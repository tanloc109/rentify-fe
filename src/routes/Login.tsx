import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext.tsx';
import { useTokenContext } from '../contexts/TokenContext.tsx';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Alert, Link } from '@mui/material';
import { showToast, TimeDisplayed } from '../components/common/Toast.tsx';

const BASE_URL = 'http://localhost:8080/rentify/api/auth/login';

const Login = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUserContext();
  const { setTokens } = useTokenContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userData) navigate('/');
  }, []);

  const validateEmail = (email: string) => {
    if (!email) return "Email cannot be empty";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address.";
    return "";
  };

  const validatePassword = (password: string) => {
    return password ? "" : "Password cannot be empty";
  };

  const handleSubmit = async () => {
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
    if (validateEmail(email) || validatePassword(password)) return;

    try {
      const response = await axios.post(BASE_URL, { email, password });
      const data = response.data.data;

      setUserData(data.user);
      setTokens({ accessToken: data.accessToken, refreshToken: null });

      showToast({
        type: 'success',
        info: 'Success!',
        message: 'Login successful!',
        timeDisplayed: TimeDisplayed.LONG,
      });

      if (data.user.role === "RENTER") {
        navigate('/rentals');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight="bold">Login</Typography>
      <Box component="form" sx={{ mt: 3 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Log in
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link href="/register" sx={{ cursor: 'pointer' }}>Register</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
