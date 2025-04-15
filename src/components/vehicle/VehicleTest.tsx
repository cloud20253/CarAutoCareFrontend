import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { VehicleListData } from 'Services/vehicleService';

// Simple test component to isolate the advance payment issue
export default function VehicleTest() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const fetchVehicles = async () => {
    try {
      const response = await VehicleListData();
      const data = response.data;
      console.log('Raw vehicle data:', data);
      
      if (Array.isArray(data)) {
        setVehicles(data);
      } else if (data) {
        setVehicles([data]);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('Failed to fetch vehicles');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Advance Payment Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={fetchVehicles} 
        sx={{ mb: 2 }}
      >
        Refresh Data
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Advance Payment (Raw)</TableCell>
              <TableCell>Advance Payment (Parsed)</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => {
              // Try multiple parsing methods
              const rawValue = vehicle.advancePayment;
              const numberValue = Number(rawValue);
              const floatValue = parseFloat(String(rawValue).replace(/[^\d.-]/g, ''));
              
              return (
                <TableRow key={vehicle.vehicleRegId}>
                  <TableCell>{vehicle.vehicleRegId}</TableCell>
                  <TableCell>{vehicle.vehicleNumber}</TableCell>
                  <TableCell>{JSON.stringify(rawValue)}</TableCell>
                  <TableCell>
                    Number: {isNaN(numberValue) ? 'NaN' : numberValue}<br/>
                    parseFloat: {isNaN(floatValue) ? 'NaN' : floatValue}
                  </TableCell>
                  <TableCell>{typeof rawValue}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h6" sx={{ mt: 4 }}>
        Debug Information:
      </Typography>
      <pre style={{ backgroundColor: '#f5f5f5', padding: 16, overflow: 'auto' }}>
        {JSON.stringify(vehicles.map(v => ({
          id: v.vehicleRegId,
          number: v.vehicleNumber,
          advance: v.advancePayment,
          type: typeof v.advancePayment
        })), null, 2)}
      </pre>
    </Box>
  );
} 