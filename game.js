const player = document.getElementById('player');
const container = document.getElementById('game-container');
const interactionPrompt = document.getElementById('interaction-prompt');
const atmInterface = document.getElementById('atm-interface');

let playerX = 224;
let playerY = 144;
let facing = 'down';
let isMoving = false;
let currentStep = 'stand';
let stepCycle = ['stand', 'step1', 'step2', 'step1'];
let stepIndex = 0;
let isKeyPressed = false;

// Create grid tiles
for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 15; x++) {
        if ((x + y) % 2 === 0) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.left = (x * 32) + 'px';
            tile.style.top = (y * 32) + 'px';
            container.appendChild(tile);
        }
    }
}

// Add market stalls and ATM
const stalls = [
    { x: 3, y: 2, items: [1, 2], type: 'shop' },  // Sells potions and scrolls
    { x: 11, y: 3, items: [3, 4], type: 'shop' }, // Sells rings and shields
    { x: 7, y: 7, type: 'atm' }  // ATM stall
];

stalls.forEach(stall => {
    const element = document.createElement('div');
    element.className = stall.type === 'atm' ? 'stall atm-stall' : 'stall';
    element.style.left = (stall.x * 32) + 'px';
    element.style.top = (stall.y * 32) + 'px';
    container.appendChild(element);
});

function updatePlayerPosition() {
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    checkStallProximity();
}

function updatePlayerDirection(direction) {
    stepIndex = (stepIndex + 1) % stepCycle.length;
    currentStep = stepCycle[stepIndex];
    player.className = `facing-${direction} ${currentStep}`;
    facing = direction;
}

function resetPlayerStance() {
    stepIndex = 0;
    currentStep = 'stand';
    player.className = `facing-${facing} stand`;
}

function checkStallProximity() {
    const playerTileX = Math.floor(playerX / 32);
    const playerTileY = Math.floor(playerY / 32);
    
    nearStall = stalls.find(stall => 
        Math.abs(stall.x - playerTileX) <= 1 && 
        Math.abs(stall.y - playerTileY) <= 1
    );

    if (nearStall) {
        interactionPrompt.style.display = 'block';
        interactionPrompt.style.left = (playerX + 16) + 'px';
        interactionPrompt.style.top = (playerY - 20) + 'px';
    } else {
        interactionPrompt.style.display = 'none';
    }
}

function checkCollision(newX, newY) {
    // Check boundaries
    if (newX < 0 || newX >= 448 || newY < 0 || newY >= 288) {
        return true;
    }

    // Check stalls
    const playerTileX = Math.floor(newX / 32);
    const playerTileY = Math.floor(newY / 32);

    return stalls.some(stall => 
        stall.x === playerTileX && stall.y === playerTileY
    );
}

function move(direction) {
    if (isMoving) return;
    
    let newX = playerX;
    let newY = playerY;
    const step = 32;

    updatePlayerDirection(direction);

    switch (direction) {
        case 'up':
            newY -= step;
            break;
        case 'down':
            newY += step;
            break;
        case 'left':
            newX -= step;
            break;
        case 'right':
            newX += step;
            break;
    }

    if (!checkCollision(newX, newY)) {
        isMoving = true;
        playerX = newX;
        playerY = newY;
        updatePlayerPosition();
        setTimeout(() => {
            isMoving = false;
            if (!isKeyPressed) {
                resetPlayerStance();
            }
        }, 200);
    } else {
        // Reset to standing position if can't move
        resetPlayerStance();
    }
}

// Initialize player position and stance
updatePlayerPosition();
resetPlayerStance();

// Keyboard controls
document.addEventListener('keydown', (e) => {
    isKeyPressed = true;
    if (shopInterface.style.display === 'block' || 
        inventoryInterface.style.display === 'block' ||
        atmInterface.style.display === 'block') {
        if (e.key === 'Escape') {
            shopInterface.style.display = 'none';
            inventoryInterface.style.display = 'none';
            atmInterface.style.display = 'none';
            if (atmInterface.style.display === 'none') {
                document.getElementById('atm-amount').value = '';
            }
        }
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            move('up');
            break;
        case 'ArrowDown':
        case 's':
            move('down');
            break;
        case 'ArrowLeft':
        case 'a':
            move('left');
            break;
        case 'ArrowRight':
        case 'd':
            move('right');
            break;
        case 'e':
        case 'E':
            if (nearStall) {
                if (nearStall.type === 'atm') {
                    openATM();
                } else {
                    openShop();
                }
            }
            break;
        case 'i':
        case 'I':
            openInventory();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'ArrowDown':
        case 's':
        case 'ArrowLeft':
        case 'a':
        case 'ArrowRight':
        case 'd':
            isKeyPressed = false;
            if (!isMoving) {
                resetPlayerStance();
            }
            break;
    }
});

// Add continuous movement when key is held
let moveInterval = null;

function startContinuousMovement(direction) {
    if (moveInterval === null) {
        moveInterval = setInterval(() => {
            if (isKeyPressed && !isMoving) {
                move(direction);
            }
        }, 200);
    }
}

function stopContinuousMovement() {
    if (moveInterval !== null) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
}

// Enhance keyboard controls for continuous movement
document.addEventListener('keydown', (e) => {
    let direction = null;
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            direction = 'up';
            break;
        case 'ArrowDown':
        case 's':
            direction = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
            direction = 'left';
            break;
        case 'ArrowRight':
        case 'd':
            direction = 'right';
            break;
    }
    
    if (direction) {
        startContinuousMovement(direction);
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'ArrowDown':
        case 's':
        case 'ArrowLeft':
        case 'a':
        case 'ArrowRight':
        case 'd':
            stopContinuousMovement();
            break;
    }
});