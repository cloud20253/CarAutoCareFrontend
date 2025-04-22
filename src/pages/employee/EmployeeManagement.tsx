import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  SelectChangeEvent,
  FormGroup,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../components/common/Notification';
import { apiClient } from '../../utils/apiClient';

interface EmployeeForm {
  name: string;
  position: string;
  contact: string;
  address: string;
  email: string;
  username: string;
  password: string;
  userId?: number;
}

interface BaseResponseDTO {
  code: string;
  message: string;
}

interface EmployeeDTO extends EmployeeForm {
  componentNames: string[];
}

const EmployeeManagement: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeForm>({
    name: '',
    position: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
    userId: undefined,
  });

  const [componentNames, setComponentNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositionChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      position: e.target.value,
    }));
  };

  const handleComponentChange = (component: string) => {
    setComponentNames((prev) => {
      if (prev.includes(component)) {
        return prev.filter((p) => p !== component);
      }
      return [...prev, component];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.email || !formData.username || !formData.password) {
      showNotification({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    const employeeDTO: EmployeeDTO = {
      ...formData,
      userId: Math.floor(Math.random() * 1000) + 100, // Generate a random userId between 100-1099
      componentNames,
    };

    setIsLoading(true);
    try {
      const response = await apiClient.post<BaseResponseDTO>(
        'employees/add',
        employeeDTO
      );

      if (response.data.code === '200') {
        showNotification({ message: 'Employee created successfully', type: 'success' });
        handleReset();
        navigate('/admin/dashboard');
      } else {
        showNotification({ 
          message: response.data.message || 'Failed to create employee',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      showNotification({ 
        message: error instanceof Error ? error.message : 'Failed to create employee',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      position: '',
      contact: '',
      address: '',
      email: '',
      username: '',
      password: '',
      userId: undefined,
    });
    setComponentNames([]);
  };

  const permissionsList = [
    'Dashboard',
    'Manage User',
    'Manage Services',
    'Manage Repairs',
    'Manage Spares Inventory',
    'Manage Supplier',
    'Manage Customer',
    'Purchase',
    'Job Sales Report',
    'Counter Sales Report',
    'Purchase Report',
    'Vehicle Registration',
    'Bookings',
    'Service Queue',
    'Service History',
    'Day Book',
    'Counter Sale',
    'Job Card',
    'Spares',
    'Services',
    'Sale Account Report',
    'Purchase Account Report',
    'Manage Stock',
    'Manage Sale',
    'Customer Payment',
    'Bank Deposit',
    'Employee Payment',
    'Manage Notes',
    'Superwiser/Technician Service Report',
    'Quotation',
    'Manage Insurance',
    'Spare Sale Stock',
    'Manage Terms & Conditions',
    'Vehicle History'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New User
        </Typography>
        <Grid container spacing={3}>
          {/* Left side - Form fields */}
          <Grid item xs={12} md={5}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!formData.name}
                helperText={!formData.name && "Name is required"}
              />
              
              <FormControl fullWidth required error={!formData.position}>
                <Select
                  value={formData.position}
                  onChange={handlePositionChange}
                  displayEmpty
                  name="position"
                >
                  <MenuItem value="" disabled>Select Position</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="technician">Technician</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />

              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
                error={!formData.address}
                helperText={!formData.address && "Address is required"}
              />

              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!formData.email}
                helperText={!formData.email && "Email is required"}
              />

              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!formData.username}
                helperText={!formData.username && "Username is required"}
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!formData.password}
                helperText={!formData.password && "Password is required"}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
                <Button 
                  type="button" 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Component Names */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              Manage Roles
            </Typography>
            <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {permissionsList.map((component) => (
                <FormControlLabel
                  key={component}
                  control={
                    <Checkbox
                      checked={componentNames.includes(component)}
                      onChange={() => handleComponentChange(component)}
                      disabled={isLoading}
                    />
                  }
                  label={component}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmployeeManagement; 