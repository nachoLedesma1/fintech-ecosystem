package com.bank.core_banking.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Core Banking API",
                version = "1.0",
                description = "Documentación del Microservicio de Core Banking",
                contact = @Contact(name = "Ignacio Ledesma", email = "nacho@banking.com")
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080/api/core",
                        description = "Servidor Gateway (Público)"
                )
        },
        security = @SecurityRequirement(name = "bearerAuth") // Aplica seguridad a todo
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Autenticación JWT (Copia el token del login y pégalo aquí)",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
