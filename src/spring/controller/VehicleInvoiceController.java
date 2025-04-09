package com.spring.jwt.VehicleReg.VehicleInvoice.controller;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.VehicleInvoice;
import com.spring.jwt.VehicleReg.VehicleInvoice.service.InvoiceSequenceService;
import com.spring.jwt.VehicleReg.VehicleInvoice.service.VehicleInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicle-invoices")
@CrossOrigin(origins = "*")
public class VehicleInvoiceController {
    
    @Autowired
    private VehicleInvoiceService vehicleInvoiceService;
    
    @Autowired
    private InvoiceSequenceService sequenceService;
    
    @PostMapping("/save")
    public ResponseEntity<VehicleInvoice> saveInvoice(@RequestBody VehicleInvoice invoice) {
        return ResponseEntity.ok(vehicleInvoiceService.saveInvoice(invoice));
    }
    
    @GetMapping
    public ResponseEntity<List<VehicleInvoice>> getAllInvoices() {
        return ResponseEntity.ok(vehicleInvoiceService.getAllInvoices());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<VehicleInvoice>> getAllInvoicesWithoutDetails() {
        return ResponseEntity.ok(vehicleInvoiceService.getAllInvoicesWithoutDetails());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleInvoice> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleInvoiceService.getInvoiceById(id).orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id)));
    }
    
    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<VehicleInvoice> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return ResponseEntity.ok(vehicleInvoiceService.getInvoiceByInvoiceNumber(invoiceNumber).orElseThrow(() -> new RuntimeException("Invoice not found with number: " + invoiceNumber)));
    }
    
    @GetMapping("/search/date")
    public ResponseEntity<List<VehicleInvoice>> getInvoicesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(vehicleInvoiceService.getInvoicesByDate(date));
    }
    
    @GetMapping("/search/vehicle-reg/{vehicleRegId}")
    public ResponseEntity<List<VehicleInvoice>> getInvoicesByVehicleRegId(@PathVariable String vehicleRegId) {
        return ResponseEntity.ok(vehicleInvoiceService.getInvoicesByVehicleRegId(vehicleRegId));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<VehicleInvoice> patchInvoice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(vehicleInvoiceService.patchInvoice(id, updates));
    }
    
    @GetMapping("/search/date-range")
    public ResponseEntity<List<VehicleInvoice>> getInvoicesBetweenDates(
            @RequestParam(required = false) String startDateStr,
            @RequestParam(required = false) String endDateStr) {
        
        // Parse dates with flexible format
        DateTimeFormatter[] formatters = {
            DateTimeFormatter.ISO_DATE,
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy")
        };
        
        LocalDate startDate = null;
        LocalDate endDate = null;
        
        // Try to parse start date
        if (startDateStr != null && !startDateStr.isEmpty()) {
            for (DateTimeFormatter formatter : formatters) {
                try {
                    startDate = LocalDate.parse(startDateStr, formatter);
                    break;
                } catch (Exception e) {
                    // Continue to next formatter
                }
            }
        }
        
        // Try to parse end date
        if (endDateStr != null && !endDateStr.isEmpty()) {
            for (DateTimeFormatter formatter : formatters) {
                try {
                    endDate = LocalDate.parse(endDateStr, formatter);
                    break;
                } catch (Exception e) {
                    // Continue to next formatter
                }
            }
        }
        
        // If dates are still null, use default values
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        return ResponseEntity.ok(vehicleInvoiceService.getInvoicesBetweenDates(startDate, endDate));
    }
} 