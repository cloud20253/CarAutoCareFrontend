import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
} from '@mui/material';
import apiClient from 'Services/apiService';

export interface VehicleRegDto {
  vehicleRegId: number;
  appointmentId?: number;
  vehicleNumber: string;
  vehicleBrand?: string;
  vehicleModelName?: string;
  vehicleVariant?: string;
  engineNumber?: string;
  chasisNumber?: string;
  numberPlateColour?: string;
  kmsDriven?: number;
  email?: string;
  ManufactureYear?: number;
  advancePayment?: number;
  customerId?: number;
  customerName: string;
  customerAddress?: string;
  customerMobileNumber: string;
  customerAadharNo?: string;
  customerGstin?: string;
  superwiser?: string;
  technician?: string;
  worker?: string;
  status?: string;
  userId?: number;
  date?: string;
  vehicleInspection?: string;
  jobCard?: string;
  insuranceStatus?: string;
  insuredFrom?: string;
  insuredTo?: string;
}

const InsuranceList: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [expiredInsurances, setExpiredInsurances] = useState<VehicleRegDto[]>([]);
  const [activeInsurances, setActiveInsurances] = useState<VehicleRegDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch data from both API endpoints using the custom API service
  const fetchInsuranceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expiredResponse, activeResponse] = await Promise.all([
        apiClient.get<VehicleRegDto[]>('/vehicle-reg/expired'),
        apiClient.get<VehicleRegDto[]>('/vehicle-reg/active'),
      ]);
      setExpiredInsurances(expiredResponse.data);
      setActiveInsurances(activeResponse.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load insurance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsuranceData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filterData = (data: VehicleRegDto[]) => {
    if (!searchTerm) return data;
    return data.filter((item) => {
      const searchableString = (
        item.vehicleNumber + ' ' +
        item.vehicleModelName + ' ' +
        item.customerName + ' ' +
        item.customerMobileNumber + ' ' +
        (item.insuredTo ? new Date(item.insuredTo).toLocaleDateString('en-GB') : '')
      ).toLowerCase();
      return searchableString.includes(searchTerm);
    });
  };

  const renderTable = (data: VehicleRegDto[]) => {
    const filteredData = filterData(data);

    if (filteredData.length === 0) {
      return (
        <Typography variant="body1" sx={{ padding: 2 }}>
          No records found.
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Vehicle Model</strong></TableCell>
              <TableCell><strong>Customer Name</strong></TableCell>
              <TableCell><strong>Customer Mobile</strong></TableCell>
              <TableCell><strong>Insured To</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.vehicleRegId}>
                <TableCell>{item.vehicleNumber}</TableCell>
                <TableCell>{item.vehicleModelName}</TableCell>
                <TableCell>{item.customerName}</TableCell>
                <TableCell>{item.customerMobileNumber}</TableCell>
                <TableCell>
                  {item.insuredTo
                    ? new Date(item.insuredTo).toLocaleDateString('en-GB')
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Insurance Vehicle Lists
      </Typography>

      {/* Search Box */}
      <TextField 
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchChange}
        placeholder="Search by any field..."
      />

      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Expired Insurance" />
        <Tab label="Active Insurance" />
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <>
          {tabValue === 0 && (
            <Box role="tabpanel" sx={{ padding: 2 }}>
              {renderTable(expiredInsurances)}
            </Box>
          )}
          {tabValue === 1 && (
            <Box role="tabpanel" sx={{ padding: 2 }}>
              {renderTable(activeInsurances)}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default InsuranceList;
