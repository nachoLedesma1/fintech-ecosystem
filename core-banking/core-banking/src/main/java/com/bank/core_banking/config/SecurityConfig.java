package com.bank.core_banking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Deshabilitamos CSRF (Cross-Site Request Forgery)
                // Esto es necesario porque vamos a usar Tokens, no Cookies de navegador.
                // Si no lo quitas, los POST te darán error 403.
                .csrf(csrf -> csrf.disable())

                // Configurar URLs públicas vs privadas
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // Login y Registro son públicos
                        .anyRequest().authenticated()            // El resto requiere login
                )

                // No guardar estado
                // Para que el  servidor NO guarde sesiones en memoria. Cada petición debe traer su token.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
