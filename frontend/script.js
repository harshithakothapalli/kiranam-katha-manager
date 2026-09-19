// ========================================
// KIRANAM KATHA MANAGER
// CUSTOMER INDEX
// ========================================


// ----------------------------------------
// 1. API URLs
// ----------------------------------------

const CUSTOMER_API =
    "http://localhost:8081/api/customers";

const TRANSACTION_API =
    "http://localhost:8081/api/transactions";


// ----------------------------------------
// 2. Get HTML Elements
// ----------------------------------------

const customerList =
    document.getElementById("customerList");

const searchCustomer =
    document.getElementById("searchCustomer");

const addCustomerBtn =
    document.getElementById("addCustomerBtn");

const dashboardBtn =
    document.getElementById("dashboardBtn");


// ----------------------------------------
// Add Customer
// ----------------------------------------

const customerModal =
    document.getElementById("customerModal");


// Support both possible close button IDs
const closeCustomerModal =
    document.getElementById("closeCustomerModal") ||
    document.getElementById("closeModal");


const customerForm =
    document.getElementById("customerForm");


// ----------------------------------------
// Edit Customer
// ----------------------------------------

const editCustomerModal =
    document.getElementById("editCustomerModal");


const closeEditCustomerModal =
    document.getElementById("closeEditCustomerModal") ||
    document.getElementById("closeEditModal");


const editCustomerForm =
    document.getElementById("editCustomerForm");


// ----------------------------------------
// 3. Variables
// ----------------------------------------

let customers = [];

let editingCustomerId = null;


// ----------------------------------------
// 4. Get Customer Balance
// ----------------------------------------

async function getCustomerBalance(customerId) {

    try {

        const response =
            await fetch(
                `${TRANSACTION_API}/customer/${customerId}`
            );


        if (!response.ok) {

            return 0;
        }


        const transactions =
            await response.json();


        let balance = 0;


        transactions.forEach(
            function (transaction) {

                if (
                    transaction.type === "KATHA" ||
                    transaction.type === "katha"
                ) {

                    balance +=
                        Number(transaction.amount);
                }


                if (
                    transaction.type === "PAYMENT" ||
                    transaction.type === "payment"
                ) {

                    balance -=
                        Number(transaction.amount);
                }

            }
        );


        return balance;

    } catch (error) {

        console.error(
            "Error getting balance:",
            error
        );

        return 0;
    }
}


// ----------------------------------------
// 5. Display Customers
// ----------------------------------------

async function displayCustomers(customerArray) {

    customerList.innerHTML = "";


    // Empty state
    if (customerArray.length === 0) {

        customerList.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    👥 No customers found.
                </td>
            </tr>
        `;

        return;
    }


    // Sort by page number
    const sortedCustomers =
        [...customerArray].sort(
            function (a, b) {

                return Number(a.pageNumber) -
                    Number(b.pageNumber);

            }
        );


    // Display customers
    for (
        const customer of sortedCustomers
    ) {

        const balance =
            await getCustomerBalance(
                customer.id
            );


        const newRow =
            document.createElement("tr");


        newRow.innerHTML = `

            <td>
                ${customer.pageNumber}
            </td>

            <td>
                ${customer.name}
            </td>

            <td>
                ₹${balance.toFixed(2)}
            </td>

            <td>

                <button
                    class="open-btn"
                    onclick="openLedger(${customer.id})">
                    Open Ledger
                </button>

                <button
                    class="edit-btn"
                    onclick="editCustomer(${customer.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${customer.id})">
                    Delete
                </button>

            </td>

        `;


        customerList.appendChild(
            newRow
        );
    }
}


// ----------------------------------------
// 6. Load Customers from Backend
// ----------------------------------------

async function loadCustomers() {

    try {

        console.log(
            "Loading customers from:",
            CUSTOMER_API
        );


        const response =
            await fetch(
                CUSTOMER_API
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        customers =
            await response.json();


        console.log(
            "Customers loaded:",
            customers
        );


        await displayCustomers(
            customers
        );


    } catch (error) {

        console.error(
            "Error loading customers:",
            error
        );


        customerList.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">

                    ❌ Unable to load customers.

                    <br><br>

                    Make sure Spring Boot is running.

                </td>
            </tr>
        `;
    }
}


// ----------------------------------------
// 7. Search Customers
// ----------------------------------------

searchCustomer.addEventListener(
    "input",
    function () {

        const searchText =
            searchCustomer.value
                .trim()
                .toLowerCase();


        const filteredCustomers =
            customers.filter(
                function (customer) {

                    return customer.name
                        .toLowerCase()
                        .includes(searchText);

                }
            );


        displayCustomers(
            filteredCustomers
        );
    }
);


// ----------------------------------------
// 8. Open Add Customer Modal
// ----------------------------------------

addCustomerBtn.addEventListener(
    "click",
    function () {

        customerForm.reset();

        customerModal.style.display =
            "flex";

    }
);


// ----------------------------------------
// 9. Close Add Customer Modal
// ----------------------------------------

if (closeCustomerModal) {

    closeCustomerModal.addEventListener(
        "click",
        function () {

            customerModal.style.display =
                "none";

        }
    );
}


// ----------------------------------------
// 10. Add Customer
// ----------------------------------------

customerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const pageNumber =
            Number(
                document.getElementById(
                    "pageNumber"
                ).value
            );


        // Validate name
        if (name === "") {

            alert(
                "Please enter customer name."
            );

            return;
        }


        // Validate page
        if (pageNumber <= 0) {

            alert(
                "Please enter a valid page number."
            );

            return;
        }


        // Check duplicate page
        const duplicatePage =
            customers.some(
                function (customer) {

                    return Number(
                        customer.pageNumber
                    ) === pageNumber;

                }
            );


        if (duplicatePage) {

            alert(
                "This page number is already assigned to another customer."
            );

            return;
        }


        const newCustomer = {

            name:
                name,

            pageNumber:
                pageNumber
        };


        try {

            const response =
                await fetch(
                    CUSTOMER_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                newCustomer
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to add customer"
                );
            }


            console.log(
                "Customer added successfully."
            );


            await loadCustomers();


            customerForm.reset();


            customerModal.style.display =
                "none";


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Unable to add customer."
            );
        }
    }
);


// ----------------------------------------
// 11. Edit Customer
// ----------------------------------------

function editCustomer(id) {

    const customer =
        customers.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }


    editingCustomerId =
        id;


    document.getElementById(
        "editCustomerName"
    ).value =
        customer.name;


    document.getElementById(
        "editPageNumber"
    ).value =
        customer.pageNumber;


    editCustomerModal.style.display =
        "flex";
}


// ----------------------------------------
// 12. Close Edit Customer Modal
// ----------------------------------------

if (closeEditCustomerModal) {

    closeEditCustomerModal.addEventListener(
        "click",
        function () {

            editCustomerModal.style.display =
                "none";

            editingCustomerId =
                null;

        }
    );
}


// ----------------------------------------
// 13. Save Edited Customer
// ----------------------------------------

editCustomerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (
            editingCustomerId ===
            null
        ) {

            return;
        }


        const name =
            document.getElementById(
                "editCustomerName"
            ).value.trim();


        const pageNumber =
            Number(
                document.getElementById(
                    "editPageNumber"
                ).value
            );


        // Validate name
        if (name === "") {

            alert(
                "Please enter customer name."
            );

            return;
        }


        // Validate page
        if (pageNumber <= 0) {

            alert(
                "Please enter a valid page number."
            );

            return;
        }


        // Check duplicate page
        const duplicatePage =
            customers.some(
                function (customer) {

                    return (
                        Number(customer.pageNumber) ===
                        pageNumber
                    ) &&
                    (
                        Number(customer.id) !==
                        Number(editingCustomerId)
                    );

                }
            );


        if (duplicatePage) {

            alert(
                "This page number is already assigned to another customer."
            );

            return;
        }


        const updatedCustomer = {

            name:
                name,

            pageNumber:
                pageNumber
        };


        try {

            const response =
                await fetch(
                    `${CUSTOMER_API}/${editingCustomerId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedCustomer
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to update customer"
                );
            }


            await loadCustomers();


            editCustomerModal.style.display =
                "none";


            editCustomerForm.reset();


            editingCustomerId =
                null;


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Unable to update customer."
            );
        }
    }
);


// ----------------------------------------
// 14. Delete Customer
// ----------------------------------------

async function deleteCustomer(id) {

    const customer =
        customers.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete customer "${customer.name}"?`
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                `${CUSTOMER_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete customer"
            );
        }


        await loadCustomers();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Unable to delete customer."
        );
    }
}


// ----------------------------------------
// 15. Open Customer Ledger
// ----------------------------------------

function openLedger(customerId) {

    window.location.href =
        `ledger.html?id=${customerId}`;
}


// ----------------------------------------
// 16. Dashboard
// ----------------------------------------

dashboardBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "dashboard.html";

    }
);


// ----------------------------------------
// 17. Start Application
// ----------------------------------------

loadCustomers(); 