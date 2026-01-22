package com.bank.notification_service.service;

import com.bank.notification_service.dto.EmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    // Inyectamos la herramienta de Spring para correos
    private final JavaMailSender mailSender;

    public void sendEmail(EmailRequest request) {
        /*
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@bancofintech.com");
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getBody());
        mailSender.send(message);
        */

        // Simulación (Lo de arriba es la posta)
        System.out.println("========================================");
        System.out.println("📧 ENVIANDO CORREO SIMULADO");
        System.out.println("PARA: " + request.getTo());
        System.out.println("ASUNTO: " + request.getSubject());
        System.out.println("MENSAJE: " + request.getBody());
        System.out.println("========================================");
    }

}
