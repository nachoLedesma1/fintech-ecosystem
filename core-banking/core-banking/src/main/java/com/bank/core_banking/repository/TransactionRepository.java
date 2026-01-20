package com.bank.core_banking.repository;

import com.bank.core_banking.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long>{

    //Para ver el historial de una cuenta específica
    List<Transaction> findByAccountIdOrderByTimestampDesc(Long accountId);

}
