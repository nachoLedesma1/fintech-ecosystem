package com.bank.core_banking.controller;

import com.bank.core_banking.dto.UserResponseDTO;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // <--- Coincide con la regla de seguridad
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .toList();

        return ResponseEntity.ok(users);
    }

}
