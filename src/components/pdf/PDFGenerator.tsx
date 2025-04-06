import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { Svg, Circle } from "@react-pdf/renderer";
// Define styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { fontSize: 12,  fontWeight: "bold" ,flexDirection: "row", justifyContent: "space-between", width: "100%", paddingBottom : "10"},
  section: { marginBottom: 10 ,flexDirection: "row", justifyContent: "space-between",borderBottom : "1 solid black" },
  customerSection: { marginBottom: 10 ,borderBottom : "1 solid black" },
  row: { flexDirection: "row", justifyContent: "space-between", borderBottom: "1 solid black", padding: 5 },
  boldText: { fontWeight: "bold" },
  terms: { marginTop: 2, fontSize: 10 },
  container : { border : "1 solid black",padding :"2" },
  signatureSection : {paddingTop : 40 ,flexDirection: "row", justifyContent: "space-between"}
});

const SelectedCircle = () => (
  <Svg height="10" width="10">
    <Circle cx="5" cy="5" r="4" fill="black" />
  </Svg>
);

const UnselectedCircle = () => (
  <Svg height="10" width="10">
    <Circle cx="5" cy="5" r="4" stroke="black" strokeWidth="1" fill="white" />
  </Svg>
);

// Sample data
const billData = {
  customerName: "John Doe",
  contact: "9876543210",
  email: "john.doe@example.com",
  vehicleModel: "Toyota Corolla 2020",
  regNo: "MH12AB1234",
  jobCardNo: "001234",
  services: [
    { description: "Oil Change", cost: "₹1,500" },
    { description: "Windshield Washer Refill", cost: "₹300" },
    { description: "Air Filter Replacement", cost: "₹800" },
  ],
};

// PDF Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      {/* <Text style={styles.header}> */}
        <View style={styles.header}>
          <Text>Job Card</Text>
          <Text>Auto Car Care Point</Text>
        </View>
      {/* </Text> */}

      <View style={styles.container}>
      {/* Customer Info */}
      <View style={styles.section}>
        <View>
            <Text style={styles.boldText}> Auto Car Care Point</Text>
            <Text>A/p:Kolki, Buvasheb Nagar, Shingnapur Road, Kolki,</Text>
            <Text>Tal:Phaltan-415523, Dist: Satara.</Text>
            <Text>Mobile: 9595054555 / 7758817766</Text>
            <Text>Email: autocarcarepoint@gmail.com</Text>
            {/* <Text>Reg No: {billData.regNo}</Text>
            <Text>Job Card No: {billData.jobCardNo}</Text> */}
        </View>
        <View>
            <Text style={styles.boldText}> Job Card No. {billData.regNo}</Text>
            <Text>Superwiser Name:{billData.regNo}</Text>
            <Text>Technician Name:{billData.regNo}</Text>
        </View>
      </View>
    
      <View style={styles.customerSection}>
          <Text style={styles.boldText}>Customer Name: {billData.customerName}</Text>
          <Text>Contact: {billData.contact}</Text>
          <Text>Email: {billData.email}</Text>
          <Text>Aadhar No.: {billData.vehicleModel}</Text>
          <Text>GSTIN: {billData.regNo}</Text>
          <Text>Model: {billData.jobCardNo}</Text>
          <Text>Date Of Vehicle Regd: {billData.jobCardNo}</Text>
          <Text>Address: {billData.jobCardNo}</Text>
          <Text>Km Driven: {billData.jobCardNo}</Text>
      </View>
        <View style={{ flexDirection: "row",  justifyContent: "space-between"}}>
          <Text> Service Booklet:</Text>
          <Text>
          {billData.jobCardNo === "001234" ? <SelectedCircle /> : <UnselectedCircle />}
             Yes
          {billData.jobCardNo === "No" ? <SelectedCircle /> : <UnselectedCircle />}
           No</Text>
           <Text>Estimated Cost Of Repairs:</Text>
        </View>
      

      {/* Service Details */}
      <View style={styles.section}>
        <Text style={styles.boldText}>Service Details:</Text>
        {billData.services.map((service, index) => (
          <View key={index} style={styles.row}>
            <Text>{service.description}</Text>
            <Text>{service.cost}</Text>
          </View>
        ))}
      </View>

      {/* Terms & Conditions */}
      <View style={styles.terms}>
        <Text style={styles.boldText}>Terms & Conditions:</Text>
        <Text>1.  I have given my car to my swatch workshop for repair, but the parts used to repair my car have no complaints, and  all expenses for the car will be billed without bargaining, I will stand by the bill.</Text>
        <Text>2. If there is any damage to my vehicle while working or parked in the garage, I will not ask for compensation or make  any complaint.</Text>
        <Text>3.I have ensured that the insurance is valid before taking my car to the workshop, which will not hold the workshop  and staff responsible for any accident while working on my car.</Text>
      </View>
      
      {/* Signatures */}
      <View style={styles.signatureSection}>
        <Text>Customer Signature: ______________</Text>
        <Text>Service Advisor Signature: ______________</Text>
      </View>

        <View>
          
        </View>

    </View>

    </Page>
  </Document>
);

// Component to download PDF
const PDFGenerator = () => (
  <div>
   <PDFDownloadLink document={<MyDocument />} fileName="AutoCarCareBill.pdf">
  {({ loading }) => <span>{loading ? "Generating PDF..." : "Download Bill PDF"}</span>}
</PDFDownloadLink>

  </div>
);

export default PDFGenerator;
