package com.bank.core_banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "investments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;       // Dinero invertido
    private BigDecimal interestRate; // Tasa aplicada (ej: 0.10 para 10% diario ponele)
    private BigDecimal finalAmount;  // Cuánto recibirá al final (Capital + Interés)

    private LocalDate creationDate;  // Cuándo lo creó (Hoy)
    private LocalDate endDate;       // Cuándo cobra (Hoy + 30 días)

    private boolean active;          // Para saber si ya se le pagó o sigue corriendo

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;         // De qué cuenta salió la plata

}
