package com.bank.core_banking.repository;

import com.bank.core_banking.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long>{
    // Ver todas las inversiones de una cuenta
    List<Investment> findByAccountId(Long accountId);

    List<Investment> findByAccountUserEmail(String email);
}
