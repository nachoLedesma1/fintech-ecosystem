package com.bank.core_banking.controller;

import com.bank.core_banking.dto.UserResponseDTO;
import com.bank.core_banking.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        // Spring Security ya guardó al usuario en el objeto Authentication
        User user = (User) authentication.getPrincipal();

        // Convertimos a DTO y devolvemos
        return ResponseEntity.ok(new UserResponseDTO(user));
    }

}
