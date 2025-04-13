
// import React, { useState } from 'react';
// import { FormControl, Stack, Button, TextField, Typography, IconButton } from '@mui/material';
// import CustomizedDataGrid from 'components/CustomizedDataGrid'; // Assuming you have a customized data grid component
// import Copyright from 'internals/components/Copyright'; // Assuming you have a copyright component
// import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
// import { Print } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';

// interface Invoice {
//   id: number;
//   invoiceNumber: string;
//   vehicleNo: string;
//   invoiceDate: string;
//   totalAmount: number | null; // Allow null if totalAmount is not provided
// }

// const JobSaleReport: React.FC = () => {
//   const [fromDate, setFromDate] = useState<string>('');
//   const [toDate, setToDate] = useState<string>('');
//   const [rows, setRows] = useState<GridRowsProp>([]);
//   const navigate = useNavigate();

//   const fetchInvoices = async () => {
//     if (fromDate && toDate) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/vehicle-invoices/search/date-range?startDate=${fromDate}&endDate=${toDate}`);
//         const data: Invoice[] = await response.json();
//         const formattedRows = data.map((invoice, index) => ({
//           id: index + 1, // Sr.No
//           invoiceNumber: invoice.invoiceNumber,
//           vehicleNo: invoice.vehicleNo,
//           invDate: invoice.invoiceDate,
//           grandTotal: invoice.totalAmount !== null ? invoice.totalAmount : 0, // Default to 0 if null
//         }));
//         setRows(formattedRows);
//       } catch (error) {
//         console.error('Error fetching invoices:', error);
//       }
//     } else {
//       alert('Please select both dates.');
//     }
//   };

//   const handlePrint = () => {
//     navigate('/admin/jobsalereportPdf', {
//       state: {
//         fromDate, // Pass fromDate
//         toDate,   // Pass toDate
//         reportData: rows, // Pass the entire rows data
//       },
//     });
//   };

//   function renderActionButtons(params: GridCellParams) {
//     return (
//       <IconButton
//         color="secondary"
//         onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleNo}`)}
//       >
//         <Print />
//       </IconButton>
//     );
//   }

//   // Define the columns
//   const columns: GridColDef[] = [
//     { field: 'id', headerName: 'Sr.No', flex: 1, minWidth: 100 },
//     { field: 'invoiceNumber', headerName: 'ID', flex: 1, minWidth: 150 },
//     { field: 'vehicleNo', headerName: 'Veh No', flex: 1, minWidth: 150 },
//     { field: 'invDate', headerName: 'Invoice Date', flex: 1, minWidth: 150 },
//     { field: 'grandTotal', headerName: 'Grand Total', flex: 1, minWidth: 150 },
//     { field: 'Action', headerName: 'Actions', flex: 1, minWidth: 150, renderCell: renderActionButtons },
//   ];

//   return (
//     <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
//       <Typography variant="h4" gutterBottom>
//         Job Sale Report
//       </Typography>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//         <FormControl>
//           <TextField
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             label="From Date"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </FormControl>
//         <FormControl>
//           <TextField
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             label="To Date"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </FormControl>
//         <Button variant="contained" color="primary" onClick={fetchInvoices}>
//           Search
//         </Button>
//       </Stack>
//       <Grid container spacing={1} columns={12}>
//         <Grid item xs={12}>
//           <CustomizedDataGrid  columns={columns} rows={rows} />
//         </Grid>
//       </Grid>

//       <div style={{ marginTop: '20px', textAlign: 'center' }}>
//         <button
//           style={{
//             border: 'none',
//             borderRadius: '5px',
//             padding: '10px 20px',
//             backgroundColor: '#60B5FF',
//             color: '#fff',
//             fontSize: '1rem',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             transition: 'background-color 0.3s ease',
//           }}
//           onClick={handlePrint}
//         >
//           Print 
//         </button>
//       </div>
//       <Copyright />
//     </Box>
//   );
// };

// export default JobSaleReport;




import React, { useState ,useEffect} from 'react';
import { FormControl, Stack, Button, TextField, Typography, IconButton } from '@mui/material';
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
      reportData: Invoice[];
    };

    dataToSend = {
      fromDate,
      toDate,
      reportData: rows,
    };

    const query = encodeURIComponent(JSON.stringify(dataToSend));
    const url = `/admin/jobsalereportPdf?data=${query}`;

    window.open(url, '_blank');
  };

  function renderActionButtons(params: GridCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => navigate(`/admin/vehicle/view/${params.row.vehicleNo}`)}
      >
        <Print />
      </IconButton>
    );
  }

  // Define the columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr.No', flex: 1, minWidth: 100 },
    { field: 'invoiceNumber', headerName: 'ID', flex: 1, minWidth: 150 },
    { field: 'vehicleNo', headerName: 'Vehicle No', flex:  1, minWidth: 150 },
    { field: 'invoiceDate', headerName: 'Invoice Date', flex: 1, minWidth: 150 },
    { field: 'grandTotal', headerName: 'Grand Total', flex: 1, minWidth: 150 },  
    { field: 'Action', headerName: 'Actions', flex: 1, minWidth: 150, renderCell: renderActionButtons },
  ];

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
            // onChange={(e) => setToDate(e.target.value)}
            onChange={(e) => {
              setToDate(e.target.value);
              fetchInvoices(); // Call fetchInvoices when toDate changes
            }}
          />
        </FormControl>
        {/* <Button variant="contained" onClick={fetchInvoices}>
          Fetch Invoices
        </Button> */}
       { loading && <p>Loading...</p>}
      </Stack>
      <CustomizedDataGrid rows={rows} columns={columns} />
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