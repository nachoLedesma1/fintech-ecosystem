package com.bank.core_banking.dto;
import lombok.Data;

@Data
public class AuditRequest {

    private String eventType;
    private String username;
    private String message;

}
