package com.bank.core_banking.controller;

import com.bank.core_banking.dto.CreateAccountRequest;
import com.bank.core_banking.dto.AliasRequest;
import com.bank.core_banking.dto.AccountResponseDTO;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.service.AccountService;
import com.bank.core_banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;

    @PostMapping
    public Account createAccount(@RequestBody CreateAccountRequest request, Authentication authentication) {
        // authentication.getName() devuelve el email gracias a nuestro UserDetails
        return accountService.createAccount(request, authentication.getName());
    }

    /*@GetMapping
    public java.util.List<Account> getMyAccounts(Authentication authentication) {
        return accountService.getMyAccounts(authentication.getName());
    }*/

    @PutMapping("/alias")
    public ResponseEntity<String> setAlias(@RequestBody AliasRequest request,
                                           Authentication authentication) {

        transactionService.setAlias(request.getCbu(), request.getAlias(), authentication.getName(), authentication.getName());
        return ResponseEntity.ok("Alias creado exitosamente: " + request.getAlias());
    }

    @GetMapping("/me")
    public ResponseEntity<List<AccountResponseDTO>> getMyAccounts(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        // Buscamos las cuentas del ID del usuario logueado
        List<Account> accounts = accountRepository.findByUserId(user.getId());

        // Convertimos a DTO (Asumiendo que tienes un mapper o constructor)
        List<AccountResponseDTO> dtos = accounts.stream()
                .map(AccountResponseDTO::new)
                .toList();

        return ResponseEntity.ok(dtos);
    }

}
