
import React, { useState } from 'react';
import { FormControl, Stack, Button, TextField, Typography,IconButton } from '@mui/material';
import CustomizedDataGrid from 'components/CustomizedDataGrid'; // Assuming you have a customized data grid component
import Copyright from 'internals/components/Copyright'; // Assuming you have a copyright component
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import BuildIcon from '@mui/icons-material/Build';
// import PreviewIcon from '@mui/icons-material/Preview';
import { Print } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';


interface InvoiceItem {
  id: number;
  spareName: string;
  spareNo: string;
  quantity: number;
  rate: number;
  discountPercent: number;
  discountAmt: number;
  taxableValue: number;
  cgstPercent: number;
  amount: number;
  sgstPercent: number;
  cgstAmt: number;
  sgstAmt: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invDate: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  adharNo: string;
  gstin: string;
  vehicleNo: string;
  totalAmount: number;
  discount: number;
  netTotal: number;
  items: InvoiceItem[];
}

const CounterSaleReport: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [rows, setRows] = useState<GridRowsProp>([]);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    if (fromDate && toDate) {
      try {
        const response = await fetch(`http://localhost:8080/api/invoices/dateRange?from=${fromDate}&to=${toDate}`);
        const data: Invoice[] = await response.json();
        const formattedRows = data.map((invoice) => {
          const totalQuantity = invoice.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalTaxable = invoice.items.reduce((sum, item) => sum + item.taxableValue, 0);
          return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            invDate: invoice.invDate,
            customerName: invoice.customerName,
            totalQuantity: totalQuantity,
            taxable: totalTaxable,
            grandTotal: invoice.totalAmount,
            vehicleNo: invoice.vehicleNo,
          };
        });
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    } else {
      alert('Please select both dates.');
    }
  };


  const handlePrint = () => {
    navigate('/admin/countersalereportPdf', {
      state: {
        fromDate, // Pass fromDate
        toDate,   // Pass toDate
        reportData: rows, // Pass the entire rows data
      },
    });
  };


  function renderActionButtons(params: GridCellParams) {
        return (
          <>
            {/* <IconButton
              color="primary"
              onClick={() => navigate(`/admin/vehicle/edit/${params.row.vehicleRegId}`)}
            >
              <EditIcon />
            </IconButton> */}
            {/* <IconButton
              color="secondary"
              onClick={() => handleDelete(params.row.vehicleRegId)}
            >
              <DeleteIcon />
            </IconButton> */}
            {/* <IconButton
              color="secondary"
              onClick={() =>
                navigate(`/admin/vehicle/add/servicepart/${params.row.vehicleRegId}`)
              }
            >
              <BuildIcon />
            </IconButton> */}
            {/* <IconButton
              color="secondary"
              onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleRegId}`)}
            >
              <PreviewIcon />
            </IconButton> */}
            <IconButton
              color="secondary"
              onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleRegId}`)}
            >
              <Print />
            </IconButton>
          </>
        );
      }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr.No', flex: 1, minWidth: 100 },
    { field: 'invoiceNumber', headerName: 'Invoice No', flex: 1, minWidth: 150 },
    { field: 'invDate', headerName: 'Invoice Date', flex: 1, minWidth: 150 },
    // { field: 'customerName', headerName: 'Customer Name', flex: 1, minWidth: 150 },
    { field: 'totalQuantity', headerName: 'Total Quantity', flex: 1, minWidth: 150 },
    { field: 'taxable', headerName: 'Taxable', flex: 1, minWidth: 150 },
    { field: 'grandTotal', headerName: 'Grand Total', flex: 1, minWidth: 150 },
    { field: 'Action', headerName: 'Action', flex: 1, minWidth: 150, renderCell: renderActionButtons },

  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Typography variant="h4" gutterBottom>
        Counter Sale Report
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <FormControl>
          <TextField
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            label="From Date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl>
          <TextField
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            label="To Date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={fetchInvoices}>
          Search
        </Button>
      </Stack>
      <Grid container spacing={1} columns={12}>
      <Grid item xs={12}>
      <CustomizedDataGrid columns={columns} rows={rows} />
   </Grid>
         </Grid>

         <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <button
      style={{
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        backgroundColor: '#60B5FF', // Red background
        color: '#fff', // White text
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#AFDDFF')} // Darker red on hover
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#60B5FF')} // Original red on leave
      onClick={handlePrint}
    >
    Print
    </button>

</div>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default CounterSaleReport;