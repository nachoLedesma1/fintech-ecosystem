package com.bank.core_banking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvestmentRequest {

    private String cbu;      // De dónde sale la plata
    private BigDecimal amount; // Cuánto invierte
    private int days;        // Por cuántos días (ej: 30, 60, 90)

}
