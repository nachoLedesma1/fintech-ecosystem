package com.bank.core_banking.service;

import com.bank.core_banking.config.JwtService;
import com.bank.core_banking.dto.AuthenticationRequest;
import com.bank.core_banking.dto.AuthenticationResponse;
import com.bank.core_banking.dto.RegisterRequest;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Inyecta automáticamente los campos 'final'
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        // Al registrarse, devolvemos el token de una vez para que no tenga que loguearse
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Verifica email y contraseña automáticamente. Si falla, lanza una excepción.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Si pasó la línea anterior, el usuario es correcto. Buscamos sus datos.
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // Generamos el token
        var jwtToken = jwtService.generateToken(user);

        // Lo devolvemos
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
