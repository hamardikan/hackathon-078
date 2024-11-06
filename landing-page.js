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

// UI State Management
function updateUIState() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const currentUser = sessionStorage.getItem('currentUser');
    
    const userInfo = rememberedUser || currentUser;
    
    if (userInfo) {
        const user = JSON.parse(userInfo);
        welcomeMessage.textContent = `Hello, ${user.username}!`;
        mainButton.textContent = 'Play Game';
        mainButton.classList.add('play-game');
        logoutButton.style.display = 'block';
        
        // Update Play Game button behavior
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const userData = {
            username: user.username,
            loginTime: new Date().toISOString()
        };

        // Store in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(userData));

        // If remember me is checked, store in local storage
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify(userData));
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        showMessage('Username already exists!', 'error');
        return;
    }

    users.push({
        username,
        password,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Registration successful! Please login.', 'success');
    registerForm.reset();
    wrapper.classList.remove('active');
});

// Event Listeners
registerLink.addEventListener('click', () => wrapper.classList.add('active'));
loginLink.addEventListener('click', () => wrapper.classList.remove('active'));
iconClose.addEventListener('click', () => wrapper.classList.remove('active-popup', 'active'));
logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    showMessage('Logged out successfully!', 'success');
    updateUIState();
});

// Initialize
document.addEventListener('DOMContentLoaded', updateUIState);