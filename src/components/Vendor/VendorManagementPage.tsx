import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  FormHelperText
} from "@mui/material";

interface SupplierFormData {
  name: string;
  address: string;
  mobileNo: string;
  email: string;
  gstin: string;
  panNo: string;
  sparesBrandName: string;
}

const AddNewSupplierPage: React.FC = () => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    address: "",
    mobileNo: "",
    email: "",
    gstin: "",
    panNo: "",
    sparesBrandName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    // TODO: Submit form logic
    console.log("Form Data:", formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      address: "",
      mobileNo: "",
      email: "",
      gstin: "",
      panNo: "",
      sparesBrandName: ""
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add New Supplier
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Supplier's Name"
              />
              <FormHelperText>Name *</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Mobile No"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Enter Supplier's Mobile No."
              />
              <FormHelperText>Mobile No *</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="Enter Supplier's GSTIN"
              />
              <FormHelperText>GSTIN *</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                multiline
                rows={3}
                label="Spares Brand Name"
                name="sparesBrandName"
                value={formData.sparesBrandName}
                onChange={handleChange}
                placeholder="Enter Supplier's Spares Brand Name"
              />
              <FormHelperText>Spares Brand Name</FormHelperText>
            </FormControl>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Supplier's Address"
              />
              <FormHelperText>Address *</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Supplier's Email No."
              />
              <FormHelperText>Email *</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="PAN No"
                name="panNo"
                value={formData.panNo}
                onChange={handleChange}
                placeholder="Enter Supplier's PAN No."
              />
              <FormHelperText>PAN No *</FormHelperText>
            </FormControl>
          </Grid>

          {/* Submit and Reset Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddNewSupplierPage;
