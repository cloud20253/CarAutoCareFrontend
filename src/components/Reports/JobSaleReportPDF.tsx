
// import React, { FC, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// interface BillRow {
//   id?: number;
//   invoiceNumber: string; // Invoice number
//   invDate: string; // Invoice date
//   customerName: string; // Customer name
//   totalQuantity: number; // Total quantity
//   taxable: number; // Taxable amount
//   grandTotal: number; // Grand total
//   vehicleNo: string; // Vehicle number
// }

// interface LocationState {
//   fromDate: string;
//   toDate: string;
//   reportData: BillRow[];
// }

// const JobSaleReportPDF: FC = () => {
//   const theme = useTheme();
//   const location = useLocation(); // Use without type argument
//   const { fromDate, toDate, reportData } = location.state as LocationState || {}; // Type assertion

//   console.log("Counter sale report data>>>", JSON.stringify(reportData, null, 2));
  
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   const generatePDF = async () => {
//     const invoiceElement = invoiceRef.current;
//     if (!invoiceElement) {
//       console.error("Invoice element not found!");
//       return;
//     }

//     const options = { scale: 3};
//     const canvas = await html2canvas(invoiceElement, options as any);
//     const imgData = canvas.toDataURL("image/png", 0.9);

//     const pageWidth = 210; 
//     const pageHeight = 297; 

//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width; 

//     let finalHeight = imgHeight;
//     let scaleFactor = 1;

//     if (finalHeight > pageHeight) {
//       scaleFactor = pageHeight / imgHeight; 
//       finalHeight = pageHeight;
//     }

//     const pdf = new jsPDF({
//       orientation: "p",
//       unit: "mm",
//       format: "a4",
//       compress: true,
//     });
//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
//     pdf.save("invoice.pdf");
//   };
  
//   return (
//     <>
//     <div
//       ref={invoiceRef}
//       id="invoice-container"
//       style={{
//         width: '100%',
//         minHeight: '297mm',
//         margin: '0 auto',
//         padding: '5mm',
//         fontFamily: 'Arial, sans-serif',
//         fontSize: '0.6rem',
//         backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
//         color: theme.palette.mode === 'dark' ? '#fff' : '#000',
//       }}
//     >
//       <h5 style={{ padding: '4px', marginTop: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
//         Job Sale Report
//       </h5>

//       <p style={{ padding: '6px', textAlign: 'center', fontSize: '1rem',  }}>
//      From  {fromDate} To {toDate}
//       </p>

//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <tbody>
//           <tr>
//             <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr>
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>S.No</td>
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Invoice No</td>
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Invoice Date</td>
//                     {/* <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Customer Name</td> */}
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Total Quantity</td>
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Taxable</td>
//                     <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Grand Total</td>
//                   </tr>
//                 </thead>
//                 <tbody>
//   {reportData && reportData.map((row: BillRow, index: number) => (
//     <tr key={index}>
//       <td style={tableBodyCell}>{index + 1}</td>
//       <td style={tableBodyCell}>{row.invoiceNumber}</td>
//       <td style={tableBodyCell}>{row.invDate}</td>
//       <td style={tableBodyCell}>{row.totalQuantity}</td>
//       <td style={tableBodyCell}>{row.taxable}</td>
//       <td style={tableBodyCell}>{row.grandTotal.toFixed(2)}</td>
//     </tr>
//   ))}

//   {/* Calculate sums */}
//   {reportData && reportData.length > 0 && (
//     (() => {
//       let totalQuantity = 0;
//       let totalTaxable = 0;
//       let totalGrandTotal = 0;

//       reportData.forEach(row => {
//         totalQuantity += row.totalQuantity;
//         totalTaxable += row.taxable;
//         totalGrandTotal += row.grandTotal;
//       });

//       return (
//         <tr>
//           <td colSpan={3} style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//         TOTAL
//           </td>
//           <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//             {totalQuantity}
//           </td>
//           <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//             {totalTaxable.toFixed(2)}
//           </td>
//           <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//             {totalGrandTotal.toFixed(2)}
//           </td>
//         </tr>
//       );
//     })()
//   )}
// </tbody>
            
//                   <tr></tr>
//               </table>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div style={{ marginTop: '20px', textAlign: 'center' }}>
//     <button
//       style={{
//         border: 'none',
//         borderRadius: '5px',
//         padding: '10px 20px',
//         backgroundColor: '#60B5FF', // Red background
//         color: '#fff', // White text
//         fontSize: '1rem',
//         fontWeight: 'bold',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease',
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#AFDDFF')} // Darker red on hover
//       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#60B5FF')} // Original red on leave
//       onClick={generatePDF}
//     >
//     Print
//     </button>

// </div>
//     </div>
   
//           </>
//   );
// };

// const tableBodyCell: React.CSSProperties = {
//   border: '1px solid #000',
//   padding: '6px',
//   textAlign: 'center',
//   verticalAlign: 'middle',
// };

// export default JobSaleReportPDF;







// import React, { FC, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// interface BillRow {
//   id?: number;
//   invoiceNumber: string; // Invoice number
//   invDate: string; // Invoice date
//   customerName: string; // Customer name
//   totalQuantity: number; // Total quantity
//   taxable: number; // Taxable amount
//   grandTotal: number; // Grand total
//   vehicleNo: string; // Vehicle number
//   // Add any other fields you want to display
// }

// interface LocationState {
//   fromDate: string;
//   toDate: string;
//   reportData: BillRow[];
// }

// const JobSaleReportPDF: FC = () => {
//   const theme = useTheme();
//   const location = useLocation();
//   const { fromDate, toDate, reportData } = location.state as LocationState || {}; // Type assertion

//   console.log("Counter sale report data>>>", JSON.stringify(reportData, null, 2));
  
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   const generatePDF = async () => {
//     const invoiceElement = invoiceRef.current;
//     if (!invoiceElement) {
//       console.error("Invoice element not found!");
//       return;
//     }

//     const options = { scale: 3 };
//     const canvas = await html2canvas(invoiceElement, options as any);
//     const imgData = canvas.toDataURL("image/png", 0.9);

//     const pageWidth = 210; 
//     const pageHeight = 297; 

//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width; 

//     let finalHeight = imgHeight;
//     let scaleFactor = 1;

//     if (finalHeight > pageHeight) {
//       scaleFactor = pageHeight / imgHeight; 
//       finalHeight = pageHeight;
//     }

//     const pdf = new jsPDF({
//       orientation: "p",
//       unit: "mm",
//       format: "a4",
//       compress: true,
//     });
//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
//     pdf.save("invoice.pdf");
//   };
  
//   return (
//     <>
//       <div
//         ref={invoiceRef}
//         id="invoice-container"
//         style={{
//           width: '100%',
//           minHeight: '297mm',
//           margin: '0 auto',
//           padding: '5mm',
//           fontFamily: 'Arial, sans-serif',
//           fontSize: '0.6rem',
//           backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
//           color: theme.palette.mode === 'dark' ? '#fff' : '#000',
//         }}
//       >
//         <h5 style={{ padding: '4px', marginTop: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
//           Job Sale Report
//         </h5>

//         <p style={{ padding: '6px', textAlign: 'center', fontSize: '1rem' }}>
//           From {fromDate} To {toDate}
//         </p>

//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr>
//               <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>S.No</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Invoice No</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Invoice Date</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Customer Name</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Total Quantity</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Taxable</td>
//                       <td style={{ border: '1px solid grey', textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Grand Total</td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reportData && reportData.map((row: BillRow, index: number) => (
//                       <tr key={index}>
//                         <td style={tableBodyCell}>{index + 1}</td>
//                         <td style={tableBodyCell}>{row.invoiceNumber}</td>
//                         <td style={tableBodyCell}>{row.invDate}</td>
//                         <td style={tableBodyCell}>{row.customerName}</td>
//                         <td style={tableBodyCell}>{row.totalQuantity}</td>
//                         <td style={tableBodyCell}>{row.taxable}</td>
//                         <td style={tableBodyCell}>{row.grandTotal.toFixed(2)}</td>
//                       </tr>
//                     ))}

//                     {/* Calculate sums */}
//                     {reportData && reportData.length > 0 && (
//                       (() => {
//                         let totalQuantity = 0;
//                         let totalTaxable = 0;
//                         let totalGrandTotal = 0;

//                         reportData.forEach(row => {
//                           totalQuantity += row.totalQuantity;
//                           totalTaxable += row.taxable;
//                           totalGrandTotal += row.grandTotal;
//                         });

//                         return (
//                           <tr>
//                             <td colSpan={4} style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                               TOTAL
//                             </td>
//                             <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                               {totalQuantity}
//                             </td>
//                             <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                               {totalTaxable.toFixed(2)}
//                             </td>
//                             <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
//                               {totalGrandTotal.toFixed(2)}
//                             </td>
//                           </tr>
//                         );
//                       })()
//                     )}
//                   </tbody>
//                 </table>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           <button
//             style={{
//               border: 'none',
//               borderRadius: '5px',
//               padding: '10px 20px',
//               backgroundColor: '#60B5FF',
//               color: '#fff',
//               fontSize: '1rem',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               transition: 'background-color 0.3s ease',
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#AFDDFF')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#60B5FF')}
//             onClick={generatePDF}
//           >
//             Print
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// const tableBodyCell: React.CSSProperties = {
//   border: '1px solid #000',
//   padding: '6px',
//   textAlign: 'center',
//   verticalAlign: 'middle',
// };

// export default JobSaleReportPDF;



import React, { FC, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface BillRow {
  id?: number; // Sr.No
  invoiceNumber: string; // ID
  vehicleNo: string; // Veh No
  invDate: string; // Invoice Date
  grandTotal: number; // Grand Total
}

interface LocationState {
  fromDate: string;
  toDate: string;
  reportData: BillRow[];
}

const JobSaleReportPDF: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { fromDate, toDate, reportData } = location.state as LocationState || {}; // Type assertion

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
    pdf.save("invoice.pdf");
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
                    {reportData && reportData.map((row: BillRow, index: number) => (
                      <tr key={index}>
                        <td style={tableBodyCell}>{index + 1}</td>
                        <td style={tableBodyCell}>{row.invoiceNumber}</td>
                        <td style={tableBodyCell}>{row.vehicleNo}</td>
                        <td style={tableBodyCell}>{row.invDate}</td>
                        <td style={tableBodyCell}>{row.grandTotal.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
                        TOTAL
                      </td>
                      <td style={{ ...tableBodyCell, textAlign: 'right', fontWeight: 'bold' }}>
                        {totalGrandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            
          </tbody>
        </table>
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
            onClick={generatePDF}
          >
            Print
          </button>
        </div>
      </div>
    </>
  );
};

const tableBodyCell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

export default JobSaleReportPDF;