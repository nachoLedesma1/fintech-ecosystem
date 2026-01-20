package com.bank.core_banking.controller;

import com.bank.core_banking.dto.CreateAccountRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public Account createAccount(@RequestBody CreateAccountRequest request, Authentication authentication) {
        // authentication.getName() devuelve el email gracias a nuestro UserDetails
        return accountService.createAccount(request, authentication.getName());
    }

    @GetMapping
    public java.util.List<Account> getMyAccounts(Authentication authentication) {
        return accountService.getMyAccounts(authentication.getName());
    }



}
