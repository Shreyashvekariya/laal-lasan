// Rental Status JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const statusTabs = document.querySelectorAll('.status-tab');
    const statusContents = document.querySelectorAll('.status-content');
    const searchInput = document.getElementById('search-rentals');
    const activeRentalsContainer = document.getElementById('active-rentals');
    const upcomingRentalsContainer = document.getElementById('upcoming-rentals');
    const pastRentalsContainer = document.getElementById('past-rentals');
    const extendModal = document.getElementById('extend-modal');
    const returnModal = document.getElementById('return-modal');
    const reviewModal = document.getElementById('review-modal');
    const extendForm = document.getElementById('extend-form');
    const returnForm = document.getElementById('return-form');
    const reviewForm = document.getElementById('review-form');

    // Get rentals from localStorage
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    // If no rentals, show empty state
    if (rentals.length === 0) {
        showEmptyState();
    } else {
        // Display rentals
        displayRentals(rentals);
    }

    // Set up tab switching
    if (statusTabs.length > 0 && statusContents.length > 0) {
        statusTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                statusTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all content sections
                statusContents.forEach(content => content.style.display = 'none');
                
                // Show corresponding content section
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).style.display = 'block';
            });
        });
    }

    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRentals(searchTerm);
        });
    }

    // Set up extend form submission
    if (extendForm) {
        extendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processExtension();
        });
    }

    // Set up return form submission
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processReturn();
        });
    }

    // Set up review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processReview();
        });
    }

    // Function to display rentals
    function displayRentals(rentals) {
        // Clear containers
        if (activeRentalsContainer) activeRentalsContainer.innerHTML = '';
        if (upcomingRentalsContainer) upcomingRentalsContainer.innerHTML = '';
        if (pastRentalsContainer) pastRentalsContainer.innerHTML = '';

        // Current date for comparison
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

        // Categorize rentals
        const active = [];
        const upcoming = [];
        const past = [];

        rentals.forEach(rental => {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < now) {
                // Past rentals
                past.push(rental);
            } else if (startDate > now) {
                // Upcoming rentals
                upcoming.push(rental);
            } else {
                // Active rentals (start date is today or earlier, end date is today or later)
                active.push(rental);
            }
        });

        // Display active rentals
        if (activeRentalsContainer) {
            if (active.length === 0) {
                activeRentalsContainer.innerHTML = '<p class="empty-message">You have no active rentals.</p>';
            } else {
                active.forEach(rental => {
                    const rentalCard = createRentalCard(rental, 'active');
                    activeRentalsContainer.appendChild(rentalCard);
                });
            }
        }

        // Display upcoming rentals
        if (upcomingRentalsContainer) {
            if (upcoming.length === 0) {
                upcomingRentalsContainer.innerHTML = '<p class="empty-message">You have no upcoming rentals.</p>';
            } else {
                upcoming.forEach(rental => {
                    const rentalCard = createRentalCard(rental, 'upcoming');
                    upcomingRentalsContainer.appendChild(rentalCard);
                });
            }
        }

        // Display past rentals
        if (pastRentalsContainer) {
            if (past.length === 0) {
                pastRentalsContainer.innerHTML = '<p class="empty-message">You have no past rentals.</p>';
            } else {
                past.forEach(rental => {
                    const rentalCard = createRentalCard(rental, 'past');
                    pastRentalsContainer.appendChild(rentalCard);
                });
            }
        }
    }

    // Function to create a rental card
    function createRentalCard(rental, type) {
        const card = document.createElement('div');
        card.className = 'rental-card';
        card.dataset.rentalId = rental.rentalId;

        // Card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'rental-card-header';
        cardHeader.innerHTML = `
            <div class="rental-item-image">
                <img src="${rental.itemImage}" alt="${rental.itemName}">
            </div>
            <div class="rental-item-info">
                <h3>${rental.itemName}</h3>
                <p class="rental-id">Rental ID: ${rental.rentalId}</p>
                <p class="rental-dates">
                    <i class="fas fa-calendar-alt"></i> ${formatDate(rental.startDate)} to ${formatDate(rental.endDate)}
                </p>
                <p class="rental-duration">
                    <i class="fas fa-clock"></i> ${rental.duration} ${rental.duration === 1 ? 'day' : 'days'}
                </p>
            </div>
        `;

        // Card details
        const cardDetails = document.createElement('div');
        cardDetails.className = 'rental-card-details';

        // Status badge
        let statusClass = '';
        let statusText = '';

        switch (type) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Active';
                break;
            case 'upcoming':
                statusClass = 'status-upcoming';
                statusText = 'Upcoming';
                break;
            case 'past':
                statusClass = 'status-past';
                statusText = rental.reviewed ? 'Completed' : 'Pending Review';
                break;
        }

        cardDetails.innerHTML = `
            <div class="rental-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="rental-price">
                <p>Total: ${formatCurrency(rental.grandTotal || rental.totalPrice)}</p>
            </div>
        `;

        // Card actions
        const cardActions = document.createElement('div');
        cardActions.className = 'rental-card-actions';

        // Different actions based on rental type
        if (type === 'active') {
            cardActions.innerHTML = `
                <button class="btn extend-btn" data-rental-id="${rental.rentalId}">
                    <i class="fas fa-calendar-plus"></i> Extend
                </button>
                <button class="btn return-btn" data-rental-id="${rental.rentalId}">
                    <i class="fas fa-undo"></i> Return
                </button>
            `;
        } else if (type === 'upcoming') {
            cardActions.innerHTML = `
                <button class="btn cancel-btn" data-rental-id="${rental.rentalId}">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
        } else if (type === 'past' && !rental.reviewed) {
            cardActions.innerHTML = `
                <button class="btn review-btn" data-rental-id="${rental.rentalId}">
                    <i class="fas fa-star"></i> Write Review
                </button>
            `;
        } else {
            cardActions.innerHTML = `
                <button class="btn rent-again-btn" data-item-id="${rental.itemId}">
                    <i class="fas fa-redo"></i> Rent Again
                </button>
            `;
        }

        // Append all sections to card
        card.appendChild(cardHeader);
        card.appendChild(cardDetails);
        card.appendChild(cardActions);

        // Add event listeners to buttons
        setTimeout(() => {
            // Extend button
            const extendBtn = card.querySelector('.extend-btn');
            if (extendBtn) {
                extendBtn.addEventListener('click', function() {
                    openExtendModal(rental);
                });
            }

            // Return button
            const returnBtn = card.querySelector('.return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', function() {
                    openReturnModal(rental);
                });
            }

            // Cancel button
            const cancelBtn = card.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    cancelRental(rental.rentalId);
                });
            }

            // Review button
            const reviewBtn = card.querySelector('.review-btn');
            if (reviewBtn) {
                reviewBtn.addEventListener('click', function() {
                    openReviewModal(rental);
                });
            }

            // Rent again button
            const rentAgainBtn = card.querySelector('.rent-again-btn');
            if (rentAgainBtn) {
                rentAgainBtn.addEventListener('click', function() {
                    window.location.href = `inventory.html?item=${rental.itemId}`;
                });
            }
        }, 0);

        return card;
    }

    // Function to filter rentals based on search term
    function filterRentals(searchTerm) {
        if (!searchTerm) {
            // If search term is empty, show all rentals
            displayRentals(rentals);
            return;
        }

        // Filter rentals that match the search term
        const filteredRentals = rentals.filter(rental => 
            rental.itemName.toLowerCase().includes(searchTerm) ||
            rental.rentalId.toLowerCase().includes(searchTerm)
        );

        // Display filtered rentals
        displayRentals(filteredRentals);
    }

    // Function to show empty state
    function showEmptyState() {
        if (activeRentalsContainer) {
            activeRentalsContainer.innerHTML = '<p class="empty-message">You have no active rentals.</p>';
        }

        if (upcomingRentalsContainer) {
            upcomingRentalsContainer.innerHTML = '<p class="empty-message">You have no upcoming rentals.</p>';
        }

        if (pastRentalsContainer) {
            pastRentalsContainer.innerHTML = '<p class="empty-message">You have no past rentals.</p>';
        }
    }

    // Function to open extend modal
    function openExtendModal(rental) {
        if (!extendModal) return;

        // Set rental ID in modal
        extendModal.dataset.rentalId = rental.rentalId;

        // Update modal content
        const itemName = extendModal.querySelector('#extend-item-name');
        const currentEndDate = extendModal.querySelector('#current-end-date');
        const newEndDateInput = document.getElementById('new-end-date');

        if (itemName) itemName.textContent = rental.itemName;
        if (currentEndDate) currentEndDate.textContent = formatDate(rental.endDate);

        // Set minimum date for new end date
        if (newEndDateInput) {
            const minDate = new Date(rental.endDate);
            minDate.setDate(minDate.getDate() + 1);
            newEndDateInput.min = formatDateForInput(minDate);
            newEndDateInput.value = formatDateForInput(minDate);
        }

        // Open modal
        openModal('extend-modal');
    }

    // Function to open return modal
    function openReturnModal(rental) {
        if (!returnModal) return;

        // Set rental ID in modal
        returnModal.dataset.rentalId = rental.rentalId;

        // Update modal content
        const itemName = returnModal.querySelector('#return-item-name');
        const endDate = returnModal.querySelector('#return-end-date');

        if (itemName) itemName.textContent = rental.itemName;
        if (endDate) endDate.textContent = formatDate(rental.endDate);

        // Open modal
        openModal('return-modal');
    }

    // Function to open review modal
    function openReviewModal(rental) {
        if (!reviewModal) return;

        // Set rental ID in modal
        reviewModal.dataset.rentalId = rental.rentalId;

        // Update modal content
        const itemName = reviewModal.querySelector('#review-item-name');
        if (itemName) itemName.textContent = rental.itemName;

        // Reset form
        if (reviewForm) reviewForm.reset();

        // Open modal
        openModal('review-modal');
    }

    // Function to process rental extension
    function processExtension() {
        if (!extendModal) return;

        const rentalId = extendModal.dataset.rentalId;
        const newEndDate = document.getElementById('new-end-date').value;

        // Find rental
        const rentalIndex = rentals.findIndex(r => r.rentalId === rentalId);
        if (rentalIndex === -1) return;

        const rental = rentals[rentalIndex];

        // Calculate additional days
        const oldEndDate = new Date(rental.endDate);
        const newEndDateObj = new Date(newEndDate);
        const additionalDays = calculateDuration(oldEndDate, newEndDateObj);

        // Calculate additional cost
        const additionalCost = rental.pricePerDay * additionalDays;

        // Update rental
        rental.endDate = newEndDate;
        rental.duration += additionalDays;
        rental.totalPrice += additionalCost;
        if (rental.grandTotal) {
            rental.grandTotal += additionalCost;
        }

        // Update in localStorage
        rentals[rentalIndex] = rental;
        localStorage.setItem('rentals', JSON.stringify(rentals));

        // Close modal
        closeModal('extend-modal');

        // Show success message
        alert(`Your rental has been extended by ${additionalDays} days. Additional charge: ${formatCurrency(additionalCost)}`);

        // Refresh display
        displayRentals(rentals);
    }

    // Function to process rental return
    function processReturn() {
        if (!returnModal) return;

        const rentalId = returnModal.dataset.rentalId;
        const returnCondition = document.getElementById('return-condition').value;
        const returnNotes = document.getElementById('return-notes').value;

        // Find rental
        const rentalIndex = rentals.findIndex(r => r.rentalId === rentalId);
        if (rentalIndex === -1) return;

        const rental = rentals[rentalIndex];

        // Update rental
        rental.status = 'returned';
        rental.returnDate = new Date().toISOString();
        rental.returnCondition = returnCondition;
        rental.returnNotes = returnNotes;

        // If returned early, calculate refund
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(rental.endDate);
        endDate.setHours(0, 0, 0, 0);

        let refundAmount = 0;
        if (today < endDate) {
            const remainingDays = calculateDuration(today, endDate);
            refundAmount = rental.pricePerDay * remainingDays * 0.5; // 50% refund for early return
            rental.refundAmount = refundAmount;
        }

        // Update in localStorage
        rentals[rentalIndex] = rental;
        localStorage.setItem('rentals', JSON.stringify(rentals));

        // Close modal
        closeModal('return-modal');

        // Show success message
        if (refundAmount > 0) {
            alert(`Your return has been processed. A refund of ${formatCurrency(refundAmount)} will be processed to your original payment method.`);
        } else {
            alert('Your return has been processed successfully.');
        }

        // Refresh display
        displayRentals(rentals);
    }

    // Function to process review submission
    function processReview() {
        if (!reviewModal) return;

        const rentalId = reviewModal.dataset.rentalId;
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const reviewText = document.getElementById('review-text').value;

        // Validate
        if (!rating) {
            alert('Please select a rating');
            return;
        }

        // Find rental
        const rentalIndex = rentals.findIndex(r => r.rentalId === rentalId);
        if (rentalIndex === -1) return;

        const rental = rentals[rentalIndex];

        // Update rental
        rental.reviewed = true;
        rental.rating = rating;
        rental.review = reviewText;
        rental.reviewDate = new Date().toISOString();

        // Update in localStorage
        rentals[rentalIndex] = rental;
        localStorage.setItem('rentals', JSON.stringify(rentals));

        // Close modal
        closeModal('review-modal');

        // Show success message
        alert('Thank you for your review!');

        // Refresh display
        displayRentals(rentals);
    }

    // Function to cancel rental
    function cancelRental(rentalId) {
        // Confirm cancellation
        if (!confirm('Are you sure you want to cancel this rental?')) {
            return;
        }

        // Find rental
        const rentalIndex = rentals.findIndex(r => r.rentalId === rentalId);
        if (rentalIndex === -1) return;

        // Remove rental from array
        rentals.splice(rentalIndex, 1);

        // Update localStorage
        localStorage.setItem('rentals', JSON.stringify(rentals));

        // Show success message
        alert('Your rental has been cancelled successfully.');

        // Refresh display
        displayRentals(rentals);
    }

    // Star rating functionality
    const ratingStars = document.querySelectorAll('.rating-stars label');
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('for').split('-')[1];
                highlightStars(rating);
            });

            star.addEventListener('mouseout', function() {
                resetStars();
            });
        });
    }

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = star.getAttribute('for').split('-')[1];
            if (starRating <= rating) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    }

    function resetStars() {
        const checkedRating = document.querySelector('input[name="rating"]:checked')?.value;
        ratingStars.forEach(star => {
            star.classList.remove('hover');
            if (checkedRating) {
                const starRating = star.getAttribute('for').split('-')[1];
                if (starRating <= checkedRating) {
                    star.classList.add('checked');
                } else {
                    star.classList.remove('checked');
                }
            }
        });
    }

    // Add event listeners to rating inputs
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    if (ratingInputs.length > 0) {
        ratingInputs.forEach(input => {
            input.addEventListener('change', function() {
                resetStars();
            });
        });
    }
});