package com.bank.core_banking.model;

public enum TransactionType {

    DEPOSIT,  // Ingreso de dinero (Cajero, Transferencia entrante)
    TRANSFER_SENT,     // Enviaste dinero (Resta)
    TRANSFER_RECEIVED,  // Te enviaron dinero (Suma)
    INVESTMENT_PAYOUT

}
