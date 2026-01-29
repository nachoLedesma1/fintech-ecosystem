package com.bank.core_banking.service;

import com.bank.core_banking.dto.AuditLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuditClient {

    // Usamos RestTemplate para hacer peticiones HTTP simples
    private final RestTemplate restTemplate = new RestTemplate();

    // URL interna de Docker
    private final String AUDIT_URL = "http://audit-service:8082/audit";

    @Async // Hacemos esto asíncrono para no trabar la operación principal
    public void log(String eventType, String username, String message) {
        try {
            AuditLogDTO log = AuditLogDTO.builder()
                    .eventType(eventType)
                    .username(username)
                    .message(message)
                    .build();

            restTemplate.postForObject(AUDIT_URL, log, Void.class);

        } catch (Exception e) {
            // Si falla la auditoría, no queremos romper el flujo principal, solo lo mostramos en consola
            System.err.println("❌ Error enviando auditoría: " + e.getMessage());
        }
    }

}
