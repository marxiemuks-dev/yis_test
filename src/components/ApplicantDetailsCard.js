import { Box, Grid, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import React from 'react';

const municipalities = [
  "BONGAO", "PANGLIMA SUGALA", "SIMUNUL", "SITANGKAI",
  "SOUTH UBIAN", "TANDUBAS", "LANGUYAN", "MAPUN",
  "SAPA-SAPA", "SIBUTU", "TURTLE ISLANDS"
];

const schools = [
  "MAHARDIKA INSTITUTE OF TECHNOLOGY",
  "MINDANAO STATE UNIVERSITY TAWI-TAWI COLLEGE OF TECHNOLOGY AND OCEANOGRAPHY",
  "NOTRE DAME OF BONGAO",
  "PHILIPPINE LAST FRONTIER COLLEGE",
  "TAWI-TAWI CRIMINAL JUSTICE COLLEGE",
  "TAWI-TAWI REGIONAL AGRICULTURAL COLLEGE"
];

const ApplicantDetailsCard = ({ id, applicantno, lastname, firstname, middlename, municipality, school, contactno, onChange }) => {
  return (
    <Grid container key={id} rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Application No:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          onChange={(e) => onChange("applicantno", e.target.value.toUpperCase())}
          InputProps={{ style: { height: '40px' } }}
          fullWidth
          value={applicantno}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Lastname:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          onChange={(e) => onChange("lastname", e.target.value.toUpperCase())}
          InputProps={{ style: { height: '40px' } }}
          fullWidth
          value={lastname}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Firstname:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          onChange={(e) => onChange("firstname", e.target.value.toUpperCase())}
          InputProps={{ style: { height: '40px' } }}
          fullWidth
          value={firstname}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Middlename:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          onChange={(e) => onChange("middlename", e.target.value.toUpperCase())}
          InputProps={{ style: { height: '40px' } }}
          fullWidth
          value={middlename}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Contact No:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          onChange={(e) => onChange("contactno", e.target.value.toUpperCase())}
          InputProps={{ style: { height: '40px' } }}
          fullWidth
          value={contactno}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>Municipality:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <FormControl fullWidth size="small">
          <Select
            value={municipality}
            onChange={(e) => onChange("municipality", e.target.value)}
          >
            {municipalities.map((m, index) => (
              <MenuItem key={index} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography fontWeight={500}>School:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <FormControl fullWidth size="small">
          <Select
            value={school}
            onChange={(e) => onChange("school", e.target.value)}
          >
            {schools.map((s, index) => (
              <MenuItem key={index} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ApplicantDetailsCard;
