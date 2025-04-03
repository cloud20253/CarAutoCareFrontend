import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Stack,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from 'Services/apiService';
import {
  Inventory,
  Category,
  PrecisionManufacturing,
  AttachMoney,
  CalendarToday,
  Numbers,
  InfoOutlined,
  Edit as EditIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

interface UserPart {
  userPartId: number;
  quantity: number;
  lastUpdate: string;
  sparePartId: number;
  partName: string;
  description: string;
  manufacturer: string;
  price: number;
  updateAt: string;
  partNumber: string;
  cGST: number;
  sGST: number;
  totalGST: number;
  buyingPrice: number;
}

interface UpdateUserPartRequestDTO {
  userPartId: number;
  partName: string;
  manufacturer: string;
  price: number;
  updateAt: string; 
  partNumber: string;
  quantity: number;
  cGST: number;
  sGST: number;
  totalGST: number;
  buyingPrice: number;
}

export default function UserPartDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userPart, setUserPart] = useState<UserPart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPartRequestDTO>({
    userPartId: 0,
    partName: '',
    manufacturer: '',
    price: 0,
    updateAt: '',
    partNumber: '',
    quantity: 0,
    cGST: 0,
    sGST: 0,
    totalGST: 0,
    buyingPrice: 0,
  });

  useEffect(() => {
    const fetchUserPart = async () => {
      try {
        const response = await apiClient.get<UserPart>(`/userParts/getById?userPartId=${id}`);
        setUserPart(response.data);
      } catch (error: any) {
        setFeedback({
          message: error.response?.data?.message || 'Failed to fetch user part details',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserPart();
  }, [id]);

  const handleEditClick = () => {
    if (userPart) {
      setFormData({
        userPartId: userPart.userPartId,
        partName: userPart.partName,
        manufacturer: userPart.manufacturer,
        price: userPart.price,
        updateAt: new Date(userPart.updateAt).toISOString().split('T')[0],
        partNumber: userPart.partNumber,
        quantity: userPart.quantity,
        cGST: userPart.cGST,
        sGST: userPart.sGST,
        totalGST: userPart.totalGST,
        buyingPrice: userPart.buyingPrice,
      });
    }
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price' ||
        name === 'quantity' ||
        name === 'cGST' ||
        name === 'sGST' ||
        name === 'totalGST' ||
        name === 'buyingPrice'
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFormData = { ...formData, updateAt: new Date().toISOString().split('T')[0] };

      const response = await apiClient.patch<UpdateUserPartRequestDTO>('/userParts/update', updatedFormData);

      if (userPart) {
        const updatedUserPart: UserPart = {
          ...userPart,
          ...response.data,
          lastUpdate: `Updated on ${new Date().toLocaleString()}`,
        };
        setUserPart(updatedUserPart);
      }
      setFeedback({ message: 'Spare part updated successfully.', severity: 'success' });
      setEditMode(false);
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || 'Update failed',
        severity: 'error',
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!userPart) return;
    setOpenDialog(false);

    try {
      await apiClient.delete(`/sparePartManagement/delete/${userPart.sparePartId}`);
      setFeedback({ message: 'Spare part deleted successfully.', severity: 'success' });
      setShowOverlay(true);

      setTimeout(() => {
        navigate('/admin/transaction-list');
      }, 2000);
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || 'Failed to delete the spare part',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          minHeight: '100vh',
          backgroundColor: theme => theme.palette.background.default,
        }}
      >
        <CircularProgress sx={{ color: theme => theme.palette.text.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.default,
        minHeight: '100vh',
        color: theme => theme.palette.text.primary,
        py: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            User Part Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            {editMode ? (
              <>
                <Button variant="contained" color="success" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick}>
                  Edit
                </Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleOpenDeleteDialog}>
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Stack>

        {userPart ? (
          editMode ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Part ID"
                  name="userPartId"
                  value={formData.userPartId}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Spare Part ID"
                  value={userPart.sparePartId}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Part Number"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Part Name"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Selling Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <AttachMoney />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Rate"
                  name="buyingPrice"
                  type="number"
                  value={formData.buyingPrice}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <AttachMoney />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CGST (%)"
                  name="cGST"
                  type="number"
                  value={formData.cGST}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SGST (%)"
                  name="sGST"
                  type="number"
                  value={formData.sGST}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Total GST (%)"
                  name="totalGST"
                  type="number"
                  value={formData.totalGST}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  label="Last Updated Date"
                  name="updateAt"
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Inventory />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Part ID:
                  </Typography>
                  <Typography>{userPart.userPartId}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Numbers />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Spare Part ID:
                  </Typography>
                  <Typography>{userPart.sparePartId}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <InfoOutlined />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Part Number:
                  </Typography>
                  <Typography>{userPart.partNumber}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Category />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Part Name:
                  </Typography>
                  <Typography>{userPart.partName}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Description:
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {userPart.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <PrecisionManufacturing />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Manufacturer:
                  </Typography>
                  <Typography>{userPart.manufacturer}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Inventory />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Quantity:
                  </Typography>
                  <Typography>{userPart.quantity}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <AttachMoney />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Selling Price:
                  </Typography>
                  <Typography>₹{userPart.price}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <AttachMoney />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Purchase Rate:
                  </Typography>
                  <Typography>₹{userPart.buyingPrice}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <InfoOutlined />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    CGST:
                  </Typography>
                  <Typography>{userPart.cGST}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <InfoOutlined />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    SGST:
                  </Typography>
                  <Typography>{userPart.sGST}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <InfoOutlined />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total GST:
                  </Typography>
                  <Typography>{userPart.totalGST}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <CalendarToday />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Last Updated:
                  </Typography>
                  <Typography>{new Date(userPart.updateAt).toLocaleDateString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <CalendarToday />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Last Update Info:
                  </Typography>
                  <Typography>{userPart.lastUpdate}</Typography>
                </Box>
              </Grid>
            </Grid>
          )
        ) : (
          <Typography variant="h6" color="error" align="center">
            No details available
          </Typography>
        )}

        <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Spare Part</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this spare part? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!feedback}
          autoHideDuration={6000}
          onClose={() => setFeedback(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {feedback ? (
            <Alert onClose={() => setFeedback(null)} severity={feedback.severity} sx={{ width: '100%' }}>
              {feedback.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </Container>

      {showOverlay && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
        >
          <Typography variant="h4" sx={{ color: '#fff' }}>
            Spare part deleted successfully.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
