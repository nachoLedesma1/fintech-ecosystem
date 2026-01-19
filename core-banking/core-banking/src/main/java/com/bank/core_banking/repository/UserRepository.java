package com.bank.core_banking.repository;

import com.bank.core_banking.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Para validar que no se repita el email al registrarse
    boolean existsByEmail(String email);
}