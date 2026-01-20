package com.bank.core_banking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {

    private String cbu;      // A dónde mandamos la plata
    private BigDecimal amount; // Cuánta plata

}
