package com.spring.jwt.VehicleReg.VehicleInvoice.repository;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.VehicleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleInvoiceRepository extends JpaRepository<VehicleInvoice, Long> {
    Optional<VehicleInvoice> findByInvoiceNumber(String invoiceNumber);
    List<VehicleInvoice> findByCustomerNameContainingIgnoreCase(String customerName);
    List<VehicleInvoice> findByVehicleNoContainingIgnoreCase(String vehicleNo);
    List<VehicleInvoice> findByInvoiceDate(LocalDate invoiceDate);
    List<VehicleInvoice> findByVehicleRegId(String vehicleRegId);
    
    @Query("SELECT DISTINCT v FROM VehicleInvoice v LEFT JOIN FETCH v.parts WHERE v.id = :id")
    Optional<VehicleInvoice> findByIdWithParts(@Param("id") Long id);
    
    @Query("SELECT DISTINCT v FROM VehicleInvoice v LEFT JOIN FETCH v.labours WHERE v.id = :id")
    Optional<VehicleInvoice> findByIdWithLabours(@Param("id") Long id);
    
    @Query("SELECT DISTINCT v FROM VehicleInvoice v")
    List<VehicleInvoice> findAllWithoutDetails();
    
    @Query("SELECT DISTINCT v FROM VehicleInvoice v WHERE v.invoiceDate >= :startDate AND v.invoiceDate < :endDate ORDER BY v.invoiceDate DESC")
    List<VehicleInvoice> findByInvoiceDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Debug query to check all dates
    @Query("SELECT DISTINCT v.invoiceDate FROM VehicleInvoice v ORDER BY v.invoiceDate")
    List<LocalDate> findAllInvoiceDates();
} 