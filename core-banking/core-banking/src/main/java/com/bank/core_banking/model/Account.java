package com.bank.core_banking.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal; // IMPORTANTE: Usamos BigDecimal para dinero

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cbu; // Clave Bancaria Uniforme (Identificador único)

    @Column(nullable = false)
    private String currency; // "ARS", "USD"

    @Column(nullable = false)
    private BigDecimal balance; // NUNCA usar Double para dinero.

    // Relación: Una cuenta pertenece a Un usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}