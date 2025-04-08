package com.spring.jwt.VehicleReg.VehicleInvoice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "invoice_sequence")
public class InvoiceSequence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long lastInvoiceNumber = 999L; // Will start from 1000
    private Long lastJobCardNumber = 249L; // Will start from 250
    
    @Version
    private Long version; // For optimistic locking
} 