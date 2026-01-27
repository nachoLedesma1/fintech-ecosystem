package com.bank.core_banking.service;

import com.bank.core_banking.model.Currency;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CurrencyExchangeService {

    // Simulación: Cotización fija (En el futuro esto podría venir de una API externa)
    private static final BigDecimal USD_TO_ARS_RATE = new BigDecimal("1200.00"); // 1 USD = 1200 ARS

    public BigDecimal convert(BigDecimal amount, Currency from, Currency to) {
        // Misma moneda (ARS -> ARS o USD -> USD)
        if (from == to) {
            return amount;
        }

        // Comprar Dólares (ARS -> USD)
        if (from == Currency.ARS && to == Currency.USD) {
            return amount.divide(USD_TO_ARS_RATE, 2, RoundingMode.HALF_UP);
        }

        //Vender Dólares (USD -> ARS)
        if (from == Currency.USD && to == Currency.ARS) {
            return amount.multiply(USD_TO_ARS_RATE);
        }

        throw new IllegalArgumentException("Conversión no soportada: " + from + " a " + to);
    }

}
