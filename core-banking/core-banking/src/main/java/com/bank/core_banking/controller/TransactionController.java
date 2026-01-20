package com.bank.core_banking.controller;

import com.bank.core_banking.dto.TransactionRequest;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
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

}
