package com.bank.core_banking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Este método atrapa todos los RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {

        // Preparamos una respuesta JSON bonita: { "error": "Mensaje del error" }
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());

        // Devolvemos un 400 Bad Request (Error del cliente) en lugar de 500 (Error del servidor)
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
