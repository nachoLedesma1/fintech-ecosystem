package com.bank.audit_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventType; // Ej: "TRANSFERENCIA", "LOGIN_EXITO", "ERROR_SEGURIDAD"
    private String username;  // Quién lo hizo (ej: ignacio)
    private String message;   // Detalles (ej: "Transferencia de $500 a cuenta X")

    private LocalDateTime timestamp = LocalDateTime.now(); // Se guarda la fecha automática

}
