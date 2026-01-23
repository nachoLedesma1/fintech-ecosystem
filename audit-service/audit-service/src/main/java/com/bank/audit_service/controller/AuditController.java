package com.bank.audit_service.controller;

import com.bank.audit_service.model.AuditLog;
import com.bank.audit_service.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

}
