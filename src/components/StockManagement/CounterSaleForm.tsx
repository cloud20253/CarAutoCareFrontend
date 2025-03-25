import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { AiOutlineUser, AiOutlineCalendar, AiOutlinePhone } from 'react-icons/ai';
import { MdLocationOn, MdOutlineDirectionsCar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import apiClient from 'Services/apiService';

interface BillRow {
  id?: number; 
  sNo: number;
  spareNo: string;
  spareName: string;
  quantity: number;
  rate: number;
  discountPercent: number;
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
  discountPercent: number;
  discountAmt: number;
  taxableValue: number;
  total: number;
  cgstPercent?: number;
  sgstPercent?: number;
}

function computeBillRow(row: BillRow): BillRow {
  const baseAmount = row.rate * row.quantity;
  const discountAmt = (baseAmount * row.discountPercent) / 100;
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

  const [invoiceNo, setInvoiceNo] = useState('');
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
    discountPercent: 0,
    discountAmt: 0,
    taxableValue: 0,
    total: 0,
    cgstPercent: 0,
    sgstPercent: 0,
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [billRows, setBillRows] = useState<BillRow[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const computeSpareRowTotals = (row: SpareRow) => {
    const lineAmount = row.rate * row.qty;
    const discountAmt = (lineAmount * row.discountPercent) / 100;
    const newTaxable = lineAmount - discountAmt;
    return {
      ...row,
      discountAmt,
      taxableValue: newTaxable,
      total: newTaxable,
    };
  };

  const handleSpareRowChange = (key: keyof SpareRow, value: string | number) => {
    setSpareRow((prev) => {
      const updatedValue = typeof value === 'number' ? value : value;
      const newVal = key === 'discountPercent' && Number(updatedValue) < 0 ? 0 : Number(updatedValue);
      const updatedRow = { ...prev, [key]: key === 'spareName' ? value : newVal };
      return computeSpareRowTotals(updatedRow);
    });
  };

  const fetchPartDetails = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/Filter/searchBarFilter?searchBarInput=${searchQuery}`);
      const data = await response.json();
      setSuggestions(data.list || []);
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

    fetch('http://localhost:8080/api/invoices/AddInvoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {

        navigate('/admin/counterbillPdf', { state: data });
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

  const containerStyle: React.CSSProperties = {
    width: '90%',
    margin: 'auto',
    marginTop: '2rem',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  };

  const sectionStyle: React.CSSProperties = {
    width: '48%',
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '6px',
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

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  };

  const tableCellStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
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

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button style={buttonStyle}>Manage Counter Sale</button>
      </div>
      <div style={headerStyle}>
        <div style={sectionStyle}>
          <div style={sectionHeader}>
            <AiOutlineCalendar />
            <span>Invoice Details</span>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="invoiceNo" style={labelStyle}>
              Invoice No.
            </label>
            <input
              id="invoiceNo"
              type="text"
              placeholder="Invoice No."
              style={inputStyle}
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
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
              Name
            </label>
            <input
              id="customerName"
              type="text"
              placeholder="Enter Customer Name"
              style={inputStyle}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
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
              Mobile No
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
              />
            </div>
          </div>
          <div style={fieldGroup}>
            <label htmlFor="adharNo" style={labelStyle}>
              Adhar No
            </label>
            <input
              id="adharNo"
              type="text"
              placeholder="Enter Adhar No"
              style={inputStyle}
              value={adharNo}
              onChange={(e) => setAdharNo(e.target.value)}
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
      {/* Spare details input */}
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
                      background: '#fff',
                      border: '1px solid #ccc',
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
                style={inputStyle}
                value={spareRow.rate}
                onChange={(e) => handleSpareRowChange('rate', e.target.value)}
              />
            </td>
            <td style={tableCellStyle}>
              <input
                type="number"
                style={inputStyle}
                value={spareRow.qty}
                onChange={(e) => handleSpareRowChange('qty', e.target.value)}
              />
            </td>
            <td style={tableCellStyle}>
              <input
                type="number"
                style={inputStyle}
                value={spareRow.discountPercent}
                onChange={(e) => handleSpareRowChange('discountPercent', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* Bill rows table */}
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeaderStyle}>
            <th style={tableCellStyle} rowSpan={2}>#</th>
            <th style={tableCellStyle} rowSpan={2}>S.No</th>
            <th style={tableCellStyle} rowSpan={2}>Spare No</th>
            <th style={tableCellStyle} rowSpan={2}>Spare Name</th>
            <th style={tableCellStyle} rowSpan={2}>Qty</th>
            <th style={tableCellStyle} rowSpan={2}>Rate</th>
            <th style={tableCellStyle} colSpan={2}>Discount</th>
            <th style={tableCellStyle} colSpan={2}>CGST</th>
            <th style={tableCellStyle} colSpan={2}>SGST</th>
            <th style={tableCellStyle} rowSpan={2}>Taxable</th>
            <th style={tableCellStyle} rowSpan={2}>Total</th>
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
                    updateBillRow(row.id!, { quantity: parseInt(e.target.value || '1', 10) })
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
                    updateBillRow(row.id!, { discountPercent: parseFloat(e.target.value || '0') })
                  }
                />
              </td>
              <td style={tableCellStyle}>{row.discountAmt.toFixed(2)}</td>
              {/* Non-editable GST fields */}
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
