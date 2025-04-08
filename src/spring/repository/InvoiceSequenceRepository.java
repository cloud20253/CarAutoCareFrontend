package com.spring.jwt.VehicleReg.VehicleInvoice.repository;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.InvoiceSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

@Repository
public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM InvoiceSequence s WHERE s.id = 1")
    InvoiceSequence getSequence();
} 