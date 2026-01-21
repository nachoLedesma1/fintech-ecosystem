package com.bank.core_banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // El nombre que tú le pones (ej: "mamá)
    private String cbu;  // El CBU real de esa persona

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;   // El dueño de la agenda

}
