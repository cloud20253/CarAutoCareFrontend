import React, { useState, useEffect, useMemo } from 'react';
import { FormControl, Stack, Button, TextField, Typography, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter } from '@mui/material';
import CustomizedDataGrid from 'components/CustomizedDataGrid'; // Assuming you have a customized data grid component
import Copyright from 'internals/components/Copyright'; // Assuming you have a copyright component
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
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

interface InvoiceWithTotals extends Invoice {
  totalQuantity: number;
  taxable: number;
}

const CounterSaleReport: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [rows, setRows] = useState<InvoiceWithTotals[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    if (fromDate && toDate) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/invoices/dateRange?from=${fromDate}&to=${toDate}`);
        const data: Invoice[] = await response.json();
        console.log("Fetched invoice data:", data);
  
        // Map over the data to calculate totalQuantity and totalTaxable
        const formattedRows: InvoiceWithTotals[] = data.map((invoice) => {
          // Calculate exact taxable value by calculating from amount and GST
          let totalTaxable = 0;
          
          invoice.items.forEach(item => {
            let itemTaxable = 0;
            // If amount exists, calculate taxable from amount and GST
            if (item.amount) {
              const totalGstPercent = (item.cgstPercent || 0) + (item.sgstPercent || 0);
              if (totalGstPercent > 0) {
                // Formula: taxable = amount / (1 + (totalGstPercent/100))
                itemTaxable = Number(item.amount) / (1 + (totalGstPercent / 100));
                itemTaxable = Number(itemTaxable.toFixed(2));
              } else {
                // If no GST, then taxable equals amount
                itemTaxable = Number(item.amount);
              }
            } else {
              // Fallback to taxableValue if available
              itemTaxable = Number(item.taxableValue) || 0;
            }
            
            console.log(`Item ${item.spareName} - Amount: ${item.amount}, GST: ${(item.cgstPercent || 0) + (item.sgstPercent || 0)}%, Calculated taxable: ${itemTaxable}`);
            totalTaxable += itemTaxable;
          });

          const totalQuantity = invoice.items.reduce((sum, item) => sum + item.quantity, 0);
          
          // Round to 2 decimal places for display
          totalTaxable = Number(totalTaxable.toFixed(2));
          console.log(`Invoice ${invoice.invoiceNumber} final calculated taxable: ${totalTaxable}`);
          
          return {
            ...invoice, // Spread the original invoice properties
            totalQuantity, // Add the calculated totalQuantity
            taxable: totalTaxable, // Add the calculated taxable
          };
        });

        console.log("Formatted rows with taxable amounts:", formattedRows);
  
        // Set the rows with the formatted data
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please select both dates.');
    }
  };
  
    useEffect(() => {
      if (fromDate && toDate) {
        fetchInvoices();
      }
    }, [fromDate, toDate]); // Dependency array includes both dates
  
  // Function to handle printing a specific invoice or all invoices
  const handlePrint = (invoiceId?: number, invoiceNumber?: string) => {
    let dataToSend: {
      fromDate: string;
      toDate: string;
      reportData: Invoice[];
    };

    if (invoiceId && invoiceNumber) {
      // Print a specific invoice
      console.log(`Printing individual invoice: ${invoiceNumber} with ID: ${invoiceId}`);
      
      // Find the specific invoice in the existing rows
      const invoice = rows.find(row => row.id === invoiceId);
      
      if (!invoice) {
        console.error(`Invoice with ID ${invoiceId} not found in loaded data`);
        alert('Invoice data not found. Please try again.');
        return;
      }
      
      dataToSend = {
        fromDate,
        toDate,
        reportData: [invoice]
      };
    } else {
      // Print all invoices
    dataToSend = {
      fromDate,
      toDate,
        reportData: rows
    };
    }

    console.log('Sending data to print:', dataToSend);
    const query = encodeURIComponent(JSON.stringify(dataToSend));
    window.open(`/admin/countersalereportPdf?data=${query}`, '_blank');
  };

  function renderActionButtons(params: GridCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => handlePrint(params.row.id, params.row.invoiceNumber)}
      >
        <Print />
      </IconButton>
    );
  }

  // Calculate total sums for display in footer
  const totals = useMemo(() => {
    return rows.reduce(
      (sums, row) => {
        return {
          quantity: sums.quantity + (row.totalQuantity || 0),
          taxable: sums.taxable + (row.taxable || 0),
          total: sums.total + (row.totalAmount || 0)
        };
      },
      { quantity: 0, taxable: 0, total: 0 }
    );
  }, [rows]);

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Typography variant="h4" gutterBottom>
        Counter Sale Report
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
      
      {/* Replace CustomizedDataGrid with custom table to show totals */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.No</TableCell>
              <TableCell>Invoice No</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Total Quantity</TableCell>
              <TableCell>Taxable</TableCell>
              <TableCell>Grand Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.invoiceNumber}</TableCell>
                <TableCell>{row.invDate}</TableCell>
                <TableCell>{row.totalQuantity}</TableCell>
                <TableCell>₹{Number(row.taxable).toFixed(2)}</TableCell>
                <TableCell>₹{Number(row.totalAmount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handlePrint(row.id, row.invoiceNumber)}
                  >
                    <Print />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{totals.quantity}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₹{Number(totals.taxable).toFixed(2)}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₹{Number(totals.total).toFixed(2)}</TableCell>
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
          Print All
        </button>
      </div>
      <Copyright />
    </Box>
  );
};

export default CounterSaleReport;