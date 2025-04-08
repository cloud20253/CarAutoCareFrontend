package com.spring.jwt.VehicleReg.VehicleInvoice.service;

import com.spring.jwt.VehicleReg.VehicleInvoice.entity.InvoiceSequence;
import com.spring.jwt.VehicleReg.VehicleInvoice.repository.InvoiceSequenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;

@Service
public class InvoiceSequenceService {

    @Autowired
    private InvoiceSequenceRepository sequenceRepository;

    @PostConstruct
    public void init() {
        // Initialize sequence if not exists
        if (sequenceRepository.count() == 0) {
            InvoiceSequence sequence = new InvoiceSequence();
            sequenceRepository.save(sequence);
        }
    }

    @Transactional
    public String getNextInvoiceNumber() {
        InvoiceSequence sequence = sequenceRepository.getSequence();
        Long nextNumber = sequence.getLastInvoiceNumber() + 1;
        sequence.setLastInvoiceNumber(nextNumber);
        sequenceRepository.save(sequence);
        return String.format("%04d", nextNumber);
    }

    @Transactional
    public String getNextJobCardNumber() {
        InvoiceSequence sequence = sequenceRepository.getSequence();
        Long nextNumber = sequence.getLastJobCardNumber() + 1;
        sequence.setLastJobCardNumber(nextNumber);
        sequenceRepository.save(sequence);
        return String.format("%04d", nextNumber);
    }
} 