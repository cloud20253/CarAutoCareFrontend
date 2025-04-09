import * as React from 'react';
import { useState, useEffect } from 'react';
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
  Chip,
  Tooltip,
  Badge,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GridCellParams, GridRowsProp, GridColDef, GridValueFormatter, GridValidRowModel } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import {
  GetVehicleByAppointmentID,
  GetVehicleByDateRange,
  GetVehicleByStatus,
  VehicleDataByID,
  VehicleListData,
} from 'Services/vehicleService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import VehicleDeleteModal from './VehicleDeleteModal';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PreviewIcon from '@mui/icons-material/Preview';
import { Print, Receipt, ReceiptLong } from '@mui/icons-material';
import { filter } from 'types/SparePart';
import { Theme } from '@mui/material/styles';
import apiClient from 'Services/apiService';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface Vehicle {
  vehicleRegId: string;
  vehicleNumber?: string;         
  customerName?: string;           
  customerMobileNumber?: string;    
  advancePayment: number;          
  kmsDriven?: number;               
  superwiser?: string;
  technician?: string;
  worker?: string;
  status?: string;
  date?: string;
}

export default function VehicleList() {
  const navigate = useNavigate();
  const [searchParams] = React.useState(() => new URLSearchParams(window.location.search));
  const listType = searchParams.get("listType");

  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [dateValue, setDateValue] = React.useState<[Date | null, Date | null]>([null, null]);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [textInput, setTextInput] = React.useState<string>("");

  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

  const [invoiceStatus, setInvoiceStatus] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  function renderActionButtons(params: GridCellParams) {
    return (
      <>
        <IconButton
          color="primary"
          onClick={() => navigate(`/admin/vehicle/edit/${params.row.vehicleRegId}`)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleDelete(params.row.vehicleRegId)}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() =>
            navigate(`/admin/vehicle/add/servicepart/${params.row.vehicleRegId}`)
          }
        >
          <BuildIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleRegId}`)}
        >
          <PreviewIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleRegId}`)}
        >
          <Print />
        </IconButton>
      </>
    );
  }

  const checkInvoiceStatus = async (vehicleRegId: number): Promise<boolean> => {
    try {
      console.log(`Checking invoice status for vehicle ${vehicleRegId}...`);
      const response = await apiClient.get(`/api/vehicle-invoices/search/vehicle-reg/${vehicleRegId}`);
      console.log(`Invoice response for vehicle ${vehicleRegId}:`, response.data);
      
      const hasInvoice = Array.isArray(response.data) && response.data.length > 0;
      console.log(`Vehicle ${vehicleRegId} has invoice:`, hasInvoice);
      
      setInvoiceStatus(prev => {
        const newStatus = {
          ...prev,
          [vehicleRegId.toString()]: hasInvoice
        };
        console.log('Updated invoice status:', newStatus);
        return newStatus;
      });

      return hasInvoice;
    } catch (error) {
      console.error(`Error checking invoice status for vehicle ${vehicleRegId}:`, error);
      setInvoiceStatus(prev => ({
        ...prev,
        [vehicleRegId.toString()]: false
      }));
      return false;
    }
  };

  const renderInvoiceStatus = (params: GridCellParams) => {
    const key = params.row.vehicleRegId.toString();
    const hasInvoice = invoiceStatus[key] ?? false;
    console.log(`Rendering invoice status for vehicle ${key}:`, hasInvoice);
    
    return (
      <Tooltip title={hasInvoice ? "Invoice Generated" : "Invoice Not Generated"}>
        <Badge color="error" variant="dot" invisible={hasInvoice}>
          <ReceiptIcon color={hasInvoice ? "success" : "error"} />
        </Badge>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'invoiceStatus',
      headerName: 'Invoice',
      flex: 1,
      minWidth: 100,
      renderCell: renderInvoiceStatus,
    },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 100 },
    { field: 'vehicleNoName', headerName: 'Veh No/Name', flex: 1, minWidth: 150 },
    { field: 'customerMobile', headerName: 'Customer & Mobile', flex: 1, minWidth: 150 },
    { field: 'status', headerName: 'Ready', flex: 1, minWidth: 100 },
    { 
      field: 'advance', 
      headerName: 'Advance', 
      flex: 1, 
      minWidth: 100,
      type: 'number',
      valueFormatter: ((params: { value: number | null | undefined }) => {
        return params.value ? `₹${params.value.toLocaleString('en-IN')}` : '₹0';
      }) as GridValueFormatter<GridValidRowModel>
    },
    { field: 'superwiser', headerName: 'Supervisor', flex: 1, minWidth: 100 },
    { field: 'technician', headerName: 'Technician', flex: 1, minWidth: 100 },
    { field: 'worker', headerName: 'Worker', flex: 1, minWidth: 100 },
    { field: 'kilometer', headerName: 'Kilometer', flex: 1, minWidth: 100 },
    { field: 'Action', headerName: 'Action', flex: 1, minWidth: 250, renderCell: (params) => renderActionButtons(params) },
  ];

  const handleSearch = async () => {
    let requestData: filter = {};
    let response;
    try {
      if (selectedType === 'Vehicle ID') {
        requestData = { vehicleRegId: textInput };
        const res = await VehicleDataByID(textInput);
        response = res.data;
      } else if (selectedType === 'Date Range') {
        requestData = {
          startDate: dateValue[0] ? dateValue[0].toISOString().slice(0, 10) : '',
          endDate: dateValue[1] ? dateValue[1].toISOString().slice(0, 10) : ''
        };
        const res = await GetVehicleByDateRange(requestData);
        response = res.data;
      } else if (selectedType === 'Appointment Number') {
        requestData = { appointmentId: textInput };
        const res = await GetVehicleByAppointmentID(requestData);
        response = res.data;
      }

      if (listType) {
        let statusFilter = '';
        if (listType === 'serviceQueue') {
          statusFilter = 'waiting,inprogress';
        } else if (listType === 'serviceHistory') {
          statusFilter = 'complete';
        }
        const res = await GetVehicleByStatus({ status: statusFilter });
        response = res.data;
      }

      if (response) {
        const vehicleList = Array.isArray(response) ? response : [response];
        await processVehicleData(vehicleList);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRows([]);
    }
  };
  React.useEffect(() => {
    const getVehicleList = async () => {
      try {
        let response;
        if (listType) {
          let statusFilter = '';
          if (listType === 'serviceQueue') {
            statusFilter = 'waiting,inprogress';
          } else if (listType === 'serviceHistory') {
            statusFilter = 'complete';
          }
          const res = await GetVehicleByStatus({ status: statusFilter });
          response = res.data;
        } else {
          const res = await VehicleListData();
          response = res.data;
        }
        
        if (response) {
          const vehicleList = Array.isArray(response) ? response : [response];
          await processVehicleData(vehicleList);
        } else {
          setRows([]);
          setInvoiceStatus({});
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        setRows([]);
        setInvoiceStatus({});
      }
    };
    getVehicleList();
  }, [listType]);

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

  const processVehicleData = async (vehicleList: any[]) => {
    if (!vehicleList || vehicleList.length === 0) {
      console.log('No vehicles found');
      setRows([]);
      setInvoiceStatus({});
      return;
    }

    try {
      setIsLoading(true);
      console.log('Processing vehicles:', vehicleList);
      
      const initialStatus = vehicleList.reduce((acc, vehicle) => {
        acc[vehicle.vehicleRegId.toString()] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      setInvoiceStatus(initialStatus);
      
      const processedVehicles = await Promise.all(
        vehicleList.map(async (vehicle) => {
          const vehicleId = vehicle.vehicleRegId;
          console.log(`Processing vehicle ${vehicleId}...`);
          console.log('Vehicle data:', vehicle);
          console.log('Advance payment:', vehicle.advancePayment);
          
          const hasInvoice = await checkInvoiceStatus(vehicleId);
          
          const processedVehicle = {
            id: vehicleId.toString(),
            vehicleRegId: vehicleId,
            date: vehicle.date ?? '',
            vehicleNoName: vehicle.vehicleNumber ?? '',
            customerMobile: vehicle.customerName
              ? `${vehicle.customerName} - ${vehicle.customerMobileNumber ?? ''}`
              : '',
            status: vehicle.status ?? '',
            advance: Number(vehicle.advancePayment) || 0,
            superwiser: vehicle.superwiser ?? '',
            technician: vehicle.technician ?? '',
            worker: vehicle.worker ?? '',
            kilometer: vehicle.kmsDriven ?? 0,
          };
          
          console.log('Processed vehicle:', processedVehicle);
          return processedVehicle;
        })
      );
      
      console.log('All processed vehicles:', processedVehicles);
      setRows(processedVehicles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing vehicle data:', error);
      setRows([]);
      setInvoiceStatus({});
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography component="h2" variant="h6">
          Vehicle List
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/vehicle/add')}>
          Add Vehicle
        </Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <OutlinedInput
            size="small"
            placeholder="Search in results..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            startAdornment={
              <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Grid container spacing={2} columns={12} sx={{ mb: (theme: Theme) => theme.spacing(2) }}>
        <Grid container spacing={2} sx={{ display: 'flex', gap: 2 }} item xs={12}>
          <FormControl sx={{ width: { xs: '100%', md: '25ch' } }}>
            <InputLabel>Select Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              size="medium"
            >
              <MenuItem value="Vehicle ID">Vehicle ID</MenuItem>
              <MenuItem value="Date Range">Date Range</MenuItem>
              <MenuItem value="Appointment Number">Appointment Number</MenuItem>
            </Select>
          </FormControl>

          {(selectedType === 'Vehicle ID' || selectedType === 'Appointment Number') && (
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <OutlinedInput
                size="small"
                id="search"
                placeholder="Enter text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
              />
            </FormControl>
          )}

          {selectedType === 'Date Range' && (
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
          )}

          <Button variant="contained" color="primary" sx={{ alignSelf: 'start' }} onClick={handleSearch}>
            Search
          </Button>

          
        </Grid>
        <VehicleDeleteModal open={open} onClose={() => setOpen(false)} deleteItemId={Number(selectedId)} />
      </Grid>

      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} component="div">
          <CustomizedDataGrid columns={columns} rows={filteredRows} />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}