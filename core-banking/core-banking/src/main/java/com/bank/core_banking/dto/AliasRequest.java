package com.bank.core_banking.dto;

import lombok.Data;

@Data
public class AliasRequest {

    private String cbu;   // A qué cuenta le ponemos el alias
    private String alias; // El nuevo nombre

}
