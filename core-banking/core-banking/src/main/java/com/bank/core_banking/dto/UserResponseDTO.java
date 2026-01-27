package com.bank.core_banking.dto;

import com.bank.core_banking.model.User;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String role
) {
    // Constructor extra para convertir fácilmente de Entidad a DTO
    public UserResponseDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
