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
let moveSpeed = 160; // Duration of movement animation in ms
let animationInterval = 40; // How often to update animation frames in ms

// Add CSS transition to player element
player.style.transition = `left ${moveSpeed}ms linear, top ${moveSpeed}ms linear`;

// Create grid tiles (rest of the grid creation code remains the same)
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

// Stalls setup remains the same
const stalls = [
    { x: 3, y: 2, items: [1, 2], type: 'shop', shopType: 'vending-machine' },
    { x: 11, y: 3, items: [3, 4], type: 'shop', shopType: 'coffee-machine' },
    { x: 7, y: 7, type: 'atm' }
];

// Setup stalls (remains the same)
stalls.forEach(stall => {
    const element = document.createElement('div');
    if (stall.type === 'atm') {
        element.className = 'stall atm-stall';
    } else {
        element.className = `stall ${stall.shopType}`;
    }
    element.style.left = (stall.x * 32) + 'px';
    element.style.top = (stall.y * 32) + 'px';
    container.appendChild(element);
});

function updatePlayerPosition() {
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    checkStallProximity();
}

let animationFrame = 0;
const FRAMES_PER_STEP = 4; // Number of frames before changing step animation

function updatePlayerDirection(direction) {
    animationFrame = (animationFrame + 1) % FRAMES_PER_STEP;
    if (animationFrame === 0) {
        stepIndex = (stepIndex + 1) % stepCycle.length;
        currentStep = stepCycle[stepIndex];
    }
    player.className = `facing-${direction} ${currentStep}`;
    facing = direction;
}

function resetPlayerStance() {
    stepIndex = 0;
    currentStep = 'stand';
    animationFrame = 0;
    player.className = `facing-${facing} stand`;
}

// Rest of the utility functions remain the same
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
    if (newX < 0 || newX >= 448 || newY < 0 || newY >= 288) {
        return true;
    }

    const playerTileX = Math.floor(newX / 32);
    const playerTileY = Math.floor(newY / 32);

    return stalls.some(stall => 
        stall.x === playerTileX && stall.y === playerTileY
    );
}

let moveTimeout = null;
let animationTimer = null;

function move(direction) {
    if (isMoving) return;
    
    let newX = playerX;
    let newY = playerY;
    const step = 32;

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
        
        // Start walking animation
        animationTimer = setInterval(() => {
            updatePlayerDirection(direction);
        }, animationInterval);

        // Update position with transition
        playerX = newX;
        playerY = newY;
        updatePlayerPosition();

        // Clear previous timeouts if they exist
        if (moveTimeout) clearTimeout(moveTimeout);
        
        // Set completion timeout
        moveTimeout = setTimeout(() => {
            isMoving = false;
            if (animationTimer) {
                clearInterval(animationTimer);
                animationTimer = null;
            }
            if (!isKeyPressed) {
                resetPlayerStance();
            }
        }, moveSpeed);
    } else {
        // Just update the facing direction without moving
        updatePlayerDirection(direction);
    }
}

// Initialize player position and stance
updatePlayerPosition();
resetPlayerStance();

// Enhanced keyboard controls
let activeKeys = new Set();

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (shopInterface.style.display === 'block' || 
        inventoryInterface.style.display === 'block' ||
        atmInterface.style.display === 'block')) {
        shopInterface.style.display = 'none';
        inventoryInterface.style.display = 'none';
        atmInterface.style.display = 'none';
        if (atmInterface.style.display === 'none') {
            document.getElementById('atm-amount').value = '';
        }
        return;
    }

    isKeyPressed = true;
    activeKeys.add(e.key.toLowerCase());

    if (!isMoving) {
        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                move('up');
                break;
            case 'arrowdown':
            case 's':
                move('down');
                break;
            case 'arrowleft':
            case 'a':
                move('left');
                break;
            case 'arrowright':
            case 'd':
                move('right');
                break;
            case 'e':
                if (nearStall) {
                    if (nearStall.type === 'atm') {
                        openATM();
                    } else {
                        openShop();
                    }
                }
                break;
            case 'i':
                openInventory();
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    isKeyPressed = false;
    activeKeys.delete(e.key.toLowerCase());
    
    if (activeKeys.size === 0 && !isMoving) {
        resetPlayerStance();
    }
});