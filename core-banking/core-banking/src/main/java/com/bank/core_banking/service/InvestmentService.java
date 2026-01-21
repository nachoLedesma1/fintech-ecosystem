package com.bank.core_banking.service;

import com.bank.core_banking.dto.InvestmentRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Investment;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.InvestmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final AccountRepository accountRepository;

    // Definimos una Tasa Nominal Anual (TNA) fija del 70% (0.70) para simplificar
    private static final BigDecimal TNA = new BigDecimal("0.70");

    @Transactional
    public Investment createInvestment(InvestmentRequest request, String userEmail) {
        //Validaciones básicas
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a 0");
        }
        if (request.getDays() < 30) {
            throw new RuntimeException("El plazo mínimo es de 30 días");
        }

        // Buscar cuenta y validar dueño
        Account account = accountRepository.findByCbuOrAlias(request.getCbu(), request.getCbu())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No eres el dueño de la cuenta");
        }

        // Validar saldo suficiente
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Saldo insuficiente para invertir");
        }

        // Calcular Intereses
        // Fórmula: Monto * (TNA / 365) * Días
        // Ejemplo: 1000 * (0.70 / 365) * 30
        BigDecimal dailyRate = TNA.divide(new BigDecimal("365"), 10, RoundingMode.HALF_UP); // Tasa diaria
        BigDecimal interest = request.getAmount()
                .multiply(dailyRate)
                .multiply(new BigDecimal(request.getDays()));

        BigDecimal finalAmount = request.getAmount().add(interest);

        // Ejecutar Movimiento: RESTAR dinero de la cuenta (Se "congela")
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        // Guardar Inversión
        Investment investment = Investment.builder()
                .amount(request.getAmount())
                .interestRate(TNA)
                .finalAmount(finalAmount)
                .creationDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(request.getDays()))
                .active(true)
                .account(account)
                .build();

        return investmentRepository.save(investment);
    }

    // Método extra para ver mis inversiones
    public java.util.List<Investment> getMyInvestments(String userEmail) {
        // Aquí podrías filtrar buscando primero el usuario y sus cuentas...
        // Investment -> Account -> User -> Email
        return investmentRepository.findByAccountUserEmail(userEmail);
    }

}
