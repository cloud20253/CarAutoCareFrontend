import React, { useRef, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import apiClient from 'Services/apiService';

interface CounterSaleData {
  invoiceNo: string;
  date: string;
  serialNo: string;
  gst: string;
  productName: string;
  state: string;
  totalSale: number;
  totalTaxable: number;
  gst0: {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  gst5: {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  gst12: {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  gst18: {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  gst28: {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
}

const CounterSalesReportPDF: React.FC = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [salesData, setSalesData] = useState<CounterSaleData[]>([]);
  const [totals, setTotals] = useState<CounterSaleData>({
    invoiceNo: 'Total',
    date: '',
    serialNo: '',
    gst: '',
    productName: '',
    state: '',
    totalSale: 0,
    totalTaxable: 0,
    gst0: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
    gst5: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
    gst12: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
    gst18: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
    gst28: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await apiClient.get('/api/counter-sales/report');
      if (response.data) {
        setSalesData(response.data);
        calculateTotals(response.data);
      } else {
        console.error('No data received from the API');
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const calculateTotals = (data: CounterSaleData[]) => {
    const newTotals = data.reduce((acc, curr) => ({
      ...acc,
      totalSale: acc.totalSale + curr.totalSale,
      totalTaxable: acc.totalTaxable + curr.totalTaxable,
      gst0: {
        taxable: acc.gst0.taxable + curr.gst0.taxable,
        cgst: acc.gst0.cgst + curr.gst0.cgst,
        sgst: acc.gst0.sgst + curr.gst0.sgst,
        igst: acc.gst0.igst + curr.gst0.igst,
      },
      gst5: {
        taxable: acc.gst5.taxable + curr.gst5.taxable,
        cgst: acc.gst5.cgst + curr.gst5.cgst,
        sgst: acc.gst5.sgst + curr.gst5.sgst,
        igst: acc.gst5.igst + curr.gst5.igst,
      },
      gst12: {
        taxable: acc.gst12.taxable + curr.gst12.taxable,
        cgst: acc.gst12.cgst + curr.gst12.cgst,
        sgst: acc.gst12.sgst + curr.gst12.sgst,
        igst: acc.gst12.igst + curr.gst12.igst,
      },
      gst18: {
        taxable: acc.gst18.taxable + curr.gst18.taxable,
        cgst: acc.gst18.cgst + curr.gst18.cgst,
        sgst: acc.gst18.sgst + curr.gst18.sgst,
        igst: acc.gst18.igst + curr.gst18.igst,
      },
      gst28: {
        taxable: acc.gst28.taxable + curr.gst28.taxable,
        cgst: acc.gst28.cgst + curr.gst28.cgst,
        sgst: acc.gst28.sgst + curr.gst28.sgst,
        igst: acc.gst28.igst + curr.gst28.igst,
      },
    }), totals);
    setTotals(newTotals);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        allowTaint: true,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width; 
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('counter-sales-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  return (
    <Box sx={{ m: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Counter Sales Report</Typography>
        <Button variant="contained" onClick={generatePDF}>
          Download PDF
        </Button>
      </Box>

      <div ref={invoiceRef}>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 2000, '& th, & td': { whiteSpace: 'nowrap', px: 1, py: 0.5 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60 }}>S.No</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Invoice No</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Date</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Serial No</TableCell>
                <TableCell sx={{ minWidth: 80 }}>GST</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Product Name</TableCell>
                <TableCell sx={{ minWidth: 80 }}>State</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Total Sale</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Total Taxable</TableCell>
                <TableCell sx={{ minWidth: 100 }}>0% Taxable</TableCell>
                <TableCell sx={{ minWidth: 80 }}>0% CGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>0% SGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>0% IGST</TableCell>
                <TableCell sx={{ minWidth: 100 }}>5% Taxable</TableCell>
                <TableCell sx={{ minWidth: 80 }}>2.5% CGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>2.5% SGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>5% IGST</TableCell>
                <TableCell sx={{ minWidth: 100 }}>12% Taxable</TableCell>
                <TableCell sx={{ minWidth: 80 }}>6% CGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>6% SGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>12% IGST</TableCell>
                <TableCell sx={{ minWidth: 100 }}>18% Taxable</TableCell>
                <TableCell sx={{ minWidth: 80 }}>9% CGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>9% SGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>18% IGST</TableCell>
                <TableCell sx={{ minWidth: 100 }}>28% Taxable</TableCell>
                <TableCell sx={{ minWidth: 80 }}>14% CGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>14% SGST</TableCell>
                <TableCell sx={{ minWidth: 80 }}>28% IGST</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.invoiceNo}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.serialNo}</TableCell>
                  <TableCell>{row.gst}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.totalSale.toFixed(2)}</TableCell>
                  <TableCell>{row.totalTaxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst0.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst0.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst0.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst0.igst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst5.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst5.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst5.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst5.igst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst12.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst12.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst12.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst12.igst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst18.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst18.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst18.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst18.igst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst28.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.gst28.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst28.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.gst28.igst.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell>{totals.totalSale.toFixed(2)}</TableCell>
                <TableCell>{totals.totalTaxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst0.taxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst0.cgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst0.sgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst0.igst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst5.taxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst5.cgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst5.sgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst5.igst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst12.taxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst12.cgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst12.sgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst12.igst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst18.taxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst18.cgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst18.sgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst18.igst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst28.taxable.toFixed(2)}</TableCell>
                <TableCell>{totals.gst28.cgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst28.sgst.toFixed(2)}</TableCell>
                <TableCell>{totals.gst28.igst.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
</div>
    </Box>
  );
};

export default CounterSalesReportPDF;