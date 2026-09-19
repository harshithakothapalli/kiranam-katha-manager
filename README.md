# Kiranam Katha Manager

A web-based customer credit (Katha) management system designed for local kirana shops.  
The application helps shopkeepers digitally manage customer records, credit transactions, payments, and outstanding balances instead of maintaining everything in a manual notebook.

## 📌 About the Project

In many local grocery shops, customer credit transactions are maintained manually in notebooks. Finding customer records, calculating balances, and tracking payments can become difficult as the number of customers increases.

**Kiranam Katha Manager** provides a simple digital solution where shopkeepers can maintain customer details and their complete transaction history in one place.

The application has a Customer Index, individual customer Ledgers, and a Dashboard that provides an overview of the shop's Katha records.

---

## ✨ Features

### Customer Management
- Add new customers
- Edit customer details
- Delete customers
- Search customers by name
- Assign a unique ledger page number
- Prevent duplicate page numbers
- View current outstanding balance

### Customer Ledger
- View individual customer ledger
- Add Katha/credit transactions
- Add payment transactions
- View transaction history
- Edit transactions
- Delete transactions
- Automatically calculate customer balance
- Prevent payments from exceeding the outstanding balance

### Dashboard
- Total number of customers
- Total outstanding Katha
- Today's transaction count
- Today's Katha
- Today's payments
- View outstanding customers
- View today's transaction activity
- Quickly open a customer's ledger

### Database
- Customer information is stored in MySQL
- Transactions are stored in MySQL
- Spring Boot REST APIs connect the frontend with the database
- Data remains available after refreshing or reopening the application

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman / Thunder Client

---

## 🏗️ Project Structure

```text
Kiranam-Katha-Manager/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── kiranam/
│   │   │   │           └── kiranamkathamanager/
│   │   │   │               ├── controller/
│   │   │   │               │   ├── CustomerController.java
│   │   │   │               │   └── TransactionController.java
│   │   │   │               │
│   │   │   │               ├── entity/
│   │   │   │               │   ├── Customer.java
│   │   │   │               │   └── Transaction.java
│   │   │   │               │
│   │   │   │               ├── repository/
│   │   │   │               │   ├── CustomerRepository.java
│   │   │   │               │   └── TransactionRepository.java
│   │   │   │               │
│   │   │   │               └── KiranamkathamanagerApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── ledger.html
│   ├── ledger.js
│   ├── dashboard.html
│   ├── dashboard.js
│   └── style.css
│
├── .gitignore
└── README.md
