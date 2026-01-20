package com.bank.core_banking.dto;

import com.bank.core_banking.model.Currency;
import lombok.Data;

@Data
public class CreateAccountRequest {

    private Currency currency; // El usuario enviará "ARS" o "USD"

}
