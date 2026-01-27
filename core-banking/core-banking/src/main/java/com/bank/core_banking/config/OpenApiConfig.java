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
                contact = @Contact(
                        name = "Ignacio Ledesma",
                        email = "nacholedesma2@gmail.com",
                        url = "https://github.com/nachoLedesma1"
                ),
                description = "Documentación de la API de Core Banking (Fintech Ecosystem)",
                title = "Core Banking API",
                version = "1.0"
        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8090" // URL directa al microservicio
                ),
                @Server(
                        description = "Gateway ENV",
                        url = "http://localhost:8080/api/core" // URL a través del Gateway
                )
        },
        security = {
                @SecurityRequirement(name = "bearerAuth") // Aplica seguridad a todo por defecto
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
