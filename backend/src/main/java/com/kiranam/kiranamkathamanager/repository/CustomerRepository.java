package com.kiranam.kiranamkathamanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kiranam.kiranamkathamanager.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}