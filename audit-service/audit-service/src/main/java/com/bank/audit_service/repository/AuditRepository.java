package com.bank.audit_service.repository;

import com.bank.audit_service.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AuditRepository extends JpaRepository<AuditLog, Long>{
}
