import React, { FC, useState } from 'react';
import { AiOutlineUser, AiOutlineCalendar, AiOutlinePhone } from 'react-icons/ai';
import { MdLocationOn, MdOutlineDirectionsCar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface BillRow {
  id: number;
  sNo: number;
  spareNo: string;
  spareName: string;
  qty: number;
  rate: number;
  discount: number;
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
  checked?: boolean;
}

interface SpareRow {
  spareName: string;
  rate: number;
  qty: number;
  discountPercent: number;
  discountAmt: number;
  taxableValue: number;
  total: number;
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
    rate: 0,
    qty: 1,
    discountPercent: 0,
    discountAmt: 0,
    taxableValue: 0,
    total: 0,
  });

  const [billRows, setBillRows] = useState<BillRow[]>([
    {
      id: 1,
      sNo: 1,
      spareNo: '',
      spareName: '',
      qty: 1,
      rate: 0,
      discount: 0,
      taxable: 0,
      cgst: 0,
      sgst: 0,
      total: 0,
      checked: false,
    },
  ]);

  const computeRowTotals = (row: SpareRow) => {
    const lineAmount = row.rate * row.qty;
    const discountAmt = (lineAmount * row.discountPercent) / 100;
    const newTaxable = lineAmount - discountAmt;
    return { ...row, discountAmt, taxableValue: newTaxable, total: newTaxable };
  };

  const handleSearch = async () => {
    try {
      const partData = await fetchPartDetails(spareRow.spareName);
      setBillRows((prev) => [
        ...prev,
        {
          id: Date.now(),
          sNo: prev.length + 1,
          spareNo: partData.spareNo || '',
          spareName: spareRow.spareName || '',
          qty: spareRow.qty,
          rate: partData.rate || spareRow.rate,
          discount: spareRow.discountPercent,
          taxable: spareRow.taxableValue,
          cgst: partData.cgst || 0,
          sgst: partData.sgst || 0,
          total: spareRow.total,
        },
      ]);
      setSpareRow({
        spareName: '',
        rate: 0,
        qty: 1,
        discountPercent: 0,
        discountAmt: 0,
        taxableValue: 0,
        total: 0,
      });
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleRemove = () => {
    setBillRows((prev) => prev.filter((r) => !r.checked));
  };

  const handleSave = () => {
    navigate('/admin/counterbillPdf', {
      state: {
        invoiceNo,
        invDate,
        customerName,
        customerAddress,
        customerMobile,
        adharNo,
        gstin,
        vehicleNo,
        billRows,
      },
    });
  };

  async function fetchPartDetails(spareName: string) {
    return {
      spareNo: 'PN-123',
      spareName: 'Air Filter',
      rate: 590,
      cgst: 9,
      sgst: 9,
    };
  }

  const handleSpareRowChange = (key: keyof SpareRow, value: string | number) => {
    setSpareRow((prev) => {
      const updated = { ...prev, [key]: typeof value === 'number' ? value : parseFloat(value || '0') };
      return computeRowTotals(updated);
    });
  };

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
            <label htmlFor="invoiceNo" style={labelStyle}>Invoice No.</label>
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
            <label htmlFor="invDate" style={labelStyle}>Inv. Date</label>
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
            <label htmlFor="customerName" style={labelStyle}>Name</label>
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
            <label htmlFor="customerAddress" style={labelStyle}>Address</label>
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
            <label htmlFor="customerMobile" style={labelStyle}>Mobile No</label>
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
            <label htmlFor="adharNo" style={labelStyle}>Adhar No</label>
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
            <label htmlFor="gstin" style={labelStyle}>GSTIN</label>
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
            <label htmlFor="vehicleNo" style={labelStyle}>Vehicle No</label>
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
            <th style={tableCellStyle} colSpan={2}>Discount</th>
            <th style={tableCellStyle}>Taxable Value</th>
            <th style={tableCellStyle}>Total</th>
            <th style={tableCellStyle}>Action</th>
          </tr>
          <tr>
            <th style={{ display: 'none' }}></th>
            <th style={{ display: 'none' }}></th>
            <th style={{ display: 'none' }}></th>
            <th style={tableCellStyle}>%</th>
            <th style={tableCellStyle}>Amt</th>
            <th style={{ display: 'none' }}></th>
            <th style={{ display: 'none' }}></th>
            <th style={{ display: 'none' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tableCellStyle}>
              <input
                type="text"
                style={inputStyle}
                value={spareRow.spareName}
                onChange={(e) => handleSpareRowChange('spareName', e.target.value)}
              />
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
            <td style={tableCellStyle}>
              {spareRow.discountAmt.toFixed(2)}
            </td>
            <td style={tableCellStyle}>
              {spareRow.taxableValue.toFixed(2)}
            </td>
            <td style={tableCellStyle}>
              {spareRow.total.toFixed(2)}
            </td>
            <td style={tableCellStyle}>
              <button style={buttonStyle} onClick={handleSearch}>
                Search
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={tableStyle}>
        <thead style={tableHeaderStyle}>
          <tr>
            <th style={tableCellStyle}>#</th>
            <th style={tableCellStyle}>S.No</th>
            <th style={tableCellStyle}>Spare No</th>
            <th style={tableCellStyle}>Spare Name</th>
            <th style={tableCellStyle}>Qty</th>
            <th style={tableCellStyle}>Rate</th>
            <th style={tableCellStyle}>Discount</th>
            <th style={tableCellStyle}>Taxable</th>
            <th style={tableCellStyle}>CGST</th>
            <th style={tableCellStyle}>SGST</th>
            <th style={tableCellStyle}>Total</th>
          </tr>
        </thead>
        <tbody>
          {billRows.map((row, index) => (
            <tr key={row.id}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.sNo}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, sNo: parseInt(e.target.value || '1') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="text"
                  style={inputStyle}
                  value={row.spareNo}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, spareNo: e.target.value } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="text"
                  style={inputStyle}
                  value={row.spareName}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, spareName: e.target.value } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.qty}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, qty: parseInt(e.target.value || '1') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.rate}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, rate: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.discount}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, discount: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.taxable}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, taxable: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.cgst}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, cgst: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.sgst}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, sgst: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  style={inputStyle}
                  value={row.total}
                  onChange={(e) =>
                    setBillRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, total: parseFloat(e.target.value || '0') } : r
                      )
                    )
                  }
                />
              </td>
            </tr>
          ))}
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

const tableCellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '0.5rem',
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
