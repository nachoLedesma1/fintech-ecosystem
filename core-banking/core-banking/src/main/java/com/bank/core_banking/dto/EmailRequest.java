package com.bank.core_banking.dto;

import lombok.Data;

@Data
public class EmailRequest {

    private String to;      // Destinatario (ej: nacho@gmail.com)
    private String subject; // Asunto (ej: Bienvenido al Banco)
    private String body;    // Mensaje (ej: Tu cuenta ha sido creada...)

}
