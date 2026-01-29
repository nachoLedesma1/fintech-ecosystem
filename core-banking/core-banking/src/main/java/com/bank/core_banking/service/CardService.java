package com.bank.core_banking.service;

import com.bank.core_banking.dto.CardRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Card;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;
    private final AuditClient auditClient;

    public Card createCard(CardRequest request, String userEmail) {
        // Buscar la cuenta y validar dueño
        Account account = accountRepository.findByCbuOrAlias(request.getCbu(), request.getCbu())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No eres el titular de la cuenta");
        }

        // Generar datos de tarjeta
        String number = generateCardNumber();
        String cvv = String.format("%03d", new Random().nextInt(1000)); // 000 a 999

        // Vence en 5 años
        LocalDate expiry = LocalDate.now().plusYears(5);
        String expiryDate = expiry.format(DateTimeFormatter.ofPattern("MM/yy"));

        // Crear Entidad
        Card card = Card.builder()
                .number(number)
                .cvv(cvv)
                .expiryDate(expiryDate)
                .cardHolder(account.getUser().getName().toUpperCase())
                .type(request.getType().toUpperCase())
                .account(account)
                .build();

        auditClient.log("CARD_ISSUED", userEmail, "Nueva tarjeta " + request.getType() + " emitida");

        return cardRepository.save(card);
    }

    public java.util.List<Card> getMyCards(String email) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        auditClient.log("CARDS_VIEWED", username, "Usuario consultó sus tarjetas y datos sensibles");
        return cardRepository.findByAccount_User_Email(email);
    }

    // Método auxiliar para generar 16 dígitos con formato
    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        // Prefijo simulado (ej: 4500 para Visa Débito genérica)
        sb.append("4500 ");

        for (int i = 0; i < 3; i++) {
            sb.append(String.format("%04d", random.nextInt(10000)));
            if (i < 2) sb.append(" ");
        }
        return sb.toString();
    }

}
