// ===============================
// API URLs
// ===============================

const CUSTOMER_API = "http://localhost:8081/api/customers";
const TRANSACTION_API = "http://localhost:8081/api/transactions";


// ===============================
// Dashboard Elements
// ===============================

const totalCustomersElement =
    document.getElementById("totalCustomers");

const totalKathaElement =
    document.getElementById("totalKatha");

const todayTransactionsElement =
    document.getElementById("todayTransactions");

const todayKathaElement =
    document.getElementById("todayKatha");

const todayPaymentsElement =
    document.getElementById("todayPayments");

const todayActivityList =
    document.getElementById("todayActivityList");

const outstandingCustomerList =
    document.getElementById("outstandingCustomerList");

const customersBtn =
    document.getElementById("customersBtn");

const openCustomersBtn =
    document.getElementById("openCustomersBtn");


// ===============================
// Get Today's Date
// ===============================

function getTodayLocalDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ===============================
// Transaction Type Helpers
// ===============================

function isKatha(type) {

    return type === "KATHA" ||
           type === "katha";
}


function isPayment(type) {

    return type === "PAYMENT" ||
           type === "payment";
}


// ===============================
// Load Dashboard
// ===============================

async function loadDashboard() {

    try {

        console.log("Loading dashboard from backend...");


        // --------------------------------
        // Get Customers
        // --------------------------------

        const customerResponse =
            await fetch(CUSTOMER_API);

        if (!customerResponse.ok) {

            throw new Error(
                "Failed to load customers"
            );
        }

        const customers =
            await customerResponse.json();


        // --------------------------------
        // Get ALL Transactions
        // --------------------------------

        const transactionResponse =
            await fetch(TRANSACTION_API);

        if (!transactionResponse.ok) {

            throw new Error(
                "Failed to load transactions"
            );
        }

        const transactions =
            await transactionResponse.json();


        console.log("Customers:", customers);

        console.log(
            "Transactions:",
            transactions
        );


        // --------------------------------
        // Total Customers
        // --------------------------------

        totalCustomersElement.textContent =
            customers.length;


        // --------------------------------
        // Variables
        // --------------------------------

        const today =
            getTodayLocalDate();

        let totalOutstandingKatha = 0;

        let todayTransactionCount = 0;

        let todayKatha = 0;

        let todayPayments = 0;

        const todayActivity = [];

        const outstandingCustomers = [];


        // --------------------------------
        // Create Customer Map
        // --------------------------------

        const customerMap = new Map();

        customers.forEach(customer => {

            customerMap.set(
                Number(customer.id),
                customer
            );

        });


        // --------------------------------
        // Calculate Customer Balances
        // --------------------------------

        const customerBalances = new Map();


        customers.forEach(customer => {

            customerBalances.set(
                Number(customer.id),
                0
            );

        });


        // --------------------------------
        // Process Transactions
        // --------------------------------

        transactions.forEach(transaction => {

            const customerId =
                Number(transaction.customerId);

            const customer =
                customerMap.get(customerId);


            // Ignore transaction if
            // customer doesn't exist

            if (!customer) {
                return;
            }


            const amount =
                Number(transaction.amount) || 0;


            // --------------------------------
            // KATHA
            // --------------------------------

            if (isKatha(transaction.type)) {

                const currentBalance =
                    customerBalances.get(customerId) || 0;

                customerBalances.set(
                    customerId,
                    currentBalance + amount
                );


                // Today's Katha

                if (transaction.date === today) {

                    todayTransactionCount++;

                    todayKatha += amount;


                    todayActivity.push({

                        date: transaction.date,

                        customer: customer.name,

                        description:
                            transaction.description ||
                            "Katha",

                        katha: amount,

                        payment: 0

                    });

                }

            }


            // --------------------------------
            // PAYMENT
            // --------------------------------

            else if (isPayment(transaction.type)) {

                const currentBalance =
                    customerBalances.get(customerId) || 0;

                customerBalances.set(
                    customerId,
                    currentBalance - amount
                );


                // Today's Payment

                if (transaction.date === today) {

                    todayTransactionCount++;

                    todayPayments += amount;


                    todayActivity.push({

                        date: transaction.date,

                        customer: customer.name,

                        description:
                            transaction.description ||
                            "Payment Received",

                        katha: 0,

                        payment: amount

                    });

                }

            }

        });


        // --------------------------------
        // Calculate Outstanding Customers
        // --------------------------------

        customers.forEach(customer => {

            const balance =
                customerBalances.get(
                    Number(customer.id)
                ) || 0;


            totalOutstandingKatha +=
                balance;


            if (balance > 0) {

                outstandingCustomers.push({

                    id: customer.id,

                    name: customer.name,

                    pageNumber: customer.pageNumber,

                    balance: balance

                });

            }

        });


        // ==================================
        // Update Dashboard Cards
        // ==================================

        totalKathaElement.textContent =
            `₹${totalOutstandingKatha}`;

        todayTransactionsElement.textContent =
            todayTransactionCount;

        todayKathaElement.textContent =
            `₹${todayKatha}`;

        todayPaymentsElement.textContent =
            `₹${todayPayments}`;


        // ==================================
        // Sort Outstanding Customers
        // Highest balance first
        // ==================================

        outstandingCustomers.sort(
            (a, b) => b.balance - a.balance
        );


        // ==================================
        // Display Outstanding Customers
        // ==================================

        outstandingCustomerList.innerHTML = "";


        if (outstandingCustomers.length === 0) {

            outstandingCustomerList.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        No outstanding customers
                    </td>
                </tr>
            `;

        } else {

            outstandingCustomers.forEach(customer => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${customer.name}
                    </td>

                    <td>
                        ${customer.pageNumber}
                    </td>

                    <td>
                        ₹${customer.balance}
                    </td>

                    <td>
                        <button
                            class="open-btn"
                            onclick="openLedger(${customer.id})"
                        >
                            Open Ledger
                        </button>
                    </td>

                `;

                outstandingCustomerList.appendChild(row);

            });

        }


        // ==================================
        // Display Today's Activity
        // ==================================

        todayActivityList.innerHTML = "";


        if (todayActivity.length === 0) {

            todayActivityList.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        No transactions today
                    </td>
                </tr>
            `;

        } else {

            todayActivity.forEach(activity => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${activity.date}
                    </td>

                    <td>
                        ${activity.customer}
                    </td>

                    <td>
                        ${activity.description}
                    </td>

                    <td>
                        ${
                            activity.katha > 0
                                ? "₹" + activity.katha
                                : "-"
                        }
                    </td>

                    <td>
                        ${
                            activity.payment > 0
                                ? "₹" + activity.payment
                                : "-"
                        }
                    </td>

                `;


                todayActivityList.appendChild(row);

            });

        }


        console.log(
            "Dashboard loaded successfully from MySQL backend."
        );

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        // Show zero values if
        // backend connection fails

        totalCustomersElement.textContent = "0";

        totalKathaElement.textContent = "₹0";

        todayTransactionsElement.textContent = "0";

        todayKathaElement.textContent = "₹0";

        todayPaymentsElement.textContent = "₹0";


        outstandingCustomerList.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    Unable to load dashboard data
                </td>
            </tr>
        `;


        todayActivityList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Unable to load today's activity
                </td>
            </tr>
        `;

    }

}


// ===============================
// Open Customer Ledger
// ===============================

function openLedger(customerId) {

    window.location.href =
        `ledger.html?id=${encodeURIComponent(customerId)}`;

}


// ===============================
// Go To Customer Index
// ===============================

function goToCustomers() {

    window.location.href =
        "index.html";

}


// ===============================
// Navigation Buttons
// ===============================

if (customersBtn) {

    customersBtn.addEventListener(
        "click",
        goToCustomers
    );

}


if (openCustomersBtn) {

    openCustomersBtn.addEventListener(
        "click",
        goToCustomers
    );

}


// ===============================
// Load Dashboard
// ===============================

loadDashboard();