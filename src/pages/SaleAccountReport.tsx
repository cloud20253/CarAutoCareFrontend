import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from 'components/CustomizedDataGrid';
import Copyright from 'internals/components/Copyright';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Print } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';

const SaleAccountReport = () => {
      const navigate = useNavigate();
      const [rows, setRows] = React.useState<GridRowsProp>([]);
      const [dateValue, setDateValue] = React.useState<[Date | null, Date | null]>([null, null]);
    
      // New local search state for filtering the data grid rows
      const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

        const columns: GridColDef[] = [
            { field: 'Sr.No', headerName: 'Sr.No', flex: 1, minWidth: 100 },
          { field: 'date', headerName: 'Date', flex: 1, minWidth: 100 },
          { field: 'vehicleNoName', headerName: 'Particulars Name', flex: 1, minWidth: 150 },
          { field: 'customerMobile', headerName: 'Voucher Type', flex: 1, minWidth: 150 },
          { field: 'status', headerName: 'State', flex: 1, minWidth: 100 },
          { field: 'estimate', headerName: 'Invoice No', flex: 1, minWidth: 100 },
          { field: 'advance', headerName: 'GSTIN/UID', flex: 1, minWidth: 100 },
          { field: 'due', headerName: 'Total Sale', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'Total Taxable', flex: 1, minWidth: 100 },
          { field: 'superwiser1', headerName: 'Total CGST', flex: 1, minWidth: 100 },
          { field: 'superwiser2', headerName: 'Total SGST', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'Total IGST', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'Sale 0%', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'Sale 5%', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'Taxable 5%', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'CGST 2.5%', flex: 1, minWidth: 100 },
          { field: 'superwiser', headerName: 'SGST 2.5%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'IGST 5%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'Sale 12%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'Taxable 12%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'CGST 6%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'SGST 6%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'IGST 12%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'Sale 18%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'Taxable 18%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'CGST 9%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'SGST 9%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'IGST 18%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'Taxable 28%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'CGST 14%', flex: 1, minWidth: 100 },
          { field: 'technician', headerName: 'SGST 14%', flex: 1, minWidth: 100 },
          { field: 'worker', headerName: 'IGST 28%', flex: 1, minWidth: 100 },
        //   { field: 'Action', headerName: 'Action', flex: 1, minWidth: 250, renderCell: (params) => renderActionButtons(params) },
        ];

        const handleSearch = async () => {
            // let requestData: filter = {};
            // let response;
            // try {
            //   if (selectedType === 'Vehicle ID') {
            //     requestData = { vehicleRegId: textInput };
            //     const res = await VehicleDataByID(textInput);
            //     response = res.data;
            //   } else if (selectedType === 'Date Range') {
            //     requestData = {
            //       startDate: dateValue[0] ? dateValue[0].toISOString().slice(0, 10) : '',
            //       endDate: dateValue[1] ? dateValue[1].toISOString().slice(0, 10) : ''
            //     };
            //     const res = await GetVehicleByDateRange(requestData);
            //     response = res.data;
            //   } else if (selectedType === 'Appointment Number') {
            //     requestData = { appointmentId: textInput };
            //     const res = await GetVehicleByAppointmentID(requestData);
            //     response = res.data;
            //   }
        
            //   if (listType) {
            //     let statusFilter = '';
            //     if (listType === 'serviceQueue') {
            //       statusFilter = 'waiting,inprogress';
            //     } else if (listType === 'serviceHistory') {
            //       statusFilter = 'complete';
            //     }
            //     const res = await GetVehicleByStatus({ status: statusFilter });
            //     response = res.data;
            //   }
        
            //   if (response && Array.isArray(response)) {
            //     const formattedRows = response.map((vehicle: Vehicle, index: number) => ({
            //       id: index + 1,
            //       date: vehicle.date ?? '',
            //       vehicleNoName: vehicle.vehicleNumber ?? '',
            //       customerMobile: vehicle.customerName 
            //         ? `${vehicle.customerName} - ${vehicle.customerMobileNumber ?? ''}`
            //         : '',
            //       status: vehicle.status ?? '',
            //       estimate: '',
            //       advance: vehicle.advancePayment ?? 0,
            //       due: '',
            //       superwiser: vehicle.superwiser ?? '',
            //       technician: vehicle.technician ?? '',
            //       worker: vehicle.worker ?? '',
            //       kilometer: vehicle.kmsDriven ?? 0,
            //       vehicleRegId: vehicle.vehicleRegId,
            //     }));
            //     setRows(formattedRows);
            //   } else if (response && typeof response === 'object') {
            //     const singleRow = {
            //       id: 1,
            //       date: response.date ?? '',
            //       vehicleNoName: response.vehicleNumber ?? '',
            //       customerMobile: response.customerName
            //         ? `${response.customerName} - ${response.customerMobileNumber ?? ''}`
            //         : '',
            //       status: response.status ?? '',
            //       estimate: '',
            //       advance: response.advancePayment ?? 0,
            //       due: '',
            //       superwiser: response.superwiser ?? '',
            //       technician: response.technician ?? '',
            //       worker: response.worker ?? '',
            //       kilometer: response.kmsDriven ?? 0,
            //       vehicleRegId: response.vehicleRegId,
            //     };
            //     setRows([singleRow]);
            //   } else {
            //     setRows([]);
            //   }
            // } catch (error) {
            //   console.error('Error fetching data:', error);
            // }
          };

            const filteredRows = rows.filter((row) => {
              const search = localSearchTerm.toLowerCase();
              return (
                row.vehicleNoName.toLowerCase().includes(search) ||
                row.customerMobile.toLowerCase().includes(search) ||
                (row.status && row.status.toLowerCase().includes(search)) ||
                (row.superwiser && row.superwiser.toLowerCase().includes(search)) ||
                (row.technician && row.technician.toLowerCase().includes(search)) ||
                (row.worker && row.worker.toLowerCase().includes(search))
              );
            });

    return (
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography component="h2" variant="h6">
            Monthly Sale Report
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Stack>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme: Theme) => theme.spacing(2) }}>
            <Grid container spacing={2} sx={{ display: 'flex', gap: 2 }} item xs={12}>
              
                <Grid item mt={-1}>
                  <FormControl sx={{ width: { xs: '100%', md: '25ch' } }}>
                    <ReactDatePicker
                      selected={dateValue[0]}
                      onChange={(update: [Date | null, Date | null]) => setDateValue(update)}
                      startDate={dateValue[0]}
                      endDate={dateValue[1]}
                      selectsRange
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date range"
                    />
                  </FormControl>
                </Grid>
              
    
              <Button variant="contained" color="primary" sx={{ alignSelf: 'start' }} onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
    
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} component="div">
              <CustomizedDataGrid columns={columns} rows={rows} />
            </Grid>
          </Grid>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography component="h2" variant="h6">
            Job Sale Report
            </Typography>
          </Stack>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} component="div">
              <CustomizedDataGrid columns={columns} rows={rows} />
            </Grid>
          </Grid>

          <Copyright sx={{ my: 4 }} />
        </Box>
      );
}

export default SaleAccountReport;