// TransactionAll.tsx
import React, { useEffect } from "react";
import apiClient from "Services/apiService";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from 'components/CustomizedDataGrid';
import Copyright from 'internals/components/Copyright';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Theme } from '@mui/material/styles';

interface Transaction {
  sparePartTransactionId: number;
  partNumber: string;
  transactionType: "CREDIT" | "DEBIT";
  quantity: number;
  userId: number;
  billNo: string;
  transactionDate: string;
  sparePartId: string;
  manufacturer: string;
  price: string;
  qtyPrice: string;
  updateAt: string;
  vehicleRegId: string;
  partName: string;
}

const TransactionAll = () => {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [textInput, setTextInput] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  // Date range state as a tuple [startDate, endDate]
  const [dateValue, setDateValue] = React.useState<[any, any]>([null, null]);
  const navigate = useNavigate();

  const fetchAllTransactions = async () => {
    try {
      const response = await apiClient.get("/sparePartTransactions/getAll");
      if (response && Array.isArray(response.data)) {
        const formattedRows = response.data.map((transaction: Transaction, index: number) => ({
          id: index + 1, 
          partNumber: transaction.partNumber,
          sparePartId: transaction.sparePartId,
          partName: transaction.partName,
          manufacturer: transaction.manufacturer,
          price: transaction.price,
          qtyPrice: transaction.qtyPrice,
          updateAt: transaction.updateAt,
          transactionType: transaction.transactionType,
          quantity: transaction.quantity,
          transactionDate: transaction.transactionDate,
          billNo: transaction.billNo,
          vehicleRegId: transaction.vehicleRegId,
          Action: 'View', 
        }));
        setRows(formattedRows);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'partNumber',
      headerName: 'Part Number',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'partName',
      headerName: 'Part Name',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'manufacturer',
      headerName: 'Manufacture',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'price',
      headerName: 'Price',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'qtyPrice',
      headerName: 'Quantity Price',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'updateAt',
      headerName: 'Date',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'transactionType',
      headerName: 'Transaction Type',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'transactionDate',
      headerName: 'Transaction Date',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'billNo',
      headerName: 'Bill NO',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'vehicleRegId',
      headerName: 'Vehicle Registration No',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      minWidth: 100,
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: (theme: Theme) => theme.spacing(2) }}
      >
        <Typography component="h2" variant="h6">
          Vehicle Transaction List
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/admin/spare-part/transaction/add")}>
          Add Transaction
        </Button>
      </Stack>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme: Theme) => theme.spacing(2) }}>
        <Grid container spacing={2} sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }}>
            <InputLabel>Select Type</InputLabel>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} size="medium">
              <MenuItem value="Vehicle ID">Vehicle ID</MenuItem>
              <MenuItem value="Date Range">Date Range</MenuItem>
              <MenuItem value="Status">Status</MenuItem>
              <MenuItem value="Appointment Number">Appointment Number</MenuItem>
            </Select>
          </FormControl>
          {(selectedType === "Vehicle ID" || selectedType === "Appointment Number") && (
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
          )}
          {selectedType === "Date Range" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={dateValue[0]}
                  onChange={(newStart) => setDateValue([newStart, dateValue[1]])}
                  slots={{ textField: TextField }}
                />
                <DatePicker
                  label="End Date"
                  value={dateValue[1]}
                  onChange={(newEnd) => setDateValue([dateValue[0], newEnd])}
                  slots={{ textField: TextField }}
                />
              </Stack>
            </LocalizationProvider>
          )}
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
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12}>
          <CustomizedDataGrid columns={columns} rows={rows} />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default TransactionAll;
