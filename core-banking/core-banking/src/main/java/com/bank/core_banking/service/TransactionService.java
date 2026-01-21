package com.bank.core_banking.service;

import com.bank.core_banking.dto.TransactionRequest;
import com.bank.core_banking.dto.TransferRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.model.TransactionType;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.TransactionRepository;
import jakarta.transaction.Transactional; // Asegura que todo pase o nada pase
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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

    @Transactional // ¡CRUCIAL! Si falla la suma al destino, se deshace la resta al origen.
    public void transfer(TransferRequest request, String userEmail) {
        // Validar que el monto sea positivo
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a 0");
        }

        // Buscar cuenta origen y verificar que pertenezca al usuario logueado
        Account sourceAccount = accountRepository.findAll().stream()
                .filter(a -> a.getCbu().equals(request.getSourceCbu()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cuenta de origen no encontrada"));

        if (!sourceAccount.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No eres el dueño de la cuenta de origen");
        }

        // Buscar cuenta destino (Soporta CBU o ALIAS)
        String target = request.getDestinationCbu(); // El usuario puede enviar CBU o Alias aquí

        Account destinationAccount = accountRepository.findByCbuOrAlias(target, target)
                .orElseThrow(() -> new RuntimeException("Cuenta de destino no encontrada (CBU o Alias inválido)"));

        // Validar saldo suficiente
        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        // Validar monedas iguales (No permitimos transferir USD a ARS por ahora)
        if (destinationAccount.getCurrency() != sourceAccount.getCurrency()) {
            throw new RuntimeException("No se pueden transferir entre monedas distintas");
        }

        //Descontar al origen
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));

        //Sumar al destino
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

        //Crear registro para el que envía (Resta)
        Transaction debitTx = Transaction.builder()
                .type(TransactionType.TRANSFER_SENT)
                .amount(request.getAmount().negate()) // Guardamos negativo para visualización
                .description("Transferencia a " + request.getDestinationCbu())
                .account(sourceAccount)
                .build();

        // Crear registro para el que recibe (Suma)
        Transaction creditTx = Transaction.builder()
                .type(TransactionType.TRANSFER_RECEIVED)
                .amount(request.getAmount())
                .description("Transferencia de " + request.getSourceCbu())
                .account(destinationAccount)
                .build();

        // Guardar todo
        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);
        transactionRepository.save(debitTx);
        transactionRepository.save(creditTx);
    }

    public java.util.List<Transaction> getHistory(String cbu, String userEmail) {
        // Buscar la cuenta
        Account account = accountRepository.findAll().stream()
                .filter(a -> a.getCbu().equals(cbu))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        //Validar que la cuenta sea del usuario logueado
        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No tienes permiso para ver esta cuenta");
        }

        //Devolver historial
        return transactionRepository.findByAccountIdOrderByTimestampDesc(account.getId());
    }

    public void setAlias(String cbu, String alias, String userEmail) {
        //Validar formato del alias (ej: letras y puntos)
        if (!alias.matches("^[a-zA-Z0-9.]+$")) {
            throw new RuntimeException("El alias solo puede tener letras, números y puntos");
        }

        //Buscar la cuenta y validar dueño
        Account account = accountRepository.findAll().stream()
                .filter(a -> a.getCbu().equals(cbu))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No eres el dueño de la cuenta");
        }

        // Verificar que el alias no esté ocupado por OTRO
        if (accountRepository.findByAlias(alias).isPresent()) {
            throw new RuntimeException("El alias ya está en uso");
        }

        //Guardar
        account.setAlias(alias);
        accountRepository.save(account);
    }

}
