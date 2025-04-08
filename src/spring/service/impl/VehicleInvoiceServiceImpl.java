package com.spring.jwt.VehicleReg.VehicleInvoice.service.impl;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.VehicleInvoice;
import com.spring.jwt.VehicleReg.VehicleInvoice.repository.VehicleInvoiceRepository;
import com.spring.jwt.VehicleReg.VehicleInvoice.service.VehicleInvoiceService;
import com.spring.jwt.VehicleReg.VehicleInvoice.service.InvoiceSequenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class VehicleInvoiceServiceImpl implements VehicleInvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(VehicleInvoiceServiceImpl.class);

    @Autowired
    private VehicleInvoiceRepository vehicleInvoiceRepository;

    @Autowired
    private InvoiceSequenceService sequenceService;

    @Override
    public VehicleInvoice saveInvoice(VehicleInvoice invoice) {
        // Generate invoice and job card numbers
        if (invoice.getInvoiceNumber() == null) {
            invoice.setInvoiceNumber(sequenceService.getNextInvoiceNumber());
        }
        if (invoice.getJobCardNumber() == null) {
            invoice.setJobCardNumber(sequenceService.getNextJobCardNumber());
        }
        return vehicleInvoiceRepository.save(invoice);
    }

    @Override
    @Transactional
    public Optional<VehicleInvoice> getInvoiceById(Long id) {
        Optional<VehicleInvoice> invoiceOpt = vehicleInvoiceRepository.findById(id);
        if (invoiceOpt.isPresent()) {
            VehicleInvoice invoice = invoiceOpt.get();
            
            // Fetch parts and labours separately
            VehicleInvoice invoiceWithParts = vehicleInvoiceRepository.findByIdWithParts(id).orElse(invoice);
            VehicleInvoice invoiceWithLabours = vehicleInvoiceRepository.findByIdWithLabours(id).orElse(invoice);
            
            invoice.setParts(invoiceWithParts.getParts());
            invoice.setLabours(invoiceWithLabours.getLabours());
            
            return Optional.of(invoice);
        }
        return Optional.empty();
    }

    @Override
    public Optional<VehicleInvoice> getInvoiceByInvoiceNumber(String invoiceNumber) {
        return vehicleInvoiceRepository.findByInvoiceNumber(invoiceNumber);
    }

    @Override
    public List<VehicleInvoice> getAllInvoices() {
        return vehicleInvoiceRepository.findAll();
    }

    @Override
    public void deleteInvoice(Long id) {
        vehicleInvoiceRepository.deleteById(id);
    }

    @Override
    public VehicleInvoice updateInvoice(Long id, VehicleInvoice invoice) {
        Optional<VehicleInvoice> existingInvoice = vehicleInvoiceRepository.findById(id);
        if (existingInvoice.isPresent()) {
            // Preserve the original invoice and job card numbers
            invoice.setId(id);
            invoice.setInvoiceNumber(existingInvoice.get().getInvoiceNumber());
            invoice.setJobCardNumber(existingInvoice.get().getJobCardNumber());
            return vehicleInvoiceRepository.save(invoice);
        }
        throw new RuntimeException("Invoice not found with id: " + id);
    }

    @Override
    public List<VehicleInvoice> getInvoicesByCustomerName(String customerName) {
        return vehicleInvoiceRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    @Override
    public List<VehicleInvoice> getInvoicesByVehicleNo(String vehicleNo) {
        return vehicleInvoiceRepository.findByVehicleNoContainingIgnoreCase(vehicleNo);
    }
    
    @Override
    public List<VehicleInvoice> getInvoicesByDate(LocalDate invoiceDate) {
        return vehicleInvoiceRepository.findByInvoiceDate(invoiceDate);
    }
    
    @Override
    public List<VehicleInvoice> getInvoicesByVehicleRegId(String vehicleRegId) {
        return vehicleInvoiceRepository.findByVehicleRegId(vehicleRegId);
    }
    
    @Override
    public VehicleInvoice patchInvoice(Long id, Map<String, Object> updates) {
        VehicleInvoice invoice = getInvoiceById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        
        updates.forEach((key, value) -> {
            switch (key) {
                case "customerName":
                    invoice.setCustomerName((String) value);
                    break;
                case "customerAddress":
                    invoice.setCustomerAddress((String) value);
                    break;
                case "customerMobile":
                    invoice.setCustomerMobile((String) value);
                    break;
                case "customerAadharNo":
                    invoice.setCustomerAadharNo((String) value);
                    break;
                case "customerGstin":
                    invoice.setCustomerGstin((String) value);
                    break;
                case "vehicleNo":
                    invoice.setVehicleNo((String) value);
                    break;
                case "comments":
                    invoice.setComments((String) value);
                    break;
                case "globalDiscount":
                    invoice.setGlobalDiscount((Double) value);
                    break;
                case "advanceAmount":
                    invoice.setAdvanceAmount((Double) value);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid field: " + key);
            }
        });
        return vehicleInvoiceRepository.save(invoice);
    }

    @Override
    public List<VehicleInvoice> getAllInvoicesWithoutDetails() {
        return vehicleInvoiceRepository.findAllWithoutDetails();
    }

    @Override
    @Transactional
    public List<VehicleInvoice> getInvoicesBetweenDates(LocalDate startDate, LocalDate endDate) {
        logger.info("Searching invoices between dates: {} and {}", startDate, endDate);
        
        // Log all available dates for debugging
        List<LocalDate> allDates = vehicleInvoiceRepository.findAllInvoiceDates();
        logger.info("Available invoice dates in database: {}", allDates);
        
        // Set end date to include the entire day
        endDate = endDate.plusDays(1);
        
        List<VehicleInvoice> invoices = vehicleInvoiceRepository.findByInvoiceDateBetween(startDate, endDate);
        logger.info("Found {} invoices between dates", invoices.size());
        
        // Fetch parts and labours for each invoice
        invoices.forEach(invoice -> {
            VehicleInvoice invoiceWithParts = vehicleInvoiceRepository.findByIdWithParts(invoice.getId()).orElse(invoice);
            VehicleInvoice invoiceWithLabours = vehicleInvoiceRepository.findByIdWithLabours(invoice.getId()).orElse(invoice);
            
            invoice.setParts(invoiceWithParts.getParts());
            invoice.setLabours(invoiceWithLabours.getLabours());
        });
        
        return invoices;
    }
} 