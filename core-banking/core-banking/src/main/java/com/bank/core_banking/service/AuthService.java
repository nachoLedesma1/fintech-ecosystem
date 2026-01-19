package com.bank.core_banking.service;

import com.bank.core_banking.dto.RegisterRequest;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Inyecta automáticamente los campos 'final'
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String register (RegisterRequest request){
        //validar si el mail existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        //Crear el objeto Usuario
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // OJO: Encriptamos aquí
                .role("ROLE_USER") // Por defecto todos son users
                .build();

        // Guardar en DB
        userRepository.save(user);

        // Retornar mensaje ( retornaremos el Token JWT) falta
        return "User registered successfully";
    }
}
