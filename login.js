// Login and Registration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');

    // Toggle between login and register forms
    if (loginLink && registerLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        });

        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }
            
            // Check for specific credentials
            if (username === 'inventory' && password === 'inventory') {
                // For this demo, we'll simulate a successful login
                simulateLogin(username, password);
            } else {
                showError('Invalid credentials. Try username: inventory, password: inventory');
            }
        });
    }

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Simple validation
            if (!username || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll simulate a successful registration
            simulateRegistration(username, email, password);
        });
    }

    // Function to show error messages
    function showError(message) {
        // Find the visible form's error message element
        const visibleForm = document.getElementById('login-container').style.display !== 'none' ? 
            document.getElementById('login-form') : document.getElementById('register-form');
        
        const errorElement = visibleForm.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Hide error after 3 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        }
    }

    // Simulate login (in a real app, this would be an API call)
    function simulateLogin(username, password) {
        // Simulate API delay
        setTimeout(() => {
            // Create user object with the provided username
            const user = {
                name: username,
                username: username,
                id: 'USR' + Math.floor(10000 + Math.random() * 90000)
            };
            
            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = 'home.html';
        }, 1000);
    }

    // Simulate registration (in a real app, this would be an API call)
    function simulateRegistration(username, email, password) {
        // Simulate API delay
        setTimeout(() => {
            // For demo purposes, any registration attempt is successful
            const user = {
                name: username,
                username: username,
                id: 'USR' + Math.floor(10000 + Math.random() * 90000)
            };
            
            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = 'home.html';
        }, 1000);
    }

    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    if (togglePasswordButtons) {
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordField = this.previousElementSibling;
                
                // Toggle password visibility
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordField.type = 'password';
                    this.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
    }
});