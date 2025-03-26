import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid
} from "@mui/material";
import apiClient from "Services/apiService";

// Update the interface to include panNo field
interface VendorDto {
  vendorId?: number;
  name: string;
  GSTno: string;       // Will map from response field "gstno"
  address: string;
  mobileNumber: string;
  panNo: string;       // New field to display PAN No
  sparesBrandName: string; // Will remain empty if not provided
}

const VendorUpdatePage: React.FC = () => {
  // Retrieve vendorId from URL parameters
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form state pre-populated with vendor data
  const [formData, setFormData] = useState<VendorDto>({
    name: "",
    GSTno: "",
    address: "",
    mobileNumber: "",
    panNo: "",
    sparesBrandName: ""
  });

  // Fetch vendor details using query parameter: /vendor/findById?vendorId=...
  const fetchVendorDetails = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/vendor/findById?vendorId=${vendorId}`);
      // Assume the response structure is:
      // { headers: {}, body: { vendorId, name, address, mobileNumber, panNo, gstno }, ... }
      // Adjust mapping accordingly if your structure is different.
      const data = res.data.body ? res.data.body : res.data;
      const vendor: VendorDto = {
        vendorId: data.vendorId,
        name: data.name,
        address: data.address,
        // Convert mobileNumber to string if it's a number
        mobileNumber: data.mobileNumber.toString(),
        panNo: data.panNo,
        GSTno: data.gstno,
        sparesBrandName: data.sparesBrandName || ""
      };
      setFormData(vendor);
    } catch (error) {
      console.error("Error fetching vendor details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]);

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Update vendor using PATCH /vendor/update/{vendorId}
  const handleUpdate = async () => {
    if (!vendorId) return;
    try {
      await apiClient.patch(`/vendor/update/${vendorId}`, formData);
      // After update, navigate back to the supplier list page
      navigate("/supplier/list");
    } catch (error) {
      console.error("Error updating vendor", error);
    }
  };

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Update Supplier
      </Typography>
      {loading ? (
        <Typography>Loading vendor details...</Typography>
      ) : (
        <Paper sx={{ padding: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GST No"
                name="GSTno"
                value={formData.GSTno}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PAN No"
                name="panNo"
                value={formData.panNo}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* Optional: Display Spare Brand if needed */}
            <Grid item xs={12}>
              <TextField
                label="Spare Brand"
                name="sparesBrandName"
                value={formData.sparesBrandName}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="outlined" onClick={() => navigate("/supplier/list")}>
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default VendorUpdatePage;
