package com.bank.core_banking.service;

import com.bank.core_banking.dto.CreateAccountRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Currency;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AuditClient auditClient;

    public Account createAccount(CreateAccountRequest request, String userEmail) {
        //Buscar al usuario en la DB (el email viene del Token)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Definir límites según moneda
        BigDecimal limit = request.getCurrency() == Currency.ARS
                ? new BigDecimal("300000.00") // 300k pesos
                : new BigDecimal("1000.00");  // 1000 dólares

        //Crear la cuenta
        Account account = Account.builder()
                .user(user)
                .cbu(generateCbu()) // Generamos un CBU único
                .currency(request.getCurrency())
                .balance(BigDecimal.ZERO) // Empieza pobre :(
                .transactionLimit(limit)
                .build();

        auditClient.log("CREATE_ACCOUNT", userEmail, "Cuenta creada en " + request.getCurrency());

        return accountRepository.save(account);
    }

    // Generador simple de CBU
    private String generateCbu() {
        // Generamos números al azar para simular un CBU de 22 dígitos
        // Usamos timestamp para que sea difícil que se repita
        return System.currentTimeMillis() + "" + (long)(Math.random() * 1000000000L);
    }

    public java.util.List<Account> getMyAccounts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserId(user.getId());
    }

}
