import React, { FC, useRef } from "react";
import  { useState, useEffect } from "react";

import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,TextField,
  FormControl,
  FormLabel,FormGroup,Checkbox,
  styled,
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "1.1rem",
}));

const SubTitle = styled(Typography)(() => ({
  fontSize: "0.95rem",
  fontWeight: 600,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
  textDecoration: "underline",
}));

const LabelText = styled(Typography)(() => ({
  fontWeight: 500,
  display: "inline-block",
  minWidth: 100,
}));

const ValueText = styled(Typography)(() => ({
  display: "inline-block",
  marginLeft: 6,
}));

const JobCardPDF: React.FC = () => {
  const jobCardNo = 0;
  const customerName = "null";
  const contact = "null";
  const email = "null";
  const gstNo = "null";
  const rtoNo = "null";
  const vehicleNo = "null";
  const technicianName = "null";
  const oilType = "null";
  const coolant = "null";
  const ramLock = "null";
  const documentReq = "null";
  const serviceBooklet = "No";
  const fuelLevel = "Full Level";
  const costOfRepairs = "Estimated Cost";
  const washType = "Exterior Wash";
  const tyreAir = "Yes";
  const interiorWash = "Yes";
  const termsAndConditions =
    "I do agree the owner is any scratch, workshop for repair, but the parts need to repair or any can be chargeable...";

  const handleSave = () => {
    alert("Save clicked!");
    generatePDF();
  };

  const handleClose = () => {
    alert("Close clicked!");
  };

  const [jobCardDetails, setJobCardDetails] = useState<any | null>(null); // Use appropriate type instead of 'any'
  const [vehicledata, setVehicleData] = useState<any | null>(null); // Use appropriate type instead of 'any'

  const storedJobCardDetails = localStorage.getItem("jobCardDetails");


  const invoiceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const storedJobCardDetails = localStorage.getItem("jobCardDetails");
    const storedVehicleDataDetails = localStorage.getItem("vehicleData");

    if (storedJobCardDetails) {
      setJobCardDetails(JSON.parse(storedJobCardDetails));
    }
    if (storedVehicleDataDetails) {
      setVehicleData(JSON.parse(storedVehicleDataDetails));
    }
  }, []);

  // Check if jobCardDetails is null and display a loading message
  if (!jobCardDetails || !vehicledata ) {
    return <div>Loading job card details...</div>; // Or any other loading state
  }
  const generatePDF = async () => {
    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) {
      console.error("Invoice element not found!");
      return;
    }

    const options = { scale: 2 };
    const canvas = await html2canvas(invoiceElement, options as any);
    const imgData = canvas.toDataURL("image/png", 0.7);

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalHeight = imgHeight;
    let scaleFactor = 1;

    if (finalHeight > pageHeight) {
      scaleFactor = pageHeight / imgHeight;
      finalHeight = pageHeight;
    }

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true, // Enable compression
    });
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
    pdf.save("invoice.pdf");
  };

  return (
    <Box ref={invoiceRef} sx={{ width: "100%", p: 2 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Header>
          <Box>
            <Title>AUTO Car Care Point</Title>
            <Typography variant="body2">
              At/Post Bhubtal Nagar, Shinganapur Road, Kolki, Tal/Phaltan -
              415523, Dist. Satara.
              <br />
              Contact: 9876543210 / 7359871234
              <br />
              Email: autocarepoint@gmail.com
            </Typography>
          </Box>
          <Box textAlign="right">
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <Button variant="contained" size="small" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" size="small" onClick={generatePDF}>
                Print
              </Button>
            </Box>
            <SubTitle sx={{
                          
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}>Job Card No: {jobCardDetails.vehicleJobCardId || "N/A"}</SubTitle>
            <SubTitle>Superwiser Name: {vehicledata.superwiser || "N/A"}</SubTitle>

            <SubTitle>Technician Name: {vehicledata.technician || "N/A"}</SubTitle>
          </Box>
        </Header>
        <Divider />

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <LabelText>Customer Name:</LabelText>
              <ValueText>{jobCardDetails?.customerName || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Contact:</LabelText>
              <ValueText>{vehicledata?.customerMobileNumber || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Adhar NO:</LabelText>
              <ValueText>{vehicledata?.customerAadharNo || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Address:</LabelText>
              <ValueText>{vehicledata?.customerAddress || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Email:</LabelText>
              <ValueText>{vehicledata?.email || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>GST No:</LabelText>
              <ValueText>{vehicledata?.customerGstin || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Model:</LabelText>
              <ValueText>{vehicledata?.vehicleModelName || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Vehicle No:</LabelText>
              <ValueText>{vehicledata?.vehicleNumber || "N/A"}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Kms Driven:</LabelText>
              <ValueText>{vehicledata?.kmsDriven || "N/A"}</ValueText>
            </Grid>
          </Grid>
        </Box>

        {/* <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <LabelText>Oil Type:</LabelText>
              <ValueText>{oilType}</ValueText>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LabelText>Coolant:</LabelText>
              <ValueText>{coolant}</ValueText>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LabelText>Ram Lock:</LabelText>
              <ValueText>{ramLock}</ValueText>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LabelText>Document Req:</LabelText>
              <ValueText>{documentReq}</ValueText>
            </Grid>
          </Grid>
        </Box> */}
        <Divider />



        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <FormControl>
                <RadioGroup
                  row
                  value={serviceBooklet}
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <Box>
                    <Box display="flex" alignItems="center">
                      <FormLabel
                        sx={{
                          marginTop: 2,
                          marginRight: 2,
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}
                      >
                        {" "}
                        Service Booklet :
                      </FormLabel>

                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" />}
                        label="Yes"
                        disabled
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" />}
                        label="No"
                        disabled
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center">
                      <FormLabel
                        sx={{
                          marginTop: 2,
                          marginRight: 2,
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}
                      >
                        {" "}
                        Rim Lock :
                      </FormLabel>

                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" />}
                        label="Yes"
                        disabled
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" />}
                        label="No"
                        disabled
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center">
                      <FormLabel
                        sx={{
                          marginTop: 2,
                          marginRight: 2,
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}
                      >
                        {" "}
                        Document Reg.Papers:
                      </FormLabel>

                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" />}
                        label="Yes"
                        disabled
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" />}
                        label="No"
                        disabled
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center">
                      <FormLabel
                        sx={{
                          marginTop: 2,
                          marginRight: 2,
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}
                      >
                        {" "}
                        Tool Kit:
                      </FormLabel>

                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" />}
                        label="Yes"
                        disabled
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" />}
                        label="No"
                        disabled
                      />
                    </Box>
                  </Box>
                </RadioGroup>

                <LabelText  sx={{
                          marginTop: 2,
                          marginRight: 2,
                          fontWeight: "bold", // Make text bold
                          color: "text.primary",
                        }}>Fuel Level:  <ValueText>{fuelLevel}</ValueText></LabelText>
               
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
             

              <Box sx={{ mt: 2 }}>
          <LabelText>Estimated Cost Of Repairs:</LabelText>
          <ValueText>{costOfRepairs}</ValueText>
          <br />
          <LabelText>Wash Type:</LabelText>
          <ValueText>{washType}</ValueText>
          <br />
          <LabelText>Tyre Air:</LabelText>
          <ValueText>{tyreAir}</ValueText>
          <br />
          <LabelText>Interior Wash:</LabelText>
          <ValueText>{interiorWash}</ValueText>
        </Box>

            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ width: '100%', backgroundColor: 'black', height: 2, marginY: 2 }} />


        <SectionTitle variant="body1">Terms & Conditions:</SectionTitle>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {termsAndConditions}
        </Typography>
        <Box
      display="flex"
      justifyContent="space-between" // Space between to push items to the edges
      alignItems="center" // Center items vertically
      padding={2} // Optional padding
      marginTop={4}
      width="100%" // Full width of the container
   
    >
      <Typography variant="h6"> Customer Signature / Thumb</Typography>
      <Typography variant="h6"> Service Advisor Signature</Typography>

    </Box>

    <Divider sx={{ width: '100%', backgroundColor: 'black', height: 2, marginY: 2 }} />


{/* //****** */}
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="end"
          control={<Checkbox />}
          label="Paid Service/Running Repair"
          labelPlacement="end"
        />
          <FormControlLabel
          value="end"
          control={<Checkbox />}
          label="Body Shop/Paint"
          labelPlacement="end"
        />
          <FormControlLabel
          value="end"
          control={<Checkbox />}
          label=" A.C/Accessories"
          labelPlacement="end"
        />
          <FormControlLabel
          value="end"
          control={<Checkbox />}
          label="Car Detailing"
          labelPlacement="end"
        />
      </FormGroup>
    </FormControl>
    <Divider sx={{ width: '100%', backgroundColor: 'black', height: 2, marginY: 2 }} />

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell align="left" sx={{ color: '#333',fontWeight : 'bold' }}>Sr No</TableCell>
            <TableCell align="left" sx={{ color: '#333',fontWeight : 'bold' }}> Customer Complaint/ Work Desc.</TableCell>
            <TableCell align="left" sx={{ color: '#333',fontWeight : 'bold' }}>Actual Workshop Finding</TableCell>
            <TableCell align="left" sx={{ color: '#333',fontWeight : 'bold' }}>Action Taken</TableCell>
            <TableCell align="left" sx={{ color: '#333',fontWeight : 'bold' }}>Cost Of Part & Labour</TableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
    </TableContainer>


    <Divider sx={{ width: '100%', backgroundColor: 'black', height: 2, marginY: 2 }} />



    {/* ****************** */}

    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
      Workshop Note:
      </Typography>
    
    </Box>

    <Divider sx={{ width: '100%', backgroundColor: 'black', height: 2, marginY: 2 }} />

    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
       Note:
      </Typography>
    
      <Box
      display="flex"
      justifyContent="space-between" // Space between to push items to the edges
      alignItems="center" // Center items vertically
      padding={2} // Optional padding
      marginTop={4}
      width="100%" // Full width of the container
      >
      <Typography variant="h6"> Customer Signature / Thumb</Typography>
      <Typography variant="h6"> Service Advisor Signature</Typography>

    </Box>

    </Box>

      </Paper>
    </Box>
  );
};

export default JobCardPDF;
