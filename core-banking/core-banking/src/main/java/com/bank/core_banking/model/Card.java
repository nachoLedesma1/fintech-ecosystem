package com.bank.core_banking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // "1234 5678 1234 5678"
    private String number;

    // "123"
    private String cvv;

    // "05/29"
    private String expiryDate;

    private String cardHolder; // Nombre impreso

    private String type; // "DEBIT" o "CREDIT"

    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore // Para evitar bucles infinitos al convertir a JSON
    private Account account;

}
