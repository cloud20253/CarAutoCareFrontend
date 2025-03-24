import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface BillRow {
  id?: number;
  sNo: number;
  spareNo: string;
  spareName: string;
  qty?: number;
  rate: number;
  discountPercent: number;
  discountAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  taxable?: number;
  total?: number;
  quantity?: number;
  amount?: number; // <-- The final per-item amount we want to display
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
  items?: BillRow[];
  billRows?: BillRow[];
}

const CounterBillPDF: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;

  // Gather invoice items from either "items" or "billRows"
  const invoiceItems = state.items || state.billRows || [];

  // Calculate grand total from item.amount (fallback to row.total or row.rate * row.qty if needed)
  const grandTotal = invoiceItems
    .reduce((acc, row) => {
      const qty = row.qty ?? row.quantity ?? 0;
      // Default to item.amount; fallback to item.total; fallback to row.rate * qty
      const amt = row.amount ?? row.total ?? (row.rate * qty);
      return acc + amt;
    }, 0)
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
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
                verticalAlign: 'top',
                width: '70%',
              }}
            >
              <h2 style={{ margin: 0 }}>AUTO CAR CARE POINT</h2>
              <p style={{ margin: 0 }}>
                Burnasheeb Nagar, Shivnagar Road, Katol, (445201), Dist Satara
              </p>
              <p style={{ margin: 0 }}>
                Ph: 9999999999 | 7890117886 | Email: autocarepoint@gmail.com
              </p>
              <p style={{ margin: 0 }}>GSTIN: 29CLJPS9999C1ZV</p>
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                textAlign: 'center',
                verticalAlign: 'middle',
                width: '30%',
              }}
            >
              <strong style={{ fontSize: '1.2rem' }}>TAX INVOICE</strong>
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                fontWeight: 'bold',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              CUSTOMER DETAILS
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                fontWeight: 'bold',
                textAlign: 'right',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              INVOICE DETAILS
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              <p style={{ margin: 0 }}>Name: {state.customerName}</p>
              <p style={{ margin: 0 }}>Address: {state.customerAddress}</p>
              <p style={{ margin: 0 }}>Mobile: {state.customerMobile}</p>
              <p style={{ margin: 0 }}>Vehicle No: {state.vehicleNo}</p>
              {state.adharNo && <p style={{ margin: 0 }}>Aadhaar No: {state.adharNo}</p>}
              {state.gstin && <p style={{ margin: 0 }}>GSTIN: {state.gstin}</p>}
            </td>
            <td
              style={{
                border: '1px solid #000',
                padding: '6px',
                verticalAlign: 'top',
                width: '50%',
              }}
            >
              <p style={{ margin: 0, textAlign: 'right' }}>
                Invoice No: {state.invoiceNo}
              </p>
              <p style={{ margin: 0, textAlign: 'right' }}>
                Invoice Date: {state.invDate}
              </p>
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}
            >
              <strong>SPARES / ITEMS</strong>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 0, border: '1px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor:
                        theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
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
                      Discount (%)
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
                    <th rowSpan={2} style={tableHeaderCell}>
                      Amount
                    </th>
                  </tr>
                  <tr
                    style={{
                      backgroundColor:
                        theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    }}
                  >
                    <th style={tableHeaderCell}>Rate</th>
                    <th style={tableHeaderCell}>Amt</th>
                    <th style={tableHeaderCell}>Rate</th>
                    <th style={tableHeaderCell}>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item: BillRow, idx: number) => {
                    // Determine quantity from either item.qty or item.quantity
                    const quantity = item.qty ?? item.quantity ?? 0;
                    return (
                      <tr key={idx}>
                        <td style={tableBodyCell}>{idx + 1}</td>
                        <td style={tableBodyCell}>{item.spareName}</td>
                        <td style={tableBodyCell}>{quantity}</td>
                        <td style={tableBodyCell}>{(item.rate || 0).toFixed(2)}</td>
                        <td style={tableBodyCell}>
                          {(item.discountPercent || 0).toFixed(2)}%
                        </td>
                        <td style={tableBodyCell}>
                          {(item.taxable || 0).toFixed(2)}
                        </td>
                        <td style={tableBodyCell}>
                          {(item.cgstPercent || 0).toFixed(2)}%
                        </td>
                        <td style={tableBodyCell}>
                          {(item.cgstAmt || 0).toFixed(2)}
                        </td>
                        <td style={tableBodyCell}>
                          {(item.sgstPercent || 0).toFixed(2)}%
                        </td>
                        <td style={tableBodyCell}>
                          {(item.sgstAmt || 0).toFixed(2)}
                        </td>
                        {/* Display item.amount here instead of item.total */}
                        <td style={tableBodyCell}>
                          {(item.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        ...tableBodyCell,
                        textAlign: 'right',
                        fontWeight: 'bold',
                      }}
                    >
                      GRAND TOTAL
                    </td>
                    <td
                      style={{
                        ...tableBodyCell,
                        textAlign: 'right',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        // Summation of item.amount or fallback
                        invoiceItems
                          .reduce((acc, row) => {
                            const qty = row.qty ?? row.quantity ?? 0;
                            // Fallback to row.amount, then row.total, then row.rate * qty
                            const amt =
                              row.amount ?? row.total ?? row.rate * qty;
                            return acc + amt;
                          }, 0)
                          .toFixed(2)
                      }
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
