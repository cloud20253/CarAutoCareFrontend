import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { VehicleAdd, VehicleDataByID, VehicleUpdate } from 'Services/vehicleService';
import apiClient from 'Services/apiService';

export interface VehicleRegDto {
  vehicleRegId: string;
  appointmentId: string | null;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModelName: string;
  engineNumber: string;
  chasisNumber: string;
  numberPlateColour: string;
  customerId: string | null;
  customerName: string;
  customerAddress: string;
  customerMobileNumber: string;
  customerAadharNo: string;
  customerGstin: string;
  email: string;
  superwiser: string;
  technician: string;
  worker: string;
  vehicleInspection: string;
  jobcard: string;
  kmsDriven?: number | string;
  status: "Waiting" | "In Progress" | "Complete";
  userId: string;
  date: string;
  insuranceStatus: "Insured" | "Expired";
  insuranceFrom: string | null;
  insuranceTo: string | null;
  vehicleVariant: string; // used for fuel type in your payload
  manufactureYear: number | string;
  advancePayment?: number | string;
}

export interface VehicleFormData {
  vehicleRegId?: string;
  appointmentId: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModelName: string;
  engineNumber: string;
  chasisNumber: string;
  numberPlateColour: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerMobileNumber: string;
  customerAadharNo: string;
  customerGstin: string;
  email: string;
  superwiser: string;
  technician: string;
  worker: string;
  vehicleInspection: string;
  jobCard: string;
  kmsDriven: number | string;
  status: "Waiting" | "In Progress" | "Complete";
  userId: string;
  date: string;
  insuranceStatus: "Insured" | "Expired";
  insuranceFrom: string;
  insuranceTo: string;
  fuelType: string;
  manufactureYear: string;
  advancePayment: number | string;
}

const initialFormData: VehicleFormData = {
  vehicleRegId: "",
  appointmentId: "",
  vehicleNumber: "",
  vehicleBrand: "",
  vehicleModelName: "",
  engineNumber: "",
  chasisNumber: "",
  numberPlateColour: "",
  customerId: "",
  customerName: "",
  customerAddress: "",
  customerMobileNumber: "",
  customerAadharNo: "",
  customerGstin: "",
  email: "",
  superwiser: "",
  technician: "",
  worker: "",
  vehicleInspection: "",
  jobCard: "",
  kmsDriven: 0,
  status: "Waiting",
  userId: "",
  date: "",
  insuranceStatus: "Expired",
  insuranceFrom: "",
  insuranceTo: "",
  fuelType: "",
  manufactureYear: "",
  advancePayment: 0,
};

// --- Styled components ---
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  maxWidth: '90%',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export default function AddUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; customerName?: string; customerMobileNumber?: string; kmsDriven?: string }>({});

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<VehicleRegDto[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegDto | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors((prev) => ({ ...prev, [event.target.name]: "" }));
    setFormData({ ...formData, [event.target.name]: event.target.value || "" });
  };

  const handleSelectChange = (event: SelectChangeEvent<"Waiting" | "In Progress" | "Complete">) => {
    setFormData({ ...formData, status: event.target.value as VehicleFormData["status"] });
  };

  const handleInsuranceStatusChange = (event: SelectChangeEvent<"Insured" | "Expired">) => {
    setFormData({ ...formData, insuranceStatus: event.target.value as "Insured" | "Expired" });
  };

  const handleFuelTypeChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, fuelType: event.target.value || "" });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateFields = (): boolean => {
    const newErrors: { email?: string; customerName?: string; customerMobileNumber?: string; kmsDriven?: string } = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    }
    if (!formData.customerMobileNumber.trim()) {
      newErrors.customerMobileNumber = "Mobile number is required";
    } else {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.customerMobileNumber)) newErrors.customerMobileNumber = "Mobile number must be exactly 10 digits";
    }
    if (!formData.kmsDriven || formData.kmsDriven.toString().trim() === "" || Number(formData.kmsDriven) === 0) {
      newErrors.kmsDriven = "Kilometer Driven is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateFields()) return;
    try {
      const { fuelType, ...rest } = formData;
      const payload = { ...rest, vehicleVariant: fuelType, status: id ? formData.status : "Waiting" };
      let response: any = "";
      if (id) {
        response = await VehicleUpdate(payload);
      } else {
        response = await VehicleAdd(payload);
      }
      console.log("Vehicle operation successful:", response);
      setDialogTitle("Success");
      setDialogMessage(`Vehicle ${id ? "updated" : "added"} successfully!`);
      setDialogOpen(true);
      if (!id) {
        const generatedId = response.data.vehicleRegId;
        navigate(`/admin/vehicle/add/servicepart/${generatedId}`);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error processing vehicle:", error);
      let errorMsg = "Failed to process vehicle.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      setDialogTitle("Error");
      setDialogMessage(errorMsg);
      setDialogOpen(true);
    }
  };
  React.useEffect(() => {
    if (id) {
      const getVehicleData = async () => {
        try {
          const response = await VehicleDataByID(id);
          setFormData({
            vehicleRegId: response.vehicleRegId || "",
            appointmentId: response.appointmentId || "",
            vehicleNumber: response.vehicleNumber || "",
            vehicleBrand: response.vehicleBrand || "",
            vehicleModelName: response.vehicleModelName || "",
            engineNumber: response.engineNumber || "",
            chasisNumber: response.chasisNumber || "",
            numberPlateColour: response.numberPlateColour || "",
            customerId: response.customerId || "",
            customerName: response.customerName || "",
            customerAddress: response.customerAddress || "",
            customerMobileNumber: response.customerMobileNumber || "",
            customerAadharNo: response.customerAadharNo || "",
            customerGstin: response.customerGstin || "",
            email: response.email || "",
            superwiser: response.superwiser || "",
            technician: response.technician || "",
            worker: response.worker || "",
            vehicleInspection: response.vehicleInspection || "",
            jobCard: response.jobcard || "",
            kmsDriven: response.kmsDriven || "",
            status: response.status || "Waiting",
            userId: response.userId || "",
            date: response.date || "",
            insuranceStatus: response.insuranceStatus || "Expired",
            insuranceFrom: response.insuranceFrom || "",
            insuranceTo: response.insuranceTo || "",
            fuelType: response.vehicleVariant || "",
            manufactureYear: response.manufactureYear ? String(response.manufactureYear) : "",
            advancePayment: response.advancePayment || 0,
          });
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
        }
      };
      getVehicleData();
    }
  }, [id]);
  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchInput.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await apiClient.get<VehicleRegDto[]>("/vehicle-reg/search", {
          params: { query: searchInput },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchResults();
  }, [searchInput]);
  const handleVehicleSelect = (event: any, value: VehicleRegDto | null) => {
    setSelectedVehicle(value);
    if (value) {
      setFormData((prev) => ({
        ...prev,
        vehicleRegId: value.vehicleRegId || "",
        appointmentId: value.appointmentId || "",
        vehicleNumber: value.vehicleNumber || "",
        vehicleBrand: value.vehicleBrand || "",
        vehicleModelName: value.vehicleModelName || "",
        engineNumber: value.engineNumber || "",
        chasisNumber: value.chasisNumber || "",
        numberPlateColour: value.numberPlateColour || "",
        customerId: value.customerId || "",
        customerName: value.customerName || "",
        customerAddress: value.customerAddress || "",
        customerMobileNumber: value.customerMobileNumber || "",
        customerAadharNo: value.customerAadharNo || "",
        customerGstin: value.customerGstin || "",
        email: value.email || "",
        vehicleInspection: value.vehicleInspection || "",
        jobCard: value.jobcard || "",
        status: value.status || "Waiting",
        userId: value.userId || "",
        date: value.date || "",
        insuranceStatus: value.insuranceStatus || "Expired",
        insuranceFrom: value.insuranceFrom || "",
        insuranceTo: value.insuranceTo || "",
        fuelType: value.vehicleVariant || "",
        manufactureYear: value.manufactureYear ? String(value.manufactureYear) : "",
        advancePayment: value.advancePayment || 0,
      }));
    }
  };

  return (
    <ContainerBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography component="h2" variant="h6">
          {id ? "Update " : "Add "}User Registration
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleNumber">Name</FormLabel>
            <OutlinedInput
              id="name"
              name="name"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter Name"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="fuelType">Select Position</FormLabel>
            <FormControl fullWidth size="small">
              <InputLabel id="fuelType-label">Select Position</InputLabel>
              <Select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleFuelTypeChange}
                label="Fuel Type"
                required
              >
                <MenuItem value="">Select Position</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Superwiser">Superwiser</MenuItem>
                <MenuItem value="Technician">Technician</MenuItem>
                <MenuItem value="Worker">Worker</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="manufactureYear">Contact</FormLabel>
            <OutlinedInput
              id="manufactureYear"
              name="manufactureYear"
              value={formData.manufactureYear}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="kmsDriven">Address</FormLabel>
            <OutlinedInput
              id="Address"
              name="Address"
              value={formData.kmsDriven}
              onChange={handleChange}
              placeholder="Enter Address"
              required
              size="small"
              error={Boolean(errors.kmsDriven)}
            />
            {errors.kmsDriven && <FormHelperText error>{errors.kmsDriven}</FormHelperText>}
          </FormGrid>
          
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <OutlinedInput
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
              size="small"
              error={Boolean(errors.email)}
            />
            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="userName">Username</FormLabel>
            <OutlinedInput
              id="userName"
              name="userName"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Enter User Name"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <OutlinedInput
              id="password"
              name="password"
              value={formData.customerMobileNumber}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              required
              size="small"
              error={Boolean(errors.customerMobileNumber)}
            />
            {errors.customerMobileNumber && <FormHelperText error>{errors.customerMobileNumber}</FormHelperText>}
          </FormGrid>
         </Grid>
      </form>
      <Typography>
        
      </Typography>
      </Stack>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{ style: { padding: 20, textAlign: "center" } }}
      >
        <DialogTitle id="dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography id="dialog-description">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ContainerBox>
  );
}
