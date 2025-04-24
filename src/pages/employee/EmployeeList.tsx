import React, { useEffect, useState, FC, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useNotification } from '../../components/common/Notification';
import { useSidebar } from '../../contexts/SidebarContext';

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

const EmployeeList: FC = () => {
  const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use effect to force re-render when sidebar state changes
  useEffect(() => {
    // Trigger a resize event to make the DataGrid recalculate its width
    window.dispatchEvent(new Event('resize'));
  }, [sidebarOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get<EmployeeDTO[]>('api/employees/getAll');
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
      employee.address,
      employee.username,
    ];
    
    return fields.some(field => 
      field && field.toString().toLowerCase().includes(searchLower)
    );
  });

  // Add serial number to employees
  const employeesWithIndex = filteredEmployees.map((employee, index) => ({
    ...employee,
    srNo: index + 1
  }));

  // Custom header renderer to handle mobile view with line breaks
  const renderHeaderWithTooltip = (params: any) => {
    const headerName = params.colDef.headerName || '';
    
    // For mobile view, add break for multi-word headers
    if (isMobile && headerName.includes(' ')) {
      const words = headerName.split(' ');
      
      return (
        <Tooltip title={headerName}>
          <Box sx={{ lineHeight: 1.1, textAlign: 'center' }}>
            {words.map((word: string, index: number) => (
              <React.Fragment key={index}>
                {word}
                {index < words.length - 1 && <br />}
              </React.Fragment>
            ))}
          </Box>
        </Tooltip>
      );
    }
    
    return (
      <Tooltip title={headerName}>
        <span>{headerName}</span>
      </Tooltip>
    );
  };

  // Define all columns with flexible widths
  const columns: GridColDef[] = [
    { 
      field: 'srNo', 
      headerName: 'Sr No', 
      width: 70,
      minWidth: 70,
      maxWidth: 80,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      flex: 0,
      renderHeader: renderHeaderWithTooltip,
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 120,
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
    },
    { 
      field: 'position', 
      headerName: 'Position', 
      width: 120,
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'Manager' ? 'primary' : 
            params.value === 'Technician' ? 'info' : 
            params.value === 'Superwiser' ? 'success' : 'default'
          }
          variant="outlined"
        />
      ),
    },
    { 
      field: 'contact', 
      headerName: 'Contact', 
      width: 120,
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 180,
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              width: '100%'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      width: 120,
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
    },
    { 
      field: 'password', 
      headerName: 'Password', 
      width: 120,
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      minWidth: 100,
      flex: 0,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
      renderCell: (params: GridRenderCellParams<EmployeeDTO>) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => handleEdit(params.row.userId || 0)}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => handleDelete(params.row.userId || 0)}
              sx={{ 
                bgcolor: alpha(theme.palette.error.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
              }}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        p: 0,
        m: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CardHeader
          title={
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="bold" 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', textAlign: 'center' }}
            >
              <PersonIcon color="primary" />
              Employee Directory
            </Typography>
          }
          subheader={!isMobile && "Manage employee accounts and profiles"}
          sx={{ 
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            p: isMobile ? 1.5 : 2,
            '& .MuiCardHeader-content': { overflow: 'hidden', textAlign: 'center' },
            '& .MuiCardHeader-action': { 
              margin: isMobile ? '4px 0 0 0' : 'auto',
              alignSelf: isMobile ? 'flex-start' : 'center',
            },
            textAlign: 'center'
          }}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={!isMobile && <AddIcon />}
              onClick={handleAddNew}
              size={isMobile ? "small" : "medium"}
              sx={{ borderRadius: 2, ml: isMobile ? 1 : 0 }}
            >
              {isMobile ? <AddIcon /> : "Add New Employee"}
            </Button>
          }
        />
        
        <CardContent sx={{ 
          p: 0, 
          width: '100%', 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'flex-end',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%'
          }}>
            <TextField
              size="small"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                width: isMobile ? '100%' : 300,
                mb: isMobile ? 1 : 0
              }}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>
          
          <Divider />
          
          <Box sx={{ 
            flexGrow: 1,
            width: '100%', 
            p: 2,
            display: 'flex',
            overflow: 'hidden',
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflowX: 'auto',
            }}>
              <div style={{ 
                minWidth: isMobile ? 800 : 'auto',
                width: '100%' 
              }}>
                <DataGrid
                  rows={employeesWithIndex}
                  columns={columns}
                  getRowId={(row: EmployeeDTO) => row.id || row.userId || Math.random()}
                  hideFooter={employeesWithIndex.length <= 25}
                  autoHeight
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableColumnSorting
                  loading={loading}
                  columnVisibilityModel={{
                    address: false,
                  }}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: 1,
                    width: '100%',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      height: isMobile ? '80px !important' : 'auto',
                      maxHeight: isMobile ? '80px !important' : 'auto',
                      lineHeight: isMobile ? 1.1 : 'inherit',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      overflow: 'visible',
                      lineHeight: isMobile ? 1.1 : 'inherit',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: isMobile ? '0.7rem' : 'inherit',
                      textAlign: 'center',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                      wordBreak: isMobile ? 'break-word' : 'normal',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      padding: isMobile ? '0 4px' : 'inherit',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                      display: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      padding: '8px 10px',
                      fontSize: isMobile ? '0.8rem' : 'inherit',
                    },
                    '& .MuiDataGrid-columnHeaderTitleContainer': {
                      padding: '0 8px',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflowY: 'auto',
                      overflowX: 'auto',
                    },
                    '& .MuiDataGrid-main': {
                      overflow: 'visible',
                      width: '100%',
                    },
                    '& .MuiDataGrid-footerContainer': {
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    },
                  }}
                />
              </div>
            </div>
          </Box>
          
          {/* Mobile scroll indicator */}
          {isMobile && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 1,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Typography variant="caption" color="text.secondary">
                ← Swipe horizontally to view all columns →
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeList; 