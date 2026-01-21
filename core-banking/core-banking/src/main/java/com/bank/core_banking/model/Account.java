package com.bank.core_banking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal; // IMPORTANTE: Usamos BigDecimal para dinero
import java.time.LocalDateTime;

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

    @Column(unique = true, nullable = false, length = 22)
    private String cbu; // Clave Bancaria Uniforme

    @Column(unique = true)
    private String alias; // Nuevo campo

    @Enumerated(EnumType.STRING)
    private Currency currency; // ARS o USD

    @Column(nullable = false)
    private BigDecimal balance; // BigDecimal es obligatorio para dinero

    @Column(nullable = false)
    private BigDecimal transactionLimit; // Límite de extracción

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Muchas cuentas pertenecen a Un usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Esta será la Foreign Key en la tabla accounts
    @JsonIgnore // Evita bucles infinitos al convertir a JSON
    private User user;
}