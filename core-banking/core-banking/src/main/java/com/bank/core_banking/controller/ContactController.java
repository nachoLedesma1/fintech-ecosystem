package com.bank.core_banking.controller;

import com.bank.core_banking.dto.ContactRequest;
import com.bank.core_banking.model.Contact;
import com.bank.core_banking.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<String> addContact(@RequestBody ContactRequest request, Authentication auth) {
        contactService.addContact(request, auth.getName());
        return ResponseEntity.ok("Contacto agregado a la agenda");
    }

    @GetMapping
    public List<Contact> getContacts(Authentication auth) {
        return contactService.getMyContacts(auth.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok("Contacto eliminado");
    }

}
