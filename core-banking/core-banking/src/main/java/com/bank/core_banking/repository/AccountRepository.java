package com.bank.core_banking.repository;

import com.bank.core_banking.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // Busqueda por CBU
    Optional<Account> findByCbu(String cbu);

    boolean existsByCbu(String cbu);

    List<Account> findByUserId(Long userId);
}