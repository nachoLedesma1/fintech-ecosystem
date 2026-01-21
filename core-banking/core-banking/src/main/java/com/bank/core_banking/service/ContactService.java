package com.bank.core_banking.service;

import com.bank.core_banking.dto.ContactRequest;
import com.bank.core_banking.model.Account;
import com.bank.core_banking.model.Contact;
import com.bank.core_banking.model.User;
import com.bank.core_banking.repository.AccountRepository;
import com.bank.core_banking.repository.ContactRepository;
import com.bank.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public void addContact(ContactRequest request, String userEmail) {
        // Identificar al usuario dueño de la agenda
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar la cuenta que queremos guardar (puede ser por CBU o Alias)
        Account targetAccount = accountRepository.findByCbuOrAlias(request.getCbuOrAlias(), request.getCbuOrAlias())
                .orElseThrow(() -> new RuntimeException("La cuenta/alias que intentas agregar no existe"));

        // Evitar duplicados
        if (contactRepository.existsByUserIdAndCbu(user.getId(), targetAccount.getCbu())) {
            throw new RuntimeException("Ya tienes este contacto en tu agenda");
        }

        // Guardar
        Contact contact = Contact.builder()
                .name(request.getName())
                .cbu(targetAccount.getCbu()) // Guardamos siempre el CBU real
                .user(user)
                .build();

        contactRepository.save(contact);
    }

    public List<Contact> getMyContacts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return contactRepository.findByUserId(user.getId());
    }

    public void deleteContact(Long contactId) {
        contactRepository.deleteById(contactId);
    }

}
