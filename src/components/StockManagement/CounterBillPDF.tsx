import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface BillRow {
  id: number;
  sNo: number;
  itemName?: string;    
  spareName?: string;
  qty?: number;
  unitPrice?: number;   
  rate?: number;
  discount?: number;
  taxable?: number;   
  cgstRate?: number;
  cgstAmt?: number;
  cgst?: number;      
  sgstRate?: number;
  sgstAmt?: number;
  sgst?: number;        
  igstRate?: number;
  igstAmt?: number;
  amount?: number;      
  total?: number;
}

interface LocationState {
  invoiceNo: string;
  invDate: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  adharNo: string;
  gstin: string;
  vehicleNo: string;
  billRows: BillRow[];
}

const CounterBillPDF: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;

  const {
    invoiceNo = '',
    invDate = '',
    customerName = '',
    customerAddress = '',
    customerMobile = '',
    adharNo = '',
    gstin = '',
    vehicleNo = '',
    billRows = [],
  } = state || {};

  const grandTotal = billRows
    .reduce((acc, row) => acc + (row.amount ?? row.total ?? 0), 0)
    .toFixed(2);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: '70%', textAlign: 'center', verticalAlign: 'top' }}>
              <h2 style={{ margin: 0 }}>AUTO CAR CARE POINT</h2>
              <p style={{ margin: 0 }}>
                Burnasheeb Nagar, Shivnagar Road, Katol, (445201), Dist Satara
              </p>
              <p style={{ margin: 0 }}>
                Ph: 9999999999 | 7890117886 | Email: autocarepoint@gmail.com
              </p>
              <p style={{ margin: 0 }}>GSTIN: 29CLJPS9999C1ZV</p>
            </td>
            <td style={{ ...cellStyle, width: '30%', textAlign: 'center', verticalAlign: 'middle' }}>
              <strong style={{ fontSize: '1.2rem' }}>TAX INVOICE</strong>
            </td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, width: '50%', fontWeight: 'bold', verticalAlign: 'top' }}>
              CUSTOMER DETAILS
            </td>
            <td
              style={{
                ...cellStyle,
                width: '50%',
                fontWeight: 'bold',
                textAlign: 'right',
                verticalAlign: 'top',
              }}
            >
              INVOICE DETAILS
            </td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, width: '50%', verticalAlign: 'top' }}>
              <p style={{ margin: 0 }}>Name: {customerName}</p>
              <p style={{ margin: 0 }}>Address: {customerAddress}</p>
              <p style={{ margin: 0 }}>Mobile: {customerMobile}</p>
              <p style={{ margin: 0 }}>Vehicle No: {vehicleNo}</p>
              {adharNo && <p style={{ margin: 0 }}>Aadhaar No: {adharNo}</p>}
              {gstin && <p style={{ margin: 0 }}>GSTIN: {gstin}</p>}
            </td>
            <td style={{ ...cellStyle, width: '50%', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'right' }}>Invoice No: {invoiceNo}</p>
              <p style={{ margin: 0, textAlign: 'right' }}>Invoice Date: {invDate}</p>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ ...cellStyle, textAlign: 'center' }}>
              <strong>SPARES / ITEMS</strong>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    }}
                  >
                    <th rowSpan={2} style={tableHeaderCell}>
                      S.No
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Particular/Item
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Qty
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Unit Price
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Discount
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Taxable Amt
                    </th>
                    <th colSpan={2} style={tableHeaderCell}>
                      CGST
                    </th>
                    <th colSpan={2} style={tableHeaderCell}>
                      SGST
                    </th>
                    <th colSpan={2} style={tableHeaderCell}>
                      IGST
                    </th>
                    <th rowSpan={2} style={tableHeaderCell}>
                      Amount
                    </th>
                  </tr>
                  <tr
                    style={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    }}
                  >
                    <th style={tableHeaderCell}>Rate</th>
                    <th style={tableHeaderCell}>Amt</th>
                    <th style={tableHeaderCell}>Rate</th>
                    <th style={tableHeaderCell}>Amt</th>
                    <th style={tableHeaderCell}>Rate</th>
                    <th style={tableHeaderCell}>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {billRows.map((row) => (
                    <tr key={row.id}>
                      <td style={tableBodyCell}>{row.sNo}</td>
                      <td style={tableBodyCell}>{row.itemName || row.spareName}</td>
                      <td style={tableBodyCell}>{row.qty ?? 0}</td>
                      <td style={tableBodyCell}>
                        {((row.unitPrice ?? row.rate) || 0).toFixed(2)}
                      </td>
                      <td style={tableBodyCell}>{(row.discount ?? 0).toFixed(2)}</td>
                      <td style={tableBodyCell}>{(row.taxable ?? 0).toFixed(2)}</td>
                      <td style={tableBodyCell}>
                        {((row.cgstRate !== undefined ? row.cgstRate : row.cgst) ?? 0).toFixed(2)}%
                      </td>
                      <td style={tableBodyCell}>
                        {(
                          row.cgstAmt ??
                          (((row.taxable ?? 0) *
                            ((row.cgstRate !== undefined ? row.cgstRate : row.cgst) ?? 0)) /
                            100)
                        ).toFixed(2)}
                      </td>
                      <td style={tableBodyCell}>
                        {((row.sgstRate !== undefined ? row.sgstRate : row.sgst) ?? 0).toFixed(2)}%
                      </td>
                      <td style={tableBodyCell}>
                        {(
                          row.sgstAmt ??
                          (((row.taxable ?? 0) *
                            ((row.sgstRate !== undefined ? row.sgstRate : row.sgst) ?? 0)) /
                            100)
                        ).toFixed(2)}
                      </td>
                      <td style={tableBodyCell}>
                        {(row.igstRate ?? 0).toFixed(2)}%
                      </td>
                      <td style={tableBodyCell}>
                        {(row.igstAmt ?? 0).toFixed(2)}
                      </td>
                      <td style={tableBodyCell}>
                        {((row.amount ?? row.total) || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={12}
                      style={{
                        ...tableBodyCell,
                        textAlign: 'right',
                        fontWeight: 'bold',
                        borderRight: 'none',
                        borderBottom: 'none',
                      }}
                    >
                      GRAND TOTAL
                    </td>
                    <td
                      style={{
                        ...tableBodyCell,
                        textAlign: 'right',
                        fontWeight: 'bold',
                        borderLeft: '1px solid #000',
                        borderBottom: 'none',
                      }}
                    >
                      {grandTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 0, border: 'none' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #000',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        borderRight: '1px solid #000',
                        height: '100px',
                        width: '33.33%',
                      }}
                    >
                      Scan QR Code
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        borderRight: '1px solid #000',
                        height: '100px',
                        width: '33.33%',
                      }}
                    >
                      Customer Signature
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        height: '100px',
                        width: '33.33%',
                      }}
                    >
                      Authorized Signature
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CounterBillPDF;

const cellStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  verticalAlign: 'top',
};

const tableHeaderCell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

const tableBodyCell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '6px',
  textAlign: 'center',
  verticalAlign: 'middle',
};
