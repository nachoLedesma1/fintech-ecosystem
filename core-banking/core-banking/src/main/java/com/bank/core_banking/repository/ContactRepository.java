package com.bank.core_banking.repository;

import com.bank.core_banking.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long>{

    // Buscar todos los contactos de un usuario específico
    List<Contact> findByUserId(Long userId);

    // Verificar si ya existe un contacto con ese CBU para este usuario (para no duplicar)
    boolean existsByUserIdAndCbu(Long userId, String cbu);

}
