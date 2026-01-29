package com.bank.audit_service.controller;

import com.bank.audit_service.model.AuditLog;
import com.bank.audit_service.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditRepository auditRepository;

    @PostMapping
    public void createAudit(@RequestBody AuditLog log) {
        // Guardamos en la BD real
        AuditLog savedLog = auditRepository.save(log);

        // Imprimimos en consola para verlo nosotros también
        System.out.println("📝 AUDITORÍA GUARDADA: [" + savedLog.getEventType() + "] " + savedLog.getMessage());
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        // Devuelve todos los registros, idealmente ordenados por fecha descendente si quisieras
        return ResponseEntity.ok(auditRepository.findAll());
    }

}
