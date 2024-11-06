// Create mobile controls
function createMobileControls() {
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    
    // Create D-Pad
    const dPad = document.createElement('div');
    dPad.className = 'd-pad';
    
    const directions = [
        { class: 'up', symbol: '↑', key: 'ArrowUp' },
        { class: 'down', symbol: '↓', key: 'ArrowDown' },
        { class: 'left', symbol: '←', key: 'ArrowLeft' },
        { class: 'right', symbol: '→', key: 'ArrowRight' }
    ];
    
    directions.forEach(dir => {
        const button = document.createElement('button');
        button.className = dir.class;
        button.textContent = dir.symbol;
        
        // Touch events for movement
        let touchInterval;
        
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // Simulate keydown
            const event = new KeyboardEvent('keydown', { key: dir.key });
            document.dispatchEvent(event);
            
            // Continue movement while holding
            touchInterval = setInterval(() => {
                document.dispatchEvent(event);
            }, 100);
        });
        
        button.addEventListener('touchend', () => {
            clearInterval(touchInterval);
            // Simulate keyup
            const event = new KeyboardEvent('keyup', { key: dir.key });
            document.dispatchEvent(event);
        });
        
        dPad.appendChild(button);
    });
    
    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    
    // Interaction button (E)
    const interactButton = document.createElement('button');
    interactButton.textContent = 'E';
    interactButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const event = new KeyboardEvent('keydown', { key: 'e' });
        document.dispatchEvent(event);
    });
    
    // Inventory button (I)
    const inventoryButton = document.createElement('button');
    inventoryButton.textContent = 'I';
    inventoryButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const event = new KeyboardEvent('keydown', { key: 'i' });
        document.dispatchEvent(event);
    });
    
    actionButtons.appendChild(interactButton);
    actionButtons.appendChild(inventoryButton);
    
    mobileControls.appendChild(dPad);
    mobileControls.appendChild(actionButtons);
    document.body.appendChild(mobileControls);
}

// Device detection
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// Initialize mobile controls
if (isMobileDevice()) {
    createMobileControls();
    
    // Prevent default touchmove behavior to avoid scrolling
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('.mobile-controls')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add meta viewport tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }
    
    // Handle interface closing with a close button for mobile
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.style.padding = '15px'; // Bigger touch target
    });
}