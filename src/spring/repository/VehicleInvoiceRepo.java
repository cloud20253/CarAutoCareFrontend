package com.spring.jwt.VehicleReg.VehicleInvoice.repository;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.VehicleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface VehicleInvoiceRepo extends JpaRepository<VehicleInvoice, Long> {
    Optional<VehicleInvoice> findByInvoiceNumber(String invoiceNumber);
    List<VehicleInvoice> findByCustomerNameContainingIgnoreCase(String customerName);
    List<VehicleInvoice> findByVehicleNoContainingIgnoreCase(String vehicleNo);
} 