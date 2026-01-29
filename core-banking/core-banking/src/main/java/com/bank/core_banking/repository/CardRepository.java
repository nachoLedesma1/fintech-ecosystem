package com.bank.core_banking.repository;

import com.bank.core_banking.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long>{

    // Buscar todas las tarjetas asociadas a las cuentas de un usuario
    // (Join implícito: Card -> Account -> User -> Email)
    List<Card> findByAccount_User_Email(String email);

    // Verificar que no se repita el número muy improbable pero posible
    boolean existsByNumber(String number);

}
