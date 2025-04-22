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
  FormHelperText,
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handlePositionChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      position: e.target.value,
    }));
    
    setTouchedFields(prev => ({
      ...prev,
      position: true
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

  // Validation functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateContactNumber = (contact: string) => {
    return /^\d{10}$/.test(contact);
  };

  // Get error states
  const getFieldError = (fieldName: string) => {
    if (!formSubmitted && !touchedFields[fieldName]) return false;
    
    switch (fieldName) {
      case 'name':
        return !formData.name;
      case 'position':
        return !formData.position;
      case 'contact':
        return formData.contact ? !validateContactNumber(formData.contact) : false;
      case 'address':
        return !formData.address;
      case 'email':
        return !formData.email || !validateEmail(formData.email);
      case 'username':
        return !formData.username;
      case 'password':
        return !formData.password || formData.password.length < 6;
      default:
        return false;
    }
  };

  // Get helper text
  const getHelperText = (fieldName: string) => {
    if (!formSubmitted && !touchedFields[fieldName]) return '';
    
    switch (fieldName) {
      case 'name':
        return !formData.name ? 'Name is required' : '';
      case 'position':
        return !formData.position ? 'Position is required' : '';
      case 'contact':
        return formData.contact && !validateContactNumber(formData.contact) 
          ? 'Contact must be a 10-digit number' 
          : '';
      case 'address':
        return !formData.address ? 'Address is required' : '';
      case 'email':
        if (!formData.email) return 'Email is required';
        if (!validateEmail(formData.email)) return 'Please enter a valid email';
        return '';
      case 'username':
        return !formData.username ? 'Username is required' : '';
      case 'password':
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate all fields
    const isNameValid = !!formData.name;
    const isPositionValid = !!formData.position;
    const isAddressValid = !!formData.address;
    const isEmailValid = !!formData.email && validateEmail(formData.email);
    const isUsernameValid = !!formData.username;
    const isPasswordValid = !!formData.password && formData.password.length >= 6;
    const isContactValid = !formData.contact || validateContactNumber(formData.contact);
    
    if (!isNameValid || !isPositionValid || !isAddressValid || !isEmailValid || 
        !isUsernameValid || !isPasswordValid || !isContactValid) {
      showNotification({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    const employeeDTO: EmployeeDTO = {
      ...formData,
      userId: Math.floor(Math.random() * 1000) + 100, 
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
    setFormSubmitted(false);
    setTouchedFields({});
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
          <Grid item xs={12} md={5}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                error={getFieldError('name')}
                helperText={getHelperText('name')}
              />
              
              <FormControl fullWidth required error={getFieldError('position')}>
                <Select
                  value={formData.position}
                  onChange={handlePositionChange}
                  onBlur={() => handleBlur('position')}
                  displayEmpty
                  name="position"
                >
                  <MenuItem value="" disabled>Select Position</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="technician">Technician</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
                {getFieldError('position') && <FormHelperText>Position is required</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                onBlur={() => handleBlur('contact')}
                error={getFieldError('contact')}
                helperText={getHelperText('contact')}
                placeholder="10-digit number"
              />

              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={() => handleBlur('address')}
                multiline
                rows={2}
                error={getFieldError('address')}
                helperText={getHelperText('address')}
              />

              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                error={getFieldError('email')}
                helperText={getHelperText('email')}
              />

              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={() => handleBlur('username')}
                error={getFieldError('username')}
                helperText={getHelperText('username')}
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                error={getFieldError('password')}
                helperText={getHelperText('password')}
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