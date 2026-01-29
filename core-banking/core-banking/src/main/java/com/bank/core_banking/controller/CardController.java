package com.bank.core_banking.controller;

import com.bank.core_banking.dto.CardRequest;
import com.bank.core_banking.model.Card;
import com.bank.core_banking.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<Card> createCard(@RequestBody CardRequest request, Authentication auth) {
        return ResponseEntity.ok(cardService.createCard(request, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Card>> getMyCards(Authentication auth) {
        return ResponseEntity.ok(cardService.getMyCards(auth.getName()));
    }

}
