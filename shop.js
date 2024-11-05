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
let nearStall = null;

const shopInterface = document.getElementById('shop-interface');
const inventoryInterface = document.getElementById('inventory-interface');
const moneyDisplay = document.getElementById('money-display');

function updateMoneyDisplay() {
    moneyDisplay.textContent = `Money: $${playerMoney}`;
}

function openShop() {
    if (!nearStall) return;

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

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (item && playerMoney >= item.price) {
        playerMoney -= item.price;
        inventory.push({...item});
        updateMoneyDisplay();
        
        // Add purchase effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            color: #4CAF50;
            font-weight: bold;
            animation: float-up 1s ease-out;
            z-index: 5;
        `;
        effect.textContent = 'Item purchased!';
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
        
        openShop(); // Refresh shop interface
    }
}

function useItem(itemId) {
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = inventory[itemIndex];
        
        // Add use effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            color: #4CAF50;
            font-weight: bold;
            animation: float-up 1s ease-out;
            z-index: 5;
        `;
        effect.textContent = `Used ${item.name}!`;
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
        
        // Remove item from inventory
        inventory.splice(itemIndex, 1);
        openInventory(); // Refresh inventory interface
    }
}

// Close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = function() {
        this.parentElement.parentElement.style.display = 'none';
    };
});

// Add floating animation style
const style = document.createElement('style');
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

// Initialize money display
updateMoneyDisplay();