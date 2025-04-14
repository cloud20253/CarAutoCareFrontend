import React, { FC, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface BillRow {
  id?: number;
  invoiceNumber: string; 
  vehicleNo: string; 
  invDate: string; 
  grandTotal: number; 
}

interface LocationState {
  fromDate: string;
  toDate: string;
  reportData: BillRow[];
}

const JobSaleReportPDF: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const parseQueryData = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const decodedData = decodeURIComponent(dataParam);
        return JSON.parse(decodedData) as LocationState;
      }
      return null;
    } catch (error) {
      console.error("Error parsing query data:", error);
      return null;
    }
  };

  const queryData = parseQueryData();
  const fromDate = queryData?.fromDate || '';
  const toDate = queryData?.toDate || '';
  const reportData = queryData?.reportData || [];

  const invoiceRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) {
      console.error("Invoice element not found!");
      return;
    }

    const options = { scale: 3 };
    const canvas = await html2canvas(invoiceElement, options as any);
    const imgData = canvas.toDataURL("image/png", 0.9);

    const pageWidth = 210; 
    const pageHeight = 297; 

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width; 

    let finalHeight = imgHeight;
    let scaleFactor = 1;

    if (finalHeight > pageHeight) {
      scaleFactor = pageHeight / imgHeight; 
      finalHeight = pageHeight;
    }

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
    pdf.save("Job_Sale_Report.pdf");
  };

  const totalGrandTotal = reportData.reduce((acc, row) => acc + (row.grandTotal || 0), 0);
  
  return (
    <>
      <div
        ref={invoiceRef}
        id="invoice-container"
        style={{
          width: '100%',
          minHeight: '297mm',
          margin: '0 auto',
          padding: '5mm',
          fontFamily: 'Arial, sans-serif',
          fontSize: '0.6rem',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        }}
      >
        <h5 style={{ padding: '4px', marginTop: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Job Sale Report
        </h5>

        <p style={{ padding: '6px', textAlign: 'center', fontSize: '1rem' }}>
          From {fromDate} To {toDate}
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>S.No</td>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>ID</td>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Veh No</td>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Invoice Date</td>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Grand Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px' }}>{index + 1}</td>
                        <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px' }}>{row.invoiceNumber}</td>
                        <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px' }}>{row.vehicleNo}</td>
                        <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px' }}>{row.invDate}</td>
                        <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px' }}>{row.grandTotal}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} style={{ border: '1px solid grey', textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>Total</td>
                      <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>{totalGrandTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#60B5FF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Download PDF
      </button>
    </>
  );
};

export default JobSaleReportPDF;