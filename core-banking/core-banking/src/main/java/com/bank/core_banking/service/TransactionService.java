package com.bank.core_banking.service;

import com.bank.core_banking.dto.AuditRequest;
import com.bank.core_banking.dto.EmailRequest;
import com.bank.core_banking.dto.TransactionRequest;
import com.bank.core_banking.dto.TransferRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.model.TransactionType;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.TransactionRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import jakarta.transaction.Transactional; // Asegura que todo pase o nada pase
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CurrencyExchangeService exchangeService;
    private final NotificationHelper notificationHelper;
    //creamos cliente nativo
    private final RestClient restClient = RestClient.create();

    //inyeccion de variables desde application.properties
    @Value("${notification.service.url}")
    private String notificationUrl;

    @Value("${audit.service.url}")
    private String auditUrl;

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

    @Transactional // Si falla la suma al destino, se deshace la resta al origen.
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

        // Calculamos cuánto recibe el destino basado en las monedas de ambos
        BigDecimal amountToReceive = exchangeService.convert(
                request.getAmount(),            // Monto original
                sourceAccount.getCurrency(),    // Moneda Origen
                destinationAccount.getCurrency()// Moneda Destino
        );

        //Descontar al origen
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));

        //Sumar al destino
        destinationAccount.setBalance(destinationAccount.getBalance().add(amountToReceive));

        //Crear registro para el que envía (Resta)
        Transaction debitTx = Transaction.builder()
                .type(TransactionType.TRANSFER_SENT)
                .amount(request.getAmount().negate()) // Guardamos negativo para visualización
                .description("Transferencia a " + request.getDestinationCbu() + " (" + sourceAccount.getCurrency() + ")")
                .account(sourceAccount)
                .build();

        // Crear registro para el que recibe (Suma)
        Transaction creditTx = Transaction.builder()
                .type(TransactionType.TRANSFER_RECEIVED)
                .amount(amountToReceive)
                .description("Transferencia de " + request.getSourceCbu() + " (" + destinationAccount.getCurrency() + ")")
                .account(destinationAccount)
                .build();

        // Guardar todo
        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);
        transactionRepository.save(debitTx);
        transactionRepository.save(creditTx);



        //servicio de notifiaciones
        notificationHelper.sendNotification(sourceAccount, destinationAccount, request.getAmount());

        //acá van los logs
        try {
            String nombreDestino = destinationAccount.getAlias() != null
                    ? destinationAccount.getAlias()       // Si tiene alias, úsalo
                    : destinationAccount.getCbu();
            AuditRequest audit = new AuditRequest();
            audit.setEventType("TRANSFERENCIA_ENVIADA");
            audit.setUsername(sourceAccount.getUser().getUsername()); // O getEmail()
            audit.setMessage("Transferencia: " + request.getAmount() + " " + sourceAccount.getCurrency() +
                    " -> " + amountToReceive + " " + destinationAccount.getCurrency() +
                    " a " + nombreDestino);

            restClient.post()
                    .uri(auditUrl + "/audit")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(audit)
                    .retrieve()
                    .toBodilessEntity();

        } catch (Exception e) {
            System.err.println("⚠️ No se pudo guardar auditoría: " + e.getMessage());
        }

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
