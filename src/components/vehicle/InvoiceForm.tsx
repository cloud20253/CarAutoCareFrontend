import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import apiClient from 'Services/apiService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface InvoiceFormData {
  vehicleRegId: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  customerAadharNo: string;
  customerGstin: string;
  date: string;
  regNo: string;
  model: string;
  kmsDriven: string;
  comments: string;
  parts: {
    partName: string;
    quantity: string; 
    unitPrice: string;
    taxableAmount: string;
    discountPercent: string;
    cgstPercent: string;
    sgstPercent: string;
    igstPercent: string;
    cgst: string;
    sgst: string;
    igst: string;
  }[];
  labours: {
    description: string;
    quantity: string;
    unitPrice: string;
    taxableAmount: string;
    discountPercent: string;
    cgstPercent: string;
    sgstPercent: string;
    igstPercent: string;
    cgst: string;
    sgst: string;
    igst: string;
  }[];
  globalDiscount?: number;
  partsSubtotal: number;
  laboursSubtotal: number;
  subTotal: number;
  totalAmount: number;
  advanceAmount: string;
  totalInWords: string;
}

const defaultInvoiceData: InvoiceFormData = {
  vehicleRegId: '',
  customerName: '',
  customerAddress: '',
  customerMobile: '',
  customerAadharNo: '',
  customerGstin: '',
  date: '',
  regNo: '',
  model: '',
  kmsDriven: '',
  comments: '',
  parts: [],
  labours: [
    {
      description: '',
      quantity: '1',
      unitPrice: '',
      taxableAmount: '',
      discountPercent: '',
      cgstPercent: '',
      sgstPercent: '',
      igstPercent: '',
      cgst: '',
      sgst: '',
      igst: ''
    }
  ],
  globalDiscount: 0,
  subTotal: 0,
  partsSubtotal: 0,
  laboursSubtotal: 0,
  totalAmount: 0,
  advanceAmount: '',
  totalInWords: ''
};

export default function InvoiceForm() {
  const [formData, setFormData] = useState<InvoiceFormData>(defaultInvoiceData);
  const [loadingData, setLoadingData] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'advanceAmount') {
      if (value === '' || parseFloat(value) >= 0) {
        setFormData(prev => ({ ...prev, advanceAmount: value }));
      }
    } else if (name === 'kmsDriven'){
      setFormData(prev => ({ ...prev, kmsDriven: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePartsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof InvoiceFormData['parts'][number]
  ) => {
    if (['partName', 'quantity', 'cgstPercent', 'sgstPercent', 'igstPercent'].includes(field))
      return;
    const newParts = [...formData.parts];
    const inputVal = e.target.value;
    if (inputVal !== "" && parseFloat(inputVal) < 0) return;
    newParts[index] = { ...newParts[index], [field]: inputVal };
    setFormData(prev => ({ ...prev, parts: newParts }));
  };

  const handleLabourChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof InvoiceFormData['labours'][number]
  ) => {
    // Only allow editing of allowed fields (not description)
    if (field === 'description' || ['cgstPercent', 'sgstPercent', 'igstPercent'].includes(field))
      return;
    const newLabours = [...formData.labours];
    const inputVal = e.target.value;
    if (inputVal !== "" && parseFloat(inputVal) < 0) return;
    newLabours[index] = { ...newLabours[index], [field]: inputVal };
    setFormData(prev => ({ ...prev, labours: newLabours }));
  };

  const addLabourRow = () => {
    setFormData(prev => ({
      ...prev,
      labours: [
        ...prev.labours,
        {
          description: '',
          quantity: '1',
          unitPrice: '',
          taxableAmount: '',
          discountPercent: '',
          cgstPercent: '',
          sgstPercent: '',
          igstPercent: '',
          cgst: '',
          sgst: '',
          igst: ''
        }
      ]
    }));
  };

  const computeTotals = () => {
    const globalDiscountPercent = formData.globalDiscount || 0;
    const computeItemTotal = (item: {
      quantity: string;
      unitPrice: string;
      discountPercent: string;
      cgstPercent: string;
      sgstPercent: string;
      igstPercent: string;
    }) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const discountPercent =
        globalDiscountPercent > 0
          ? globalDiscountPercent
          : Number(item.discountPercent) || 0;
      const baseAmount = quantity * unitPrice;
      const discount = (baseAmount * discountPercent) / 100;
      const taxableAmount = baseAmount - discount;
      const cgst = (taxableAmount * Number(item.cgstPercent)) / 100;
      const sgst = (taxableAmount * Number(item.sgstPercent)) / 100;
      const igst = (taxableAmount * Number(item.igstPercent)) / 100;
      const total = taxableAmount;
      return { total, taxableAmount, cgst, sgst, igst };
    };

    const partsTotals = formData.parts.map(computeItemTotal);
    const laboursTotals = formData.labours.map(computeItemTotal);
    const partsSubtotal = partsTotals.reduce((acc, item) => acc + item.total, 0);
    const laboursSubtotal = laboursTotals.reduce((acc, item) => acc + item.total, 0);
    const subTotal = partsSubtotal + laboursSubtotal;
    const totalAmount = subTotal;
    return { partsTotals, laboursTotals, partsSubtotal, laboursSubtotal, subTotal, totalAmount };
  };

  React.useEffect(() => {
    if (id) {
      fetchVehicleData();
      fetchLabourData();
    }
  }, [id]);

  const fetchVehicleData = async () => {
    setLoadingData(true);
    try {
      const vehicleResponse = await apiClient.get('/vehicle-reg/getById', {
        params: { vehicleRegId: id }
      });
      const vehicleData = vehicleResponse.data.data || vehicleResponse.data;
      if (vehicleData) {
        setFormData(prev => ({
          ...prev,
          customerName: vehicleData.customerName || '',
          customerAddress: vehicleData.customerAddress || '',
          customerMobile: vehicleData.customerMobileNumber || '',
          customerAadharNo: vehicleData.customerAadharNo || '',
          customerGstin: vehicleData.customerGstin || '',
          regNo: vehicleData.vehicleNumber || '',
          model: `${vehicleData.vehicleBrand || ''} - ${vehicleData.vehicleModelName || ''}`,
          kmsDriven: vehicleData.kmsDriven ? String(vehicleData.kmsDriven) : '',
          vehicleRegId: String(id)
        }));
      } else {
        setDialogTitle("Error");
        setDialogMessage("No vehicle data found.");
        setDialogOpen(true);
      }
      
      const partsResponse = await apiClient.get('/sparePartTransactions/vehicleRegId', {
        params: { vehicleRegId: id }
      });
      let partsArray: any[] = [];
      if (partsResponse.data && partsResponse.data.data && Array.isArray(partsResponse.data.data)) {
        partsArray = partsResponse.data.data;
      } else if (Array.isArray(partsResponse.data)) {
        partsArray = partsResponse.data;
      } else {
        console.error('Parts data is not an array:', partsResponse.data);
      }
      const parts = partsArray.map((p: any) => {
        const baseAmount = parseFloat(p.quantity) * parseFloat(p.price);
        const discountAmount = (baseAmount * parseFloat(p.discountPercent)) / 100;
        const taxableAmount = baseAmount - discountAmount;
        const cgst = (taxableAmount * parseFloat(p.cgst || 0)) / 100;
        const sgst = (taxableAmount * parseFloat(p.sgst || 0)) / 100;
        const igst = (taxableAmount * parseFloat(p.igst || 0)) / 100;
        return {
          partName: p.partName,
          quantity: p.quantity ? String(p.quantity) : "1",
          unitPrice: p.price ? String(p.price) : "",
          discountPercent: p.discountPercent ? String(p.discountPercent) : "",
          cgstPercent: p.cgst ? String(p.cgst) : "",
          sgstPercent: p.sgst ? String(p.sgst) : "",
          igstPercent: p.igst ? String(p.igst) : "",
          taxableAmount: taxableAmount.toFixed(2),
          cgst: cgst.toFixed(2),
          sgst: sgst.toFixed(2),
          igst: igst.toFixed(2)
        };
      });
      setFormData(prev => ({ ...prev, parts }));
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setDialogTitle("Error");
      setDialogMessage("Error fetching vehicle or parts data.");
      setDialogOpen(true);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch labour work data from the serviceUsed API and map them accordingly
  const fetchLabourData = async () => {
    try {
      const labourResponse = await apiClient.get(`/serviceUsed/getByVehicleId/${id}`);
      let labourArray: any[] = [];
      if (labourResponse.data && Array.isArray(labourResponse.data)) {
        labourArray = labourResponse.data;
      } else {
        console.error("Labour data is not an array:", labourResponse.data);
      }
      // Map each service used object to the labour object structure
      const labours = labourArray.map((s: any) => ({
        description: s.serviceName || '',
        quantity: s.quantity ? String(s.quantity) : '1',
        unitPrice: s.rate ? String(s.rate) : '',
        taxableAmount: '', // will be computed in computeTotals
        discountPercent: '0',
        cgstPercent: s.cgst != null ? String(s.cgst) : '',
        sgstPercent: s.sgst != null ? String(s.sgst) : '',
        igstPercent: '',
        cgst: s.cgst != null ? String(s.cgst) : '',
        sgst: s.sgst != null ? String(s.sgst) : '',
        igst: ''
      }));
      setFormData(prev => ({ ...prev, labours }));
    } catch (error) {
      console.error("Error fetching labour data:", error);
    }
  };

  const totals = computeTotals();

  const handleSubmit = () => {
    const totals = computeTotals();
    const advanceAmount = formData.advanceAmount === '' ? 0 : parseFloat(formData.advanceAmount);
    const submissionData = {
      ...formData,
      subTotal: totals.subTotal,
      totalAmount: totals.totalAmount,
      partsSubtotal: totals.partsSubtotal,
      laboursSubtotal: totals.laboursSubtotal,
      advanceAmount: advanceAmount
    };
    navigate('/admin/invoicepdfgenerator', { state: submissionData });
  };

  const numberToWords = (num: number): string => {
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    return convert(num);
  };

  const disabledTaxStyle = { backgroundColor: '#f5f5f5' };

  return (
    // Outer container scrollable horizontally for smaller screens
    <Box sx={{ p: 2, width: '100%', overflowX: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Generate Invoice
      </Typography>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{ style: { padding: 20, textAlign: 'center' } }}
      >
        <DialogTitle id="dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography id="dialog-description">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight="bold">
            CUSTOMER DETAILS Test
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField label="Name" name="customerName" size="small" value={formData.customerName} onChange={handleChange} />
            <TextField label="Address" name="customerAddress" size="small" value={formData.customerAddress} onChange={handleChange} />
            <TextField label="Mobile" name="customerMobile" size="small" value={formData.customerMobile} onChange={handleChange} />
            <TextField label="Aadhar No" name="customerAadharNo" size="small" value={formData.customerAadharNo} onChange={handleChange} />
            <TextField label="GSTIN" name="customerGstin" size="small" value={formData.customerGstin} onChange={handleChange} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight="bold">
            VEHICLE / INVOICE DETAILS
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Date field made mandatory */}
            <TextField
              label="Date"
              name="date"
              type="date"
              size="small"
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange} />
            <TextField label="Reg No" name="regNo" size="small" value={formData.regNo} onChange={handleChange} />
            <TextField label="Model" name="model" size="small" value={formData.model} onChange={handleChange} />
            <TextField 
              label="KMS Driven" 
              name="kmsDriven" 
              size="small" 
              type="number"
              value={formData.kmsDriven === "0" ? "" : formData.kmsDriven} 
              onChange={handleChange}  />
            <TextField
              label="Advance Amount"
              name="advanceAmount"
              type="number"
              size="small"
              value={formData.advanceAmount}
              onChange={handleChange}
              inputProps={{ min: 0 }}  />
            <TextField label="Comments" name="comments" size="small" value={formData.comments} onChange={handleChange} />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          SPARES
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mr: 2 }}>
            Global Discount (%):
          </Typography>
          <TextField
            type="number"
            size="small"
            value={formData.globalDiscount || ""}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                globalDiscount: Number(e.target.value) || 0,
              }))
            }
            sx={{ width: "100px" }}
            inputProps={{ min: 0 }}
          />
        </Box>
        <TableContainer component={Paper} sx={{ mt: 1, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell sx={{ minWidth: '200px' }}>Part Name</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center" colSpan={2}>Discount</TableCell>
                <TableCell align="center" colSpan={2}>CGST</TableCell>
                <TableCell align="center" colSpan={2}>SGST</TableCell>
                <TableCell align="center" colSpan={2}>IGST</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={4}></TableCell> 
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"></TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.parts.map((item, index) => {
                const quantity = Number(item.quantity) || 0;
                const unitPrice = Number(item.unitPrice) || 0;
                const globalDiscountPercent = formData.globalDiscount || 0;
                const discountPercent = globalDiscountPercent > 0 ? globalDiscountPercent : Number(item.discountPercent) || 0;
                const base = quantity * unitPrice;
                const discount = base * discountPercent / 100;
                const taxableAmount = base - discount;
                const cgst = (taxableAmount * Number(item.cgstPercent)) / 100;
                const sgst = (taxableAmount * Number(item.sgstPercent)) / 100;
                const igst = (taxableAmount * Number(item.igstPercent)) / 100;
                const amount = taxableAmount;
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    {/* Part Name is read-only */}
                    <TableCell sx={{ minWidth: '200px' }}>
                      <TextField
                        name="partName"
                        size="small"
                        fullWidth
                        value={item.partName}
                        disabled
                      />
                    </TableCell>
                    {/* Quantity is read-only */}
                    <TableCell align="center">
                      <TextField
                        name="quantity"
                        type="number"
                        size="small"
                        value={item.quantity}
                        disabled
                        sx={{ width: '70px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="unitPrice"
                        type="number"
                        size="small"
                        value={item.unitPrice}
                        onChange={(e) => handlePartsChange(e as React.ChangeEvent<HTMLInputElement>, index, 'unitPrice')}
                        sx={{ width: '100px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="discountPercent"
                        type="number"
                        size="small"
                        value={globalDiscountPercent || item.discountPercent} 
                        onChange={(e) => { handlePartsChange(e as React.ChangeEvent<HTMLInputElement>, index, 'discountPercent'); }}
                        sx={{ width: '70px', backgroundColor: globalDiscountPercent ? '#f0f0f0' : '' }} 
                        inputProps={{ min: 0, disabled: !!globalDiscountPercent }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="discount"
                        type="number"
                        size="small"
                        value={discount}
                        onChange={(e) => handlePartsChange(e as React.ChangeEvent<HTMLInputElement>, index, 'discountPercent')}
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="cgstPercent"
                        type="number"
                        size="small"
                        value={item.cgstPercent}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="cgst"
                        type="number"
                        size="small"
                        value={cgst}
                        disabled
                        sx={{ width: '70px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="sgstPercent"
                        type="number"
                        size="small"
                        value={item.sgstPercent}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="sgst"
                        type="number"
                        size="small"
                        value={sgst}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="igstPercent"
                        type="number"
                        size="small"
                        value={item.igstPercent}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="igst"
                        type="number"
                        size="small"
                        value={igst}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{amount.toFixed(2)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {formData.parts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No spare parts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="bold">
            LABOUR WORK
          </Typography>
          <IconButton onClick={addLabourRow} size="small">
            <AddIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 1, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell sx={{ minWidth: '200px' }}>Description</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center" colSpan={2}>Discount</TableCell>
                <TableCell align="center" colSpan={2}>CGST</TableCell>
                <TableCell align="center" colSpan={2}>SGST</TableCell>
                <TableCell align="center" colSpan={2}>IGST</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={4}></TableCell> 
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"> (%)</TableCell>
                <TableCell align="center"> Amt</TableCell>
                <TableCell align="center"></TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.labours.map((item, index) => {
                const quantity = Number(item.quantity) || 0;
                const unitPrice = Number(item.unitPrice) || 0;
                const globalDiscountPercent = formData.globalDiscount || 0;
                const discountPercent = globalDiscountPercent > 0 ? globalDiscountPercent : Number(item.discountPercent) || 0;
                const base = quantity * unitPrice;
                const discount = base * discountPercent / 100;
                const taxableAmount = base - discount;
                const cgst = (taxableAmount * Number(item.cgstPercent)) / 100;
                const sgst = (taxableAmount * Number(item.sgstPercent)) / 100;
                const igst = (taxableAmount * Number(item.igstPercent)) / 100;
                const amount = taxableAmount;
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    {/* Description is non-editable */}
                    <TableCell sx={{ minWidth: '200px' }}>
                      <TextField
                        name="description"
                        size="small"
                        fullWidth
                        value={item.description}
                        disabled
                      />
                    </TableCell>
                    <TableCell align="center">
                    <TextField
                        name="quantity"
                        type="number"
                        size="small"
                        value={item.quantity}
                        disabled
                        sx={{ width: '70px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="unitPrice"
                        type="number"
                        size="small"
                        value={item.unitPrice}
                        onChange={(e) => handleLabourChange(e as React.ChangeEvent<HTMLInputElement>, index, 'unitPrice')}
                        sx={{ width: '100px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="discountPercent"
                        type="number"
                        size="small"
                        value={globalDiscountPercent || item.discountPercent}
                        onChange={(e) => handleLabourChange(e as React.ChangeEvent<HTMLInputElement>, index, 'discountPercent')}
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="discount"
                        type="number"
                        size="small"
                        value={discount}
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="cgstPercent"
                        type="number"
                        size="small"
                        value={item.cgstPercent}
                        disabled
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="cgst"
                        type="number"
                        size="small"
                        value={cgst}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="sgstPercent"
                        type="number"
                        size="small"
                        value={item.sgstPercent}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="sgst"
                        type="number"
                        size="small"
                        value={sgst}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="igstPercent"
                        type="number"
                        size="small"
                        value={item.igstPercent}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        name="igst"
                        type="number"
                        size="small"
                        value={igst}
                        disabled
                        sx={{ width: '70px', ...disabledTaxStyle }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{amount.toFixed(2)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {formData.labours.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No labour work added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 300 }}>
        <TextField
          label="Sub Total"
          name="subTotal"
          type="number"
          size="small"
          value={totals.subTotal.toFixed(2)}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Total Amount"
          name="totalAmount"
          type="number"
          size="small"
          value={totals.totalAmount.toFixed(2)}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Total in Words"
          name="totalInWords"
          size="small"
          value={numberToWords(Number(totals?.totalAmount) || 0)}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Generate Invoice PDF
        </Button>
      </Box>
    </Box>
  );
}