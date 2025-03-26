import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { AiOutlineUser, AiOutlineCalendar, AiOutlinePhone } from 'react-icons/ai';
import { MdLocationOn, MdOutlineDirectionsCar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import apiClient from 'Services/apiService';

interface BillRow {
  id?: number; 
  sNo: number;
  spareNo: string;
  spareName: string;
  quantity: number;
  rate: number;
  discountPercent: string | number; 
  discountAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  taxable: number;
  total: number;
  amount: number; 
  checked?: boolean;
}

interface SpareRow {
  spareName: string;
  spareNo?: string;
  rate: number;
  qty: number; 
  discountPercent: string | number; 
  discountAmt: number;
  taxableValue: number;
  total: number;
  cgstPercent?: number;
  sgstPercent?: number;
}

function computeSpareRowTotals(row: SpareRow): SpareRow {
  const rate = row.rate;
  const qty = row.qty;
  const discountPercent = Number(row.discountPercent) || 0;
  const lineAmount = rate * qty;
  const discountAmt = (lineAmount * discountPercent) / 100;
  const newTaxable = lineAmount - discountAmt;
  return {
    ...row,
    discountAmt,
    taxableValue: newTaxable,
    total: newTaxable,
  };
}

function computeBillRow(row: BillRow): BillRow {
  const baseAmount = row.rate * row.quantity;
  const discountPercent = Number(row.discountPercent) || 0;
  const discountAmt = (baseAmount * discountPercent) / 100;
  const taxable = baseAmount - discountAmt;
  const cgstAmt = (taxable * row.cgstPercent) / 100;
  const sgstAmt = (taxable * row.sgstPercent) / 100;
  const total = taxable;
  const amount = total;
  return {
    ...row,
    discountAmt,
    cgstAmt,
    sgstAmt,
    taxable,
    total,
    amount,
  };
}

const CounterSaleForm: FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [invDate, setInvDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const [gstin, setGstin] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');

  const [spareRow, setSpareRow] = useState<SpareRow>({
    spareName: '',
    spareNo: '',
    rate: 0,
    qty: 1,
    discountPercent: '',
    discountAmt: 0,
    taxableValue: 0,
    total: 0,
    cgstPercent: 0,
    sgstPercent: 0,
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [billRows, setBillRows] = useState<BillRow[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: isDark ? '1px solid #555' : '1px solid #ccc',
    width: '100%',
    backgroundColor: isDark ? '#424242' : '#fff',
    color: isDark ? '#fff' : '#000',
  };

  const sectionStyle: React.CSSProperties = {
    width: '48%',
    border: isDark ? '1px solid #555' : '1px solid #ccc',
    padding: '1rem',
    borderRadius: '6px',
    backgroundColor: isDark ? '#333' : '#fff',
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#555' : '#f5f5f5',
    color: isDark ? '#fff' : '#000',
    textAlign: 'left',
  };

  const tableCellStyle: React.CSSProperties = {
    border: isDark ? '1px solid #555' : '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: isDark ? '#424242' : '#fff',
    color: isDark ? '#fff' : '#000',
  };

  const containerStyle: React.CSSProperties = {
    width: '90%',
    margin: 'auto',
    marginTop: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
    color: isDark ? '#fff' : '#000',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  };

  const sectionHeader: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const fieldGroup: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '0.25rem',
    fontWeight: 'bold',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const removeBtnStyle: React.CSSProperties = {
    backgroundColor: 'red',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSpareRowChange = (key: keyof SpareRow, value: string | number) => {
    setSpareRow((prev) => {
      const updatedValue = key === 'discountPercent' && value === '' ? '' : value;
      const updatedRow = { ...prev, [key]: updatedValue };
      return computeSpareRowTotals(updatedRow);
    });
  };

  const fetchPartDetails = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await apiClient.get(`/Filter/searchBarFilter?searchBarInput=${searchQuery}`);
      setSuggestions(response.data.list || []);
    } catch (error) {
      console.error('Error fetching part details:', error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPartDetails(spareRow.spareName);
    }, 500);
    return () => clearTimeout(timer);
  }, [spareRow.spareName, fetchPartDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionSelect = (item: any) => {
    const updatedSpareRow: SpareRow = computeSpareRowTotals({
      spareName: item.partName,
      spareNo: item.partNumber,
      rate: item.price,
      qty: 1,
      discountPercent: spareRow.discountPercent,
      discountAmt: 0,
      taxableValue: 0,
      total: 0,
      cgstPercent: item.cgst,
      sgstPercent: item.sgst,
    });
    setSpareRow(updatedSpareRow);
    setSuggestions([]);

    const newBillRow: BillRow = computeBillRow({
      sNo: billRows.length + 1,
      spareNo: updatedSpareRow.spareNo || '',
      spareName: updatedSpareRow.spareName,
      quantity: updatedSpareRow.qty,
      rate: updatedSpareRow.rate,
      discountPercent: updatedSpareRow.discountPercent,
      discountAmt: 0,
      cgstPercent: updatedSpareRow.cgstPercent || 0,
      cgstAmt: 0,
      sgstPercent: updatedSpareRow.sgstPercent || 0,
      sgstAmt: 0,
      taxable: 0,
      total: 0,
      amount: 0,
      checked: false,
    });
    setBillRows((prev) => [...prev, newBillRow]);
    setSpareRow((prev) => ({
      ...prev,
      spareName: '',
      spareNo: '',
      rate: 0,
      qty: 1,
      discountAmt: 0,
      taxableValue: 0,
      total: 0,
      cgstPercent: 0,
      sgstPercent: 0,
      discountPercent: '',
    }));
  };

  const updateBillRow = (rowId: number, updatedFields: Partial<BillRow>) => {
    setBillRows((prevRows) =>
      prevRows.map((r) => {
        if (r.id === rowId) {
          const merged = { ...r, ...updatedFields };
          return computeBillRow(merged);
        }
        return r;
      })
    );
  };

  const handleRemove = () => {
    setBillRows((prev) => prev.filter((r) => !r.checked));
  };

  const handleSave = () => {
    if (!customerName) {
      alert('Customer Name is required');
      return;
    }
    if (!adharNo) {
      alert('Aadhaar No is required');
      return;
    }
    if (!customerMobile) {
      alert('Mobile No is required');
      return;
    }
    if (invDate > todayStr) {
      alert('Invoice date cannot be in the future.');
      return;
    }

    const updatedBillRows = billRows.map((row) => computeBillRow(row));
    const totalAmount = updatedBillRows.reduce((acc, curr) => acc + curr.amount, 0);

    const payload = {
      invDate,
      customerName,
      customerAddress,
      customerMobile,
      adharNo,
      gstin,
      vehicleNo,
      discount: 0,
      totalAmount,
      items: updatedBillRows,
    };

    apiClient
      .post('/api/invoices/AddInvoice', payload)
      .then((response) => {
        navigate('/admin/counterbillPdf', { state: response.data });
      })
      .catch((error) => console.error('Error saving invoice:', error));
  };

  useEffect(() => {
    if (billRows.length > 0) {
      setBillRows((prev) =>
        prev.map((row) =>
          computeBillRow({ ...row, discountPercent: spareRow.discountPercent })
        )
      );
    }
  }, [spareRow.discountPercent]);

  // ================================================
  // NEW: Navigate to InvoiceList on "Manage Counter Sale"
  // ================================================
  const handleManageCounterSale = () => {
    // Adjust the route to wherever your invoice list page is located
    navigate('/admin/invoiceList');
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        {/* Use the new handler here */}
        <button style={buttonStyle} onClick={handleManageCounterSale}>
          Manage Counter Sale
        </button>
      </div>

      <div style={headerStyle}>
        <div style={sectionStyle}>
          <div style={sectionHeader}>
            <AiOutlineCalendar />
            <span>Invoice Details</span>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="invDate" style={labelStyle}>
              Inv. Date
            </label>
            <input
              id="invDate"
              type="date"
              style={inputStyle}
              value={invDate}
              max={todayStr}
              onChange={(e) => setInvDate(e.target.value)}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionHeader}>
            <AiOutlineUser />
            <span>Customer Details</span>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="customerName" style={labelStyle}>
              Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="customerName"
              type="text"
              placeholder="Enter Customer Name"
              style={inputStyle}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div style={fieldGroup}>
            <label htmlFor="customerAddress" style={labelStyle}>
              Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdLocationOn style={{ marginRight: '0.5rem' }} />
              <input
                id="customerAddress"
                type="text"
                placeholder="Enter Customer Address"
                style={inputStyle}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="customerMobile" style={labelStyle}>
              Mobile No <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AiOutlinePhone style={{ marginRight: '0.5rem' }} />
              <input
                id="customerMobile"
                type="text"
                placeholder="Enter Customer Mobile No."
                style={inputStyle}
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="adharNo" style={labelStyle}>
              Aadhaar No <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="adharNo"
              type="text"
              placeholder="Enter Aadhaar No"
              style={inputStyle}
              value={adharNo}
              onChange={(e) => setAdharNo(e.target.value)}
              required
            />
          </div>
          <div style={fieldGroup}>
            <label htmlFor="gstin" style={labelStyle}>
              GSTIN
            </label>
            <input
              id="gstin"
              type="text"
              placeholder="Enter GSTIN"
              style={inputStyle}
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
            />
          </div>
          <div style={fieldGroup}>
            <label htmlFor="vehicleNo" style={labelStyle}>
              Vehicle No
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdOutlineDirectionsCar style={{ marginRight: '0.5rem' }} />
              <input
                id="vehicleNo"
                type="text"
                placeholder="Enter Vehicle No"
                style={inputStyle}
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <table style={tableStyle}>
        <thead style={tableHeaderStyle}>
          <tr>
            <th style={tableCellStyle}>Spare Name</th>
            <th style={tableCellStyle}>Rate</th>
            <th style={tableCellStyle}>Qty</th>
            <th style={tableCellStyle}>Discount (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tableCellStyle, position: 'relative' }}>
              <div ref={dropdownRef}>
                <input
                  type="text"
                  style={inputStyle}
                  value={spareRow.spareName}
                  onChange={(e) => handleSpareRowChange('spareName', e.target.value)}
                  placeholder="Search spare parts..."
                />
                {suggestions.length > 0 && (
                  <div
                    style={{
                      background: isDark ? '#424242' : '#fff',
                      border: isDark ? '1px solid #555' : '1px solid #ccc',
                      position: 'absolute',
                      width: '100%',
                      zIndex: 1,
                    }}
                  >
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        style={{ padding: '0.5rem', cursor: 'pointer' }}
                        onClick={() => handleSuggestionSelect(item)}
                      >
                        {`${item.manufacturer} - ${item.partNumber} - ${item.description}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
            <td style={tableCellStyle}>
              <input
                type="number"
                style={{ ...inputStyle, backgroundColor: isDark ? '#555' : '#f0f0f0' }}
                value={spareRow.rate}
                disabled
              />
            </td>
            <td style={tableCellStyle}>
              <input
                type="number"
                style={{ ...inputStyle, backgroundColor: isDark ? '#555' : '#f0f0f0' }}
                value={spareRow.qty}
                disabled
              />
            </td>
            <td style={tableCellStyle}>
              <input
                type="number"
                style={inputStyle}
                value={spareRow.discountPercent}
                onChange={(e) =>
                  handleSpareRowChange(
                    'discountPercent',
                    e.target.value === '' ? '' : e.target.value
                  )
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Bill rows table */}
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeaderStyle}>
            <th style={tableCellStyle} rowSpan={2}>
              #
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              S.No
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Spare No
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Spare Name
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Qty
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Rate
            </th>
            <th style={tableCellStyle} colSpan={2}>
              Discount
            </th>
            <th style={tableCellStyle} colSpan={2}>
              CGST
            </th>
            <th style={tableCellStyle} colSpan={2}>
              SGST
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Taxable
            </th>
            <th style={tableCellStyle} rowSpan={2}>
              Total
            </th>
          </tr>
          <tr style={tableHeaderStyle}>
            <th style={tableCellStyle}>%</th>
            <th style={tableCellStyle}>Amt</th>
            <th style={tableCellStyle}>%</th>
            <th style={tableCellStyle}>Amt</th>
            <th style={tableCellStyle}>%</th>
            <th style={tableCellStyle}>Amt</th>
          </tr>
        </thead>
        <tbody>
          {billRows.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>
                <input
                  type="checkbox"
                  checked={!!row.checked}
                  onChange={(e) => updateBillRow(row.id!, { checked: e.target.checked })}
                />
              </td>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>
                <input
                  type="text"
                  style={inputStyle}
                  value={row.spareNo}
                  onChange={(e) => updateBillRow(row.id!, { spareNo: e.target.value })}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="text"
                  style={inputStyle}
                  value={row.spareName}
                  onChange={(e) => updateBillRow(row.id!, { spareName: e.target.value })}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.quantity}
                  onChange={(e) =>
                    updateBillRow(row.id!, {
                      quantity: parseInt(e.target.value || '1', 10),
                    })
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.rate}
                  onChange={(e) =>
                    updateBillRow(row.id!, { rate: parseFloat(e.target.value || '0') })
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.discountPercent}
                  onChange={(e) =>
                    updateBillRow(row.id!, {
                      discountPercent: e.target.value === '' ? '' : e.target.value,
                    })
                  }
                />
              </td>
              <td style={tableCellStyle}>{row.discountAmt.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.cgstPercent.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.cgstAmt.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.sgstPercent.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.sgstAmt.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.taxable.toFixed(2)}</td>
              <td style={tableCellStyle}>{row.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td style={{ ...tableCellStyle, textAlign: 'right' }} colSpan={13}>
              <strong>Grand Total</strong>
            </td>
            <td style={tableCellStyle}>
              <strong>
                {billRows.reduce((acc, curr) => acc + (curr.amount || 0), 0).toFixed(2)}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button style={buttonStyle} onClick={handleSave}>
          Save
        </button>
        <button style={removeBtnStyle} onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CounterSaleForm;
