package com.bank.core_banking.dto;

import lombok.Data;

@Data
public class CardRequest {

    private String cbu; // A qué cuenta vinculamos la tarjeta
    private String type; // "DEBIT" o "CREDIT"

}
