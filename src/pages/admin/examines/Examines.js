import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Grid,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, useMediaQuery,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid2,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/AddBox';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from "react-redux";
import { mockApplicants } from '../../../lib/mock_data';
import ApplicantDetailsCard from '../../../components/ApplicantDetailsCard';
import { addApplicant, deleteApplicant, getAllApplicants, searchApplicant, searchApplicantByMunicipality, searchApplicantBySchool, updateApplicant } from '../../../actions/applicants';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const Examiners = () => {

  const dispatch = useDispatch();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [transformedApplicants, setTransformedApplicant] = useState([]);
  const [filteredApplicant, setFilteredApplicant] = useState([]);
  const [type, setType] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const [applicationNo, setApplicationNo] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [contact, setContact] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [school, setSchool] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const printToExcel = () => {
    const applicantsToExport = filteredApplicant.map(({ id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(applicantsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'applicants_list.xlsx');
  };

  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMobileDialog, setOpenMobileDialog] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    
  const fetchApplicant = async () => {
    setIsLoading(true);
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 120000)
    );
    try {
      const result = await Promise.race([dispatch(getAllApplicants()), timeout]);
      const applicants = result.data;
      const message = result.message;
      const status = result.status;
      if (status) {
        const mappedApplicants = applicants.map((applicant) => ({
          id: applicant.applicants_id,
          applicantno: applicant.application_no,
          lastname: applicant.lastname,
          firstname: applicant.firstname,
          middlename: applicant.middlename,
          contactno: applicant.contact_num,
          municipality: applicant.municipality,
          school: applicant.school
        }));
        setFilteredApplicant(mappedApplicants);
        setTransformedApplicant(mappedApplicants);
        setIsLoading(false)
        return;
      } else {
        setFilteredApplicant([]);
        setTransformedApplicant([]);
        setIsLoading(false)
        return;
      }
    } catch (error) {
      setMessage('Loading timeout or error, please refresh the page.')
      setSeverity('error')
      setOpenSnackbar(true)
      setFilteredApplicant([]);
      setTransformedApplicant([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, []);

  const handleOpenDialog = () => {
    setEditIndex(null);
    setOpenDialog(true);
  };
  
  const handleCancelSubmiting = () => {
    setSubmitLoading(false);
    setOpenDialog(false)
  }

  const resetForm = () => {
      setApplicationNo("");
      setFirstname("");
      setMiddlename("");
      setLastname("");
      setContact("");
      setMunicipality("");
      setSchool("");
  }

  const handleSubmit =async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    if (
      !applicationNo ||
      !firstname     ||
      !lastname      ||
      !municipality  ||
      !school
    ) {
      setMessage("Please fill in all required fields.");
      setSeverity("warning");
      setOpenSnackbar(true);
      setSubmitLoading(false);
      return;
    }

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 120000)
    );

    try {
    const result = await Promise.race([
      dispatch(addApplicant(applicationNo,firstname,middlename,lastname,contact,municipality,school)),
      timeout,
    ]);
    const status = result.status
    const message = result.message
    if (status === true) {
      setMessage(result.message);
      setSeverity("success");
      setOpenSnackbar(true);

      // Refresh list
      fetchApplicant();
      // Reset form
      resetForm();

      setOpenDialog(false);
    } else {
      setMessage(result.message || "Failed to add applicant.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  } catch (err) {
    console.log(err)
    const msg =
      err.message === "Request timed out"
        ? "⏱️ Request timed out. Please try again."
        : "⚠️ An unexpected error occurred.";
    setMessage(msg);
    setSeverity("error");
    setOpenSnackbar(true);
  } finally {
    setSubmitLoading(false);
  }
  };
  const handleCellClick = (params) => {
    const applicant = filteredApplicant.find((applicant) => applicant.id === params.id)
      if(applicant){
      setSelectedApplicant(applicant)
    }else{
      setSelectedApplicant(null)
    }
    if(isMobile){
      setOpenMobileDialog(true)
    }
  };
  const handleFetch = async () => {
    setIsLoading(true)
    setSelectedApplicant(null);

    const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Request timed out")), 120000)
    );

    if (searchQuery) {
      try{
        const result = await Promise.race([dispatch(searchApplicant(searchQuery)), timeout])
        const applicants = result.data;
        const message = result.message;
        const status = result.status;
        if(status){
          const mappedApplicants = applicants.map((applicant, index)=> ({
            id: applicant.applicants_id,
            applicantno: applicant.application_no,
            lastname: applicant.lastname,
            firstname: applicant.firstname,
            middlename: applicant.middlename,
            contactno: applicant.contact_num,
            municipality: applicant.municipality,
            school: applicant.school
          }));
          setFilteredApplicant(mappedApplicants);
          setTransformedApplicant(mappedApplicants);
          setIsLoading(false)
          return;
        }else{
          setFilteredApplicant([]);
          setTransformedApplicant([]);
          setIsLoading(false)
          return;
        }
      }catch(error){
        setMessage('Loading timeout or error, please refresh the page.')
        setSeverity('error')
        setOpenSnackbar(true)
        setFilteredApplicant([]);
        setTransformedApplicant([]);
      }finally{
        setIsLoading(false)
      }
    }else{
      fetchApplicant();
    }
  }
  const handleSearch = async (event) => {
    setIsLoading(true)
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setSelectedApplicant(null);
    const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Request timed out")), 120000)
    );
    if (query) {
      try{
        const result = await Promise.race([dispatch(searchApplicant(query)), timeout])
        const applicants = result.data;
        const message = result.message;
        const status = result.status;
        if(status){
          const mappedApplicants = applicants.map((applicant, index)=> ({
            id: applicant.applicants_id,
            applicantno: applicant.application_no,
            lastname: applicant.lastname,
            firstname: applicant.firstname,
            middlename: applicant.middlename,
            contactno: applicant.contact_num,
            municipality: applicant.municipality,
            school: applicant.school
          }));
          setFilteredApplicant(mappedApplicants);
          setTransformedApplicant(mappedApplicants);
          setIsLoading(false)
          return;
        }else{
          setFilteredApplicant([]);
          setTransformedApplicant([]);
          setIsLoading(false)
          return;
        }
      }catch(error){
        setMessage('Loading timeout or error, please refresh the page.')
        setSeverity('error')
        setOpenSnackbar(true)
        setFilteredApplicant([]);
        setTransformedApplicant([]);
      }finally{
        setIsLoading(false)
      }
    }else{
      fetchApplicant();
    }
  };
  const searchByMunicipality = async(event)=> {
    setIsLoading(true);
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 120000)
    );
    const query = event.target.value;
    setType(query)
    if(query == 'All'){
      fetchApplicant()
      return;
    }
    try{
      const result = await Promise.race([dispatch(searchApplicantByMunicipality(query)),timeout]);
      const applicants = result.data;
      const message = result.message;
      const status = result.status;
      console.log(result)
      if(status){
        const mappedApplicants = applicants.map((applicant, index)=> ({
          id: applicant.applicants_id,
          applicantno: applicant.application_no,
          lastname: applicant.lastname,
          firstname: applicant.firstname,
          middlename: applicant.middlename,
          contactno: applicant.contact_num,
          municipality: applicant.municipality,
          school: applicant.school
        }));
        setFilteredApplicant(mappedApplicants);
        setTransformedApplicant(mappedApplicants);
        setIsLoading(false);
        return;
      }else{
          setFilteredApplicant([]);
          setTransformedApplicant([]);
          setIsLoading(false)
          return;
      }
    }catch(error){
       setMessage('Loading timeout or error, please refresh the page.')
        setSeverity('error')
        setOpenSnackbar(true)
        setFilteredApplicant([]);
        setTransformedApplicant([]);
      } finally {
        setIsLoading(false);
      }
    
  }
    const searchBySchool = async(event)=> {
    setIsLoading(true);
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 120000)
    );
    const query = event.target.value;
    setSelectedSchool(query)
    if(query === 'All'){
      fetchApplicant()
      return;
    }
    try{
      const result = await dispatch(searchApplicantBySchool(query));
      const applicants = result.data;
      const message = result.message;
      const status = result.status;
      console.log(result)
      if(status){
        const mappedApplicants = applicants.map((applicant, index)=> ({
          id: applicant.applicants_id,
          applicantno: applicant.application_no,
          lastname: applicant.lastname,
          firstname: applicant.firstname,
          middlename: applicant.middlename,
          contactno: applicant.contact_num,
          municipality: applicant.municipality,
          school: applicant.school
        }));
        setFilteredApplicant(mappedApplicants);
        setTransformedApplicant(mappedApplicants);
        setIsLoading(false);
        return;
      }else{
          setFilteredApplicant([]);
          setTransformedApplicant([]);
          setIsLoading(false)
          return;
      }
    }catch(error){
       setMessage('Loading timeout or error, please refresh the page.')
        setSeverity('error')
        setOpenSnackbar(true)
        setFilteredApplicant([]);
        setTransformedApplicant([]);
      } finally {
        setIsLoading(false);
      }
    
  }

  const columns = [
    { field: 'applicantno', headerName: 'APPLICANT NO', width: 140 },
    { field: 'lastname', headerName: 'LAST NAME', sortable: true, width: 120 },
    { field: 'firstname', headerName: 'FIRST NAME', width: 120 },
    { field: 'middlename', headerName: 'MIDDLE INITIAL', width: 120 },
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

  const handleUpdate = async () => {
    if (!selectedApplicant || !selectedApplicant.id) return;

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 120000)
    );

    try {
      const result = await Promise.race([
        dispatch(updateApplicant(
          selectedApplicant.id,
          selectedApplicant.applicantno,
          selectedApplicant.firstname,
          selectedApplicant.middlename,
          selectedApplicant.lastname,
          selectedApplicant.contactno,
          selectedApplicant.municipality,
          selectedApplicant.school
        )),
        timeout
      ]);
      console.log(result)
      const status = result.status;
      if(status === true){ 
        setMessage("Applicant updated successfully.");
        setSeverity("success");
        setOpenSnackbar(true);
        handleFetch();
        return;
      }else{
        setMessage(result.message);
        setSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      // ❌ Timeout or error
      console.error("Update Error:", err.message);
      const errorMsg = err.message === "Request timed out"
        ? "Request timed out. Please try again."
        : "Something went wrong.";
      setMessage(errorMsg);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleDelete = async () => {
    if (!selectedApplicant || !selectedApplicant.id){
      setMessage("Select applicant!");
      setSeverity("warning")
      setOpenSnackbar(true);
      return;
    }

    try {
      const result = await dispatch(deleteApplicant(selectedApplicant.id));
      const status = result.status;
      const message = result.message
      if(status === true){
        setMessage(message);
        setSeverity("success");
        fetchApplicant();
        setSelectedApplicant(null);
      }
      setSearchQuery("")
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Delete Error:", err.message);
      setMessage("Something went wrong.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const handleCardChange = (field, value) => {
    setSelectedApplicant(prev => ({
    ...prev,
    [field]: value,
  }));
  };
  const handleSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box>
      <Snackbar sx={{ display: { xs: 'none', md: 'block' } }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbar} >
        <Alert onClose={handleSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar sx={{ display: { xs: 'block', md: 'none' } }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={4000} onClose={handleSnackbar} >
        <Alert onClose={handleSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>Examiners</Typography>
      <Box mb={2} sx={{display:'flex',gap:2}}>
        <TextField
          label="Search Applicant"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{maxWidth:'sm'}}
        />
        <FormControl size="small" sx={{width: "30%", height:'52px',}}>
          <InputLabel id="payment-status-label" sx={{fontSize:'10px'}}>Select municipality</InputLabel>
            <Select
              fullWidth
              size="small"
              label="Select municipality"
              value={type}
              onChange={searchByMunicipality}
              sx={{height:'52px' }}
            >
              <MenuItem value="All">
              All
              </MenuItem>
              {municipalities.map((muni, index) => (
                <MenuItem key={index} value={muni}>{muni}</MenuItem>
              ))}
            </Select>
        </FormControl>
        <FormControl size="small" sx={{width: "30%", height:'52px',}}>
          <InputLabel id="payment-status-label" sx={{fontSize:'10px'}}>Select school</InputLabel>
            <Select
              fullWidth
              size="small"
              label="Select municipality"
              value={selectedSchool}
              onChange={searchBySchool}
              sx={{height:'52px' }}
            >
              <MenuItem value="All">
              All
              </MenuItem>
              {schools.map((sch, index) => (
                <MenuItem key={index} value={sch}>{sch}</MenuItem>
              ))}
            </Select>
        </FormControl>
          {isSmallScreen ? (
            <Tooltip title="Export to Excel">
              <IconButton onClick={printToExcel}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button variant="contained" onClick={printToExcel} startIcon={<DownloadIcon />}>
              Export to Excel
            </Button>
          )}

      {/* Add Applicant Button */}
      {isSmallScreen ? (
        <Tooltip title="Add Applicant">
          <IconButton onClick={handleOpenDialog} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant="contained" onClick={handleOpenDialog} startIcon={<AddIcon />}>
          Add Applicant
        </Button>
      )}

      </Box>
      <Grid container spacing={2}>
      {isLoading ?(
        <Grid item xs={12} md={8} lg={8} xl={8}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      ):(
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
              sx={{maxHeight:'100vh', minHeight:'90vh'}}
              getRowHeight={() => 40}
              pageSizeOptions={[10]}
              disableSelectionOnClick
              onCellClick={handleCellClick}
            />
          </Box>
        </Grid>
      )}
        <Grid item xs={12} md={4} lg={4} xl={4} sx={{display:{xs:'none', md:'unset'}}}>
          <Card sx={{padding:'10px', height:'100%'}}>
            <Card sx={{background:'#F7F7F7', padding:1}}>
              <Typography variant='h4' mb={2}>Details</Typography>
              <Box spacing={2} mt={1}>
                {selectedApplicant != null ? (<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantno={selectedApplicant?.applicantno || ''}
                  lastname={selectedApplicant?.lastname || ''}
                  firstname={selectedApplicant?.firstname || ''}
                  middlename={selectedApplicant?.middlename || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                  contactno={selectedApplicant?.contactno || ''}
                  onChange={handleCardChange}
                />
                </>):(<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantno={selectedApplicant?.applicationNo || ''}
                  lastname={selectedApplicant?.lastname || ''}
                  firstname={selectedApplicant?.firstname || ''}
                  middlename={selectedApplicant?.middlename || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                  contactno={selectedApplicant?.contactno || ''}
                  onChange={handleCardChange}
                />
                </>)}
              </Box>
              <Box sx={{display:'flex', justifyContent:'space-between', mt:2}}>
                <Button variant="contained" onClick={handleUpdate}>Update</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
              </Box>
            </Card>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openMobileDialog} onClose={() => setOpenMobileDialog(false)} fullScreen={fullScreen} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          p:2
        }
      }}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Card sx={{padding:'10px', height:'100%'}}>
            <Card sx={{background:'#F7F7F7', padding:1}}>
              <Typography variant='h4' mb={2}>Details</Typography>
              <Box spacing={2} mt={1}>
                {selectedApplicant != null ? (<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantno={selectedApplicant?.applicantno || ''}
                  lastname={selectedApplicant?.lastname || ''}
                  firstname={selectedApplicant?.firstname || ''}
                  middlename={selectedApplicant?.middlename || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                  contactno={selectedApplicant?.contactno || ''}
                  onChange={handleCardChange}
                />
                </>):(<>
                <ApplicantDetailsCard
                  id={selectedApplicant?.id || 0}
                  applicantno={selectedApplicant?.applicationNo || ''}
                  lastname={selectedApplicant?.lastname || ''}
                  firstname={selectedApplicant?.firstname || ''}
                  middlename={selectedApplicant?.middlename || ''}
                  municipality={selectedApplicant?.municipality || ''}
                  school={selectedApplicant?.school || ''}
                  contactno={selectedApplicant?.contactno || ''}
                  onChange={handleCardChange}
                />
                </>)}
              </Box>
              <Box sx={{display:'flex', justifyContent:'space-between', mt:2}}>
                <Button variant="contained" onClick={handleUpdate}>Update</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
              </Box>
            </Card>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setOpenMobileDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Applicant Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen={fullScreen} maxWidth="sm" fullWidth >
        <DialogTitle variant='h4'>Add Applicant</DialogTitle>
        {submitLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="APPLICANT NO"
                  name="applicationNo"
                  value={applicationNo}
                  onChange={(e) => setApplicationNo(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                  fullWidth
                  label="LASTNAME"
                  name="lastname"
                  value={lastname}
                  onChange={(e) =>setLastname(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="FIRSTNAME"
                  name="firstname"
                  value={firstname}
                  onChange={(e) =>setFirstname(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="MIDDLEINITIAL"
                  name="middlename"
                  value={middlename}
                  onChange={(e) =>setMiddlename(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CONTACT NO"
                  name="contact"
                  value={contact}
                  onChange={(e) =>setContact(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="municipality-label">MUNICIPALITY</InputLabel>
                  <Select
                    labelId="municipality-label"
                    value={municipality}
                    name="municipality"
                    label="MUNICIPALITY"
                    onChange={(e) => setMunicipality(e.target.value)}
                  >
                    {municipalities.map((muni, index) => (
                      <MenuItem key={index} value={muni}>{muni}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="school-label">SCHOOL</InputLabel>
                  <Select
                    labelId="school-label"
                    value={school}
                    name="school"
                    label="SCHOOL"
                    onChange={(e) => setSchool(e.target.value)}
                  >
                    {schools.map((sch, index) => (
                      <MenuItem key={index} value={sch}>{sch}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmiting}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Examiners;
