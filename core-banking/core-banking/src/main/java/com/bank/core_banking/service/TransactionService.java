package com.bank.core_banking.service;

import com.bank.core_banking.dto.TransactionRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.model.TransactionType;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.TransactionRepository;
import jakarta.transaction.Transactional; // Asegura que todo pase o nada pase
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional // Si algo falla en medio, se hace rollback
    public Transaction deposit(TransactionRequest request) {
        //Busca la cuenta por CBU
        Account account = accountRepository.findAll().stream()
                .filter(a -> a.getCbu().equals(request.getCbu()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Account not found"));

        //Crea el registro de la transacción
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .description("Depósito en efectivo")
                .account(account)
                .build();

        //Actualiza el saldo de la cuenta
        // saldo = saldo + monto
        account.setBalance(account.getBalance().add(request.getAmount()));

        // Guardar cambios (Spring guarda la cuenta actualizada y la transacción nueva)
        transactionRepository.save(transaction);
        accountRepository.save(account);

        return transaction;
    }

}
