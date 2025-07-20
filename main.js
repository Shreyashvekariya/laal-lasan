// Main JavaScript file for shared functionality across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear any user session data
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // Check if user is logged in
    function checkAuth() {
        const currentUser = localStorage.getItem('user');
        const isLoginPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname.endsWith('/');

        if (!currentUser && !isLoginPage) {
            // Redirect to login page if not logged in and not already on login page
            window.location.href = 'index.html';
        } else if (currentUser && isLoginPage) {
            // Redirect to home page if logged in and on login page
            window.location.href = 'home.html';
        }
    }

    // Call the auth check function
    checkAuth();

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');

    // Function to open modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    };

    // Function to close modal
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    };

    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });

    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });

    // Format currency
    window.formatCurrency = function(amount) {
        return '$' + parseFloat(amount).toFixed(2);
    };

    // Format date
    window.formatDate = function(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate rental duration in days
    window.calculateDuration = function(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Generate a random rental ID
    window.generateRentalId = function() {
        return 'RNT-' + Math.floor(10000 + Math.random() * 90000);
    };

    // Add days to a date
    window.addDays = function(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Format date to YYYY-MM-DD for input fields
    window.formatDateForInput = function(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    // Set minimum date for date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const today = new Date();
        const formattedDate = formatDateForInput(today);
        
        dateInputs.forEach(input => {
            input.min = formattedDate;
        });
    }
});