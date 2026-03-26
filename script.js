// Select DOM Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const emptyState = document.getElementById('empty-state');
const form = document.getElementById('form');
const text = document.getElementById('text');
const type = document.getElementById('type');
const amount = document.getElementById('amount');

// Check localStorage for any saved transactions
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

// Global application state
let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Generate random UUID for transactions
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
    // Get correct sign based on type
    const sign = transaction.type === 'income' ? '+' : '-';
    
    // Create list item element
    const item = document.createElement('li');

    // Add class based on income/expense
    item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');

    // Structure inner HTML
    item.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-title">${transaction.text}</span>
            <span class="transaction-amount">${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        </div>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})" title="Delete Transaction">
            <ion-icon name="trash-outline"></ion-icon>
        </button>
    `;

    // Append to the list
    list.appendChild(item);
}

// Update the Balance, Income and Expense summaries
function updateValues() {
    // Filter incomes and expenses
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    // Calculate totals
    const totalIncome = incomeTransactions.reduce((acc, item) => (acc += item.amount), 0);
    const totalExpense = expenseTransactions.reduce((acc, item) => (acc += item.amount), 0);
    const totalBalance = totalIncome - totalExpense;

    // Update UI Elements
    balance.innerText = `₹${totalBalance.toFixed(2)}`;
    money_plus.innerText = `+₹${totalIncome.toFixed(2)}`;
    money_minus.innerText = `-₹${totalExpense.toFixed(2)}`;
    
    // Visual aid: Format balance color if negative
    if(totalBalance < 0) {
        balance.style.color = 'var(--expense-color)';
        balance.innerText = `-₹${Math.abs(totalBalance).toFixed(2)}`;
    } else {
        balance.style.color = 'var(--text-color)';
    }

    // Toggle Empty State message vs List
    if (transactions.length === 0) {
        emptyState.style.display = 'block';
        list.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        list.style.display = 'block';
    }
}

// Remove transaction by its ID
function removeTransaction(id) {
    // Filter out the specific transaction
    transactions = transactions.filter(transaction => transaction.id !== id);

    // Save to local storage and re-render
    updateLocalStorage();
    init();
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add new transaction using the form
function addTransaction(e) {
    e.preventDefault();

    // Minor validation
    if (text.value.trim() === '' || amount.value.trim() === '' || type.value === '') {
        alert('Please provide title, type, and amount.');
        return;
    }

    // Create transaction object
    const transaction = {
        id: generateID(),
        text: text.value,
        type: type.value,
        amount: +amount.value // Convert string to number
    };

    // Push into global state
    transactions.push(transaction);

    // Add UI representation immediately
    addTransactionDOM(transaction);

    // Update numbers
    updateValues();

    // Persist to local storage
    updateLocalStorage();

    // Reset Form fields
    text.value = '';
    amount.value = '';
    type.value = '';
    
    // Scroll list to bottom smoothly
    setTimeout(() => {
        list.scrollTop = list.scrollHeight;
    }, 100);
}

// Application Initializer
function init() {
    // Clear list
    list.innerHTML = '';

    // Render transactions
    transactions.forEach(addTransactionDOM);
    
    // Calculate values
    updateValues();
}

// Event Listeners
form.addEventListener('submit', addTransaction);

// Initial start call
init();
