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
        String username = event.getAuthentication().getName();
        auditClient.log("LOGIN_SUCCESS", username, "Inicio de sesión exitoso");
    }

    // Login fallido  (Contraseña incorrecta, Usuario no existe, etc) ❌
    @EventListener
    public void onFailure(AbstractAuthenticationFailureEvent event) {
        // Obtenemos el usuario que INTENTARON usar (aunque no exista)
        String username = (String) event.getAuthentication().getPrincipal();
        String error = event.getException().getMessage();

        auditClient.log("LOGIN_FAILURE", username, "Fallo al iniciar sesión: " + error);
    }

}
