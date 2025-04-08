package com.spring.jwt.VehicleReg.VehicleInvoice.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@Table(name = "invoice_labours")
public class InvoiceLabour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;     // Particulars Of Services
    private Integer quantity;       // Qty
    private Double unitPrice;       // Unit Price
    private Double discountPercent; // Discount %
    private Double discountAmount;  // Discount Amount
    private Double taxableAmount;   // Taxable Amount
    
    private Double cgstPercent;     // CGST %
    private Double cgstAmount;      // CGST Amount
    
    private Double sgstPercent;     // SGST %
    private Double sgstAmount;      // SGST Amount
    
    private Double igstPercent;     // IGST %
    private Double igstAmount;      // IGST Amount
    
    private Double totalAmount;     // Final Amount
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    @JsonBackReference
    private VehicleInvoice invoice;
    
    // Helper method to calculate all amounts
    @PrePersist
    @PreUpdate
    public void calculateAmounts() {
        // Calculate discount amount
        this.discountAmount = (this.unitPrice * this.quantity * this.discountPercent) / 100;
        
        // Calculate taxable amount (after discount)
        this.taxableAmount = (this.unitPrice * this.quantity) - this.discountAmount;
        
        // Calculate GST amounts
        this.cgstAmount = (this.taxableAmount * this.cgstPercent) / 100;
        this.sgstAmount = (this.taxableAmount * this.sgstPercent) / 100;
        this.igstAmount = (this.taxableAmount * this.igstPercent) / 100;
        
        // Calculate total amount
        this.totalAmount = this.taxableAmount + this.cgstAmount + this.sgstAmount + this.igstAmount;
    }
} 