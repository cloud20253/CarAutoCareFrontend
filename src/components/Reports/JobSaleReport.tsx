import React, { useState ,useEffect, useMemo} from 'react';
import { FormControl, Stack, Button, TextField, Typography, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter } from '@mui/material';
import CustomizedDataGrid from 'components/CustomizedDataGrid'; // Assuming you have a customized data grid component
import Copyright from 'internals/components/Copyright'; // Assuming you have a copyright component
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Print } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Define the interfaces based on the JSON structure
interface Part {
  id: number;
  partName: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  totalAmount: number;
}

interface Labour {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  totalAmount: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  jobCardNumber: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  customerAadharNo: string;
  customerGstin: string;
  vehicleRegId: string;
  regNo: string;
  model: string;
  kmsDriven: string;
  vehicleNo: string;
  comments: string;
  parts: Part[];
  labours: Labour[];
  globalDiscount: number;
  subTotal: number;
  partsSubtotal:number ;
  laboursSubtotal:number;
  totalAmount: number | null; // Allow null if totalAmount is not provided
  advanceAmount: number;
  totalInWords: string;
}

const JobSaleReport: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchInvoices = async () => {
    if (fromDate && toDate) {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(`http://localhost:8080/api/vehicle-invoices/search/date-range?startDate=${fromDate}&endDate=${toDate}`);
        const data = await response.json();
        console.log("Fetched invoice data:", data);
        setRows(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    } else {
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchInvoices();
    }
  }, [fromDate, toDate]); // Dependency array includes both dates

  const handlePrint = () => {
    let dataToSend: {
      fromDate: string;
      toDate: string;
      reportData: any[];
    };

    dataToSend = {
      fromDate,
      toDate,
      reportData: gridRows, // Use gridRows instead of rows to ensure proper field mapping
    };

    const query = encodeURIComponent(JSON.stringify(dataToSend));
    const url = `/admin/jobsalereportPdf?data=${query}`;

    window.open(url, '_blank');
  };

  function renderActionButtons(params: GridCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => {
          // Navigate to the invoice PDF generator with invoice number as parameter
          window.open(`/admin/invoicepdfgenerator?invoiceNumber=${params.row.invoiceNumber}`, '_blank');
        }}
      >
        <Print />
      </IconButton>
    );
  }

  // Convert data for the grid display
  const gridRows = rows.map((invoice, index) => {
    // Get the totalAmount directly from the invoice and ensure it's a number
    console.log(`Invoice ${invoice.invoiceNumber} total amount:`, invoice.totalAmount);
    const totalAmount = Number(invoice.totalAmount || 0);
    
    return {
      id: index + 1,
      invoiceNumber: invoice.invoiceNumber,
      vehicleNo: invoice.regNo || 'N/A',
      invDate: invoice.invoiceDate,
      grandTotal: totalAmount
    };
  });

  // Calculate the grand total sum
  const grandTotalSum = useMemo(() => {
    return gridRows.reduce((sum, row) => sum + (row.grandTotal || 0), 0);
  }, [gridRows]);

  // Use a custom table instead of CustomizedDataGrid to show the total row
  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Typography variant="h4" gutterBottom>
        Job Sale Report
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} sx={{ mb: 2 }}>
        <FormControl>
          <TextField
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <TextField
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              fetchInvoices(); // Call fetchInvoices when toDate changes
            }}
          />
        </FormControl>
        {loading && <p>Loading...</p>}
      </Stack>
      
      {/* Replace CustomizedDataGrid with custom table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Vehicle No</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Grand Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gridRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.invoiceNumber}</TableCell>
                <TableCell>{row.vehicleNo}</TableCell>
                <TableCell>{row.invDate}</TableCell>
                <TableCell>₹{row.grandTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      window.open(`/admin/invoicepdfgenerator?invoiceNumber=${row.invoiceNumber}`, '_blank');
                    }}
                  >
                    <Print />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₹{grandTotalSum.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          style={{
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            backgroundColor: '#60B5FF',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#AFDDFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#60B5FF')}
          onClick={() => handlePrint()}
        >
          Print 
        </button>
      </div>
      <Copyright />
    </Box>
  );
};

export default JobSaleReport;