package com.spring.jwt.VehicleReg.VehicleInvoice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "vehicle_invoices")
public class VehicleInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String invoiceNumber;
    
    @Column(unique = true)
    private String jobCardNumber;
    
    private LocalDate invoiceDate;
    private String customerName;
    private String customerAddress;
    private String customerMobile;
    private String customerAadharNo;
    private String customerGstin;
    private String vehicleRegId;
    private String regNo;
    private String model;
    private String kmsDriven;
    private String vehicleNo;
    private String comments;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "invoice_id")
    @JsonManagedReference
    private List<InvoicePart> parts;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "invoice_id")
    @JsonManagedReference
    private List<InvoiceLabour> labours;
    
    private Double globalDiscount;
    private Double subTotal;
    private Double partsSubtotal;
    private Double laboursSubtotal;
    private Double totalAmount;
    private Double advanceAmount;
    private String totalInWords;
    
    @PrePersist
    public void prePersist() {
        if (invoiceDate == null) {
            invoiceDate = LocalDate.now();
        }
    }
} 