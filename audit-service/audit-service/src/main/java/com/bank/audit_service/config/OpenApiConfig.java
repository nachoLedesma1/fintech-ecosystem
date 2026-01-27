package com.bank.audit_service.config;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Core Banking API",
                version = "1.0",
                description = "Documentación del Microservicio de Audit Service"
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080/api/audit",
                        description = "Servidor Gateway (Público)"
                )
        }
)
public class OpenApiConfig {
}