import React, { useState } from 'react';
import { FormControl, Stack, Button, TextField, Typography, IconButton } from '@mui/material';
import CustomizedDataGrid from 'components/CustomizedDataGrid';
import Copyright from 'internals/components/Copyright';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Print } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import apiClient from 'Services/apiService';

interface SparePartTransaction {
  sparePartTransactionId: number;
  partNumber: string;
  sparePartId: number;
  partName: string;
  manufacturer: string;
  price: number;
  qtyPrice: number;
  updateAt: string;
  transactionType: string;
  quantity: number;
  transactionDate: string;
  userId: number;
  billNo: string;
  vehicleRegId: string | null;
  customerName: string | null;
  name: string;
  totalGST: number | null;
  invoiceNumber: string | null;
  jobCardNumber: string | null;
  cgst: number | null;
  sgst: number | null;
}

interface ReportRow {
  id: number;
  invoiceNumber: string;
  invDate: string;
  totalQuantity: number;
  taxable: number;
  netTotal: number;
  transactions: SparePartTransaction[];
}

const PurchaseReport: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [allTransactions, setAllTransactions] = useState<SparePartTransaction[]>([]);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    if (fromDate && toDate) {
      try {
        const startDate = `${fromDate}T00:00:00`;
        const endDate = `${toDate}T23:59:59`;
        
        const response = await apiClient.get(
          `/sparePartTransactions/byTransactionTypeAndDateRange?transactionType=CREDIT&startDate=${startDate}&endDate=${endDate}`
        );
        
        if (response.data && Array.isArray(response.data.data)) {
          const transactions: SparePartTransaction[] = response.data.data;
          setAllTransactions(transactions);
          const groupedByBill: Record<string, SparePartTransaction[]> = {};
          
          transactions.forEach(transaction => {
            const billNo = transaction.billNo || 'Unknown';
            if (!groupedByBill[billNo]) {
              groupedByBill[billNo] = [];
            }
            groupedByBill[billNo].push(transaction);
          });
          const formattedRows = Object.entries(groupedByBill).map(([billNo, billTransactions], index) => {
            const firstTransaction = billTransactions[0];
            const totalQuantity = billTransactions.reduce((sum, t) => sum + t.quantity, 0);
            
            const subTotal = billTransactions.reduce((sum, t) => sum + (t.price * t.quantity), 0);
            
            const totalGST = billTransactions.reduce((sum, t) => {
              const itemSubtotal = t.price * t.quantity;
              const cgstRate = t.cgst || 0;
              const sgstRate = t.sgst || 0;
              const gstAmount = (cgstRate + sgstRate) * itemSubtotal / 100;
              return sum + gstAmount;
            }, 0);
            
            const netTotal = subTotal + totalGST;
            const transactionDate = new Date(firstTransaction.transactionDate);
            const formattedDate = transactionDate.toISOString().split('T')[0];
            
            console.log('Row data for bill', billNo, {
              subTotal,
              totalGST,
              netTotal
            });
            
            const row: ReportRow = {
              id: index + 1,
              invoiceNumber: billNo,
              invDate: formattedDate,
              totalQuantity,
              taxable: subTotal,
              netTotal: netTotal,
              transactions: billTransactions
            };
            return row;
          });
          setRows(formattedRows);
        } else {
          alert('Invalid response format from server');
        }
      } catch (error) {
        alert('Failed to fetch transactions. Please try again.');
      }
    } else {
      alert('Please select both dates.');
    }
  };

  const handlePrint = (billNo?: string) => {
    let dataToSend: {
      fromDate: string;
      toDate: string;
      reportData: ReportRow[];
      transactions: SparePartTransaction[];
    };
  
    if (billNo) {
      const invoice = rows.find((row) => row.invoiceNumber === billNo);
      if (!invoice) return;
  
      dataToSend = {
        fromDate,
        toDate,
        reportData: [invoice],
        transactions: invoice.transactions,
      };
    } else {
      dataToSend = {
        fromDate,
        toDate,
        reportData: rows,
        transactions: allTransactions,
      };
    }
  
    const query = encodeURIComponent(JSON.stringify(dataToSend));
    const url = `/admin/purchasereportPdf?data=${query}`;
  
    window.open(url, '_blank');
  };
  
  function renderActionButtons(params: GridCellParams) {
    return (
      <>
        <IconButton
          color="secondary"
          onClick={() => handlePrint(params.row.invoiceNumber)}
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
    { field: 'totalQuantity', headerName: 'Total Quantity', flex: 1, minWidth: 150 },
    { 
      field: 'taxable', 
      headerName: 'Taxable', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => {
        const hasGST = params.row.transactions.some((t: SparePartTransaction) => (t.cgst || 0) > 0 || (t.sgst || 0) > 0);
        const value = hasGST ? params.row.taxable : 0;
        
        return (
          <span>
            ₹{Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    { 
      field: 'netTotal', 
      headerName: 'Net Total', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => {
        const value = params.row.netTotal;
        return (
          <span>
            ₹{Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    { field: 'Action', headerName: 'Actions', flex: 1, minWidth: 150, renderCell: renderActionButtons },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Typography variant="h4" gutterBottom>
        Purchase Report
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
        <Button variant="contained" color="primary" onClick={fetchTransactions}>
          Search
        </Button>
      </Stack>
      {rows.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Debug info:</strong> Found {rows.length} rows. 
          First row data: {rows[0]?.invoiceNumber} - Taxable: {rows[0]?.taxable}, Net Total: {rows[0]?.netTotal}
        </div>
      )}
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
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default PurchaseReport;