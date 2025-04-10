import * as React from 'react';
import { useState, useEffect, FormEvent } from "react";
import apiClient from "Services/apiService";

import {
  Box,
  Grid,
  Typography,
  Button,
  OutlinedInput,
  FormLabel,
  styled,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface CreateTransaction {
  transactionType: "CREDIT" | "DEBIT";
  userId?: number;
  vehicleRegId?: number;
  partNumber: string;
  partName: string;
  manufacturer: string;
  quantity: string;
  billNo?: string;
  name: string; 
}

interface Feedback {
  message: string;
  severity: "success" | "error";
}

interface Vendor {
  vendorId: number;
  name: string;
}

interface SparePartDto {
  partName: string;
  partNumber: string;
  manufacturer: string;
  description?: string;  
}

const initialCreateData: CreateTransaction = {
  transactionType: "CREDIT",
  userId: 10006,
  vehicleRegId: undefined,
  partNumber: "",
  partName: "",
  manufacturer: "",
  quantity: "1",
  billNo: "",
  name: "",
};

const filterOptions = createFilterOptions<SparePartDto>({
  matchFrom: 'any',
  stringify: (option) =>
    `${option.manufacturer} ${option.partName} ${option.partNumber} ${option.description || ""}`,
});

const TransactionAdd: React.FC = () => {
  const [createData, setCreateData] = useState<CreateTransaction>(initialCreateData);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [vendorSuggestions, setVendorSuggestions] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [partSuggestions, setPartSuggestions] = useState<SparePartDto[]>([]);
  const [selectedPart, setSelectedPart] = useState<SparePartDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  let userRole: string = "";
  const storedDecodedToken = localStorage.getItem("userData");
  if (storedDecodedToken) {
    const parsedToken = JSON.parse(storedDecodedToken);
    userRole = parsedToken.authorities[0];
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await apiClient.get("/vendor/getAll");
      console.log("Vendors:", response.data);
      const vendors: Vendor[] = Array.isArray(response.data)
        ? response.data
        : response.data.vendors || [];
      setVendorSuggestions(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchPartsBySearch = async (query: string) => {
    try {
      const response = await apiClient.get(`/Filter/searchBarFilter?searchBarInput=${query}`);

      const parts: SparePartDto[] = response.data.list || response.data.content || [];
      setPartSuggestions(parts);
    } catch (error) {
      console.error("Error fetching parts:", error);
      setPartSuggestions([]);
    }
  };

  const handlePartInputChange = (event: any, value: string, reason: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      fetchPartsBySearch(value);
    } else {
      setPartSuggestions([]);
    }
  };

  const handleSelectPart = (event: any, newValue: SparePartDto | null) => {
    setSelectedPart(newValue);
    setCreateData((prev) => ({
      ...prev,
      manufacturer: newValue ? newValue.manufacturer : "",
      partNumber: newValue ? newValue.partNumber : "",
  
      partName: newValue ? newValue.partName : "",
    }));
  };

  const handleSelectVendor = (event: any, newValue: Vendor | null) => {
    setSelectedVendor(newValue);
    setCreateData((prev) => ({
      ...prev,
      name: newValue ? newValue.name : "",
    }));
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...createData,
        quantity: Number(createData.quantity),
      };
      const response = await apiClient.post("/sparePartTransactions/add", dataToSubmit);
      setFeedback({
        message: response.data.message || "Transaction created successfully",
        severity: "success",
      });
      setCreateData(initialCreateData);
      setSelectedVendor(null);
      setSelectedPart(null);
      setSearchTerm("");
      setPartSuggestions([]);
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || "Failed to create transaction",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        maxWidth: { sm: '100%', md: '90%' },
        maxHeight: '720px',
        gap: { xs: 2, md: 'none' },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h6">
          Add Transaction
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      <form onSubmit={handleCreateSubmit}>
        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vendorName">Vendor Name</FormLabel>
            <Autocomplete
              disablePortal
              openOnFocus
              noOptionsText="No vendors available"
              options={vendorSuggestions}
              getOptionLabel={(option) => option.name}
              onChange={handleSelectVendor}
              value={selectedVendor}
              renderInput={(params) => <TextField {...params} label="Vendor Name" />}
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="billNo">
              Bill Number
            </FormLabel>
            <OutlinedInput
              name="billNo"
              value={createData.billNo}
              onChange={handleCreateChange}
              placeholder="Enter Bill Number"
              size="small"
              required
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partName">Spare Part (Search)</FormLabel>
            <Autocomplete
              disablePortal
              openOnFocus
              noOptionsText="No parts found"
              options={partSuggestions}
              filterOptions={filterOptions}
              getOptionLabel={(option) =>
           
                `${option.manufacturer} - ${option.partName} - ${option.description || "No Description"}`
              }
              onInputChange={handlePartInputChange}
              onChange={handleSelectPart}
              value={selectedPart}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Part Search with Part Number/Name/Manufacturer/Description"
                />
              )}
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partNumber">
              Part Number
            </FormLabel>
            <OutlinedInput
              name="partNumber"
              value={createData.partNumber}
              onChange={handleCreateChange}
              placeholder="Auto-filled Part Number"
              size="small"
              required
              disabled
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="quantity">
              Quantity
            </FormLabel>
            <OutlinedInput
              name="quantity"
              value={createData.quantity}
              onChange={handleCreateChange}
              type="number"
              size="small"
              required
              inputProps={{ min: 1 }}
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Transaction
            </Button>
          </FormGrid>
        </Grid>
      </form>

      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert onClose={handleCloseSnackbar} severity={feedback.severity} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default TransactionAdd;
