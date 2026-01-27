package com.bank.core_banking.dto;
import com.bank.core_banking.model.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDTO {

    private Long id;
    private String number;
    private BigDecimal balance;
    private String currency;

    // 💡 Este es el constructor clave que usa tu Controlador
    public AccountResponseDTO(Account account) {
        this.id = account.getId();
        this.number = account.getCbu();
        this.balance = account.getBalance();

        // Si tu moneda es un Enum, usa .name(). Si es String, quita el .name()
        this.currency = account.getCurrency().toString();
    }

}
