package com.spring.jwt.VehicleReg.VehicleInvoice.service;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.VehicleInvoice;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface VehicleInvoiceService {
    VehicleInvoice saveInvoice(VehicleInvoice invoice);
    Optional<VehicleInvoice> getInvoiceById(Long id);
    Optional<VehicleInvoice> getInvoiceByInvoiceNumber(String invoiceNumber);
    List<VehicleInvoice> getAllInvoices();
    void deleteInvoice(Long id);
    VehicleInvoice updateInvoice(Long id, VehicleInvoice invoice);
    List<VehicleInvoice> getInvoicesByCustomerName(String customerName);
    List<VehicleInvoice> getInvoicesByVehicleNo(String vehicleNo);
    List<VehicleInvoice> getInvoicesByDate(LocalDate invoiceDate);
    VehicleInvoice patchInvoice(Long id, Map<String, Object> updates);
    List<VehicleInvoice> getInvoicesByVehicleRegId(String vehicleRegId);
    List<VehicleInvoice> getAllInvoicesWithoutDetails();
    List<VehicleInvoice> getInvoicesBetweenDates(LocalDate startDate, LocalDate endDate);
} 