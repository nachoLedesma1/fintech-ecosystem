package com.bank.core_banking.service;

import com.bank.core_banking.dto.EmailRequest;
import com.bank.core_banking.model.Account;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class NotificationHelper {

    private final RestClient restClient = RestClient.create();

    @Value("${notification.service.url}")
    private String notificationUrl;

    // circuit breaker
    @CircuitBreaker(name = "notificationBreaker", fallbackMethod = "fallbackNotification")
    public void sendNotification(Account source, Account dest, BigDecimal amount) {
        String nombreDestino = dest.getAlias() != null ? dest.getAlias() : dest.getCbu();
        EmailRequest email = new EmailRequest();
        email.setTo(source.getUser().getEmail());
        email.setSubject("Transferencia Exitosa");
        email.setBody("Has transferido " + amount + " " + source.getCurrency() + " a " + nombreDestino);

        restClient.post()
                .uri(notificationUrl + "/notifications/send")
                .contentType(MediaType.APPLICATION_JSON)
                .body(email)
                .retrieve()
                .toBodilessEntity();

        System.out.println("✅ Notificación enviada correctamente");
    }

    // fallback
    public void fallbackNotification(Account source, Account dest, BigDecimal amount, Throwable t) {
        // Este mensaje saldrá cuando el servicio esté caído
        System.err.println("⚠️ ALERTA: Servicio de notificaciones caído. Circuito Abierto.");
        System.err.println("📄 Razón: " + t.getMessage());
        // La transferencia NO falla, solo avisamos en el log.
    }

}
