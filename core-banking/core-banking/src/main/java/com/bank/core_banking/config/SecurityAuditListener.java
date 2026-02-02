package com.bank.core_banking.config;

import com.bank.core_banking.service.AuditClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityAuditListener {

    private final AuditClient auditClient;

    // Login exitoso
    @EventListener
    public void onSuccess(AuthenticationSuccessEvent event) {
        try {
            if (event.getAuthentication() != null) {
                String username = event.getAuthentication().getName();
                auditClient.log("LOGIN_SUCCESS", username, "Inicio de sesión exitoso");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error auditando Login Exitoso: " + e.getMessage());
        }
    }

    // Login fallido  (Contraseña incorrecta, Usuario no existe, etc) ❌
    @EventListener
    public void onFailure(AbstractAuthenticationFailureEvent event) {
        try {
            // A veces getPrincipal() devuelve un objeto User, a veces un String, a veces null.
            // Usamos .toString() para evitar ClassCastException.
            Object principal = event.getAuthentication().getPrincipal();
            String username = (principal != null) ? principal.toString() : "UNKNOWN";

            String error = event.getException().getMessage();

            auditClient.log("LOGIN_FAILURE", username, "Fallo al iniciar sesión: " + error);
        } catch (Exception e) {
            // Atrapamos cualquier error aquí para que NO rompa el flujo de respuesta al usuario
            System.err.println("⚠️ Error auditando Login Fallido: " + e.getMessage());
        }
    }

}
