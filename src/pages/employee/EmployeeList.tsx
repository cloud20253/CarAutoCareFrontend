import React, { useEffect, useState, FC } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useNotification } from '../../components/common/Notification';

interface EmployeeDTO {
  id: number | null;
  name: string | null;
  position: string;
  contact: string;
  address: string;
  email: string | null;
  username: string | null;
  userId: number | null;
  password: string | null;
  role: string | null;
  componentNames: string[];
}

interface Employee {
  id: number;
  name: string;
  position: string;
  contact: string;
  email: string;
  address: string;
}

const EmployeeList: FC = () => {
  const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get<EmployeeDTO[]>('employees/getAll');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showNotification({
        message: 'Failed to fetch employees',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (userId: number) => {
    navigate(`/admin/employeeManagement/edit/${userId}`);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiClient.delete(`employees/delete/${userId}`);
        showNotification({
          message: 'Employee deleted successfully',
          type: 'success',
        });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification({
          message: 'Failed to delete employee',
          type: 'error',
        });
      }
    }
  };

  const handleAddNew = () => {
    navigate('/admin/employeeManagement');
  };

  const filteredEmployees = employees.filter((employee: EmployeeDTO) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const fields = [
      employee.name,
      employee.position,
      employee.contact,
      employee.email,
      employee.address
    ];
    
    return fields.some(field => 
      field && field.toString().toLowerCase().includes(searchLower)
    );
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'contact', headerName: 'Contact', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams<EmployeeDTO>) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row.userId || 0)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.userId || 0)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      <Paper sx={{ 
        p: 3,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          width: '100%'
        }}>
          <Typography variant="h5">User List</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add New User
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={employees}
          columns={columns}
          getRowId={(row: EmployeeDTO) => row.id || row.userId || Math.random()}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          loading={loading}
          sx={{
            width: '100%',
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            },
            '& .MuiDataGrid-main': {
              width: '100%',
              maxWidth: '100%'
            },
            '& .MuiDataGrid-virtualScroller': {
              width: '100%'
            },
            '& .MuiDataGrid-footerContainer': {
              width: '100%'
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default EmployeeList; 