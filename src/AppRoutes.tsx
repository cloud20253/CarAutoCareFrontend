import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignInSide";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import AdminHeader from "pages/AdminHeader";
import Dashboard from "pages/Dashboard";
import ManageUsers from "pages/ManageUsers";
import WebHeader from "pages/Headers";
import MyAddSparePart from "pages/MyAddSparePart";
import SparePart from "pages/SparePart";
import EditSparePart from "pages/EditSparePart";
import BookAppointment from "pages/BookAppointment";
import SparePartDetails from "pages/SparePartDetails";
import VehicleRegistration from "pages/VehicleRegistraction";
import VehicleReg from 'pages/vehiclereg';
import VehicleById from 'pages/VehicleById';
import VehicleByDate from 'pages/vechiclebydate';
import Vehiclestatus from 'pages/vechiclestatus';
import VehicleByAppointmentId from 'pages/VehicleByAppointmentId';
import ManageRepairPage from "components/RepairsComponent/ManageRepairPage";
import VehicleList from "components/vehicle/VehicleList";
import QuatationList from "components/Quatation/QuatationList";

import AddVehicle from "components/vehicle/AddVehicle";
import TransactionAdd from "pages/TransactionManagement/TransactionAdd";
import TransactionAll from "pages/TransactionManagement/TransactionAll";
import AddVehiclePartService from "components/vehicle/AddVehiclePartService";
import QuatationGrid from "components/Quatation/QuatationGrid";

import StockManageGrid from "components/StockManagement/StockManageGrid";
import TransactionList from "components/StockManagement/TransactionList";
import VehicleDetailsView from "components/vehicle/VehicleDetailsView";
import InvoiceForm from "components/vehicle/InvoiceForm";
import BillForm from "components/vehicle/BillForm";
import AddNewQuotation from "components/Quatation/QutationForm";
import TransactionDetails from "components/StockManagement/TransactionDetails";
import CounterSaleForm from "components/StockManagement/CounterSaleForm";
import CounterBillPDF from "components/StockManagement/CounterBillPDF";
import SupplierListPage from "components/Vendor/SupplierListPage";
import AddNewSupplierPage from "components/Vendor/VendorManagementPage";
import VendorUpdatePage from "components/Vendor/VendorUpdatePage";
import InvoiceList from "components/StockManagement/InvoiceList";
import InvoiceEditForm from "components/StockManagement/InvoiceEditForm";
import AppointmentList from "components/Appointments/AppointmentList";
import JobCard from "components/vehicle/jobCard";
import EditJobOptionForm from "components/JobCard/EditJobOptionForm";
import JobCardGrid from "components/JobCard/JobCardsGrid";
import JobOptionForm from "components/JobCard/JobOptionForm";
import JobCardList from "components/JobCard/JobCardList";
import ManageServiceGrid from "components/ManageServices/ManageServiceGrid";
import AddService from "components/ManageServices/AddService";
import GetAllServices from "components/ManageServices/GetAllServices";
import EditService from "components/ManageServices/EditServices";
import JobCardPDF from "components/vehicle/jobcardpdf";
import InvoiceTable from "components/vehicle/ServiceTab";
import ServiceTab from "components/vehicle/ServiceTab";
import QuatationServiceTab from "components/Quatation/QuatationServiceTab";
import SpareTab from "components/Quatation/SpareTab";

import VendorManagementGrid from "components/Vendor/VendorManagementGrid";
// import InvoiceDetailsWrapper from "pages/TransactionManagement/InvoiceDetailsWrapper";
import InvoicePDFGenerator from "components/vehicle/InvoicePDFGenerator";
import QuatationPDFGeneration from "components/Quatation/QuatationPDFGeneration";
import QuatationEdit from "components/Quatation/QuatationEdit";



const AppRoutes = () => {
    return(
        <>
        <Routes>
            <Route path="*" element={<h2>404 Page Not Found</h2>} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user/reset-password" element={<ResetPassword/>} />
            <Route element={<WebHeader />} >
            <Route path="/" element = {<Home/>} />
            <Route path="/add-part" element={<MyAddSparePart />} /> 
            <Route path="/getAll" element={<SparePart />} /> 
            <Route path="/supplier/add" element={<AddNewSupplierPage />} /> 
            <Route path="/supplier/update/:vendorId" element={<VendorUpdatePage />} />
            
            <Route path="/spare-part/:id" element={<SparePartDetails />} /> 
            <Route path="/book-service" element={<BookAppointment />} /> 
            <Route path="/edit-spare-part/:id" element={<EditSparePart />} />
            <Route path="/vehicle-registration" element={<VehicleRegistration />} />
            <Route path="/vehicle-regi" element={<VehicleReg />} />
            <Route path="/vehicle-by-id" element={<VehicleById />} />
            <Route path="/vehicle-by-date-range" element={<VehicleByDate />} />
            <Route path="/Vehiclestatus" element={<Vehiclestatus />} />
            <Route path="/VehicleByAppointmentId" element={<VehicleByAppointmentId />} />
            
            </Route>
            <Route path="/admin/*" element={<AdminHeader />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointmentList" element={<AppointmentList />} />
                <Route path="jobCardgrid" element={<JobCardGrid />} />
                <Route path="manageVendor" element={<VendorManagementGrid />} />
                <Route path="billForm/:id" element={<InvoiceForm />} />
                <Route path="jobcardpdf" element={<JobCardPDF />} />
                <Route path="invoicepdfgenerator" element={<InvoicePDFGenerator />} />
                <Route path="quatationpdfgenerator/:id" element={<QuatationPDFGeneration />} />


                <Route path="ServiceTable" element={<InvoiceTable />} />
                <Route path="serviceManage" element={<AddService />} />
                <Route path="invoice/edit" element={<InvoiceEditForm />} />
                <Route path="vendorManagement" element={<SupplierListPage />} />
                <Route path="counterbillPdf" element={<CounterBillPDF />} />
                <Route path="counterSale" element={<CounterSaleForm />} />
                <Route path="counterSale/:invoiceNumber" element={<CounterSaleForm />} />
                <Route path="transaction" element={<TransactionAdd />} /> 
                <Route path="manage-repair" element={<ManageRepairPage />} />
                <Route path="manageService" element={<GetAllServices />} />
                <Route path="manage-stock" element={<StockManageGrid />} />
                <Route path="editJob/:id" element={<EditJobOptionForm />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="bill" element={<BillForm />} />
                <Route path="invoiceList" element={<InvoiceList />} />
                <Route path="transaction-list" element={<TransactionList />} /> 
                <Route path="user-part/view/:id" element={<TransactionDetails />} />
                <Route path="vehicle" element={<VehicleList />} />
                <Route path="quatationlist" element={<QuatationList />} />

                <Route path="editService/:id" element={<EditService />} />
                <Route path="vehicle/add" element={<AddVehicle/>} />
                <Route path="jobcards/add" element={<JobOptionForm />} />
                <Route path="job-card/:id" element={<JobCard/>} />
              

                <Route path="quatation" element={<AddNewQuotation />} />
                <Route path="quationserviceTab/:vehicleId" element={<QuatationServiceTab />} />

                <Route path="serviceTab/:vehicleId" element={<ServiceTab />} />
                <Route path="spareTab/:vehicleId" element={<SpareTab />} />
                <Route path="quotation/edit/:id" element={<QuatationEdit/>} />

                <Route path="vehicle/edit/:id" element={<AddVehicle/>} />
                <Route path="vehicle/view/:id" element={<VehicleDetailsView/>} />
                <Route path="vehicle/add/sparepart/:id" element={<QuatationGrid/>} />

                <Route path="vehicle/add/servicepart/:id" element={<AddVehiclePartService/>} />
                <Route path="vehicle/details/:id" element={<AddVehicle/>} />
                <Route path="jobcard/manage" element={<JobCardList/>} />
                <Route path="services" element={<ManageServiceGrid/>} />
                <Route path="spare-part/transaction/add" element={<TransactionAdd />} />
                <Route path="spare-part/transaction/list" element={<TransactionAll />} />

            </Route>
        </Routes>
        </>
    )
}

export default AppRoutes;
