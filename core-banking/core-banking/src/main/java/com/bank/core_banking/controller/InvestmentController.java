package com.bank.core_banking.controller;

import com.bank.core_banking.dto.InvestmentRequest;
import com.bank.core_banking.model.Investment;
import com.bank.core_banking.service.InvestmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<Investment> createInvestment(@RequestBody InvestmentRequest request, Authentication auth) {
        Investment newInvestment = investmentService.createInvestment(request, auth.getName());
        return ResponseEntity.ok(newInvestment);
    }

    @GetMapping
    public java.util.List<Investment> getMyInvestments(Authentication auth) {
        return investmentService.getMyInvestments(auth.getName());
    }

}
