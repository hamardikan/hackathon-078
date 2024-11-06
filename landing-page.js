// DOM Elements
const wrapper = document.querySelector('.wrapper');
const mainButton = document.getElementById('mainButton');
const logoutButton = document.getElementById('logoutButton');
const welcomeMessage = document.getElementById('welcome-message');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconClose = document.querySelector('.icon-close');
const message = document.getElementById('message');
const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');

// Safe storage operations
function safeGetItem(storage, key) {
    try {
        const item = storage.getItem(key);
        if (!item) return null;
        return JSON.parse(item);
    } catch (e) {
        console.error('Storage error:', e);
        return null;
    }
}

function safeSetItem(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    const sessionUser = safeGetItem(sessionStorage, 'currentUser');
    const rememberedUser = safeGetItem(localStorage, 'rememberedUser');
    return sessionUser || rememberedUser;
}

// UI State Management
function updateUIState() {
    const user = isUserLoggedIn();
    
    if (user) {
        welcomeMessage.textContent = `Hello, ${user.username}!`;
        mainButton.textContent = 'Play Game';
        mainButton.classList.add('play-game');
        logoutButton.style.display = 'block';
        
        mainButton.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        };
    } else {
        welcomeMessage.textContent = '';
        mainButton.textContent = 'Login';
        mainButton.classList.remove('play-game');
        logoutButton.style.display = 'none';
        mainButton.onclick = () => wrapper.classList.add('active-popup');
    }
}

// Message Display
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    message.style.display = 'block';
    setTimeout(() => message.style.display = 'none', 3000);
}

// Form Handlers
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = rememberMeCheckbox.checked;

    const users = safeGetItem(localStorage, 'users') || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const userData = {
            username: user.username,
            loginTime: new Date().toISOString()
        };

        safeSetItem(sessionStorage, 'currentUser', userData);

        if (rememberMe) {
            safeSetItem(localStorage, 'rememberedUser', userData);
        }
        
        showMessage('Login successful!', 'success');
        wrapper.classList.remove('active-popup', 'active');
        loginForm.reset();
        updateUIState();
    } else {
        showMessage('Invalid username or password!', 'error');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }

    const users = safeGetItem(localStorage, 'users') || [];
    if (users.some(user => user.username === username)) {
        showMessage('Username already exists!', 'error');
        return;
    }

    users.push({
        username,
        password,
        createdAt: new Date().toISOString()
    });
    
    safeSetItem(localStorage, 'users', users);
    showMessage('Registration successful! Please login.', 'success');
    registerForm.reset();
    wrapper.classList.remove('active');
});

// Event Listeners
registerLink.addEventListener('click', () => wrapper.classList.add('active'));
loginLink.addEventListener('click', () => wrapper.classList.remove('active'));
iconClose.addEventListener('click', () => wrapper.classList.remove('active-popup', 'active'));
logoutButton.addEventListener('click', () => {
    try {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        showMessage('Logged out successfully!', 'success');
        updateUIState();
    } catch (e) {
        console.error('Logout error:', e);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateUIState();
    } catch (e) {
        console.error('Initialization error:', e);
    }
});