package com.bank.core_banking.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditLogDTO {

    private String eventType;
    private String username;
    private String message;

}
