import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FormData {
  quotationDate: string;
  vehicleNo: string;
  customerName: string;
  mobileNo: string;
  emailId: string;
  customerAddress: string;
}

export default function AddNewQuotation() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    quotationDate: '',
    vehicleNo: '',
    customerName: '',
    mobileNo: '',
    emailId: '',
    customerAddress: '',
  });

  // Error state for basic validations
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    // Required checks
    if (!formData.quotationDate) {
      newErrors.quotationDate = 'Quotation Date is required';
    }
    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle No is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer Name is required';
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile No is required';
    }
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    }
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Customer Address is required';
    }

    // Basic email format check
    if (formData.emailId && !/^\S+@\S+\.\S+$/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email address';
    }

    // Basic mobile number check (10 digits, no other chars)
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If no errors, form is valid
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // If validation passes, navigate to desired route
      navigate('/admin/vehicle/add/servicepart');
    }
  };

  // Reset the form
  const handleReset = () => {
    setFormData({
      quotationDate: '',
      vehicleNo: '',
      customerName: '',
      mobileNo: '',
      emailId: '',
      customerAddress: '',
    });
    setErrors({});
  };

  return (
    <Paper sx={{ width: '100%', p: 3, boxSizing: 'border-box' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add New Quotation
      </Typography>
      <Grid container spacing={2}>
        {/* Quotation Date */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quotation Date"
            type="date"
            name="quotationDate"
            value={formData.quotationDate}
            onChange={handleChange}
            error={!!errors.quotationDate}
            helperText={errors.quotationDate}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Vehicle No */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Vehicle No"
            name="vehicleNo"
            value={formData.vehicleNo}
            onChange={handleChange}
            error={!!errors.vehicleNo}
            helperText={errors.vehicleNo}
            fullWidth
            required
          />
        </Grid>
        {/* Customer Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            error={!!errors.customerName}
            helperText={errors.customerName}
            fullWidth
            required
          />
        </Grid>
        {/* Mobile No */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mobile No"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
            fullWidth
            required
          />
        </Grid>
        {/* Email Id */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Id"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            error={!!errors.emailId}
            helperText={errors.emailId}
            fullWidth
            required
          />
        </Grid>
        {/* Customer Address */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Customer Address"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            error={!!errors.customerAddress}
            helperText={errors.customerAddress}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      {/* Action Buttons */}
      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mr: 2 }}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
}
