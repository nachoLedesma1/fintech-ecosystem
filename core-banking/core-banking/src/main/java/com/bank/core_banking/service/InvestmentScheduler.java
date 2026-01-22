package com.bank.core_banking.service;

import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Investment;
import com.bank.core_banking.model.Transaction;
import com.bank.core_banking.model.TransactionType;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.InvestmentRepository;
import com.bank.core_banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvestmentScheduler {

    private final InvestmentRepository investmentRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    // Se ejecuta todos los días a las 00:00
    // Cron: Seg Min Hora Dia Mes DiaSemana
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional //Si falla un pago en el lote, hace rollback de ese lote
    public void processInvestments() {

        List<Investment> expiredInvestments = investmentRepository.findReadyToPay();
        int count = 0;

        for (Investment investment : expiredInvestments) {
            payInvestment(investment);
            count++;
        }

        System.out.println("ROBOT FINALIZADO: Se pagaron " + count + " inversiones.");
    }

    private void payInvestment(Investment investment) {
        Account account = investment.getAccount();

        // Devolver Capital + Interés a la cuenta
        account.setBalance(account.getBalance().add(investment.getFinalAmount()));

        // Marcar inversión como "Pagada" (active = false)
        investment.setActive(false);

        // Generar registro en el historial (Extracto)
        Transaction tx = Transaction.builder()
                .account(account)
                .amount(investment.getFinalAmount())
                .description("Cobro Plazo Fijo #" + investment.getId())
                .type(TransactionType.INVESTMENT_PAYOUT)
                .timestamp(LocalDateTime.now())
                .build();

        // Guardar cambios
        accountRepository.save(account);
        investmentRepository.save(investment);
        transactionRepository.save(tx);
    }

}
