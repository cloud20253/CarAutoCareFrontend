import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Button,
  Tooltip,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  Divider,
  useTheme,
  alpha,
  Grid,
  useMediaQuery,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridColumnHeaderParams,
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import apiClient from 'Services/apiService';

interface UserPart {
  userPartId: number;
  partNumber: string;
  partName: string;
  manufacturer: string;
  quantity: number;
  price: number;
  buyingPrice: number;
  description: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

const UserPartList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [lowStockCount, setLowStockCount] = useState<number>(0);

  const fetchAllUserParts = async (): Promise<any[]> => {
    setLoading(true);
    try {
      // Get first page to determine total number of pages
      const firstPage = await apiClient.get<PaginatedResponse<UserPart>>('/userParts/getAll', {
        params: { page: 0, size: 50 },
      });
      
      let allParts = [...firstPage.data.content];
      const pages = firstPage.data.totalPages;
      
      // Fetch all remaining pages if there are more
      for (let i = 1; i < pages; i++) {
        const pageData = await apiClient.get<PaginatedResponse<UserPart>>('/userParts/getAll', {
          params: { page: i, size: 50 },
        });
        allParts = allParts.concat(pageData.data.content);
      }
      
      const formattedRows = allParts.map((p) => ({
        id: p.userPartId,
        partNumber: p.partNumber,
        partName: p.partName,
        description: p.description,
        manufacturer: p.manufacturer,
        quantity: p.quantity,
        price: p.price,
        buyingPrice: p.buyingPrice,
      }));
      
      // Count low stock items
      const lowStock = formattedRows.filter(item => item.quantity < 2).length;
      setLowStockCount(lowStock);
      setTotalElements(formattedRows.length);
      
      return formattedRows;
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || 'Failed to fetch all user parts',
        severity: 'error',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllUserParts();
      setRows(data);
    };
    
    loadData();
  }, []);

  const handleSearchClick = async () => {
    if (!searchText.trim()) {
      const data = await fetchAllUserParts();
      setRows(data);
      return;
    }
    
    const allRows = await fetchAllUserParts();
    const search = searchText.toLowerCase();
    const filtered = allRows.filter((row) => {
      return (
        row.partNumber.toLowerCase().includes(search) ||
        row.partName.toLowerCase().includes(search) ||
        row.description.toLowerCase().includes(search) ||
        row.manufacturer.toLowerCase().includes(search) ||
        row.quantity.toString().toLowerCase().includes(search) ||
        row.price.toString().toLowerCase().includes(search) ||
        (row.updateAt && row.updateAt.toLowerCase().includes(search))
      );
    });
    
    // Count low stock items in filtered results
    const lowStock = filtered.filter(item => item.quantity < 2).length;
    setLowStockCount(lowStock);
    
    setRows(filtered);
    setTotalElements(filtered.length);
  };

  // Custom header renderer to handle mobile view with line breaks
  const renderHeaderWithTooltip = (params: GridColumnHeaderParams) => {
    const headerName = params.colDef.headerName || '';
    
    // For mobile view, add break for multi-word headers
    if (isMobile && headerName.includes(' ')) {
      const words = headerName.split(' ');
      
      return (
        <Tooltip title={headerName}>
          <Box sx={{ lineHeight: 1.1, textAlign: 'center' }}>
            {words.map((word, index) => (
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

  // Define columns - all columns are visible on all screen sizes
  const getColumns = (): GridColDef[] => {
    const columns: GridColDef[] = [
      {
        field: 'view',
        headerName: '',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params: GridCellParams) => (
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => navigate(`/admin/user-part/view/${params.row.id}`)}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
                m: 'auto',
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
        renderHeader: () => null,
      },
      {
        field: 'id',
        headerName: 'ID',
        width: 60,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
      },
      {
        field: 'partNumber',
        headerName: isMobile ? 'Part Num' : 'Part Number',
        width: 110,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
      },
      {
        field: 'partName',
        headerName: isMobile ? 'Name' : 'Part Name',
        width: 130,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
      },
      {
        field: 'quantity',
        headerName: 'Qty',
        width: 80,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
        renderCell: (params: GridCellParams) => {
          const quantity = Number(params.value);
          const isLowStock = quantity < 2;
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: isLowStock ? theme.palette.error.main : 'inherit',
              fontWeight: isLowStock ? 'bold' : 'normal',
            }}>
              {isLowStock && (
                <Tooltip title="Low Stock">
                  <WarningIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                </Tooltip>
              )}
              {quantity}
            </Box>
          );
        },
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 90,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
        renderCell: (params: GridCellParams) => {
          const price = Number(params.value);
          return (
            <Typography variant="body2">
              {'₹' + price.toString()}
            </Typography>
          );
        },
      },
      {
        field: 'manufacturer',
        headerName: isMobile ? 'Manufacturer' : 'Manufacturer',
        width: 110,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 150,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
      },
      {
        field: 'buyingPrice',
        headerName: isMobile ? 'Buy Price' : 'Purchase Rate',
        width: 100,
        sortable: false,
        renderHeader: renderHeaderWithTooltip,
        renderCell: (params: GridCellParams) => {
          const buyingPrice = Number(params.value);
          return (
            <Typography variant="body2">
              {'₹' + buyingPrice.toString()}
            </Typography>
          );
        },
      },
    ];

    return columns;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mx: 'auto', maxWidth: '600px' }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h1" 
              fontWeight="bold" 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
            >
              <InventoryIcon color="primary" />
              Parts Inventory
            </Typography>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary">
                Manage your parts inventory and track stock levels
              </Typography>
            )}
          </Box>
        </Box>
        
        <CardContent sx={{ p: 0 }}>
          {/* Summary Cards */}
          <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={6} sm={6} md={4} lg={3}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: 2, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">Total Parts</Typography>
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="primary.main" sx={{ mt: 1 }}>
                    {totalElements}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={6} sm={6} md={4} lg={3}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: 2, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                  }}
                >
                  <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">Low Stock Items</Typography>
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="error.main" sx={{ mt: 1 }}>
                    {lowStockCount}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          {/* Search Box */}
          <Box sx={{ px: { xs: 1.5, sm: 3 }, pb: { xs: 1.5, sm: 2 } }}>
            <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"}>
              <OutlinedInput
                placeholder={isMobile ? "Search parts..." : "Search by part number, name, manufacturer or description..."}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleSearchClick} 
                      variant="contained" 
                      size="small"
                      sx={{ borderRadius: 1.5 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              />
            </FormControl>
          </Box>

          {/* Data Grid */}
          <Box 
            sx={{ 
              px: { xs: 1.5, sm: 3 }, 
              pb: { xs: 1.5, sm: 3 },
            }}
          >
            <Box
              sx={{
                width: '100%', 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                overflowX: 'auto',
              }}
            >
              <div style={{ 
                minWidth: isMobile ? 900 : 'auto', 
                width: '100%',
              }}>
                <DataGrid
                  rows={rows}
                  columns={getColumns()}
                  loading={loading}
                  autoHeight
                  disableRowSelectionOnClick
                  hideFooter
                  disableColumnMenu
                  disableColumnSorting
                  getRowClassName={(params) =>
                    params.row.quantity < 2 ? 'low-stock' : ''
                  }
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderBottom: `1px solid ${theme.palette.divider}`,
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
                    '& .MuiDataGrid-cell': {
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      fontSize: isMobile ? '0.75rem' : 'inherit',
                      padding: isMobile ? '0 4px' : 'inherit',
                    },
                    '& .MuiDataGrid-row': {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    },
                    '& .low-stock': {
                      backgroundColor: alpha(theme.palette.error.main, 0.08),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.12),
                      },
                    },
                  }}
                />
              </div>
            </Box>
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
          
          {/* Results count indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderTop: `1px solid ${theme.palette.divider}`,
              p: { xs: 1.5, sm: 2 },
            }}
          >
            <Chip 
              label={`Showing ${rows.length} items`} 
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ minWidth: '120px', justifyContent: 'center' }}
            />
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert 
            onClose={() => setFeedback(null)} 
            severity={feedback.severity} 
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default UserPartList;

