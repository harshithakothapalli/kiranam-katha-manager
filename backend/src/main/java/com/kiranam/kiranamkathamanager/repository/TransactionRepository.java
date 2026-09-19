package com.kiranam.kiranamkathamanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kiranam.kiranamkathamanager.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCustomerId(Long customerId);
}