package com.bank.core_banking.controller;

import com.bank.core_banking.dto.TransactionRequest;
import com.bank.core_banking.dto.TransferRequest;
import com.bank.core_banking.dto.AliasRequest;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody TransactionRequest request) {
        return transactionService.deposit(request);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequest request,
                                           Authentication authentication) {

        transactionService.transfer(request, authentication.getName());
        return ResponseEntity.ok("Transferencia exitosa");
    }

    @GetMapping("/{cbu}")
    public java.util.List<Transaction> getHistory(@PathVariable String cbu,
                                                  Authentication authentication){

        return transactionService.getHistory(cbu, authentication.getName());
    }

    @PutMapping("/alias")
    public ResponseEntity<String> updateAlias(@RequestBody AliasRequest request, Authentication auth) {
        transactionService.setAlias(request.getCbu(), request.getAlias(), auth.getName());
        return ResponseEntity.ok("Alias actualizado correctamente");
    }

}
