import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: '',
    civilStatus: '',
    pwdType: '',
    municipality: '',
    barangay: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Registration Successful!');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>GAD MIS Registration</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" name="firstName" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" name="lastName" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone Number" name="phoneNumber" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Gender" name="gender" fullWidth onChange={handleChange} required>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Civil Status" name="civilStatus" fullWidth onChange={handleChange} required>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField select label="PWD Type" name="pwdType" fullWidth onChange={handleChange}>
              <MenuItem value="">Not Applicable</MenuItem>
              <MenuItem value="Physical">Physical</MenuItem>
              <MenuItem value="Visual">Visual</MenuItem>
              <MenuItem value="Hearing">Hearing</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Municipality" name="municipality" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Barangay" name="barangay" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">Register</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Registration;
