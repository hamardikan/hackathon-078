// Game state
const shopItems = [
    { 
        id: 1, 
        name: 'Health Potion', 
        price: 25, 
        description: 'Restores 50 HP',
        type: 'potion'
    },
    { 
        id: 2, 
        name: 'Magic Scroll', 
        price: 40, 
        description: 'Increases MP by 30',
        type: 'scroll'
    },
    { 
        id: 3, 
        name: 'Power Ring', 
        price: 75, 
        description: 'Boosts attack power',
        type: 'ring'
    },
    { 
        id: 4, 
        name: 'Shield', 
        price: 60, 
        description: 'Improves defense',
        type: 'shield'
    }
];

let inventory = [];
let playerMoney = 100;
let bankBalance = 1000; // Starting bank balance
let nearStall = null;

const shopInterface = document.getElementById('shop-interface');
const inventoryInterface = document.getElementById('inventory-interface');
const moneyDisplay = document.getElementById('money-display');

function updateMoneyDisplay() {
    moneyDisplay.textContent = `Money: $${playerMoney}`;
}

function openShop() {
    if (!nearStall || nearStall.type !== 'shop') return;

    const shopItemsContainer = document.getElementById('shop-items');
    shopItemsContainer.innerHTML = '';

    const stallItems = shopItems.filter(item => nearStall.items.includes(item.id));
    
    stallItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="item-icon ${item.type}"></div>
                <div>
                    <div>${item.name}</div>
                    <div style="font-size: 12px; color: #666;">${item.description}</div>
                </div>
            </div>
            <div>
                <div>$${item.price}</div>
                <button class="buy-btn" ${playerMoney < item.price ? 'disabled' : ''}
                    onclick="buyItem(${item.id})">Buy</button>
            </div>
        `;
        shopItemsContainer.appendChild(itemElement);
    });

    shopInterface.style.display = 'block';
}

function openInventory() {
    const inventoryItemsContainer = document.getElementById('inventory-items');
    inventoryItemsContainer.innerHTML = '';

    if (inventory.length === 0) {
        inventoryItemsContainer.innerHTML = '<div class="item">No items in inventory</div>';
    } else {
        inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="item-icon ${item.type}"></div>
                    <div>
                        <div>${item.name}</div>
                        <div style="font-size: 12px; color: #666;">${item.description}</div>
                    </div>
                </div>
                <button class="use-btn" onclick="useItem(${item.id})">Use</button>
            `;
            inventoryItemsContainer.appendChild(itemElement);
        });
    }

    inventoryInterface.style.display = 'block';
}

function openATM() {
    if (!nearStall || nearStall.type !== 'atm') return;
    
    document.getElementById('bank-balance').textContent = bankBalance;
    atmInterface.style.display = 'block';
}

function deposit() {
    const amount = parseInt(document.getElementById('atm-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount > playerMoney) {
        alert('You don\'t have enough money to deposit this amount');
        return;
    }

    playerMoney -= amount;
    bankBalance += amount;
    updateMoneyDisplay();
    document.getElementById('bank-balance').textContent = bankBalance;
    document.getElementById('atm-amount').value = '';

    showTransactionEffect(`Deposited $${amount}!`, '#4CAF50');
}

function withdraw() {
    const amount = parseInt(document.getElementById('atm-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount > bankBalance) {
        alert('Insufficient funds in bank account');
        return;
    }

    playerMoney += amount;
    bankBalance -= amount;
    updateMoneyDisplay();
    document.getElementById('bank-balance').textContent = bankBalance;
    document.getElementById('atm-amount').value = '';

    showTransactionEffect(`Withdrew $${amount}!`, '#4CAF50');
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item && playerMoney >= item.price) {
        playerMoney -= item.price;
        inventory.push({...item});
        updateMoneyDisplay();
        
        showTransactionEffect('Item purchased!', '#4CAF50');
        
        openShop(); // Refresh shop interface
    }
}

function useItem(itemId) {
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = inventory[itemIndex];
        
        showTransactionEffect(`Used ${item.name}!`, '#4CAF50');
        
        inventory.splice(itemIndex, 1);
        openInventory(); // Refresh inventory interface
    }
}

function showTransactionEffect(text, color) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        color: ${color};
        font-weight: bold;
        animation: float-up 1s ease-out;
        z-index: 5;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    effect.textContent = text;
    document.body.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1000);
}

// Close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = function() {
        this.parentElement.parentElement.style.display = 'none';
        if (this.parentElement.parentElement === atmInterface) {
            document.getElementById('atm-amount').value = '';
        }
    };
});

// Initialize money display
updateMoneyDisplay();

// Add floating animation style if not already added
if (!document.getElementById('float-animation')) {
    const style = document.createElement('style');
    style.id = 'float-animation';
    style.textContent = `
        @keyframes float-up {
            0% {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}