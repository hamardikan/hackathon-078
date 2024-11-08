// First, check if we're on the landing page
const isLandingPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

// Auth check for non-landing pages
if (!isLandingPage) {
    try {
        const sessionUser = sessionStorage.getItem('currentUser');
        const rememberedUser = localStorage.getItem('rememberedUser');

        if (!sessionUser && !rememberedUser) {
            window.location.href = 'index.html';
        } else {
            // Validate JSON format
            const user = sessionUser ? JSON.parse(sessionUser) : JSON.parse(rememberedUser);
            if (!user || !user.username) {
                // Invalid user data
                sessionStorage.removeItem('currentUser');
                localStorage.removeItem('rememberedUser');
                window.location.href = 'index.html';
            }
        }
    } catch (e) {
        console.error('Auth check error:', e);
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        window.location.href = 'index.html';
    }
} else {
    // Landing page code
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
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const tutorialButton = document.querySelector('.btnTutorial');
    const tutorialWrapper = document.querySelector('.tutorial-wrapper');
    const tutorialClose = document.querySelector('.tutorial-close');

    // Tutorial popup handlers
    if (tutorialButton && tutorialWrapper) {
        tutorialButton.addEventListener('click', () => {
            tutorialWrapper.classList.add('active');
        });
    }

    if (tutorialClose && tutorialWrapper) {
        tutorialClose.addEventListener('click', () => {
            tutorialWrapper.classList.remove('active');
        });
    }

    // Close tutorial when clicking outside
    if (tutorialWrapper) {
        tutorialWrapper.addEventListener('click', (e) => {
            if (e.target === tutorialWrapper) {
                tutorialWrapper.classList.remove('active');
            }
        });
    }

    // Message display
    function showMessage(text, type) {
        if (!message) return;
        message.textContent = text;
        message.className = type;
        message.style.display = 'block';
        setTimeout(() => {
            if (message) message.style.display = 'none';
        }, 3000);
    }

    // Save credentials with specific key
    function saveCredentials(username, password) {
        try {
            if (!rememberMeCheckbox || !rememberMeCheckbox.checked) {
                return;
            }

            const credentials = {
                username: username,
                password: password,
                timestamp: new Date().toISOString()
            };
            console.log('Saving credentials:', credentials);
            localStorage.setItem('userCredentials', JSON.stringify(credentials));
        } catch (err) {
            console.error('Error saving credentials:', err);
        }
    }

    // Load credentials with better error handling
    function loadCredentials() {
        try {
            const savedCredentials = localStorage.getItem('userCredentials');
            console.log('Loading saved credentials:', savedCredentials);

            if (savedCredentials) {
                const credentials = JSON.parse(savedCredentials);

                if (loginUsername && credentials.username) {
                    loginUsername.value = credentials.username;
                    console.log('Username loaded:', credentials.username);
                }

                if (loginPassword && credentials.password) {
                    loginPassword.value = credentials.password;
                    console.log('Password loaded');
                }

                if (rememberMeCheckbox) {
                    rememberMeCheckbox.checked = true;
                    console.log('Checkbox checked');
                }

                return true;
            }
        } catch (err) {
            console.error('Error loading credentials:', err);
        }
        return false;
    }

    // Clear credentials
    function clearCredentials() {
        try {
            localStorage.removeItem('userCredentials');
            if (loginUsername) loginUsername.value = '';
            if (loginPassword) loginPassword.value = '';
            if (rememberMeCheckbox) rememberMeCheckbox.checked = false;
        } catch (err) {
            console.error('Error clearing credentials:', err);
        }
    }

    // UI States
    function showLoginState() {
        welcomeMessage.textContent = '';
        mainButton.textContent = 'Login';
        mainButton.classList.remove('play-game');
        logoutButton.style.display = 'none';
        mainButton.onclick = function () {
            wrapper.classList.add('active-popup');
            loadCredentials();
        };
    }

    function showLoggedInState(username) {
        welcomeMessage.textContent = `Hello, ${username}!`;
        mainButton.textContent = 'Play Game';
        mainButton.classList.add('play-game');
        logoutButton.style.display = 'block';
        mainButton.onclick = function (e) {
            e.preventDefault();
            window.location.href = 'game.html';
        };
    }

    // Form handlers
    if (loginForm) {
        console.log('Login form found, loading credentials...');
        loadCredentials();

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = loginUsername.value;
            const password = loginPassword.value;

            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    const userData = {
                        username: user.username,
                        loginTime: new Date().toISOString()
                    };

                    sessionStorage.setItem('currentUser', JSON.stringify(userData));

                    console.log('Remember Me checked:', rememberMeCheckbox?.checked);

                    if (rememberMeCheckbox?.checked) {
                        localStorage.setItem('rememberedUser', JSON.stringify(userData));
                        saveCredentials(username, password);
                        console.log('Credentials saved for Remember Me');
                    } else {
                        clearCredentials();
                        console.log('Credentials cleared (Remember Me unchecked)');
                    }

                    showLoggedInState(userData.username);
                    showMessage('Login successful!', 'success');
                    wrapper.classList.remove('active-popup', 'active');
                } else {
                    showMessage('Invalid username or password!', 'error');
                }
            } catch (err) {
                console.error('Login error:', err);
                showMessage('Login failed', 'error');
            }
        });
    }

    // Remember me checkbox handler
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', function () {
            if (!this.checked) {
                clearCredentials();
                console.log('Credentials cleared (Remember Me unchecked manually)');
            }
        });
    }

    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }

            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.some(user => user.username === username)) {
                    showMessage('Username already exists!', 'error');
                    return;
                }

                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                showMessage('Registration successful! Please login.', 'success');
                registerForm.reset();
                wrapper.classList.remove('active');
            } catch (err) {
                console.error('Register error:', err);
                showMessage('Registration failed', 'error');
            }
        });
    }

    // Event listeners
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.add('active');
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.remove('active');
        });
    }

    if (iconClose) {
        iconClose.addEventListener('click', () => {
            wrapper.classList.remove('active-popup', 'active');
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');
            clearCredentials();
            showLoginState();
            showMessage('Logged out successfully!', 'success');
        });
    }

    // Initialize
    try {
        const sessionUser = sessionStorage.getItem('currentUser');
        const rememberedUser = localStorage.getItem('rememberedUser');
        const userData = sessionUser ? JSON.parse(sessionUser) : rememberedUser ? JSON.parse(rememberedUser) : null;

        if (userData && userData.username) {
            showLoggedInState(userData.username);
        } else {
            showLoginState();
            loadCredentials();
        }
    } catch (err) {
        console.error('Init error:', err);
        showLoginState();
    }
}