package com.bank.core_banking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {

    private String sourceCbu;      // Desde dónde pago
    private String destinationCbu; // A quién le pago
    private BigDecimal amount;     // Cuánto

}
