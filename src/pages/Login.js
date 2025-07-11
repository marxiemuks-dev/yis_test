import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Snackbar, Alert, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {login} from '../actions/auth'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const userData = localStorage.getItem('yis_user');
      if(userData){
        try{
          navigate('/')
        }catch(error){
          console.error(error)
        }
      }
    }
    fetchUserFromLocalStorage()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please fill in all fields.');
      setSeverity('warning')
      setOpenSnackbar(true);
      return;
    }

    const loginData = await dispatch(login(username,password));
    const status = loginData.status;
    const message = loginData.message;
    if(!status){
      setSeverity('error')
      setMessage(message)
      setOpenSnackbar(true)
      return
    }
    else{
      setSeverity('success')
      setMessage(message)
      setOpenSnackbar(true)
      navigate('/');
      return;
    }
  };

  const handleSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
  <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Snackbar sx={{ display: { xs: 'none', md: 'block' } }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={openSnackbar} autoHideDuration={4000} onClose={handleSnackbar}>
      <Alert onClose={handleSnackbar} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
    <Snackbar sx={{ display: { xs: 'block', md: 'none' } }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={openSnackbar} autoHideDuration={4000} onClose={handleSnackbar}>
      <Alert onClose={handleSnackbar} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
    <Typography variant="h5" fontWeight="medium" mb={3} textAlign="center">
      Welcome to YIS Management Website
    </Typography>

    <Card sx={{ maxWidth: 400, width: '100%' }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">Login</Typography>
        
        {error && <Typography color="error" mb={2}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            type="username"
            fullWidth
            margin="normal"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  </Box>

  );
};

export default Login;
