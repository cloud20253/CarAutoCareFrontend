// TransactionAll.tsx
import React, { useState, useEffect } from "react";
import apiClient from "Services/apiService";
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from 'components/CustomizedDataGrid';
import Copyright from 'internals/components/Copyright';
import { Button, FormControl, IconButton,  InputLabel,  MenuItem,  OutlinedInput, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {  GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { VehicleListData } from 'Services/vehicleService';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import VehicleDeleteModal from './VehicleDeleteModal';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

interface Transaction {
  sparePartTransactionId: number;
  partNumber: string;
  transactionType: "CREDIT" | "DEBIT";
  quantity: number;
  userId: number;
  billNo: string;
  transactionDate: string;
}

const TransactionAll: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
   const [selectedType, setSelectedType] = React.useState<string>("");
      const [textInput, setTextInput] = React.useState<string>("");
      const [selectedStatus, setSelectedStatus] = React.useState<string>("");
      const [dateValue ,setDateValue] =  React.useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const navigate = useNavigate();

  const fetchAllTransactions = async () => {
    try {
      const response = await apiClient.get("/sparePartTransactions/getAll");
      setAllTransactions(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
     
     <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          {/* Left Side: Title */}
          <Typography component="h2" variant="h6">
              Vehicle List
          </Typography>
  
          {/* Right Side: Add Vehicle Button */}
          <Button variant="contained" color="primary" onClick={() => navigate("/admin/vehicle/add")}>
              Add Vehicle
          </Button>
          </Stack>
  
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          <Grid size={{ xs: 12, sm: 12, md:12, lg: 12 }} container spacing={2} sx={{ display: 'flex', gap: 2 }}  >
          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }}>
          <InputLabel>Select Type</InputLabel>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} size="medium">
            <MenuItem value="Vehicle ID">Vehicle ID</MenuItem>
            <MenuItem value="Date Range">Date Range</MenuItem>
            <MenuItem value="Status">Status</MenuItem>
            <MenuItem value="Appointment Number">Appointment Number</MenuItem>
          </Select>
        </FormControl>
  
        {/* Input Field for Vehicle ID or Appointment Number */}
        {selectedType === "Vehicle ID" || selectedType === "Appointment Number" ? (
          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
            <OutlinedInput
              size="small"
              id="search"
              placeholder="Enter text..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ color: "text.primary" }}>
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
        ) : null}
  
        {/* Date Range Picker */}
        {selectedType === "Date Range" && (
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DemoContainer components={["SingleInputDateRangeField"]}>
              <DateRangePicker
                slots={{ field: SingleInputDateRangeField }}
                name="allowedRange"
                value={dateValue}
                onChange={(newValue) => setDateValue(newValue)}
                format="DD/MM/YYYY"
              />
            </DemoContainer>
          </LocalizationProvider>
        )}
  
        {/* Select Status */}
        {selectedType === "Status" && (
          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }}>
            <InputLabel>Select Status</InputLabel>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="medium">
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Waiting">Waiting</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        )}
  
        {/* Search Button */}
        {/* <Button variant="contained" color="primary" sx={{ alignSelf: "start" }} onClick={handleSearch}>
          Search
        </Button> */}
          </Grid>
         
            {/* <VehicleDeleteModal open={open} onClose={() => setOpen(false)} deleteItemId={selectedId} /> */}
        </Grid>
        
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12, lg: 12 }}>
            {/* <CustomizedDataGrid columns ={columns} rows={rows}/> */}
          </Grid>
        </Grid>
        <Copyright sx={{ my: 4 }} />
      </Box>
    );
};

export default TransactionAll;
