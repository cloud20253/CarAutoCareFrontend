import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  styled,
} from "@mui/material";

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
  };

  const handleClose = () => {
    alert("Close clicked!");
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Header>
          <Box>
            <Title>AUTO Car Care Point</Title>
            <Typography variant="body2">
              At/Post Bhubtal Nagar, Shinganapur Road, Kolki, Tal/Phaltan - 415523, Dist. Satara.
              <br />
              Contact: 9876543210 / 7359871234
              <br />
              Email: autocarepoint@gmail.com
            </Typography>
          </Box>
          <Box textAlign="right">
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mb: 1 }}>
              <Button variant="contained" size="small" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" size="small" onClick={handleClose}>
                Close
              </Button>
            </Box>
            <SubTitle>Job Card No: {jobCardNo}</SubTitle>
            <SubTitle>Technician Name: {technicianName}</SubTitle>
          </Box>
        </Header>
        <Divider />

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <LabelText>Customer Name:</LabelText>
              <ValueText>{customerName}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Contact:</LabelText>
              <ValueText>{contact}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Email:</LabelText>
              <ValueText>{email}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>GST No:</LabelText>
              <ValueText>{gstNo}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>RTO No:</LabelText>
              <ValueText>{rtoNo}</ValueText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelText>Vehicle No:</LabelText>
              <ValueText>{vehicleNo}</ValueText>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
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
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Service Booklet:</strong>{" "}
                <RadioGroup row value={serviceBooklet}>
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
                </RadioGroup>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LabelText>Fuel Level:</LabelText>
              <ValueText>{fuelLevel}</ValueText>
            </Grid>
          </Grid>
        </Box>

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

        <SectionTitle variant="body1">Terms & Conditions:</SectionTitle>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {termsAndConditions}
        </Typography>
      </Paper>
    </Box>
  );
};

export default JobCardPDF;
