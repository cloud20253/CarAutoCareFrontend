import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { SelectChangeEvent } from "@mui/material";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { VehicleAdd, VehicleDataByID, VehicleUpdate } from 'Services/vehicleService';

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Updated interface including insurance info
interface VehicleFormData {
  vehicleRegId?: string;
  appointmentId: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModelName: string;
  vehicleVariant: string;
  engineNumber: string;
  chasisNumber: string;
  numberPlateColour: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerMobileNumber: string;
  customerAadharNo: string;
  customerGstin: string;
  superwiser: string;
  technician: string;
  worker: string;
  vehicleInspection: string; // New field
  jobcard: string;           // New field
  status: "In Progress" | "Complete" | "Waiting";
  userId: string;
  date: string;
  // New insurance info fields:
  insuranceStatus: "Insured" | "Expired";
  insuranceFrom: string;
  insuranceTo: string;
}

export default function AddVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<VehicleFormData>({
    vehicleRegId: "",
    appointmentId: "",
    vehicleNumber: "",
    vehicleBrand: "",
    vehicleModelName: "",
    vehicleVariant: "",
    engineNumber: "",
    chasisNumber: "",
    numberPlateColour: "",
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerMobileNumber: "",
    customerAadharNo: "",
    customerGstin: "",
    superwiser: "",
    technician: "",
    worker: "",
    vehicleInspection: "",
    jobcard: "",
    status: "In Progress",
    userId: "",
    date: "",
    // Initial insurance values (default status can be set to Expired)
    insuranceStatus: "Expired",
    insuranceFrom: "",
    insuranceTo: "",
  });

  // General change handler for OutlinedInput fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handler for select dropdowns (vehicle status)
  const handleSelectChange = (event: SelectChangeEvent<"In Progress" | "Complete" | "Waiting">) => {
    setFormData({ ...formData, status: event.target.value as VehicleFormData["status"] });
  };

  // New handler for Insurance Status dropdown
  const handleInsuranceStatusChange = (
    event: SelectChangeEvent<"Insured" | "Expired">
  ) => {
    setFormData({ ...formData, insuranceStatus: event.target.value as "Insured" | "Expired" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let response = '';
      if (id) {
        response = await VehicleUpdate(formData);
      } else {
        response = await VehicleAdd(formData);
      }
      console.log("Vehicle operation successful:", response);
      alert(`Vehicle ${id ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error("Error processing vehicle:", error);
      alert(`Failed to ${id ? 'update' : 'add'} vehicle!`);
    }
  };

  React.useEffect(() => {
    if (id) {
      const getVehicleData = async () => {
        try {
          const response = await VehicleDataByID(id);
          setFormData({
            vehicleRegId: response.vehicleRegId,
            appointmentId: response.appointmentId,
            vehicleNumber: response.vehicleNumber,
            vehicleBrand: response.vehicleBrand,
            vehicleModelName: response.vehicleModelName,
            vehicleVariant: response.vehicleVariant,
            engineNumber: response.engineNumber,
            chasisNumber: response.chasisNumber,
            numberPlateColour: response.numberPlateColour,
            customerId: response.customerId,
            customerName: response.customerName,
            customerAddress: response.customerAddress,
            customerMobileNumber: response.customerMobileNumber,
            customerAadharNo: response.customerAadharNo,
            customerGstin: response.customerGstin,
            superwiser: response.superwiser,
            technician: response.technician,
            worker: response.worker,
            vehicleInspection: response.vehicleInspection, // map API response
            jobcard: response.jobcard,                     // map API response
            status: response.status,
            userId: response.userId,
            date: response.date,
            // Assuming insurance data is returned from the API as well:
            insuranceStatus: response.insuranceStatus || "Expired",
            insuranceFrom: response.insuranceFrom || "",
            insuranceTo: response.insuranceTo || "",
          });
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
        }
      };
      getVehicleData();
    }
  }, [id]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      width: '100%',
      maxWidth: { sm: '100%', md: '90%' },
      maxHeight: '720px',
      gap: { xs: 2, md: 'none' },
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h6">
          {id ? 'Update ' : 'Add '}Vehicle Registration
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Existing fields... */}
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleNumber">Vehicle Number</FormLabel>
            <OutlinedInput
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter Vehicle Number"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleBrand">Vehicle Brand</FormLabel>
            <OutlinedInput
              id="vehicleBrand"
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleChange}
              placeholder="Enter Vehicle Brand"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleModelName">Model Name</FormLabel>
            <OutlinedInput
              id="vehicleModelName"
              name="vehicleModelName"
              value={formData.vehicleModelName}
              onChange={handleChange}
              placeholder="Enter Model Name"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleVariant">Variant</FormLabel>
            <OutlinedInput
              id="vehicleVariant"
              name="vehicleVariant"
              value={formData.vehicleVariant}
              onChange={handleChange}
              placeholder="Enter Vehicle Variant"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="engineNumber">Engine Number</FormLabel>
            <OutlinedInput
              id="engineNumber"
              name="engineNumber"
              value={formData.engineNumber}
              onChange={handleChange}
              placeholder="Enter Engine Number"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="numberPlateColour">Number Plate Color</FormLabel>
            <OutlinedInput
              id="numberPlateColour"
              name="numberPlateColour"
              value={formData.numberPlateColour}
              onChange={handleChange}
              placeholder="Enter Number Plate Color"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="customerName">Customer Name</FormLabel>
            <OutlinedInput
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter Customer Name"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="customerMobileNumber">Mobile Number</FormLabel>
            <OutlinedInput
              id="customerMobileNumber"
              name="customerMobileNumber"
              value={formData.customerMobileNumber}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="chasisNumber">Chasis Number</FormLabel>
            <OutlinedInput
              id="chasisNumber"
              name="chasisNumber"
              value={formData.chasisNumber}
              onChange={handleChange}
              placeholder="Enter Chasis Number"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <FormLabel htmlFor="customerAddress">Customer Address</FormLabel>
            <OutlinedInput
              id="customerAddress"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Enter Customer Address"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="customerAadharNo">Aadhar Number</FormLabel>
            <OutlinedInput
              id="customerAadharNo"
              name="customerAadharNo"
              value={formData.customerAadharNo}
              onChange={handleChange}
              placeholder="Enter Aadhar Number"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="customerGstin">GSTIN</FormLabel>
            <OutlinedInput
              id="customerGstin"
              name="customerGstin"
              value={formData.customerGstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="superwiser">Supervisor</FormLabel>
            <OutlinedInput
              id="superwiser"
              name="superwiser"
              value={formData.superwiser}
              onChange={handleChange}
              placeholder="Enter Supervisor Name"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="technician">Technician</FormLabel>
            <OutlinedInput
              id="technician"
              name="technician"
              value={formData.technician}
              onChange={handleChange}
              placeholder="Enter Technician Name"
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="worker">Worker</FormLabel>
            <OutlinedInput
              id="worker"
              name="worker"
              value={formData.worker}
              onChange={handleChange}
              placeholder="Enter Worker Name"
              required
              size="small"
            />
          </FormGrid>

          {/* New Field: Vehicle Inspection */}
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="vehicleInspection">Vehicle Inspection</FormLabel>
            <OutlinedInput
              id="vehicleInspection"
              name="vehicleInspection"
              value={formData.vehicleInspection}
              onChange={handleChange}
              placeholder="Enter Vehicle Inspection details"
              required
              size="small"
            />
          </FormGrid>

          {/* New Field: Jobcard */}
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="jobcard">Jobcard</FormLabel>
            <OutlinedInput
              id="jobcard"
              name="jobcard"
              value={formData.jobcard}
              onChange={handleChange}
              placeholder="Enter Jobcard details"
              required
              size="small"
            />
          </FormGrid>

          {/* New Section: Insurance Information */}
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="insuranceStatus">Insurance Status</FormLabel>
            <FormControl fullWidth size="small">
              <Select
                id="insuranceStatus"
                name="insuranceStatus"
                value={formData.insuranceStatus}
                onChange={handleInsuranceStatusChange}
                required
              >
                <MenuItem value="Insured">Insured</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>

          {/* Conditionally show Insurance Dates if "Insured" */}
          {formData.insuranceStatus === "Insured" && (
            <>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="insuranceFrom">Insurance From</FormLabel>
                <OutlinedInput
                  id="insuranceFrom"
                  name="insuranceFrom"
                  type="date"
                  value={formData.insuranceFrom}
                  onChange={handleChange}
                  required
                  size="small"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="insuranceTo">Insurance To</FormLabel>
                <OutlinedInput
                  id="insuranceTo"
                  name="insuranceTo"
                  type="date"
                  value={formData.insuranceTo}
                  onChange={handleChange}
                  required
                  size="small"
                />
              </FormGrid>
            </>
          )}

          {/* Existing Status field */}
          <FormGrid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Complete">Completed</MenuItem>
                <MenuItem value="Waiting">Pending</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="date">Date</FormLabel>
            <OutlinedInput
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              size="small"
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {id ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </FormGrid>
        </Grid>
      </form>
    </Box>
  );
}
