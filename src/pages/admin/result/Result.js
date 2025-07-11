import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Grid,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, useMediaQuery,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { mockApplicants } from '../../../lib/mock_data';
import ApplicantDetailsCard from '../../../components/ApplicantDetailsCard';


const rows = [
  { id: 1, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 2, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 3, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 4, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 5, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 6, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 7, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 8, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 9, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
    { id: 10, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 42, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 30, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 45, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 54, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 64, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 74, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 84, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 94, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
    { id: 14, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 24, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 34, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 44, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 53, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 63, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 73, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 83, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 93, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
    { id: 31, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 25, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 35, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 40, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 55, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 65, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 75, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 85, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 95, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
    { id: 61, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 26, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 36, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 46, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 56, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 66, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 76, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 86, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 96, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
      { id: 16, applicationNo:2, lastName: 'Snow', firstName: 'Jon', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 26, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 36, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 46, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 56, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 66, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 76, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 86, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 96, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
    { id: 27, applicationNo:25, lastName: 'Lannister', firstName: 'Cersei', middleInitial: 'O', municipality:'Simunul', school:'Tawi-Tawi Regional District College' },
  { id: 37, applicationNo:26, lastName: 'Lannister', firstName: 'Jaime', middleInitial: 'O', municipality:'Sapa-Sapa', school:'Tawi-Tawi Regional District College' },
  { id: 47, applicationNo:27, lastName: 'Stark', firstName: 'Arya', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 57, applicationNo:28, lastName: 'Targaryen', firstName: 'Daenerys', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 67, applicationNo:29, lastName: 'Melisandre', firstName: 'John', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 77, applicationNo:23, lastName: 'Clifford', firstName: 'Ferrara', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 87, applicationNo:24, lastName: 'Frances', firstName: 'Rossini', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },
  { id: 97, applicationNo:22, lastName: 'Roxie', firstName: 'Harvey', middleInitial: 'O', municipality:'Bongao', school:'Tawi-Tawi Regional District College' },

];

const Result = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [transformedApplicants, setTransformedApplicant] = useState([]);
  const [filteredApplicant, setFilteredApplicant] = useState(rows);

  const [formData, setFormData] = useState({
    applicationNo: '',
    firstname: '',
    middlename: '',
    lastname: '',
    contact: '',
    municipality: '',
    school: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setApplicants(mockApplicants);
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      applicationNo: '',
      firstname: '',
      middlename: '',
      lastname: '',
      contact: '',
      municipality: '',
      school: '',
    });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleEdit = (index) => {
    setFormData(applicants[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = applicants.filter((_, i) => i !== index);
    setApplicants(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...applicants];
      updated[editIndex] = formData;
      setApplicants(updated);
    } else {
      setApplicants([...applicants, formData]);
    }

    setOpenDialog(false);
  };
  const handleCellClick = (params) => {
    const applicant = filteredApplicant.find((applicant) => applicant.id === params.id)
      if(applicant){
      setSelectedApplicant(applicant)
    }else{
      setSelectedApplicant(null)
    }
    // handleClickOpen()
  };

  const handleSearch = async (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setSelectedApplicant(null);

    if (query) {
      const filtered = applicants.filter((item) =>
        item.applicationNo.toString().includes(query) ||
        item.lastName?.toLowerCase().includes(query)
      );
      if(filtered.length > 0){
        setFilteredApplicant(filtered);
      }else{
        setApplicants([]);
      }
    } else {
      setFilteredApplicant(filteredApplicant);
    }
  };

  const columns = [
    { field: 'applicationNo', headerName: 'APPLICANT NO', width: 110 },
    { field: 'score', headerName: 'SCORE', width: 110 },
    // { field: 'lastName', headerName: 'LAST NAME', width: 120 },
    // { field: 'firstName', headerName: 'FIRST NAME', width: 120 },
    // { field: 'middleInitial', headerName: 'MIDDLE INITIAL', width: 120 },
    !isMobile && {
      field: 'municipality',
      headerName: 'MUNICIPALITY',
      sortable: true,
      width: 150,
    },
    !isMobile && {
      field: 'school',
      headerName: 'SCHOOL',
      sortable: false,
      width: 300,
    },
  ].filter(Boolean);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Exam Result</Typography>
      <Box mb={2} sx={{display:'flex', justifyContent:'space-between', gap:2}}>
        <TextField
          label="Search Applicant"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{width:'60%'}}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={8} xl={8} spacing={2}>
          <Box sx={{ height:'100%', width: '100%', background:'#ffffff'}}>
            <DataGrid
              rows={filteredApplicant}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize:50,
                  },
                },
              }}
              sx={{maxHeight:'90vh', minHeight:'90vh'}}
              getRowHeight={() => 30}
              pageSizeOptions={[10]}
              disableSelectionOnClick
              onCellClick={handleCellClick}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4} sx={{display:{xs:'none', md:'unset'}}}>
          <Card sx={{padding:'10px', height:'100%'}}>
            <Card sx={{height:'80%', background:'#F7F7F7', padding:1}}>
              <Typography variant='h4'>Details</Typography>
              <Box spacing={2} mt={1}>
                {selectedApplicant != null ? (<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantionNo={selectedApplicant?.applicationNo || ''}
                  lastname={selectedApplicant?.lastName || ''}
                  firstname={selectedApplicant?.firstName || ''}
                  middlename={selectedApplicant?.middleInitial || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                />
                </>):(<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantionNo={selectedApplicant?.applicationNo || ''}
                  lastname={selectedApplicant?.lastName || ''}
                  firstname={selectedApplicant?.firstName || ''}
                  middlename={selectedApplicant?.middleInitial || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                />
                </>)}
              </Box>
              <Box sx={{display:'flex', justifyContent:'space-between', mt:2}}>
                <Button variant="contained">Update</Button>
                <Button variant="contained">Delete</Button>
              </Box>
            </Card>
          </Card>
        </Grid>
      </Grid>

      {/* Applicant Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen={fullScreen} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Applicant' : 'Add Applicant'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[
              { label: 'Application No', name: 'applicationNo' },
              { label: 'First Name', name: 'firstname' },
              { label: 'Middle Name', name: 'middlename' },
              { label: 'Last Name', name: 'lastname' },
              { label: 'Contact', name: 'contact' },
              { label: 'Municipality', name: 'municipality' },
              { label: 'School', name: 'school' },
            ].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editIndex !== null ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Result;
