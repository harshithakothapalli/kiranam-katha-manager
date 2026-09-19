package com.kiranam.kiranamkathamanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiranam.kiranamkathamanager.entity.Transaction;
import com.kiranam.kiranamkathamanager.repository.TransactionRepository;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Get all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transactions for a particular customer
    @GetMapping("/customer/{customerId}")
    public List<Transaction> getTransactionsByCustomer(
            @PathVariable Long customerId) {

        return transactionRepository.findByCustomerId(customerId);
    }

    // Add transaction
    @PostMapping
    public Transaction addTransaction(
            @RequestBody Transaction transaction) {

        return transactionRepository.save(transaction);
    }

    // Update transaction
    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {

        Transaction existingTransaction =
                transactionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"));

        existingTransaction.setCustomerId(
                transaction.getCustomerId());

        existingTransaction.setDate(
                transaction.getDate());

        existingTransaction.setDescription(
                transaction.getDescription());

        existingTransaction.setType(
                transaction.getType());

        existingTransaction.setAmount(
                transaction.getAmount());

        return transactionRepository.save(
                existingTransaction);
    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public String deleteTransaction(
            @PathVariable Long id) {

        if (!transactionRepository.existsById(id)) {

            throw new RuntimeException(
                    "Transaction not found");
        }

        transactionRepository.deleteById(id);

        return "Transaction deleted successfully";
    }
}