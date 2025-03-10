import * as React from "react";
import { useState, useEffect } from "react";
import apiClient from "Services/apiService";
import { FaBarcode, FaRegListAlt } from "react-icons/fa";
import {
  Grid,
  Box,
  Typography,
  Button,
  OutlinedInput,
  FormLabel,
  styled,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomizedDataGrid from "components/CustomizedDataGrid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface CreateTransaction {
  vehicleRegId?: number;
  partNumber: string;
  partName: string;
  quantity: number;
  amount: number;
  total: number;
  transactionType : string;
  billNo:number;
}

interface Feedback {
  message: string;
  severity: "success" | "error";
}

interface SparePart {
  sparePartId: number;
  partName: string;
  description: string;
  manufacturer: string;
  price: number;
  updateAt: string;
  partNumber: number;
}

const initialCreateData: CreateTransaction = {
  vehicleRegId: undefined,
  partNumber: "",
  partName: "",
  quantity: 1,
  amount: 0,
  total: 0,
  transactionType:"DEBIT",
  billNo:1
};

const AddVehiclePartService: React.FC = () => {
  const [createData, setCreateData] = useState<CreateTransaction>(initialCreateData);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [partSuggestions, setPartSuggestions] = useState<SparePart[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (createData.partName.length > 2) {
      fetchParts(createData.partName);
    }
  }, [createData.partName]);

  const fetchParts = async (query: string) => {
    try {
      const response = await apiClient.get(
        `https://carauto01-production-8b0b.up.railway.app/Filter/searchBarFilter?searchBarInput=${query}`
      );
      setPartSuggestions(response.data.list || []);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const handleCreateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSelectPart = (event: any, newValue: SparePart | null) => {
    if (newValue) {
      setCreateData((prev) => ({
        ...prev,
        partName: newValue.partName,
        partNumber: String(newValue.partNumber),
      }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const updatedData =  {
        ...createData,
        vehicleRegId: Number(id), 
        userId : 1,// Ensure conversion to number
    };
      const response = await apiClient.post("/sparePartTransactions/add", updatedData);
      const newTransaction = {
        id: rows.length + 1, // Assign unique id
        partNumber: updatedData.partNumber,
        partName: updatedData.partName,
        quantity: updatedData.quantity,
        amount: updatedData.amount,
        total: updatedData.total,
        transactionType: updatedData.transactionType,
        vehicleRegId: updatedData.vehicleRegId,
      };
  
      setRows((prevRows) => [...prevRows, newTransaction]); // Append new record
      setFeedback({
        message: response.data.message || "Transaction created successfully",
        severity: "success",
      });
      setCreateData(initialCreateData);
    } catch (error: any) {
      setFeedback({
        message: error.response?.data?.message || "Failed to create transaction",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback(null);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "partNumber", headerName: "Part Number", width: 150 },
    { field: "partName", headerName: "Part Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "total", headerName: "Total", width: 150 },
    { field: "transactionType", headerName: "Type", width: 120 },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h6">
          Add Vehicle Service Parts
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      <form onSubmit={handleCreateSubmit}>
        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partName">
              <FaBarcode style={{ marginRight: 8, verticalAlign: "middle" }} />
              Part Name
            </FormLabel>
            <Autocomplete
              options={partSuggestions}
              getOptionLabel={(option) => option.partName}
              value={partSuggestions.find((part) => part.partName === createData.partName) || null}
              onChange={handleSelectPart}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="partName"
                  value={createData.partName}
                  onChange={handleCreateChange}
                  placeholder="Enter Part Name"
                  size="small"
                  required
                />
              )}
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="partNumber">
              <FaBarcode style={{ marginRight: 8, verticalAlign: "middle" }} />
              Part Number
            </FormLabel>
            <OutlinedInput
              name="partNumber"
              value={createData.partNumber}
              onChange={handleCreateChange}
              placeholder="Auto-filled Part Number"
              size="small"
              required
              disabled
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="quantity">
              <FaRegListAlt style={{ marginRight: 8, verticalAlign: "middle" }} />
              Quantity
            </FormLabel>
            <OutlinedInput
              name="quantity"
              value={createData.quantity}
              onChange={handleCreateChange}
              type="number"
              size="small"
              required
              inputProps={{ min: 1 }}
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Transaction
            </Button>
          </FormGrid>
        </Grid>
      </form>
            {/* {rows.length !==0 ? ( */}

                <FormGrid container spacing={2} columns={12} mt={4}>
                <FormGrid >
                  <CustomizedDataGrid columns ={columns} rows={rows}  />
                </FormGrid>
              </FormGrid>
    {/* ) : <></>} */}

      {/* <Snackbar open={!!feedback} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        {feedback && (
          <Alert onClose={handleCloseSnackbar} severity={feedback.severity} sx={{ width: "100%" }}>
            {feedback.message}
          </Alert>
        )}
      </Snackbar> */}
    </Box>
  );
};

export default AddVehiclePartService;
