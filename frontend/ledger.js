// ========================================

// KIRANAM KATHA MANAGER

// CUSTOMER LEDGER - MYSQL VERSION

// ========================================



// ----------------------------------------

// 1. Get Customer ID from URL

// ----------------------------------------


const urlParams = new URLSearchParams(window.location.search);

const customerId = urlParams.get("id");



// ----------------------------------------

// 2. Get HTML Elements

// ----------------------------------------


const customerNameElement =

    document.getElementById("customerName");


const customerPageElement =

    document.getElementById("customerPage");


const currentBalanceElement =

    document.getElementById("currentBalance");


const transactionList =

    document.getElementById("transactionList");



// ----------------------------------------

// Katha Elements

// ----------------------------------------


const addKathaBtn =

    document.getElementById("addKathaBtn");


const kathaModal =

    document.getElementById("kathaModal");


const closeKathaModal =

    document.getElementById("closeKathaModal");


const kathaForm =

    document.getElementById("kathaForm");



// ----------------------------------------

// Payment Elements

// ----------------------------------------


const addPaymentBtn =

    document.getElementById("addPaymentBtn");


const paymentModal =

    document.getElementById("paymentModal");


const closePaymentModal =

    document.getElementById("closePaymentModal");


const paymentForm =

    document.getElementById("paymentForm");



// ----------------------------------------

// Edit Elements

// ----------------------------------------


const editModal =

    document.getElementById("editModal");


const closeEditModal =

    document.getElementById("closeEditModal");


const editForm =

    document.getElementById("editForm");


const editDate =

    document.getElementById("editDate");


const editDescription =

    document.getElementById("editDescription");


const editAmount =

    document.getElementById("editAmount");


const editDescriptionGroup =

    document.getElementById("editDescriptionGroup");



// ----------------------------------------

// Navigation

// ----------------------------------------


const backBtn =

    document.getElementById("backBtn");


const dashboardBtn =

    document.getElementById("dashboardBtn");



// ----------------------------------------

// 3. Transactions

// ----------------------------------------


let transactions = [];


let editingTransactionId = null;



// ----------------------------------------

// 4. Load Customer

// ----------------------------------------


async function loadCustomer() {


    try {


        const response = await fetch(

            `https://kiranam-katha-manager.onrender.com/api/customers/${customerId}`

        );


        if (!response.ok) {

            throw new Error("Customer not found");

        }


        const customer = await response.json();


        customerNameElement.textContent =

            customer.name;


        customerPageElement.textContent =

            customer.pageNumber;


    } catch (error) {


        console.error(

            "Error loading customer:",

            error

        );


        alert("Unable to load customer.");


        window.location.href =

            "index.html";

    }

}



// ----------------------------------------

// 5. Load Transactions

// ----------------------------------------


async function loadTransactions() {


    try {


        const response = await fetch(

            `https://kiranam-katha-manager.onrender.com/api/transactions/customer/${customerId}`

        );


        if (!response.ok) {

            throw new Error(

                "Unable to load transactions"

            );

        }


        transactions =

            await response.json();


        displayTransactions();


    } catch (error) {


        console.error(

            "Error loading transactions:",

            error

        );


        transactionList.innerHTML = `

            <tr>

                <td colspan="6" style="text-align:center;">

                    Unable to load transactions.

                </td>

            </tr>

        `;

    }

}



// ----------------------------------------

// 6. Calculate Balance

// ----------------------------------------


function calculateBalance() {


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

}



// ----------------------------------------

// 7. Display Transactions

// ----------------------------------------


function displayTransactions() {


    transactionList.innerHTML = "";


    let balance = 0;


    if (transactions.length === 0) {


        transactionList.innerHTML = `

            <tr>

                <td colspan="6"

                    style="text-align:center; padding:30px;">

                    No transactions yet.

                </td>

            </tr>

        `;


        currentBalanceElement.textContent =

            "₹0.00";


        return;

    }



    transactions.forEach(

        function (transaction) {


            // --------------------------------

            // Calculate balance

            // --------------------------------


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



            // --------------------------------

            // Create row

            // --------------------------------


            const newRow =

                document.createElement("tr");



            // --------------------------------

            // Katha

            // --------------------------------


            if (

                transaction.type === "KATHA" ||

                transaction.type === "katha"

            ) {


                newRow.innerHTML = `


                    <td>

                        ${transaction.date}

                    </td>


                    <td>

                        ${transaction.description}

                    </td>


                    <td>

                        ₹${Number(transaction.amount).toFixed(2)}

                    </td>


                    <td>

                        -

                    </td>


                    <td>

                        ₹${balance.toFixed(2)}

                    </td>


                    <td>


                        <button

                            class="edit-btn"

                            onclick="editTransaction(${transaction.id})">

                            ✏️

                        </button>


                        <button

                            class="delete-btn"

                            onclick="deleteTransaction(${transaction.id})">

                            🗑️

                        </button>


                    </td>

                `;

            }



            // --------------------------------

            // Payment

            // --------------------------------


            if (

                transaction.type === "PAYMENT" ||

                transaction.type === "payment"

            ) {


                newRow.innerHTML = `


                    <td>

                        ${transaction.date}

                    </td>


                    <td>

                        Payment Received

                    </td>


                    <td>

                        -

                    </td>


                    <td>

                        ₹${Number(transaction.amount).toFixed(2)}

                    </td>


                    <td>

                        ₹${balance.toFixed(2)}

                    </td>


                    <td>


                        <button

                            class="edit-btn"

                            onclick="editTransaction(${transaction.id})">

                            ✏️

                        </button>


                        <button

                            class="delete-btn"

                            onclick="deleteTransaction(${transaction.id})">

                            🗑️

                        </button>


                    </td>

                `;

            }



            transactionList.appendChild(

                newRow

            );

        }

    );



    // ----------------------------------------

    // Update current balance

    // ----------------------------------------


    currentBalanceElement.textContent =

        "₹" + balance.toFixed(2);

}



// ----------------------------------------

// 8. Set Today's Date

// ----------------------------------------


function setTodayDate(inputId) {


    const today =

        new Date();


    const year =

        today.getFullYear();


    const month =

        String(today.getMonth() + 1)

            .padStart(2, "0");


    const day =

        String(today.getDate())

            .padStart(2, "0");


    const formattedDate =

        `${year}-${month}-${day}`;


    document.getElementById(

        inputId

    ).value = formattedDate;

}



// ----------------------------------------

// 9. Open Add Katha Modal

// ----------------------------------------


addKathaBtn.addEventListener(

    "click",

    function () {


        setTodayDate("kathaDate");


        kathaModal.style.display =

            "flex";

    }

);



// ----------------------------------------

// 10. Close Katha Modal

// ----------------------------------------


closeKathaModal.addEventListener(

    "click",

    function () {


        kathaModal.style.display =

            "none";

    }

);



// ----------------------------------------

// 11. Add Katha

// ----------------------------------------


kathaForm.addEventListener(

    "submit",

    async function (event) {


        event.preventDefault();



        const date =

            document.getElementById(

                "kathaDate"

            ).value;



        const description =

            document.getElementById(

                "kathaDescription"

            ).value.trim();



        const amount =

            Number(

                document.getElementById(

                    "kathaAmount"

                ).value

            );



        // --------------------------------

        // Validate description

        // --------------------------------


        if (description === "") {


            alert(

                "Please enter a description."

            );


            return;

        }



        // --------------------------------

        // Validate amount

        // --------------------------------


        if (amount <= 0) {


            alert(

                "Please enter a valid amount."

            );


            return;

        }



        // --------------------------------

        // Create transaction

        // --------------------------------


        const newTransaction = {


            customerId:

                Number(customerId),


            date:

                date,


            description:

                description,


            type:

                "KATHA",


            amount:

                amount

        };



        try {


            const response =

                await fetch(

                    "https://kiranam-katha-manager.onrender.com/api/transactions",

                    {

                        method: "POST",


                        headers: {

                            "Content-Type":

                                "application/json"

                        },


                        body:

                            JSON.stringify(

                                newTransaction

                            )

                    }

                );



            if (!response.ok) {


                throw new Error(

                    "Failed to add Katha"

                );

            }



            // Reload from MySQL

            await loadTransactions();



            kathaForm.reset();


            kathaModal.style.display =

                "none";



        } catch (error) {


            console.error(error);


            alert(

                "Unable to add Katha."

            );

        }

    }

);



// ----------------------------------------

// 12. Open Payment Modal

// ----------------------------------------


addPaymentBtn.addEventListener(

    "click",

    function () {


        setTodayDate("paymentDate");


        paymentModal.style.display =

            "flex";

    }

);



// ----------------------------------------

// 13. Close Payment Modal

// ----------------------------------------


closePaymentModal.addEventListener(

    "click",

    function () {


        paymentModal.style.display =

            "none";

    }

);



// ----------------------------------------

// 14. Add Payment

// ----------------------------------------


paymentForm.addEventListener(

    "submit",

    async function (event) {


        event.preventDefault();



        const date =

            document.getElementById(

                "paymentDate"

            ).value;



        const amount =

            Number(

                document.getElementById(

                    "paymentAmount"

                ).value

            );



        // --------------------------------

        // Validate amount

        // --------------------------------


        if (amount <= 0) {


            alert(

                "Please enter a valid payment amount."

            );


            return;

        }



        // --------------------------------

        // Get current balance

        // --------------------------------


        const currentBalance =

            calculateBalance();



        // --------------------------------

        // Prevent overpayment

        // --------------------------------


        if (

            amount >

            currentBalance

        ) {


            alert(

                "Payment cannot be greater than current katha."

            );


            return;

        }



        // --------------------------------

        // Create payment

        // --------------------------------


        const newTransaction = {


            customerId:

                Number(customerId),


            date:

                date,


            description:

                "Payment",


            type:

                "PAYMENT",


            amount:

                amount

        };



        try {


            const response =

                await fetch(

                    "https://kiranam-katha-manager.onrender.com/api/transactions",

                    {

                        method: "POST",


                        headers: {

                            "Content-Type":

                                "application/json"

                        },


                        body:

                            JSON.stringify(

                                newTransaction

                            )

                    }

                );



            if (!response.ok) {


                throw new Error(

                    "Failed to add payment"

                );

            }



            // Reload from MySQL

            await loadTransactions();



            paymentForm.reset();


            paymentModal.style.display =

                "none";



        } catch (error) {


            console.error(error);


            alert(

                "Unable to add payment."

            );

        }

    }

);



// ----------------------------------------

// 15. Edit Transaction

// ----------------------------------------


function editTransaction(id) {


    const transaction =

        transactions.find(

            function (item) {


                return item.id === id;

            }

        );



    if (!transaction) {


        alert(

            "Transaction not found."

        );


        return;

    }



    editingTransactionId =

        id;



    editDate.value =

        transaction.date;



    editAmount.value =

        transaction.amount;



    // --------------------------------

    // Katha

    // --------------------------------


    if (

        transaction.type === "KATHA" ||

        transaction.type === "katha"

    ) {


        editDescriptionGroup.style.display =

            "block";


        editDescription.value =

            transaction.description;

    }



    // --------------------------------

    // Payment

    // --------------------------------


    if (

        transaction.type === "PAYMENT" ||

        transaction.type === "payment"

    ) {


        editDescriptionGroup.style.display =

            "none";

    }



    editModal.style.display =

        "flex";

}



// ----------------------------------------

// 16. Close Edit Modal

// ----------------------------------------


closeEditModal.addEventListener(

    "click",

    function () {


        editModal.style.display =

            "none";


        editingTransactionId =

            null;

    }

);



// ----------------------------------------

// 17. Save Edited Transaction

// ----------------------------------------


editForm.addEventListener(

    "submit",

    async function (event) {


        event.preventDefault();



        if (

            editingTransactionId ===

            null

        ) {


            return;

        }



        const transaction =

            transactions.find(

                function (item) {


                    return item.id ===

                        editingTransactionId;

                }

            );



        if (!transaction) {


            alert(

                "Transaction not found."

            );


            return;

        }



        const date =

            editDate.value;



        const amount =

            Number(editAmount.value);



        // --------------------------------

        // Validate amount

        // --------------------------------


        if (amount <= 0) {


            alert(

                "Please enter a valid amount."

            );


            return;

        }



        // --------------------------------

        // Validate Katha description

        // --------------------------------


        let description =

            transaction.description;



        if (

            transaction.type === "KATHA" ||

            transaction.type === "katha"

        ) {


            description =

                editDescription.value.trim();



            if (description === "") {


                alert(

                    "Please enter a description."

                );


                return;

            }

        }



        // --------------------------------

        // Create temporary copy

        // --------------------------------


        const updatedTransactions =

            transactions.map(

                function (item) {


                    if (

                        item.id ===

                        editingTransactionId

                    ) {


                        return {


                            ...item,


                            date:

                                date,


                            amount:

                                amount,


                            description:

                                description

                        };

                    }



                    return item;

                }

            );



        // --------------------------------

        // Calculate new balance

        // --------------------------------


        let newBalance = 0;



        updatedTransactions.forEach(

            function (item) {


                if (

                    item.type === "KATHA" ||

                    item.type === "katha"

                ) {


                    newBalance +=

                        Number(item.amount);

                }



                if (

                    item.type === "PAYMENT" ||

                    item.type === "payment"

                ) {


                    newBalance -=

                        Number(item.amount);

                }

            }

        );



        // --------------------------------

        // Prevent negative balance

        // --------------------------------


        if (

            newBalance < 0

        ) {


            alert(

                "This change would make the customer's balance negative."

            );


            return;

        }



        // --------------------------------

        // Send update to backend

        // --------------------------------


        const updatedTransaction = {


            customerId:

                Number(customerId),


            date:

                date,


            description:

                description,


            type:

                transaction.type,


            amount:

                amount

        };



        try {


            const response =

                await fetch(

                    `https://kiranam-katha-manager.onrender.com/api/transactions/${editingTransactionId}`,

                    {

                        method: "PUT",


                        headers: {

                            "Content-Type":

                                "application/json"

                        },


                        body:

                            JSON.stringify(

                                updatedTransaction

                            )

                    }

                );



            if (!response.ok) {


                throw new Error(

                    "Failed to update transaction"

                );

            }



            await loadTransactions();



            editModal.style.display =

                "none";



            editForm.reset();


            editingTransactionId =

                null;



        } catch (error) {


            console.error(error);


            alert(

                "Unable to update transaction."

            );

        }

    }

);



// ----------------------------------------

// 18. Delete Transaction

// ----------------------------------------


async function deleteTransaction(id) {


    const transaction =

        transactions.find(

            function (item) {


                return item.id === id;

            }

        );



    if (!transaction) {


        alert(

            "Transaction not found."

        );


        return;

    }



    const confirmDelete =

        confirm(

            `Delete this ${transaction.type} transaction?`

        );



    if (!confirmDelete) {


        return;

    }



    try {


        const response =

            await fetch(

                `https://kiranam-katha-manager.onrender.com/api/transactions/${id}`,

                {

                    method: "DELETE"

                }

            );



        if (!response.ok) {


            throw new Error(

                "Failed to delete transaction"

            );

        }



        await loadTransactions();



    } catch (error) {


        console.error(error);


        alert(

            "Unable to delete transaction."

        );

    }

}



// ----------------------------------------

// 19. Back to Customer Index

// ----------------------------------------


backBtn.addEventListener(

    "click",

    function () {


        window.location.href =

            "index.html";

    }

);



// ----------------------------------------

// 20. Back to Dashboard

// ----------------------------------------


dashboardBtn.addEventListener(

    "click",

    function () {


        window.location.href =

            "dashboard.html";

    }

);



// ----------------------------------------

// 21. Start Application

// ----------------------------------------


async function initializeLedger() {


    if (!customerId) {


        alert(

            "Customer ID is missing."

        );


        window.location.href =

            "index.html";


        return;

    }



    await loadCustomer();


    await loadTransactions();

}



initializeLedger();