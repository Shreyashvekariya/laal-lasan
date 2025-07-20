// Payment Processing JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const orderSummary = document.getElementById('order-summary');
    const itemDetails = document.getElementById('item-details');
    const rentalDetails = document.getElementById('rental-details');
    const costBreakdown = document.getElementById('cost-breakdown');
    const totalAmount = document.getElementById('total-amount');
    const confirmationModal = document.getElementById('payment-confirmation-modal');
    const confirmationDetails = document.getElementById('confirmation-details');
    const confirmationId = document.getElementById('confirmation-id');
    const confirmationTotal = document.getElementById('confirmation-total');
    const confirmationDate = document.getElementById('confirmation-date');

    // Get rental ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const rentalId = urlParams.get('rentalId');

    // If no rental ID, redirect to inventory
    if (!rentalId) {
        window.location.href = 'inventory.html';
        return;
    }

    // Get rental from localStorage
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rental = rentals.find(r => r.rentalId === rentalId);

    // If rental not found, redirect to inventory
    if (!rental) {
        window.location.href = 'inventory.html';
        return;
    }

    // Display rental details
    displayRentalDetails(rental);

    // Handle payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment(rental);
        });
    }

    // Function to display rental details
    function displayRentalDetails(rental) {
        // Item details
        if (itemDetails) {
            itemDetails.innerHTML = `
                <div class="item-image">
                    <img src="${rental.itemImage}" alt="${rental.itemName}">
                </div>
                <div class="item-info">
                    <h3>${rental.itemName}</h3>
                    <p class="item-id">Item ID: ${rental.itemId}</p>
                </div>
            `;
        }

        // Rental details
        if (rentalDetails) {
            rentalDetails.innerHTML = `
                <div class="rental-dates">
                    <p><strong>Rental Period:</strong></p>
                    <p><i class="fas fa-calendar-alt"></i> ${formatDate(rental.startDate)} to ${formatDate(rental.endDate)}</p>
                    <p><i class="fas fa-clock"></i> ${rental.duration} ${rental.duration === 1 ? 'day' : 'days'}</p>
                </div>
                <div class="rental-id">
                    <p><strong>Rental ID:</strong> ${rental.rentalId}</p>
                </div>
            `;
        }

        // Cost breakdown
        if (costBreakdown) {
            costBreakdown.innerHTML = `
                <div class="cost-item">
                    <span>Rental Fee (${formatCurrency(rental.pricePerDay)} × ${rental.duration} days)</span>
                    <span>${formatCurrency(rental.pricePerDay * rental.duration)}</span>
                </div>
                <div class="cost-item">
                    <span>Insurance Fee</span>
                    <span>${formatCurrency(5.00)}</span>
                </div>
                <div class="cost-item">
                    <span>Cleaning Fee</span>
                    <span>${formatCurrency(3.50)}</span>
                </div>
                <div class="cost-item">
                    <span>Tax</span>
                    <span>${formatCurrency(rental.totalPrice * 0.08)}</span>
                </div>
            `;
        }

        // Calculate total with fees and tax
        const insuranceFee = 5.00;
        const cleaningFee = 3.50;
        const tax = rental.totalPrice * 0.08;
        const grandTotal = rental.totalPrice + insuranceFee + cleaningFee + tax;

        // Update total amount
        if (totalAmount) {
            totalAmount.textContent = formatCurrency(grandTotal);
        }

        // Store grand total in rental object for later use
        rental.grandTotal = grandTotal;
    }

    // Function to process payment
    function processPayment(rental) {
        // Get form values
        const name = document.getElementById('card-name').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        // Validate form (simple validation for demo)
        if (!name || !address || !city || !state || !zip || !cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all fields');
            return;
        }

        // In a real app, you would send payment info to a payment processor
        // For this demo, we'll simulate a successful payment
        simulatePayment(rental, { name, address, city, state, zip });
    }

    // Function to simulate payment processing
    function simulatePayment(rental, shippingInfo) {
        // Simulate API delay
        setTimeout(() => {
            // Update rental status
            rental.status = 'active';
            rental.paymentDate = new Date().toISOString();
            rental.shippingInfo = shippingInfo;
            
            // Generate confirmation ID
            rental.confirmationId = 'CONF-' + Math.floor(10000 + Math.random() * 90000);

            // Update rental in localStorage
            updateRental(rental);

            // Show confirmation modal
            showConfirmation(rental);
        }, 1500);
    }

    // Function to update rental in localStorage
    function updateRental(updatedRental) {
        // Get existing rentals
        let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
        
        // Find and update the rental
        const index = rentals.findIndex(r => r.rentalId === updatedRental.rentalId);
        if (index !== -1) {
            rentals[index] = updatedRental;
        }
        
        // Save back to localStorage
        localStorage.setItem('rentals', JSON.stringify(rentals));
    }

    // Function to show payment confirmation
    function showConfirmation(rental) {
        if (!confirmationModal) return;

        // Update confirmation details
        if (confirmationDetails) {
            confirmationDetails.innerHTML = `
                <p><strong>${rental.itemName}</strong> has been successfully rented.</p>
                <p>Your rental period is from <strong>${formatDate(rental.startDate)}</strong> to <strong>${formatDate(rental.endDate)}</strong>.</p>
                <p>A confirmation email has been sent to your registered email address.</p>
            `;
        }

        if (confirmationId) {
            confirmationId.textContent = rental.confirmationId;
        }

        if (confirmationTotal) {
            confirmationTotal.textContent = formatCurrency(rental.grandTotal);
        }

        if (confirmationDate) {
            confirmationDate.textContent = formatDate(rental.paymentDate);
        }

        // Show modal
        openModal('payment-confirmation-modal');

        // Add event listener to view rentals button
        const viewRentalsBtn = document.getElementById('view-rentals-btn');
        if (viewRentalsBtn) {
            viewRentalsBtn.addEventListener('click', function() {
                window.location.href = 'rental-status.html';
            });
        }
    }

    // Credit card input formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            value = value.replace(/(.{4})/g, '$1 ').trim();
            
            // Limit to 19 characters (16 digits + 3 spaces)
            value = value.substring(0, 19);
            
            // Update input value
            this.value = value;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add slash after first 2 digits
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            // Limit to 5 characters (MM/YY)
            value = value.substring(0, 5);
            
            // Update input value
            this.value = value;
        });
    }

    // CVV input formatting
    const cvvInput = document.getElementById('card-cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 3 or 4 digits
            value = value.substring(0, 4);
            
            // Update input value
            this.value = value;
        });
    }
});